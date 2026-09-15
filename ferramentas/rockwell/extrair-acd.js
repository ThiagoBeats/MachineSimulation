// ---------------------------------------------------------------------------
// EXTRAI O PROGRAMA DO CLP DE UM PROJETO STUDIO 5000 (.ACD)
// ---------------------------------------------------------------------------
//   node ferramentas/rockwell/extrair-acd.js <arquivo.ACD> <id-da-maquina>
//
// Gera maquinas/<id>/programa.json com o ladder ja analisado em arvore, a
// ordem de varredura e a ligacao dos parametros de cada AOI. Quem executa isso
// e web/ladder.js, no navegador.
//
// Nao ha transcricao a mao em lugar nenhum: o programa continua sendo o do
// CLP. O que escrevemos uma vez so foi o significado de cada instrucao.
// ---------------------------------------------------------------------------
'use strict';

const fs = require('fs');
const path = require('path');

const acd = require('./acd.js');
const { analisarRung, separarArgumentos } = require('./ladder.js');

const RAIZ = path.resolve(__dirname, '..', '..');
const arquivo = process.argv[2];
const id = process.argv[3];

if (!arquivo || !id) {
  console.error('uso: node ferramentas/rockwell/extrair-acd.js <arquivo.ACD> <id-da-maquina>');
  process.exit(1);
}

const projeto = acd.abrir(arquivo);
const destino = path.join(RAIZ, 'maquinas', id);

// --- rotinas, na ordem de varredura -------------------------------------------
const rotinas = {};
for (const b of projeto.blocos) {
  (rotinas[b.rotina] = rotinas[b.rotina] || []).push(b);
}

// --- tudo que o programa cita, para resolver os membros dos temporizadores -------
// TON(X,?,?) nao diz onde ficam PRE/ACC/DN. Quando X e membro de um AOI o
// caminho e X.TIMER.PRE; quando e um TIMER solto e X.PRE. Descobrimos olhando
// o que o resto do programa referencia.
const todasAsTags = new Set();
for (const b of projeto.blocos) {
  (b.texto.match(/[A-Za-z_][A-Za-z0-9_.:\[\]]*/g) || []).forEach(t => todasAsTags.add(t));
}
function prefixoDeMembro(base, ...tipos) {
  for (const tipo of tipos) {
    const comTipo = base + '.' + tipo + '.';
    for (const t of todasAsTags) if (t.indexOf(comTipo) === 0) return '.' + tipo + '.';
  }
  return '.';
}

// --- parametros de cada AOI ------------------------------------------------------
// A ordem vem do RxTagCollection do proprio AOI. EnableIn e EnableOut existem
// em todo AOI e nunca entram na chamada; os nomes internos comecam com _ ou $.
// Conferencia: toda chamada de um mesmo AOI tem a mesma quantidade de
// argumentos, e ela cabe na lista.
const EXCLUI = new Set(['EnableIn', 'EnableOut', 'RxTagCollection']);
const aoi = {};
const problemas = [];

const nomesDeAoi = [...new Set(projeto.rotinas.filter(r => /\.Logic$/.test(r)).map(r => r.replace(/\.Logic$/, '')))];

for (const nome of nomesDeAoi) {
  const lista = projeto.membrosDe(nome).filter(x => !EXCLUI.has(x.nome) && !/^[$_]/.test(x.nome));

  const quantidades = new Set();
  for (const b of projeto.blocos) {
    let i = 0;
    while ((i = b.texto.indexOf(nome + '(', i)) >= 0) {
      if (i > 0 && /[A-Za-z0-9_.]/.test(b.texto[i - 1])) { i++; continue; }
      let nivel = 1, j = i + nome.length + 1;
      const ini = j;
      while (j < b.texto.length && nivel > 0) {
        if (b.texto[j] === '(') nivel++;
        else if (b.texto[j] === ')') nivel--;
        if (nivel > 0) j++;
      }
      quantidades.add(separarArgumentos(b.texto.slice(ini, j)).length - 1);
      i = j;
    }
  }
  if (!quantidades.size) continue;
  if (quantidades.size > 1) {
    problemas.push('o AOI ' + nome + ' e chamado com quantidades diferentes de argumentos: ' + [...quantidades]);
    continue;
  }
  const n = [...quantidades][0];
  if (n > lista.length) {
    problemas.push('o AOI ' + nome + ' e chamado com ' + n + ' argumentos, mas so tem ' + lista.length + ' parametros');
    continue;
  }
  const usados = lista.slice(0, n);

  // Reordena so os parametros de entrada e saida, seguindo a ordem do tipo de
  // dados. Os InOut ficam onde estao: eles nao aparecem no tipo.
  const ordemDoTipo = projeto.membrosDoTipo(nome);
  const posicoesInOut = [];
  const copiados = [];
  usados.forEach((x, i) => {
    if (x.modo === 'entradaSaida') posicoesInOut.push(i);
    else copiados.push(x);
  });
  copiados.sort((a, b) => {
    const ia = ordemDoTipo.indexOf(a.nome), ib = ordemDoTipo.indexOf(b.nome);
    if (ia < 0 || ib < 0) return 0;
    return ia - ib;
  });
  const finais = [];
  let k = 0;
  for (let i = 0; i < usados.length; i++) {
    finais.push(posicoesInOut.indexOf(i) >= 0 ? usados[i] : copiados[k++]);
  }

  aoi[nome] = {
    rotina: nome + '.Logic',
    parametros: finais.map(x => x.nome),
    modos: finais.map(x => x.modo || 'entradaSaida')
  };
}

// --- pontos de entrada -------------------------------------------------------------
// Uma rotina e ponto de entrada quando nenhum JSR aponta para ela. As rotinas
// .Logic dos AOIs ficam de fora: elas rodam quando o AOI e chamado.
const chamadas = new Set();
for (const b of projeto.blocos) {
  (b.texto.match(/JSR\(([^,)]+)/g) || []).forEach(m => chamadas.add(m.slice(4).trim()));
}
const entradas = [];
const mortas = [];
for (const nome of Object.keys(rotinas)) {
  if (/\.Logic$/.test(nome)) continue;        // rotina de AOI: roda quando o AOI e chamado
  if (chamadas.has(nome)) continue;
  if (/MainRoutine$/.test(nome) || !/^MainProgram\./.test(nome)) entradas.push(nome);
  else mortas.push(nome);
}
// MainRoutine primeiro: e a varredura continua do CLP.
entradas.sort((a, b) => (/MainRoutine$/.test(b) ? 1 : 0) - (/MainRoutine$/.test(a) ? 1 : 0));

// --- monta o programa -----------------------------------------------------------------
const saida = { rotinas: {}, aoi, entradas, temporizadores: {}, chamadasDeAoi: [] };
let comCodigo = 0, vazios = 0;

// Guardamos tambem cada chamada de AOI com os argumentos dela. E dali que
// planta.js monta as realimentacoes de campo: toda valvula chamada por
// EV_MonoEstable tem um comando e dois fins de curso, e todo motor chamado por
// ArranqueDirecto tem um contator e uma confirmacao de marcha. Sem isso a
// maquina liga e fica parada esperando um sensor que nao existe.
function anotarChamadas(no) {
  if (!no || typeof no !== 'object') return;
  if (no.t === 'serie') return no.i.forEach(anotarChamadas);
  if (no.t === 'par') return no.r.forEach(anotarChamadas);
  if (no.t !== 'i') return;
  if (!aoi[no.n]) return;
  const args = (no.a || []).map(a => (typeof a === 'string' ? a : null));
  saida.chamadasDeAoi.push({ aoi: no.n, args });
}

for (const [nome, blocos] of Object.entries(rotinas)) {
  saida.rotinas[nome] = blocos.map(b => {
    if (!b.texto.trim()) { vazios++; return null; }
    comCodigo++;
    const arvore = analisarRung(b.texto);
    anotarChamadas(arvore);
    return arvore;
  });
}

// prefixo de membro de cada temporizador e contador citado
for (const b of projeto.blocos) {
  const re = /\b(TON|TOF|TONR|RTOR|RTO)\(([^,)]+)/g;
  let m;
  while ((m = re.exec(b.texto))) {
    const base = m[2].trim();
    if (/^[A-Za-z_]/.test(base)) saida.temporizadores[base] = prefixoDeMembro(base, 'FBD_TIMER', 'TIMER');
  }
  const re2 = /\b(CTU|CTD|RES)\(([^,)]+)/g;
  while ((m = re2.exec(b.texto))) {
    const base = m[2].trim();
    if (/^[A-Za-z_]/.test(base)) saida.temporizadores[base] = prefixoDeMembro(base, 'FBD_COUNTER', 'COUNTER');
  }
}

// --- blocos funcionais: quais tem o pino EnableIn ligado -----------------------
// Um bloco de FBD so calcula quando o EnableIn dele esta ligado. Na conversao
// para ladder isso vira "XIC(origem) OTE(BLOCO.FBD_XXX.EnableIn)", e o calculo
// em si fica entre start_block e end_block. Quando o pino nao e ligado, o bloco
// calcula sempre.
//
// Ignorar isso quebra a dosagem: o ADD que guarda quantos litros a batelada
// precisa passa a recalcular a cada varredura, e o alvo foge junto com o
// totalizador - a valvula abre e nunca mais fecha.
saida.fbdEnable = {};
for (const b of projeto.blocos) {
  const re = new RegExp('OTE\\(([A-Za-z0-9_.]+)\\.(FBD_[A-Za-z_]+|SELECT|DOMINANT_SET)\\.EnableIn\\)', 'g');
  let m;
  while ((m = re.exec(b.texto))) saida.fbdEnable[m[1]] = m[1] + '.' + m[2] + '.EnableIn';
}

// --- interface com o mundo fisico ---------------------------------------------------
// Toda tag que o programa LE e nunca ESCREVE so pode vir de fora: sensor, fim
// de curso, chave de liberacao, inversor. Essa lista e o contrato que
// planta.js precisa cobrir, e sai sozinha - ninguem escreve na mao.
const PRIMEIRO = new Set(['OTE', 'OTL', 'OTU', 'CLR', 'CPT', 'TON', 'TOF', 'TONR', 'RTOR',
  'CTU', 'CTD', 'RES', 'SEL', 'SETD', 'MVMT', 'OSRI', 'OSFI', 'PID']);
const ULTIMO = new Set(['MOV', 'ADD', 'SUB', 'MUL', 'DIV', 'NEG', 'ABS', 'COP', 'MVM']);
const DOIS = new Set(['OSR', 'OSF']);

const lidas = new Set(), gravadas = new Set();
const semIndice = t => String(t).replace(/\[[^\]]*\]/g, '').replace(/\.\d+$/, '');

// Quais parametros cada AOI escreve? Sai da logica do proprio AOI: percorremos
// os rungs dele e vemos quais nomes de parametro aparecem como destino. Sem
// isso, dar por escrito todo argumento de chamada apagaria da lista entradas
// de verdade - as 17 chaves LockOut, por exemplo, que o AOI so le.
function destinosDoBloco(no, saida) {
  if (!no || typeof no !== 'object') return saida;
  if (no.t === 'serie') { no.i.forEach(x => destinosDoBloco(x, saida)); return saida; }
  if (no.t === 'par') { no.r.forEach(x => destinosDoBloco(x, saida)); return saida; }
  if (no.t !== 'i') return saida;
  const args = (no.a || []).filter(a => typeof a === 'string' && /^[A-Za-z_&]/.test(a));
  if (PRIMEIRO.has(no.n) && args[0]) saida.push(args[0]);
  if (ULTIMO.has(no.n) && args.length > 1) saida.push(args[args.length - 1]);
  if (DOIS.has(no.n)) args.forEach(a => saida.push(a));
  if (no.n === 'BTD' && args[2]) saida.push(args[2]);
  return saida;
}

const escritosPorAoi = {};
for (const [nome, def] of Object.entries(aoi)) {
  const escritos = new Set();
  for (const bloco of (saida.rotinas[def.rotina] || [])) {
    for (const d of destinosDoBloco(bloco, [])) {
      const m = new RegExp('^' + nome + '\\.([A-Za-z0-9_]+)').exec(d);
      if (m) escritos.add(m[1]);
    }
  }
  escritosPorAoi[nome] = def.parametros.map(p => escritos.has(p));
}
saida.aoiEscreve = escritosPorAoi;

function anotarUso(no) {
  if (!no || typeof no !== 'object') return;
  if (no.t === 'serie') return no.i.forEach(anotarUso);
  if (no.t === 'par') return no.r.forEach(anotarUso);
  if (no.t !== 'i') return;
  const args = (no.a || []).filter(a => typeof a === 'string' && /^[A-Za-z_&]/.test(a));
  const destinos = destinosDoBloco(no, []);
  if (aoi[no.n]) {
    const marcas = escritosPorAoi[no.n] || [];
    const todos = no.a || [];
    // posicao 0 e a instancia; dai em diante sao os parametros, na ordem
    if (typeof todos[0] === 'string') destinos.push(todos[0]);
    for (let k = 0; k < marcas.length; k++) {
      if (marcas[k] && typeof todos[k + 1] === 'string' && /^[A-Za-z_&]/.test(todos[k + 1])) {
        destinos.push(todos[k + 1]);
      }
    }
  }
  destinos.forEach(t => gravadas.add(semIndice(t)));
  args.forEach(t => { if (destinos.indexOf(t) < 0) lidas.add(semIndice(t)); });
}
for (const lista of Object.values(saida.rotinas)) lista.forEach(anotarUso);

saida.entradasDeCampo = [...lidas].filter(t => !gravadas.has(t)).sort();

fs.mkdirSync(destino, { recursive: true });
fs.writeFileSync(path.join(destino, 'programa.json'), JSON.stringify(saida), 'utf8');

fs.writeFileSync(path.join(destino, '_clp.json'), JSON.stringify({
  arquivo: path.basename(arquivo),
  extraidoEm: new Date().toISOString().slice(0, 10),
  como: 'ferramentas/rockwell/acd.js - tabela de regioes no fim do arquivo, cada regiao em gzip; ordem de varredura pela lista ligada de RegnLink.Idx',
  rotinas: Object.keys(rotinas).length,
  blocosDeCodigo: comCodigo,
  blocosVazios: vazios,
  tags: projeto.tags.length,
  aoi: Object.fromEntries(Object.entries(aoi).map(([k, v]) => [k, v.parametros])),
  pontosDeEntrada: entradas,
  rotinasNuncaChamadas: mortas,
  avisos: problemas
}, null, 1), 'utf8');

console.log('programa do CLP extraido para maquinas/' + id + '/');
console.log('  rotinas            : ' + Object.keys(rotinas).length);
console.log('  blocos com codigo  : ' + comCodigo + (vazios ? '  (' + vazios + ' vazios)' : ''));
console.log('  AOIs com parametros: ' + Object.keys(aoi).length);
console.log('  pontos de entrada  : ' + entradas.join(', '));
if (mortas.length) console.log('  nunca chamadas     : ' + mortas.join(', '));
if (problemas.length) {
  console.log('  AVISOS:');
  problemas.forEach(p => console.log('    - ' + p));
}
