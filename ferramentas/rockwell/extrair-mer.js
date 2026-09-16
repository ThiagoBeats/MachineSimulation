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
