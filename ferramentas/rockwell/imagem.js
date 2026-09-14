// ---------------------------------------------------------------------------
// Converte as imagens do projeto FactoryTalk para PNG
// ---------------------------------------------------------------------------
// As imagens ficam na pasta Images/ do .mer. A extensao nao quer dizer nada:
// ha JPEG e PNG guardados com nome .bmp. O que vale e a assinatura.
//
// O XAML referencia uma imagem por um nome composto:
//     Source="Tratadora LS-B18_ff000080_ffffffff_T"
//              \_____ nome ____/ \_fundo_/ \frente_/ \_ transparente
// O sufixo diz como a imagem deve ser pintada. Para as imagens coloridas o que
// importa e so o "_T": a cor de fundo declarada vira transparente.
// ---------------------------------------------------------------------------
'use strict';

const zlib = require('zlib');

// --- PNG ----------------------------------------------------------------------
const TABELA_CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = TABELA_CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pedaco(tipo, dados) {
  const corpo = Buffer.concat([Buffer.from(tipo, 'latin1'), dados]);
  const tam = Buffer.alloc(4); tam.writeUInt32BE(dados.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(corpo));
  return Buffer.concat([tam, corpo, crc]);
}

// rgba: Buffer com largura*altura*4 bytes
function gravarPng(largura, altura, rgba) {
  const linhas = Buffer.alloc((largura * 4 + 1) * altura);
  for (let y = 0; y < altura; y++) {
    linhas[y * (largura * 4 + 1)] = 0;                       // filtro "nenhum"
    rgba.copy(linhas, y * (largura * 4 + 1) + 1, y * largura * 4, (y + 1) * largura * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(largura, 0);
  ihdr.writeUInt32BE(altura, 4);
  ihdr[8] = 8;        // bits por canal
  ihdr[9] = 6;        // cor verdadeira com alfa
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    pedaco('IHDR', ihdr),
    pedaco('IDAT', zlib.deflateSync(linhas, { level: 9 })),
    pedaco('IEND', Buffer.alloc(0))
  ]);
}

// --- BMP ------------------------------------------------------------------------
function lerBmp(b) {
  if (b.slice(0, 2).toString('latin1') !== 'BM') return null;
  const inicioDados = b.readUInt32LE(10);
  const tamCab = b.readUInt32LE(14);
  if (tamCab < 40) return null;                              // BITMAPCOREHEADER, raro
  const largura = b.readInt32LE(18);
  const alturaBruta = b.readInt32LE(22);
  const bits = b.readUInt16LE(28);
  const compressao = b.readUInt32LE(30);
  if (compressao !== 0) return null;                         // RLE, nao usado aqui
  const deBaixoParaCima = alturaBruta > 0;
  const altura = Math.abs(alturaBruta);

  let paleta = null;
  if (bits <= 8) {
    let nCores = b.readUInt32LE(46) || (1 << bits);
    paleta = [];
    for (let i = 0; i < nCores; i++) {
      const p = 14 + tamCab + i * 4;
      paleta.push([b[p + 2], b[p + 1], b[p]]);
    }
  }

  const bytesLinha = Math.floor((bits * largura + 31) / 32) * 4;
  const rgba = Buffer.alloc(largura * altura * 4);

  for (let y = 0; y < altura; y++) {
    const linha = inicioDados + (deBaixoParaCima ? (altura - 1 - y) : y) * bytesLinha;
    for (let x = 0; x < largura; x++) {
      let r, g, a;
      if (bits === 24 || bits === 32) {
        const p = linha + x * (bits / 8);
        r = b[p + 2]; g = b[p + 1]; a = b[p];
      } else if (bits === 8) {
        const c = paleta[b[linha + x]] || [0, 0, 0];
        r = c[0]; g = c[1]; a = c[2];
      } else if (bits === 4) {
        const v = b[linha + (x >> 1)];
        const c = paleta[(x & 1) ? (v & 0x0F) : (v >> 4)] || [0, 0, 0];
        r = c[0]; g = c[1]; a = c[2];
      } else if (bits === 1) {
        const v = b[linha + (x >> 3)];
        const c = paleta[(v >> (7 - (x & 7))) & 1] || [0, 0, 0];
        r = c[0]; g = c[1]; a = c[2];
      } else {
        return null;
      }
      const d = (y * largura + x) * 4;
      rgba[d] = r; rgba[d + 1] = g; rgba[d + 2] = a; rgba[d + 3] = 255;
    }
  }
  return { largura, altura, rgba };
}

// --- separa o nome composto do XAML ---------------------------------------------
// "Tank 1_ff000080_ffffffff_T"  ->  { base:'Tank 1', fundo:'#000080', transparente:true }
function separarNome(fonte) {
  const m = /^(.*?)_([0-9a-fA-F]{8})_([0-9a-fA-F]{8})(_T)?$/.exec(String(fonte || ''));
  if (!m) return { base: String(fonte || ''), fundo: null, frente: null, transparente: false };
  const cor = h => '#' + h.slice(2).toUpperCase();          // os 2 primeiros sao o alfa
  return { base: m[1], fundo: cor(m[2]), frente: cor(m[3]), transparente: !!m[4] };
}

// --- conversao ---------------------------------------------------------------------
// Devolve { dados, extensao } ou null se nao souber converter.
function converter(bruto, info) {
  if (!bruto || bruto.length < 8) return null;

  if (bruto.slice(0, 4).toString('latin1') === '\x89PNG') {
    return { dados: bruto, extensao: 'png' };               // ja serve
  }
  if (bruto[0] === 0xFF && bruto[1] === 0xD8) {
    // JPEG nao tem canal alfa e a compressao com perda estraga a cor exata do
    // fundo, entao a transparencia declarada nao da para aplicar sem sujeira.
    return { dados: bruto, extensao: 'jpg', semTransparencia: info.transparente };
  }

  const bmp = lerBmp(bruto);
  if (!bmp) return null;

  if (info.transparente && info.fundo) {
    const r = parseInt(info.fundo.slice(1, 3), 16);
    const g = parseInt(info.fundo.slice(3, 5), 16);
    const a = parseInt(info.fundo.slice(5, 7), 16);
    for (let i = 0; i < bmp.rgba.length; i += 4) {
      if (bmp.rgba[i] === r && bmp.rgba[i + 1] === g && bmp.rgba[i + 2] === a) bmp.rgba[i + 3] = 0;
    }
  }
  return { dados: gravarPng(bmp.largura, bmp.altura, bmp.rgba), extensao: 'png' };
}

module.exports = { converter, separarNome, gravarPng };
