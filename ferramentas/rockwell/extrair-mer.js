// ---------------------------------------------------------------------------
// EXTRAI AS TELAS DE UM RUNTIME FactoryTalk View ME (.mer)
// ---------------------------------------------------------------------------
//   node ferramentas/rockwell/extrair-mer.js <arquivo.mer> <id-da-maquina>
//
// Gera, em maquinas/<id>/:
//   telas/<nome>.json   uma tela: os elementos desenhaveis e as ligacoes
//   imagens/<nome>.png  as imagens que as telas usam
//   alarmes.json        a tabela de alarmes, com texto e tag de disparo
//   _origem.json        o que foi lido, o que foi ignorado e por que
//
// O .mer traz as telas em DUAS formas:
//   - Raml/<tela>.ramlz  -> XAML vetorial, completo e legivel (11 telas)
//   - Gfx/<tela>.gfx     -> binario nativo da Rockwell (as 49 telas)
// Este extrator le a primeira. As telas que so existem em .gfx ficam de fora e
// sao listadas em _origem.json, para ninguem achar que estao faltando por erro.
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
const arqMer = process.argv[2];
const id = process.argv[3];

if (!arqMer || !id) {
  console.error('uso: node ferramentas/rockwell/extrair-mer.js <arquivo.mer> <id-da-maquina>');
  process.exit(1);
}

const destino = path.join(RAIZ, 'maquinas', id);

// --- 1. abre o .mer -----------------------------------------------------------
const fluxos = ole2.extrair(fs.readFileSync(arqMer));
const aberto = {};
for (const [nome, dados] of Object.entries(fluxos)) aberto[nome] = lz.abrir(dados);

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

// --- 5. alarmes ---------------------------------------------------------------
// O .mal e binario, mas os textos e as tags estao em claro: os textos em
// UTF-16 e as tags em ASCII com um byte de tamanho antes.
function lerAlarmes(b) {
  if (!b) return [];
  const tags = [];
  const re = /\[B18_CORTEVA\]|\]Program:MainProgram\./g;
  const ascii = b.toString('latin1');
  const reTag = /::\[[A-Za-z0-9_]+\](Program:MainProgram\.)?([A-Za-z0-9_.]+)/g;
  let m;
  while ((m = reTag.exec(ascii))) tags.push(m[2]);
  const textos = (b.toString('utf16le').match(/[A-ZÀ-Ú][A-ZÀ-Ú0-9 ÇÃÕÁÉÍÓÚÂÊÔ\/]{6,}/g) || [])
    .map(t => t.trim()).filter(t => t.length > 6);
  return { tags: [...new Set(tags)], textos: [...new Set(textos)] };
}
const alarmes = lerAlarmes(aberto['M_Alarms/MachineAlarms.mal']);

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
fs.writeFileSync(path.join(destino, 'alarmes.json'), JSON.stringify(alarmes, null, 1), 'utf8');
fs.writeFileSync(path.join(destino, '_origem.json'), JSON.stringify({
  arquivo: path.basename(arqMer),
  extraidoEm: new Date().toISOString().slice(0, 10),
  como: 'OLE2 + LZ77 proprio da Rockwell (ferramentas/rockwell/lz.js), telas do XAML do cliente web embutido no .mer',
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
console.log('imagens         : ' + usadas + ' convertidas' + (semImagem.length ? ', ' + [...new Set(semImagem)].length + ' nao encontradas' : ''));
console.log('tags usadas     : ' + relatorio.tags.length);
console.log('alarmes         : ' + alarmes.textos.length + ' textos, ' + alarmes.tags.length + ' tags');
console.log('so no .gfx      : ' + relatorio.telasSoEmGfx.length + ' telas (ver _origem.json)');
const ign = Object.entries(relatorio.tiposIgnorados);
if (ign.length) {
  console.log('tipos ignorados : ' + ign.map(([k, v]) => k + ' x' + v).join(', '));
}
