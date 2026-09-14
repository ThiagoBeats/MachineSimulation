// ---------------------------------------------------------------------------
// Leitor de documento composto OLE2 (CFBF)
// ---------------------------------------------------------------------------
// O .mer e um "compound file" da Microsoft: um sistema de arquivos dentro de
// um arquivo, com FAT, mini-FAT e um diretorio em arvore vermelho-preta. Os
// .gfx de dentro dele tambem sao, entao o mesmo leitor serve para os dois.
//
// extrair(buffer) -> { "Raml/MAIN.conn": <Buffer>, ... }
// ---------------------------------------------------------------------------
'use strict';

const LIVRE = 0xFFFFFFFF;
const FIM = 0xFFFFFFFE;

function extrair(b) {
  if (b.length < 512 || b.readUInt32LE(0) !== 0xE011CFD0) {
    throw new Error('nao e um documento composto OLE2');
  }

  const TAM_SETOR = 1 << b.readUInt16LE(30);
  const TAM_MINI = 1 << b.readUInt16LE(32);
  const DIR_INI = b.readUInt32LE(48);
  const CORTE_MINI = b.readUInt32LE(56);
  const MINIFAT_INI = b.readUInt32LE(60);
  const DIFAT_INI = b.readUInt32LE(68);
  const N_DIFAT = b.readUInt32LE(72);

  const desloc = s => 512 + s * TAM_SETOR;

  // --- DIFAT: os 109 primeiros ficam no cabecalho, o resto numa cadeia ------
  const setoresFat = [];
  for (let i = 0; i < 109; i++) {
    const s = b.readUInt32LE(76 + i * 4);
    if (s === LIVRE) break;
    setoresFat.push(s);
  }
  let d = DIFAT_INI, guarda = 0;
  while (d !== FIM && d !== LIVRE && guarda++ < N_DIFAT + 10) {
    const off = desloc(d);
    const porSetor = TAM_SETOR / 4 - 1;
    for (let i = 0; i < porSetor; i++) {
      const s = b.readUInt32LE(off + i * 4);
      if (s !== LIVRE) setoresFat.push(s);
    }
    d = b.readUInt32LE(off + porSetor * 4);
  }

  // --- FAT -------------------------------------------------------------------
  const fat = new Uint32Array(setoresFat.length * (TAM_SETOR / 4));
  let k = 0;
  for (const s of setoresFat) {
    const off = desloc(s);
    for (let j = 0; j < TAM_SETOR; j += 4) fat[k++] = b.readUInt32LE(off + j);
  }

  function cadeia(inicio, tabela) {
    const out = [];
    let s = inicio, g = 0;
    while (s !== FIM && s !== LIVRE && s < tabela.length && g++ < 500000) {
      out.push(s);
      s = tabela[s];
    }
    return out;
  }

  function lerGrande(inicio, tam) {
    const partes = cadeia(inicio, fat).map(s => b.slice(desloc(s), desloc(s) + TAM_SETOR));
    return Buffer.concat(partes).slice(0, tam);
  }

  // --- diretorio --------------------------------------------------------------
  const entradas = [];
  for (const s of cadeia(DIR_INI, fat)) {
    const off = desloc(s);
    for (let e = 0; e + 128 <= TAM_SETOR; e += 128) {
      const p = off + e;
      const nBytes = b.readUInt16LE(p + 64);
      const tipo = b[p + 66];
      if (tipo === 0) { entradas.push(null); continue; }
      entradas.push({
        nome: nBytes >= 2 ? b.toString('utf16le', p, p + nBytes - 2) : '',
        tipo,                                  // 1 = pasta, 2 = fluxo, 5 = raiz
        filhoEsq: b.readUInt32LE(p + 68),
        filhoDir: b.readUInt32LE(p + 72),
        raizFilho: b.readUInt32LE(p + 76),
        inicio: b.readUInt32LE(p + 116),
        tam: b.readUInt32LE(p + 120)
      });
    }
  }

  // --- mini-FAT (para os fluxos pequenos) --------------------------------------
  const setoresMini = cadeia(MINIFAT_INI, fat);
  const miniFat = new Uint32Array(setoresMini.length * (TAM_SETOR / 4));
  let m = 0;
  for (const s of setoresMini) {
    const off = desloc(s);
    for (let j = 0; j < TAM_SETOR; j += 4) miniFat[m++] = b.readUInt32LE(off + j);
  }
  const raiz = entradas[0];
  const miniFluxo = raiz ? lerGrande(raiz.inicio, raiz.tam) : Buffer.alloc(0);

  function lerFluxo(en) {
    if (en.tam >= CORTE_MINI) return lerGrande(en.inicio, en.tam);
    const partes = cadeia(en.inicio, miniFat)
      .map(s => miniFluxo.slice(s * TAM_MINI, s * TAM_MINI + TAM_MINI));
    return Buffer.concat(partes).slice(0, en.tam);
  }

  // --- percorre a arvore de cada pasta -----------------------------------------
  const saida = {};
  function visitar(idx, prefixo) {
    if (idx === LIVRE || idx >= entradas.length) return;
    const en = entradas[idx];
    if (!en) return;
    visitar(en.filhoEsq, prefixo);
    if (en.tipo === 1) visitar(en.raizFilho, prefixo + en.nome + '/');
    else if (en.tipo === 2) saida[prefixo + en.nome] = lerFluxo(en);
    visitar(en.filhoDir, prefixo);
  }
  visitar(raiz.raizFilho, '');
  return saida;
}

module.exports = { extrair };
