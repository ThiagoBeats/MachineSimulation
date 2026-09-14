// ---------------------------------------------------------------------------
// Descompactador dos arquivos do runtime FactoryTalk View ME (.mer)
// ---------------------------------------------------------------------------
// A Rockwell nao documenta esse formato. Ele foi deduzido comparando dois
// arquivos que, por sorte, existem nas duas formas dentro do proprio .mer:
// "Datos Lote.strn" aparece comprimido em Raml/ e cru dentro de
// "Datos Lote.ramlz". Com o par em maos o formato saiu inteiro, e a
// decodificacao reproduz o original BYTE A BYTE - nao e aproximacao.
//
// Um arquivo e uma sequencia de blocos. Cada bloco:
//
//   [4] tamanho do que vem depois deste campo (ja contando o carimbo)
//   [1] modo:  0 = comprimido       1 = guardado cru
//   [3] carimbo fixo  20 53 1f
//   [n] conteudo
//
// No modo comprimido o conteudo e um fluxo LZ77:
//   palavra de flags de 16 bits, bit menos significativo primeiro
//     bit = 0  ->  1 byte literal
//     bit = 1  ->  2 bytes de referencia:
//                    comprimento = (b0 & 0x0F) + 1        (1 a 16)
//                    distancia   = ((b0 >> 4) << 8) | b1  (1 a 4095)
//
// A janela continua valendo entre blocos: uma referencia no bloco 2 pode
// alcancar bytes produzidos no bloco 1.
//
// O modo cru e usado para o que ja vem comprimido de fabrica - os .ramlz (que
// sao zip), os PNG e os JPEG. Por isso nao ha heuristica aqui: o proprio
// arquivo diz qual e o caso.
// ---------------------------------------------------------------------------
'use strict';

const CRU = 1;

function descompactar(b) {
  const out = [];
  let bloco = 0;

  while (bloco + 8 <= b.length) {
    const tam = b.readUInt32LE(bloco);
    if (tam < 4 || bloco + 4 + tam > b.length) break;
    const fim = bloco + 4 + tam;
    let p = bloco + 8;

    if (b[bloco + 4] === CRU) {
      for (; p < fim; p++) out.push(b[p]);
      bloco = fim;
      continue;
    }

    while (p + 2 <= fim) {
      const flags = b.readUInt16LE(p); p += 2;
      for (let i = 0; i < 16 && p < fim; i++) {
        if (!(flags & (1 << i))) { out.push(b[p++]); continue; }
        if (p + 2 > fim) break;
        const comp = (b[p] & 0x0F) + 1;
        const dist = ((b[p] >> 4) << 8) | b[p + 1];
        p += 2;
        if (dist === 0 || dist > out.length) {
          throw new Error('distancia ' + dist + ' invalida na saida ' + out.length);
        }
        const base = out.length - dist;
        for (let k = 0; k < comp; k++) out.push(out[base + k]);
      }
    }
    bloco = fim;
  }
  return Buffer.from(out);
}

// Nem todo fluxo do .mer tem o cabecalho: alguns controles pequenos sao
// gravados direto. Reconhecemos o cabecalho pelo carimbo, e so.
function temCabecalho(b) {
  return b.length >= 12
    && b[5] === 0x20 && b[6] === 0x53 && b[7] === 0x1f
    && (b[4] === 0 || b[4] === CRU)
    && b.readUInt32LE(0) >= 4;
}

function abrir(b) {
  if (!temCabecalho(b)) return b;
  try {
    const r = descompactar(b);
    return r.length ? r : b;
  } catch (e) {
    return b;
  }
}

module.exports = { descompactar, abrir };
