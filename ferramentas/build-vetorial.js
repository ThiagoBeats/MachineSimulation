// ---------------------------------------------------------------------------
// BUILD DE UMA MAQUINA DO TIPO "VETORIAL"
// ---------------------------------------------------------------------------
// Maquinas cuja IHM foi desenhada em FactoryTalk View ME. As telas sao
// redesenhadas em SVG a partir da propria definicao vetorial do projeto, e
// ficam vivas: o que aparece nelas vem de tags, e as tags vem do programa do
// CLP, que roda de verdade em ladder.js a partir de programa.json.
//
//   node ferramentas/build-vetorial.js ls-b18-corteva
//
// Le  : maquinas/<id>/{maquina.json, telas/*.json, imagens/*, valores.js,
//                      planta.js, programa.json}
// Gera: <id>/{index.html, vetorial.js, ladder.js, telas.js, programa.js,
//             valores.js, planta.js, imagens/*}
//
// As expressoes saem do extrator como TEXTO de codigo JavaScript. E aqui que
// elas viram funcao de verdade, dentro de telas.js - assim o navegador nunca
// precisa compilar texto em tempo de execucao.
// ---------------------------------------------------------------------------
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const id = process.argv[2];

if (!id) {
  console.error('uso: node ferramentas/build-vetorial.js <id-da-maquina>');
  process.exit(1);
}

const pastaFonte = path.join(RAIZ, 'maquinas', id);
const pastaSaida = path.join(RAIZ, id);

function lerJson(arq) {
  try {
    return JSON.parse(fs.readFileSync(arq, 'utf8'));
  } catch (e) {
    console.error('nao consegui ler ' + arq + ': ' + e.message);
    process.exit(1);
  }
}

const maquina = lerJson(path.join(pastaFonte, 'maquina.json'));
if (maquina.tipoSimulacao !== 'vetorial') {
  console.error('a maquina "' + id + '" nao e do tipo vetorial (tipoSimulacao='
    + maquina.tipoSimulacao + ').');
  process.exit(1);
}

// --- le as telas ---------------------------------------------------------------
const pastaTelas = path.join(pastaFonte, 'telas');
if (!fs.existsSync(pastaTelas)) {
  console.error('nao ha pasta telas/ em ' + path.relative(RAIZ, pastaFonte)
    + '. Rode antes: node ferramentas/rockwell/extrair-mer.js <arquivo.mer> ' + id);
  process.exit(1);
}

const telas = {};
for (const arq of fs.readdirSync(pastaTelas).filter(f => f.endsWith('.json'))) {
  const t = lerJson(path.join(pastaTelas, arq));
  telas[t.nome] = t;
}

// --- camada de aparencia --------------------------------------------------------
// Quando a maquina tem um aparencia.js, ele corrige as telas extraidas com o que
// os prints da IHM real mostram e o arquivo publicado nao entrega. E reconstrucao
// declarada, nao extracao: cada elemento que ela cria fica marcado com
// "reconstruido", e o cabecalho do arquivo diz de onde cada correcao saiu.
let aparencia = null;
const arqAparencia = path.join(pastaFonte, 'aparencia.js');
if (fs.existsSync(arqAparencia)) {
  aparencia = require(arqAparencia).aplicar(telas);
}

// --- conferencias que evitam publicar uma simulacao quebrada --------------------
const problemas = [];
const nomes = Object.keys(telas);

if (!telas[maquina.inicial]) {
  problemas.push('a tela inicial "' + maquina.inicial + '" nao existe');
}

let destinosPerdidos = 0;
let comLigacao = 0;
const imagensUsadas = new Set();

function conferir(lista, tela) {
  for (const el of lista) {
    if (el.filhos) conferir(el.filhos, tela);
    if (el.valor || el.indicador || el.visivel || el.animaCor) comLigacao++;
    if (el.arq) imagensUsadas.add(el.arq);
    // O icone de dentro de um botao tambem e imagem. Sem esta linha, o botao
    // HOME saia com a marca de imagem quebrada em toda tela de processo.
    if (el.icone && el.icone.arq) imagensUsadas.add(el.icone.arq);
    if (el.t === 'botao' && el.modo === 'ir') {
      // Um destino que nao foi extraido nao e erro: e uma das telas que so
      // existem no formato binario. Mas o botao nao pode ficar mudo sem
      // ninguem saber, entao contamos e avisamos.
      if (!telas[el.destino]) destinosPerdidos++;
    }
  }
}
nomes.forEach(n => conferir(telas[n].elementos, n));

for (const arq of imagensUsadas) {
  if (!fs.existsSync(path.join(pastaFonte, 'imagens', arq))) {
    problemas.push('a imagem ' + arq + ' e usada por uma tela mas nao esta em imagens/');
  }
}

if (problemas.length) {
  console.error('a maquina esta inconsistente:');
  problemas.forEach(p => console.error('  - ' + p));
  process.exit(1);
}

// --- copia os arquivos ----------------------------------------------------------
fs.mkdirSync(path.join(pastaSaida, 'imagens'), { recursive: true });
for (const arq of imagensUsadas) {
  fs.copyFileSync(path.join(pastaFonte, 'imagens', arq), path.join(pastaSaida, 'imagens', arq));
}
fs.copyFileSync(path.join(RAIZ, 'web', 'vetorial.js'), path.join(pastaSaida, 'vetorial.js'));
fs.copyFileSync(path.join(RAIZ, 'web', 'ladder.js'), path.join(pastaSaida, 'ladder.js'));

for (const arq of ['valores.js', 'planta.js']) {
  const origem = path.join(pastaFonte, arq);
  fs.writeFileSync(path.join(pastaSaida, arq),
    fs.existsSync(origem) ? fs.readFileSync(origem) : '// ainda nao ha\n');
}

// O programa do CLP vira um .js em vez de .json para a pagina abrir direto do
// disco, sem servidor: <script src> funciona em file://, fetch nao.
let rungs = 0;
const arqPrograma = path.join(pastaFonte, 'programa.json');
if (fs.existsSync(arqPrograma)) {
  const programa = lerJson(arqPrograma);
  for (const lista of Object.values(programa.rotinas)) rungs += lista.filter(Boolean).length;
  fs.writeFileSync(path.join(pastaSaida, 'programa.js'),
    '// Gerado por ferramentas/rockwell/extrair-acd.js a partir do .ACD - nao edite a mao.\n'
    + 'window.PROGRAMA = ' + JSON.stringify(programa) + ';\n', 'utf8');
} else {
  fs.writeFileSync(path.join(pastaSaida, 'programa.js'), 'window.PROGRAMA = null;\n', 'utf8');
}

const foto = path.join(pastaFonte, 'maquina.jpg');
if (fs.existsSync(foto)) fs.copyFileSync(foto, path.join(pastaSaida, 'maquina.jpg'));

// A moldura pode ser a foto do gabinete ou um desenho pronto, como o do
// PanelView Plus, que o proprio navegador traca e nao precisa de arquivo.
let temMoldura = false;
if (maquina.painel && maquina.painel.foto) {
  const origem = path.join(pastaFonte, maquina.painel.foto);
  if (!fs.existsSync(origem)) {
    console.error('a moldura aponta para ' + maquina.painel.foto + ', que nao esta na pasta');
    process.exit(1);
  }
  fs.copyFileSync(origem, path.join(pastaSaida, maquina.painel.foto));
  temMoldura = true;
} else if (maquina.painel && maquina.painel.moldura) {
  temMoldura = true;
}

// --- gera telas.js ---------------------------------------------------------------
// As chaves que guardam expressao viram funcao. O nome dessas chaves esta aqui
// numa lista so, para nao haver duvida sobre o que e codigo e o que e dado.
const CAMPOS_DE_EXPRESSAO = new Set(['valor', 'indicador', 'expr']);

function serializar(v, chave) {
  if (CAMPOS_DE_EXPRESSAO.has(chave) && typeof v === 'string') {
    return 'function(v){return ' + v + ';}';
  }
  if (Array.isArray(v)) return '[' + v.map(x => serializar(x, null)).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).map(k => JSON.stringify(k) + ':' + serializar(v[k], k)).join(',') + '}';
  }
  return JSON.stringify(v === undefined ? null : v);
}

const origem = fs.existsSync(path.join(pastaFonte, '_origem.json'))
  ? lerJson(path.join(pastaFonte, '_origem.json')) : {};

const cfg = {
  id: id,
  inicial: maquina.inicial,
  telas: telas,
  telasDeFora: origem.telasSoEmGfx || [],
  rungs: rungs
};
if (temMoldura) cfg.painel = maquina.painel;
if (maquina.cabecalho) cfg.cabecalho = maquina.cabecalho;

fs.writeFileSync(path.join(pastaSaida, 'telas.js'),
  '// Gerado por ferramentas/build-vetorial.js - nao edite a mao.\n'
  + 'window.TELAS_CFG = ' + serializar(cfg, null) + ';\n', 'utf8');

// --- gera a pagina -----------------------------------------------------------------
const modelo = fs.readFileSync(path.join(RAIZ, 'web', 'vetorial.html'), 'utf8');
fs.writeFileSync(path.join(pastaSaida, 'index.html'),
  modelo.split('__NOME__').join(maquina.modelo).replace('__CFG__', 'window.TELAS_CFG'), 'utf8');

// --- relatorio ---------------------------------------------------------------------
console.log('maquina vetorial "' + id + '" gerada em ' + path.relative(RAIZ, pastaSaida) + '/');
console.log('  telas          : ' + nomes.length);
console.log('  ligacoes vivas : ' + comLigacao);
console.log('  imagens        : ' + imagensUsadas.size);
if (aparencia) {
  console.log('  aparencia      : ' + Object.keys(aparencia)
    .map(k => aparencia[k] + ' ' + k).join(', ') + ' (reconstruido dos prints)');
}
console.log('  rungs emulados : ' + (cfg.rungs || 'nenhum ainda'));
if (destinosPerdidos) {
  console.log('  ATENCAO        : ' + destinosPerdidos + ' botoes apontam para telas que nao foram extraidas');
}
if (cfg.telasDeFora.length) {
  console.log('  fora           : ' + cfg.telasDeFora.length + ' telas so existem no formato binario');
}
