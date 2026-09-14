// ---------------------------------------------------------------------------
// BUILD DE UMA MAQUINA DO TIPO "PERCURSO"
// ---------------------------------------------------------------------------
// Maquinas cuja IHM nao e web (a B18 e Vijeo, formato binario fechado) entram
// na plataforma como percurso navegavel: imagens reais das telas + areas
// clicaveis. Nao ha CLP nem valores - so a navegacao, que e fiel.
//
//   node ferramentas/build-percurso.js ls-b18
//
// Le  : maquinas/<id>/{maquina.json, telas.json, telas/*.png, maquina.jpg}
// Gera: <id>/{index.html, telas/*.png, maquina.jpg}
// ---------------------------------------------------------------------------
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const id = process.argv[2];

if (!id) {
  console.error('uso: node ferramentas/build-percurso.js <id-da-maquina>');
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
const telas = lerJson(path.join(pastaFonte, 'telas.json'));

if (maquina.tipoSimulacao !== 'percurso') {
  console.error('a maquina "' + id + '" nao e do tipo percurso (tipoSimulacao='
    + maquina.tipoSimulacao + '). Para as maquinas TwinCAT use ferramentas/build.js.');
  process.exit(1);
}

// --- conferencias que evitam publicar um percurso quebrado ------------------
const nomes = Object.keys(telas.telas);
const problemas = [];

if (!telas.telas[telas.inicial]) {
  problemas.push('a tela inicial "' + telas.inicial + '" nao existe no mapa');
}
if (!telas.telas[telas.inicial] || !telas.telas[telas.inicial].imagem) {
  problemas.push('a tela inicial "' + telas.inicial + '" nao tem imagem - o percurso abriria vazio');
}

function conferirDestinos(lista, origem) {
  (lista || []).forEach(function (a) {
    if (!telas.telas[a.destino]) {
      problemas.push('area "' + a.rotulo + '" em ' + origem + ' aponta para "' + a.destino + '", que nao existe');
    }
  });
}
conferirDestinos(telas.menu, 'menu');
nomes.forEach(function (n) { conferirDestinos(telas.telas[n].areas, 'tela ' + n); });

nomes.forEach(function (n) {
  const img = telas.telas[n].imagem;
  if (img && !fs.existsSync(path.join(pastaFonte, img))) {
    problemas.push('a tela "' + n + '" aponta para ' + img + ', que nao esta na pasta');
  }
});

if (problemas.length) {
  console.error('mapa de telas inconsistente:');
  problemas.forEach(function (p) { console.error('  - ' + p); });
  process.exit(1);
}

// --- copia das imagens -------------------------------------------------------
fs.mkdirSync(path.join(pastaSaida, 'telas'), { recursive: true });

let copiadas = 0;
nomes.forEach(function (n) {
  const img = telas.telas[n].imagem;
  if (!img) return;
  fs.copyFileSync(path.join(pastaFonte, img), path.join(pastaSaida, img));
  copiadas++;
});

const foto = path.join(pastaFonte, 'maquina.jpg');
if (fs.existsSync(foto)) fs.copyFileSync(foto, path.join(pastaSaida, 'maquina.jpg'));

// Foto do painel, usada como moldura em volta da IHM
let temMoldura = false;
if (maquina.painel && maquina.painel.foto) {
  const origem = path.join(pastaFonte, maquina.painel.foto);
  if (!fs.existsSync(origem)) {
    console.error('a moldura aponta para ' + maquina.painel.foto + ', que nao esta na pasta');
    process.exit(1);
  }
  fs.copyFileSync(origem, path.join(pastaSaida, maquina.painel.foto));
  temMoldura = true;
}

// --- pagina -------------------------------------------------------------------
// O mapa vai embutido na pagina em vez de ser buscado por fetch: assim o
// percurso tambem abre direto do disco, sem servidor.
const cfg = {
  resolucao: telas.resolucao,
  inicial: telas.inicial,
  menu: telas.menu,
  telas: telas.telas
};
if (temMoldura) cfg.painel = maquina.painel;

const modelo = fs.readFileSync(path.join(RAIZ, 'web', 'percurso.html'), 'utf8');
const pagina = modelo
  .split('__NOME__').join(maquina.modelo)
  .replace('__CFG__', JSON.stringify(cfg, null, 2));

fs.writeFileSync(path.join(pastaSaida, 'index.html'), pagina, 'utf8');

const semImagem = nomes.filter(function (n) { return !telas.telas[n].imagem; }).length;
console.log('percurso "' + id + '" gerado em ' + path.relative(RAIZ, pastaSaida) + '/');
console.log('  telas no mapa   : ' + nomes.length);
console.log('  com imagem      : ' + copiadas);
console.log('  ainda pendentes : ' + semImagem);
console.log('  areas de menu   : ' + telas.menu.length);
