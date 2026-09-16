// ---------------------------------------------------------------------------
// INVENTARIO DAS TELAS QUE SO EXISTEM EM .gfx
// ---------------------------------------------------------------------------
//   node ferramentas/rockwell/inventario-gfx.js <arquivo.mer> <id-da-maquina>
//
// Gera maquinas/<id>/_telas-gfx.json e _telas-gfx.md: o que cada tela que ficou
// de fora contem — quantos controles, de que tipo, em que posicao, e quais tags
// do CLP ela toca.
//
// Nao gera tela navegavel, de proposito. Ver o cabecalho de gfx.js: a geometria
// sai certa, mas a ligacao entre cada controle e a tag dele nao, e uma tela com
// o botao no lugar certo ligado na tag errada engana quem esta aprendendo.
// ---------------------------------------------------------------------------

'use strict';

const fs = require('fs');
const path = require('path');
const ole2 = require('./ole2.js');
const lz = require('./lz.js');
const { analisarGfx } = require('./gfx.js');

const RAIZ = path.resolve(__dirname, '..', '..');
const arqMer = process.argv[2];
const id = process.argv[3];

if (!arqMer || !id) {
  console.error('uso: node ferramentas/rockwell/inventario-gfx.js <arquivo.mer> <id-da-maquina>');
  process.exit(1);
}
const destino = path.join(RAIZ, 'maquinas', id);
if (!fs.existsSync(destino)) {
  console.error('nao existe ' + destino + ' — rode antes o extrair-mer.js');
  process.exit(1);
}

// --- 1. abre o .mer e pega os fluxos das telas --------------------------------
const fluxos = ole2.extrair(fs.readFileSync(arqMer));

const gfxPorTela = {};
for (const nome of Object.keys(fluxos)) {
  const m = /^Gfx\/(.+)\.gfx(\/Contents)?$/.exec(nome);
  if (!m || /^__MAPPE/.test(m[1])) continue;
  gfxPorTela[m[1]] = lz.descompactar(fluxos[nome]);
}

// quais telas ja saem em XAML, pelo extrator principal
const jaTemos = new Set(
  fs.existsSync(path.join(destino, 'telas'))
    ? fs.readdirSync(path.join(destino, 'telas')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5))
    : []
);

// backups que o programador deixou no projeto: prefixo Z, ZZZ- ou zzz
const eRascunho = n => /^(ZZZ|zzz|Z[A-Z])/.test(n);

// o .gfx escreve as telas do sistema como [ALARM]; o XAML, como _ALARM_
const mesmaTela = n => n.replace(/^\[(.+)\]$/, '_$1_');

const todasAsTelas = new Set([...Object.keys(gfxPorTela), ...jaTemos]);

// --- 2. le cada tela que falta ------------------------------------------------
const faltam = Object.keys(gfxPorTela).filter(n => !jaTemos.has(mesmaTela(n))).sort();
const inventario = [];

for (const nome of faltam) {
  const { elementos, tags, expressoes } = analisarGfx(gfxPorTela[nome]);

  // nomes que na verdade sao destino de botao de navegacao, nao controle
  const controles = [], destinos = [];
  for (const e of elementos) (todasAsTelas.has(e.id) || jaTemos.has(mesmaTela(e.id)) ? destinos : controles).push(e);

  const porTipo = {};
  controles.forEach(e => porTipo[e.t] = (porTipo[e.t] || 0) + 1);

  inventario.push({
    nome,
    rascunho: eRascunho(nome),
    bytes: gfxPorTela[nome].length,
    porTipo,
    controles,
    destinos: destinos.map(e => e.id).sort(),
    tags, expressoes,
  });
}

// --- 2b. o que o publish do ViewPoint descartou das telas que TEMOS -----------
// Uma tela pode existir nos dois formatos e ainda assim sair incompleta: o
// publish descarta os campos de entrada numerica inteiros. Comparando os dois,
// sobra exatamente o que falta - com a posicao vinda do binario, que e medida,
// nao estimada. O que o binario nao diz e a tag e o rotulo de cada campo; isso
// fica para a camada de aparencia.
const faltantes = {};
for (const nome of Object.keys(gfxPorTela)) {
  const arqTela = path.join(destino, 'telas', mesmaTela(nome) + '.json');
  if (!fs.existsSync(arqTela)) continue;
  const tela = JSON.parse(fs.readFileSync(arqTela, 'utf8'));
  const temIds = new Set();
  (function anda(l) { for (const e of l) { if (e.id) temIds.add(e.id); if (e.filhos) anda(e.filhos); } })(tela.elementos);

  const { elementos } = analisarGfx(gfxPorTela[nome]);
  const fora = elementos.filter(e => !temIds.has(e.id) && e.t !== 'desconhecido'
    && !todasAsTelas.has(e.id) && !jaTemos.has(mesmaTela(e.id)));
  if (fora.length) faltantes[mesmaTela(nome)] = fora.sort((a, b) => a.y - b.y || a.x - b.x);
}

fs.writeFileSync(path.join(destino, '_gfx-faltantes.json'), JSON.stringify({
  aviso: 'Elementos que existem no .gfx e sumiram no publish do ViewPoint. A '
    + 'posicao e o tipo sao extraidos do binario; a tag e o rotulo de cada um '
    + 'nao estao la e vem da camada de aparencia.',
  telas: faltantes,
}, null, 1) + '\n');

fs.writeFileSync(path.join(destino, '_telas-gfx.json'), JSON.stringify({
  aviso: 'Inventario, nao tela navegavel. Geometria e nome saem certos; a ligacao '
    + 'de cada controle com a tag dele nao sai. Ver ferramentas/rockwell/gfx.js.',
  telas: inventario,
}, null, 1) + '\n');

// --- 3. a versao legivel ------------------------------------------------------
const linhas = [];
linhas.push('# Telas que só existem no `.gfx`');
linhas.push('');
linhas.push('Gerado por `ferramentas/rockwell/inventario-gfx.js`. É um **inventário**, não');
linhas.push('uma tela navegável — o porquê está no cabeçalho de `ferramentas/rockwell/gfx.js`.');
linhas.push('');
linhas.push('O nome de cada controle e a posição dele saem do binário. O tipo vem do nome,');
linhas.push('que o FactoryTalk gera sozinho. As tags são as que a tela inteira toca: o');
linhas.push('arquivo não diz qual controle usa qual.');
linhas.push('');

const uteis = inventario.filter(t => !t.rascunho);
const rascunhos = inventario.filter(t => t.rascunho);

linhas.push('| Tela | Controles | Tags do CLP | Composição |');
linhas.push('| :--- | ---: | ---: | :--- |');
for (const t of uteis) {
  const comp = Object.keys(t.porTipo).sort((a, b) => t.porTipo[b] - t.porTipo[a])
    .map(k => t.porTipo[k] + ' ' + k).join(', ');
  linhas.push('| ' + t.nome + ' | ' + t.controles.length + ' | ' + t.tags.length + ' | ' + comp + ' |');
}
linhas.push('');
if (rascunhos.length) {
  linhas.push('Fora da tabela, ' + rascunhos.length + ' telas com prefixo `Z`, `ZZZ-` ou `zzz`: são');
  linhas.push('versões antigas que o programador guardou dentro do projeto.');
  linhas.push('');
}

for (const t of uteis) {
  linhas.push('## ' + t.nome);
  linhas.push('');
  if (t.destinos.length) linhas.push('Leva para: ' + t.destinos.join(', ') + '.');
  linhas.push('');
  linhas.push('```');
  for (const e of t.controles) {
    linhas.push(e.t.padEnd(13) + e.id.padEnd(28)
      + String(e.x).padStart(5) + ',' + String(e.y).padStart(4)
      + '  ' + String(e.w).padStart(4) + 'x' + String(e.h).padStart(3));
  }
  linhas.push('```');
  linhas.push('');
  if (t.tags.length) {
    linhas.push('Tags do CLP que esta tela usa (' + t.tags.length + '):');
    linhas.push('');
    linhas.push('```');
    t.tags.forEach(x => linhas.push(x));
    linhas.push('```');
    linhas.push('');
  }
  if (t.expressoes.length) {
    linhas.push('Contas que a tela faz sobre essas tags (' + t.expressoes.length + '):');
    linhas.push('');
    linhas.push('```');
    t.expressoes.forEach(x => linhas.push(x));
    linhas.push('```');
    linhas.push('');
  }
}

fs.writeFileSync(path.join(destino, '_telas-gfx.md'), linhas.join('\n'));

console.log('telas no .gfx        : ' + Object.keys(gfxPorTela).length);
console.log('ja saiam em XAML     : ' + jaTemos.size);
console.log('inventariadas        : ' + inventario.length + ' (' + rascunhos.length + ' são rascunho)');
console.log('controles lidos      : ' + inventario.reduce((s, t) => s + t.controles.length, 0));
console.log('tags lidas           : ' + inventario.reduce((s, t) => s + t.tags.length, 0));
console.log('');
console.log('gerado: maquinas/' + id + '/_telas-gfx.md  e  _telas-gfx.json');
