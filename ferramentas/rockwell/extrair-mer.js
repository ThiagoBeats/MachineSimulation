// ---------------------------------------------------------------------------
// EXTRAI AS TELAS DE UM PROJETO FactoryTalk View ME
// ---------------------------------------------------------------------------
//   node ferramentas/rockwell/extrair-mer.js <origem> <id-da-maquina>
//
// A <origem> pode ser das duas formas em que o projeto aparece:
//
//   - o RUNTIME .mer        um documento composto OLE2 cujos fluxos usam um
//                           LZ77 proprio da Rockwell;
//   - a PASTA DO PROJETO    o que o FactoryTalk View Studio grava em disco,
//                           com as mesmas subpastas (Raml/, Gfx/, Images/,
//                           M_Alarms/) mas sem compressao nenhuma.
//
// A pasta e melhor quando existe: traz as telas que o publish do ViewPoint
// deixou de fora e, dentro de cada .gfx, uma tabela com as legendas que o
// publish apaga.
//
// Gera, em maquinas/<id>/:
//   telas/<nome>.json   uma tela: os elementos desenhaveis e as ligacoes
//   imagens/<nome>.png  as imagens que as telas usam
//   alarmes.json        a tabela de alarmes, com texto e tag de disparo
//   _origem.json        o que foi lido, o que foi ignorado e por que
//
// As telas vem em DUAS formas, e esta parte vale para as duas origens:
//   - Raml/<tela>.ramlz  -> XAML vetorial, completo e legivel
//   - Gfx/<tela>.gfx     -> binario nativo da Rockwell
// Este extrator le a primeira. As que so existem em .gfx ficam listadas em
// _origem.json, para ninguem achar que estao faltando por erro.
// ---------------------------------------------------------------------------
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ole2 = require('./ole2.js');
const lz = require('./lz.js');
const { analisarXaml } = require('./xaml.js');
const { compilar } = require('./expressao.js');
const imagem = require('./imagem.js');

const RAIZ = path.resolve(__dirname, '..', '..');
const origemArg = process.argv[2];
const id = process.argv[3];

if (!origemArg || !id) {
  console.error('uso: node ferramentas/rockwell/extrair-mer.js <arquivo.mer|pasta-do-projeto> <id-da-maquina>');
  process.exit(1);
}

const destino = path.join(RAIZ, 'maquinas', id);

// --- 1. abre a origem ---------------------------------------------------------
// Os dois formatos entregam a mesma coisa: um mapa de "Raml/MAIN.ramlz" -> bytes.
// No .mer os fluxos vem comprimidos; na pasta sao arquivos soltos. Daqui para
// baixo o resto do extrator nao precisa saber de qual veio.

const AS_PASTAS = ['Raml', 'Gfx', 'Images', 'M_Alarms', 'Global Objects'];

function lerDaPasta(raiz) {
  const mapa = {};
  for (const sub of AS_PASTAS) {
    const dir = path.join(raiz, sub);
    if (!fs.existsSync(dir)) continue;
    for (const arq of fs.readdirSync(dir)) {
      const cheio = path.join(dir, arq);
      if (!fs.statSync(cheio).isFile()) continue;
      mapa[sub + '/' + arq] = fs.readFileSync(cheio);
    }
  }
  // Na pasta, cada .gfx e um documento OLE2 por si so. O desenho fica no fluxo
  // "Contents" e as legendas em "ls<idioma>" - um bloco que o .mer nao carrega.
  const textos = {};
  for (const nome of Object.keys(mapa)) {
    if (!/^Gfx\/.+\.gfx$/.test(nome)) continue;
    try {
      const dentro = ole2.extrair(mapa[nome]);
      if (dentro['Contents']) mapa[nome] = dentro['Contents'];
      const ls = Object.keys(dentro).find(k => /^ls[0-9a-f]+$/i.test(k));
      if (ls) textos[nome.replace(/^Gfx\//, '').replace(/\.gfx$/, '')] = dentro[ls];
    } catch (e) { /* .gfx que nao abre fica como esta, e o leitor avisa depois */ }
  }
  return { mapa, textos };
}

const ehPasta = fs.existsSync(origemArg) && fs.statSync(origemArg).isDirectory();
let aberto, textosDeTela = {};

if (ehPasta) {
  const r = lerDaPasta(origemArg);
  aberto = r.mapa;
  textosDeTela = r.textos;
} else {
  const fluxos = ole2.extrair(fs.readFileSync(origemArg));
  aberto = {};
  for (const [nome, dados] of Object.entries(fluxos)) aberto[nome] = lz.abrir(dados);
}

// --- 2. desembrulha os .ramlz (sao zip, com 8 bytes de cabecalho antes) --------
function lerZip(b) {
  let fim = -1;
  for (let i = b.length - 22; i >= 0 && i > b.length - 70000; i--) {
    if (b.readUInt32LE(i) === 0x06054b50) { fim = i; break; }
  }
  if (fim < 0) return null;
  const n = b.readUInt16LE(fim + 10);
  let p = b.readUInt32LE(fim + 16);
  const itens = {};
  for (let i = 0; i < n; i++) {
    if (b.readUInt32LE(p) !== 0x02014b50) break;
    const metodo = b.readUInt16LE(p + 10);
    const tamComp = b.readUInt32LE(p + 20);
    const nNome = b.readUInt16LE(p + 28);
    const nExtra = b.readUInt16LE(p + 30);
    const nCom = b.readUInt16LE(p + 32);
    const desl = b.readUInt32LE(p + 42);
    const nome = b.toString('utf8', p + 46, p + 46 + nNome);
    const ini = desl + 30 + b.readUInt16LE(desl + 26) + b.readUInt16LE(desl + 28);
    const bruto = b.slice(ini, ini + tamComp);
    try { itens[nome] = metodo === 0 ? bruto : zlib.inflateRawSync(bruto); } catch (e) { /* pula */ }
    p += 46 + nNome + nExtra + nCom;
  }
  return itens;
}

const xamlPorTela = {};
for (const [nome, dados] of Object.entries(aberto)) {
  const m = /^Raml\/(.+)\.ramlz$/.exec(nome);
  if (!m) continue;
  const pk = dados.indexOf(Buffer.from('PK\x03\x04'));
  if (pk < 0 || pk > 16) continue;
  const itens = lerZip(dados.slice(pk));
  if (!itens) continue;
  for (const [interno, conteudo] of Object.entries(itens)) {
    if (/\.xamle$/i.test(interno)) xamlPorTela[m[1]] = conteudo.toString('utf8');
  }
}

// --- 3. le as ligacoes tela <-> CLP (.conn) -----------------------------------
// Cada objeto da tela pode ter uma expressao de leitura (o que ele mostra) e,
// se for botao, uma tag de escrita (o que ele comanda).
function lerConn(texto) {
  const secoes = { leitura: {}, escrita: {} };
  const reSecao = /<(read|write)\b[^>]*>([\s\S]*?)<\/\1>/g;
  let s;
  while ((s = reSecao.exec(texto))) {
    const alvo = s[1] === 'read' ? secoes.leitura : secoes.escrita;
    const reObj = /<object id="([^"]+)">([\s\S]*?)<\/object>/g;
    let o;
    while ((o = reObj.exec(s[2]))) {
      const reLig = /<connection property="([^"]+)">([\s\S]*?)<\/connection>/g;
      let c;
      while ((c = reLig.exec(o[2]))) {
        (alvo[o[1]] = alvo[o[1]] || {})[c[1]] = c[2];
      }
    }
  }
  return secoes;
}

const connPorTela = {};
for (const [nome, dados] of Object.entries(aberto)) {
  const m = /^Raml\/(.+)\.conn$/.exec(nome);
  if (m) connPorTela[m[1]] = lerConn(dados.toString('utf8'));
}

const relatorio = { telasGeradas: [], telasSoEmGfx: [], tiposIgnorados: {}, tags: {}, semTransparencia: [] };

// --- 4. imagens ---------------------------------------------------------------
// O acervo fica em Images/, com a extensao errada em varios casos (ha JPEG e
// PNG chamados .bmp). O XAML pede a imagem por um nome composto, que diz
// tambem a cor de fundo a tornar transparente - ver rockwell/imagem.js.
fs.mkdirSync(path.join(destino, 'imagens'), { recursive: true });

const acervo = {};                                   // nome base -> bytes
for (const [nome, dados] of Object.entries(aberto)) {
  const m = /^(?:Images|Raml\/images)\/(.+)$/.exec(nome);
  if (!m || /^__MAPPE/.test(m[1])) continue;
  acervo[m[1].replace(/\.(bmp|png|jpg|jpeg)$/i, '')] = dados;
}

const imagens = {};                                  // Source do XAML -> arquivo
const semImagem = [];

function pegarImagem(fonte) {
  if (imagens[fonte] !== undefined) return imagens[fonte];
  const info = imagem.separarNome(fonte);
  const bruto = acervo[fonte] || acervo[info.base];
  if (!bruto) { imagens[fonte] = null; semImagem.push(fonte); return null; }

  const r = imagem.converter(bruto, info);
  if (!r) { imagens[fonte] = null; semImagem.push(fonte + ' (formato nao suportado)'); return null; }

  const arq = fonte.replace(/[^A-Za-z0-9 _.-]/g, '_') + '.' + r.extensao;
  fs.writeFileSync(path.join(destino, 'imagens', arq), r.dados);
  if (r.semTransparencia) relatorio.semTransparencia.push(fonte);
  imagens[fonte] = arq;
  return arq;
}

// --- 4b. o acervo inteiro, para as telas desenhadas a mao ----------------------
// As telas que so existem em .gfx nao dizem qual arquivo cada imagem usa: esse
// elo esta no binario e nao foi decifrado. Mas o acervo tem nomes que se
// explicam sozinhos ("Gate valve (verde)", "Tank 1", "Turbine agitator 3"),
// entao quem desenha a tela a mao escolhe pelo nome. Por isso convertemos tudo,
// e nao so o que o XAML pede.

function converterAcervoInteiro() {
  let n = 0;
  for (const base of Object.keys(acervo)) {
    const arq = base.replace(/[^A-Za-z0-9 _.()-]/g, '_') + '.png';
    const destinoArq = path.join(destino, 'imagens', arq);
    if (fs.existsSync(destinoArq)) continue;
    const r = imagem.converter(acervo[base], imagem.separarNome(base));
    if (!r) continue;
    fs.writeFileSync(path.join(destino, 'imagens', base.replace(/[^A-Za-z0-9 _.()-]/g, '_') + '.' + r.extensao), r.dados);
    n++;
  }
  return n;
}

// --- 5. alarmes ---------------------------------------------------------------
// O .mal guarda as mensagens TODAS GRUDADAS num bloco so, sem separador nem
// tabela de tamanhos que se possa seguir, e as tags de disparo logo depois, uma
// por vez, na ordem da tabela de alarmes.
//
// O que separa as mensagens e o proprio vocabulario: toda mensagem comeca por
// uma das palavras abaixo. E o que confirma o corte e a contagem - mensagens e
// tags tem que dar o mesmo numero - e, melhor ainda, o significado: PE cai em
// EMERGENCIA, Falla_BD_Lx em BOMBA DE DOSAGEM DA LINHA x, Falla_VA_Lx em
// VALVULA DE LIQUIDO DA LINHA x, Falla_TPx em AGITADOR DO LIQUIDO x. Os 25
// pares batem um a um.

const INICIO_DE_MENSAGEM = ['FALHA', 'BAIXA', 'EMERGÊNCIA', 'NÍVEL', 'ALTA', 'FALTA', 'ERRO'];

function trechosLegiveis(buf) {
  const out = [];
  let s = '', ini = 0;
  for (let p = 0; p + 1 < buf.length; p += 2) {
    const c = buf.readUInt16LE(p);
    if (c >= 32 && c <= 0x2000) { if (!s) ini = p; s += String.fromCharCode(c); }
    else { if (s.length >= 4) out.push({ off: ini, texto: s }); s = ''; }
  }
  if (s.length >= 4) out.push({ off: ini, texto: s });
  return out;
}

function separarMensagens(texto) {
  const cortes = new Set([0, texto.length]);
  for (const palavra of INICIO_DE_MENSAGEM) {
    let i = -1;
    while ((i = texto.indexOf(palavra, i + 1)) >= 0) cortes.add(i);
  }
  // "LabelN" e o que o FactoryTalk escreve nas linhas que o autor nunca usou
  const re = /Label\d+/g;
  let m;
  while ((m = re.exec(texto))) { cortes.add(m.index); cortes.add(m.index + m[0].length); }

  const ordem = [...cortes].sort((a, b) => a - b);
  const out = [];
  for (let k = 0; k + 1 < ordem.length; k++) {
    let s = texto.slice(ordem[k], ordem[k + 1]).trim();
    if (!s || /^Label\d+$/.test(s)) continue;
    // o fim do bloco traz sobra de outro campo colado
    s = s.replace(/(Program|system)[.\\][A-Za-z0-9_.]*$/, '').trim();
    out.push(s);
  }
  return out;
}

// --- 5b. a tabela de alarmes da PASTA do projeto -------------------------------
// Na pasta, o .mal e um OLE2 com dois fluxos, e os dois sao melhores do que o
// que o runtime entrega:
//
//   Alarms        as condicoes de disparo, uma por linha, na ordem da tabela -
//                 e com o "NOT" escrito quando o alarme dispara no ZERO, como
//                 acontece com a emergencia. No runtime isso nao aparece, e eu
//                 tinha deduzido a inversao pelo nome da tag.
//   ls<idioma>    as mensagens JA SEPARADAS, em vez do bloco grudado que o
//                 runtime traz e que eu precisava recortar por vocabulario.
//                 As linhas que o autor nunca preencheu aparecem como "LabelN".

function tabelaDeTextos(ls) {
  const n = ls.readUInt32LE(2), BASE = 10, pool = BASE + n * 12;
  const ent = [];
  for (let k = 0; k < n; k++) {
    const o = BASE + k * 12;
    if (o + 12 > ls.length) break;
    ent.push({ id: ls.readUInt32LE(o), des: ls.readUInt32LE(o + 4) });
  }
  // entradas que compartilham o mesmo deslocamento sao objetos sem texto
  const chars = (ls.length - pool) / 2, out = [];
  for (let k = 0; k < ent.length; k++) {
    const prox = k + 1 < ent.length ? ent[k + 1].des : chars;
    if (prox <= ent[k].des) continue;
    let s = '';
    for (let p = pool + ent[k].des * 2; p + 1 < pool + prox * 2 && p + 1 < ls.length; p += 2) {
      s += String.fromCharCode(ls.readUInt16LE(p));
    }
    out.push({ id: ent[k].id, texto: s });
  }
  return out;
}

function lerAlarmesDaPasta(bruto) {
  let dentro;
  try { dentro = ole2.extrair(bruto); } catch (e) { return null; }
  const ls = Object.keys(dentro).find(k => /^ls[0-9a-f]+$/i.test(k));
  if (!dentro['Alarms'] || !ls) return null;

  const mensagens = tabelaDeTextos(dentro[ls])
    .map(x => x.texto.trim())
    .filter(t => t && !/^Label\d+$/.test(t));

  // os gatilhos, na ordem da tabela
  const A = dentro['Alarms'];
  const gatilhos = [];
  let s = '';
  for (let p = 0; p + 1 < A.length; p += 2) {
    const c = A.readUInt16LE(p);
    if (c >= 32 && c <= 0x2000) s += String.fromCharCode(c);
    else {
      if (/::\[/.test(s)) gatilhos.push(s.trim());
      s = '';
    }
  }
  if (/::\[/.test(s)) gatilhos.push(s.trim());

  const alarmes = mensagens.map((texto, i) => {
    const g = gatilhos[i] || '';
    const m = /::\[[^\]]+\](?:Program:)?(?:MainProgram\.)?([A-Za-z0-9_.]+)/.exec(g);
    return {
      id: i + 1, texto,
      tag: m ? m[1] : null,
      // "NOT {tag}" quer dizer que o alarme esta de pe quando a tag vale ZERO
      inverte: /^\s*NOT\b/i.test(g),
    };
  });
  return { alarmes, textos: mensagens, tags: alarmes.map(a => a.tag).filter(Boolean), conferencia: conferir(alarmes) };
}

function lerAlarmes(b) {
  if (!b) return { alarmes: [], textos: [], tags: [] };
  const trechos = trechosLegiveis(b);
  if (!trechos.length) return { alarmes: [], textos: [], tags: [] };

  // o bloco das mensagens e, de longe, o maior trecho legivel do arquivo
  const bloco = trechos.reduce((a, c) => (c.texto.length > a.texto.length ? c : a));
  const mensagens = separarMensagens(bloco.texto);

  // A LISTA BOA DE TAGS COMECA DEPOIS DO MARCADOR "[ALARM]". Entre o bloco de
  // mensagens e esse marcador ha um resto de listagem parcial; usando ela, os
  // pares saem deslocados e EMERGENCIA cai em Falla_TP6.
  const marcador = trechos.find(t => t.off > bloco.off && t.texto.indexOf('[ALARM]') >= 0);
  const daqui = marcador ? marcador.off : bloco.off;

  const tags = [];
  for (const t of trechos) {
    if (t.off <= daqui) continue;
    const m = /::\[[^\]]+\](?:Program:)?(?:MainProgram\.)?([A-Za-z0-9_.]+)$/.exec(t.texto);
    if (m && tags.indexOf(m[1]) < 0) tags.push(m[1]);
  }
  // Reset_acustica e o botao de silenciar, nao um disparo
  const disparos = tags.filter(t => t !== 'Reset_acustica');

  // O fluxo acaba no meio da lista: a ultima tag nao cabe. Ela existe, porem,
  // na listagem parcial que vem ANTES do bloco de mensagens - de la sai o que
  // faltou, sem inventar nome nenhum.
  if (disparos.length < mensagens.length) {
    const antes = [];
    for (const t of trechos) {
      if (t.off >= bloco.off) break;
      const m = /::\[[^\]]+\](?:Program:)?(?:MainProgram\.)?([A-Za-z0-9_.]+)$/.exec(t.texto);
      if (m && m[1] !== 'Reset_acustica' && disparos.indexOf(m[1]) < 0
        && antes.indexOf(m[1]) < 0) antes.push(m[1]);
    }
    while (disparos.length < mensagens.length && antes.length) disparos.push(antes.shift());
  }

  const alarmes = mensagens.map((texto, i) => ({
    id: i + 1, texto, tag: disparos[i] || null,
  }));

  return { alarmes, textos: mensagens, tags: disparos, conferencia: conferir(alarmes) };
}

// Conferencia automatica do casamento. Nao basta a contagem bater: a ordem pode
// estar deslocada e ninguem perceber. Quando a tag e a mensagem falam da mesma
// linha numerada, o numero tem que ser o mesmo - e isso e verificavel sozinho.
function conferir(alarmes) {
  const numeroDaTag = t => {
    const m = /_L(\d)$|TP(\d)$/.exec(t || '');
    return m ? Number(m[1] || m[2]) : null;
  };
  const numeroDaMensagem = s => {
    const m = /\b(?:LINHA|LIQUIDO)\s+(\d)\b/.exec(s || '');
    return m ? Number(m[1]) : null;
  };
  let conferiveis = 0, batem = 0;
  const divergem = [];
  for (const a of alarmes) {
    const nt = numeroDaTag(a.tag), nm = numeroDaMensagem(a.texto);
    if (nt === null || nm === null) continue;
    conferiveis++;
    if (nt === nm) batem++;
    else divergem.push(a.tag + ' <-> ' + a.texto);
  }
  return { conferiveis, batem, divergem };
}
// a pasta traz a forma boa; o runtime, a que precisa de recorte por vocabulario
const bruto = aberto['M_Alarms/MachineAlarms.mal'];
const alarmes = (ehPasta && lerAlarmesDaPasta(bruto)) || lerAlarmes(bruto);

// --- 6. converte cada tela ----------------------------------------------------
fs.mkdirSync(path.join(destino, 'telas'), { recursive: true });

const todasTags = new Set();

for (const [nome, xaml] of Object.entries(xamlPorTela)) {
  const conn = connPorTela[nome] || { leitura: {}, escrita: {} };
  const tela = analisarXaml(xaml, conn, {
    pegarImagem,
    compilar,
    registrarTag: t => todasTags.add(t),
    registrarIgnorado: t => { relatorio.tiposIgnorados[t] = (relatorio.tiposIgnorados[t] || 0) + 1; }
  });
  tela.nome = nome;
  const arq = nome.replace(/[^A-Za-z0-9 _.-]/g, '_') + '.json';
  fs.writeFileSync(path.join(destino, 'telas', arq), JSON.stringify(tela, null, 1), 'utf8');
  relatorio.telasGeradas.push({ nome, arquivo: arq, elementos: contar(tela.elementos) });
}

function contar(lista) {
  let n = 0;
  for (const e of lista) { n++; if (e.filhos) n += contar(e.filhos); }
  return n;
}

// as telas que so existem no formato binario nativo
for (const nome of Object.keys(aberto)) {
  const m = /^Gfx\/(.+)\.gfx$/.exec(nome);
  if (m && !xamlPorTela[m[1]] && !/^__MAPPE/.test(m[1])) relatorio.telasSoEmGfx.push(m[1]);
}

relatorio.tags = [...todasTags].sort();
const doAcervo = converterAcervoInteiro();
fs.writeFileSync(path.join(destino, 'alarmes.json'), JSON.stringify(alarmes, null, 1), 'utf8');
fs.writeFileSync(path.join(destino, '_origem.json'), JSON.stringify({
  arquivo: path.basename(origemArg),
  forma: ehPasta ? 'pasta do projeto do FactoryTalk View Studio' : 'runtime .mer',
  extraidoEm: new Date().toISOString().slice(0, 10),
  como: ehPasta
    ? 'arquivos soltos da pasta do projeto; cada .gfx e um OLE2 cujo desenho esta no fluxo Contents e as legendas num fluxo ls<idioma>'
    : 'OLE2 + LZ77 proprio da Rockwell (ferramentas/rockwell/lz.js), telas do XAML do cliente web embutido no .mer',
  telasGeradas: relatorio.telasGeradas,
  telasSoEmGfx: relatorio.telasSoEmGfx.sort(),
  tiposDeElementoIgnorados: relatorio.tiposIgnorados,
  imagensNaoEncontradas: [...new Set(semImagem)].sort(),
  imagensSemTransparencia: [...new Set(relatorio.semTransparencia)].sort(),
  tagsUsadas: relatorio.tags
}, null, 1), 'utf8');

console.log('telas geradas   : ' + relatorio.telasGeradas.length);
relatorio.telasGeradas.forEach(t => console.log('   ' + String(t.elementos).padStart(4) + ' elementos  ' + t.nome));
const usadas = Object.values(imagens).filter(Boolean).length;
console.log('imagens         : ' + usadas + ' das telas, + ' + doAcervo + ' do acervo' + (semImagem.length ? ', ' + [...new Set(semImagem)].length + ' nao encontradas' : ''));
console.log('tags usadas     : ' + relatorio.tags.length);
const c = alarmes.conferencia;
console.log('alarmes         : ' + alarmes.alarmes.length + ' mensagens, '
  + alarmes.alarmes.filter(a => a.tag).length + ' com tag de disparo');
console.log('  conferencia   : ' + c.batem + ' de ' + c.conferiveis
  + ' pares numerados batem' + (c.divergem.length ? '  DIVERGEM: ' + c.divergem.join('; ') : ''));
console.log('so no .gfx      : ' + relatorio.telasSoEmGfx.length + ' telas (ver _origem.json)');
const ign = Object.entries(relatorio.tiposIgnorados);
if (ign.length) {
  console.log('tipos ignorados : ' + ign.map(([k, v]) => k + ' x' + v).join(', '));
}
