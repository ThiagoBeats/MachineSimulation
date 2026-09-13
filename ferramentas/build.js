// ---------------------------------------------------------------------------
// Gera o site publicavel de uma maquina a partir da pasta bin/ do projeto
// TwinCAT HMI. Roda na maquina do desenvolvedor (precisa do TE2000 instalado
// apenas para LER os schemas); o site gerado nao depende de TwinCAT nenhum.
//
//   node ferramentas/build.js ls-b130
//
// Le a configuracao de  maquinas/<id>/maquina.json .
// ---------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const NL = String.fromCharCode(10);
const id = process.argv[2];
if (!id) {
  console.error('uso: node ferramentas/build.js <id-da-maquina>');
  process.exit(1);
}

const pastaMaquina = path.join(RAIZ, 'maquinas', id);
const cfg = JSON.parse(fs.readFileSync(path.join(pastaMaquina, 'maquina.json'), 'utf8'));

const BIN = path.resolve(cfg.binPath);
const TF2000 = path.resolve(cfg.tf2000Path || 'C:\\TwinCAT\\Functions\\TF2000-HMI-Server');
const SRV_CONFIG = path.resolve(cfg.serverConfigPath);
const DESTINO = path.join(RAIZ, id);

// Artefatos de desenvolvimento que nao servem para nada no site publicado.
const IGNORAR = [/\.map$/i, /\.d\.ts$/i, /\.ts$/i];

function lerJson(arquivo) {
  try { return JSON.parse(fs.readFileSync(arquivo, 'utf8')); } catch (e) { return null; }
}

function procurar(dir, nome, acc) {
  acc = acc || [];
  let itens;
  try { itens = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return acc; }
  for (const it of itens) {
    const completo = path.join(dir, it.name);
    if (it.isDirectory()) procurar(completo, nome, acc);
    else if (it.name === nome) acc.push(completo);
  }
  return acc;
}

// Os arquivos de pacote usam $ref relativo ("#/definitions/X"). O TcHmi Server
// real publica com $ref absoluto, e o resolvedor do framework perde o contexto
// de origem em refs relativos aninhados - o sintoma e a tela renderizar uns 20
// controles em vez de 180. Normalizamos igual ao servidor real.
function absolutizarRefs(no, ns) {
  if (Array.isArray(no)) { for (const v of no) absolutizarRefs(v, ns); return no; }
  if (no && typeof no === 'object') {
    for (const k of Object.keys(no)) {
      if (k === '$ref' && typeof no[k] === 'string' && no[k].charAt(0) === '#') no[k] = 'tchmi:' + ns + no[k];
      else absolutizarRefs(no[k], ns);
    }
  }
  return no;
}

function montarDefinicoes(projeto) {
  const defs = { general: null, server: null, framework: null, project: null };

  const general = lerJson(path.join(TF2000, 'tchmi.general.Schema.json'));
  if (general && general.definitions) defs.general = { definitions: general.definitions };

  // server = DUTs/arrays do projeto + schemas do TcHmiSrv e das extensoes
  const servidor = {};
  if (projeto && projeto.DEFINITIONS) Object.assign(servidor, projeto.DEFINITIONS);
  for (const f of [
    path.join(TF2000, 'TcHmiSrv.Schema.json'),
    path.join(TF2000, 'TcHmiAds', 'TcHmiAds.Schema.json'),
    path.join(TF2000, 'TcHmiUserManagement', 'TcHmiUserManagement.Schema.json'),
    path.join(TF2000, 'TcHmiLua', 'TcHmiLua.Schema.json'),
    path.join(TF2000, 'TcHmiSqliteLogger', 'TcHmiSqliteLogger.Schema.json')
  ]) {
    const j = lerJson(f);
    if (j && j.definitions) Object.assign(servidor, j.definitions);
  }
  if (Object.keys(servidor).length) defs.server = { definitions: servidor };

  // framework = uniao dos Types.Schema.json de todos os pacotes publicados
  const framework = {};
  let arquivos = 0;
  for (const f of procurar(BIN, 'Types.Schema.json')) {
    const j = lerJson(f);
    if (j && j.definitions) { Object.assign(framework, j.definitions); arquivos++; }
  }
  if (Object.keys(framework).length) defs.framework = { definitions: framework };

  const projSchema = lerJson(path.join(BIN, 'Properties', 'tchmi.project.Schema.json'));
  defs.project = { definitions: (projSchema && projSchema.definitions) || {} };

  for (const ns of Object.keys(defs)) if (defs[ns]) absolutizarRefs(defs[ns].definitions, ns);

  console.log('  general ..... ' + Object.keys(defs.general ? defs.general.definitions : {}).length + ' tipos');
  console.log('  server ...... ' + Object.keys(defs.server ? defs.server.definitions : {}).length + ' tipos');
  console.log('  framework ... ' + Object.keys(defs.framework ? defs.framework.definitions : {}).length +
              ' tipos (de ' + arquivos + ' pacotes)');
  return defs;
}

function copiarArvore(origem, destino, contador) {
  fs.mkdirSync(destino, { recursive: true });
  for (const it of fs.readdirSync(origem, { withFileTypes: true })) {
    const de = path.join(origem, it.name);
    const para = path.join(destino, it.name);
    if (it.isDirectory()) copiarArvore(de, para, contador);
    else if (!IGNORAR.some(re => re.test(it.name))) {
      fs.copyFileSync(de, para);
      contador.n++;
      contador.bytes += fs.statSync(de).size;
    }
  }
}

// Injeta os scripts do simulador ANTES dos scripts do framework. Se vierem
// depois, o framework ja tera tentado falar com o servidor e falhado.
function gerarHmi(html) {
  const scripts = [
    'sim/dados.js', 'sim/valores.js',
    'sim/esquema.js', 'sim/estado.js', 'sim/logica.js', 'sim/protocolo.js',
    'sim/sim.js'
  ].map(s => '<script src="' + s + '" defer></script>').join('\n');

  const marca = '<script src="framework/Object.js" defer=""></script>';
  if (html.indexOf(marca) < 0) {
    throw new Error('nao encontrei o primeiro script do framework no Default.html');
  }
  const cabecalho =
    '<script>window.TCHMI_SIM_MAQUINA = ' + JSON.stringify(id) + ';</script>\n' + scripts + '\n';
  return html.replace(marca, cabecalho + marca);
}

// ---------------------------------------------------------------------------
console.log('Construindo "' + id + '"');
console.log('  origem ...... ' + BIN);

if (!fs.existsSync(BIN)) {
  console.error('ERRO: nao encontrei a pasta publicada em ' + BIN);
  console.error('      Publique o projeto no TwinCAT XAE antes de gerar o site.');
  process.exit(1);
}

const projeto = lerJson(SRV_CONFIG);
if (!projeto || !projeto.SYMBOLS) {
  console.error('ERRO: nao consegui ler a tabela de simbolos em ' + SRV_CONFIG);
  process.exit(1);
}

const definicoes = montarDefinicoes(projeto);

fs.rmSync(DESTINO, { recursive: true, force: true });
const contador = { n: 0, bytes: 0 };
copiarArvore(BIN, DESTINO, contador);
console.log('  copiados .... ' + contador.n + ' arquivos (' + (contador.bytes / 1048576).toFixed(1) + ' MB)');

const pastaSim = path.join(DESTINO, 'sim');
fs.mkdirSync(pastaSim, { recursive: true });

fs.writeFileSync(path.join(pastaSim, 'dados.js'),
  '// Gerado por ferramentas/build.js - nao edite a mao.\n' +
  'window.TCHMI_SIM_DADOS = ' + JSON.stringify({ DEFINITIONS: definicoes, SYMBOLS: projeto.SYMBOLS }) + ';\n',
  'utf8');

for (const f of ['esquema.js', 'estado.js', 'protocolo.js']) {
  fs.copyFileSync(path.join(RAIZ, 'nucleo', f), path.join(pastaSim, f));
}

// A logica emulada e SEMPRE de uma maquina so - o CLP de cada modelo e um
// software diferente. Sem logica propria, a maquina roda so com os valores
// de valores.js e os neutros do schema.
const logicaMaquina = path.join(pastaMaquina, 'logica.js');
if (fs.existsSync(logicaMaquina)) {
  fs.copyFileSync(logicaMaquina, path.join(pastaSim, 'logica.js'));
  console.log('  logica ...... emulada (maquinas/' + id + '/logica.js)');
} else {
  const stub = [
    '// Esta maquina ainda nao tem logica de CLP emulada.',
    '(function (raiz) {',
    '  raiz.SimLogica = { configurar: function () {}, ciclo: function () {} };',
    '})(typeof self !== "undefined" ? self : this);'
  ].join(NL) + NL;
  fs.writeFileSync(path.join(pastaSim, 'logica.js'), stub, 'utf8');
  console.log('  logica ...... nenhuma (so valores)');
}

fs.copyFileSync(path.join(RAIZ, 'web', 'sim.js'), path.join(pastaSim, 'sim.js'));
fs.copyFileSync(path.join(pastaMaquina, 'valores.js'), path.join(pastaSim, 'valores.js'));

// A IHM vai para hmi.html - no MESMO nivel de pasta, para que todos os
// caminhos relativos dela (framework/, Telas/, Images/) continuem valendo.
const html = fs.readFileSync(path.join(BIN, 'Default.html'), 'utf8');
fs.writeFileSync(path.join(DESTINO, 'hmi.html'), gerarHmi(html), 'utf8');
fs.rmSync(path.join(DESTINO, 'Default.html'), { force: true });

// index.html passa a ser a moldura do tablet, que carrega hmi.html num iframe.
if (cfg.tablet) {
  const foto = path.join(pastaMaquina, cfg.tablet.foto);
  if (!fs.existsSync(foto)) {
    console.error('ERRO: nao encontrei a foto do tablet em ' + foto);
    process.exit(1);
  }
  fs.copyFileSync(foto, path.join(DESTINO, cfg.tablet.foto));

  const nome = (cfg.textos && cfg.textos.pt && cfg.textos.pt.nome) || cfg.modelo || id;
  const moldura = fs.readFileSync(path.join(RAIZ, 'web', 'moldura.html'), 'utf8')
    .split('__CONFIG__').join(JSON.stringify({ id: id, nome: nome, tablet: cfg.tablet }))
    .split('__FOTO__').join(cfg.tablet.foto)
    .split('__NOME__').join(nome);
  fs.writeFileSync(path.join(DESTINO, 'index.html'), moldura, 'utf8');
  console.log('  moldura ..... ' + cfg.tablet.modelo + ' (tela em ' +
              cfg.tablet.tela.largura + '% x ' + cfg.tablet.tela.altura + '% da foto)');
} else {
  // Sem foto de tablet, a IHM continua sendo a pagina principal.
  fs.copyFileSync(path.join(DESTINO, 'hmi.html'), path.join(DESTINO, 'index.html'));
}


// ---------------------------------------------------------------------------
// Diferencas de maiusculas nos nomes de arquivo.
//
// O Windows e o TcHmi Server nao distinguem maiusculas, entao uma tela pode
// pedir "Images/Machine/B150.png" enquanto o arquivo se chama "b150.png" e
// tudo funciona na maquina. No GitHub Pages, que e Linux, isso vira 404 e a
// imagem simplesmente nao aparece.
//
// Aqui procuramos as referencias a arquivos nas telas e, quando a unica
// diferenca e a caixa das letras, gravamos uma copia com o nome pedido.
// ---------------------------------------------------------------------------
const EXT_TEXTO = /\.(html|view|content|usercontrol|js|json|css)$/i;
const EXT_ARQUIVO = 'png|jpg|jpeg|gif|svg|webp|ico|mp3|wav|mp4|pdf|woff2?|ttf|css|js';

function indexarArquivos(dir, base, mapa) {
  for (const it of fs.readdirSync(dir, { withFileTypes: true })) {
    const completo = path.join(dir, it.name);
    const rel = (base ? base + '/' : '') + it.name;
    if (it.isDirectory()) indexarArquivos(completo, rel, mapa);
    else mapa.set(rel.toLowerCase(), rel);
  }
  return mapa;
}

function corrigirMaiusculas() {
  const reais = indexarArquivos(DESTINO, '', new Map());
  const exatos = new Set(reais.values());
  const referencias = new Set();
  const re = new RegExp('[A-Za-z0-9_][A-Za-z0-9_./-]*\.(' + EXT_ARQUIVO + ')', 'gi');

  for (const rel of exatos) {
    if (!EXT_TEXTO.test(rel)) continue;
    let texto;
    try { texto = fs.readFileSync(path.join(DESTINO, rel), 'utf8'); } catch (e) { continue; }
    let m;
    while ((m = re.exec(texto))) referencias.add(m[0].replace(/^\.?\//, ''));
  }

  // Indice das referencias por nome em minusculas, para achar o par do arquivo.
  const refPorMinuscula = new Map();
  for (const ref of referencias) {
    const k = ref.toLowerCase();
    if (!refPorMinuscula.has(k)) refPorMinuscula.set(k, new Set());
    refPorMinuscula.get(k).add(ref);
  }

  const renomeados = [];
  const conflitos = [];
  for (const rel of exatos) {
    const pedidas = refPorMinuscula.get(rel.toLowerCase());
    if (!pedidas || pedidas.has(rel)) continue;      // ninguem pede, ou ja casa
    if (pedidas.size > 1) { conflitos.push(rel + ' pedido como ' + [...pedidas].join(' e ')); continue; }
    const alvo = [...pedidas][0];

    // O NTFS nao distingue maiusculas: copiar por cima nao cria arquivo novo e
    // renomear direto e ignorado. Por isso o desvio por um nome temporario.
    const de = path.join(DESTINO, rel);
    const temp = path.join(DESTINO, path.dirname(rel), '__tmp__' + path.basename(rel));
    const para = path.join(DESTINO, alvo);
    fs.mkdirSync(path.dirname(para), { recursive: true });
    fs.renameSync(de, temp);
    fs.renameSync(temp, para);
    renomeados.push(rel + '  ->  ' + alvo);
  }

  if (renomeados.length) {
    console.log('  maiusculas .. ' + renomeados.length + ' arquivo(s) renomeado(s) para casar com as telas:');
    for (const r of renomeados.slice(0, 6)) console.log('                ' + r);
  }
  for (const c of conflitos) {
    console.error('  AVISO: ' + c + ' - um host sensivel a maiusculas nao atende os dois.');
  }
}

corrigirMaiusculas();

const tamanhoDados = fs.statSync(path.join(pastaSim, 'dados.js')).size;
console.log('  dados.js .... ' + (tamanhoDados / 1048576).toFixed(1) + ' MB (' +
            Object.keys(projeto.SYMBOLS).length + ' simbolos)');
console.log('Pronto: ' + DESTINO);
