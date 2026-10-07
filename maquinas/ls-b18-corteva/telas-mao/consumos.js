// ---------------------------------------------------------------------------
// TELA "TABELA DE LIQUIDOS" (Consumos) - desenhada, nao extraida
// ---------------------------------------------------------------------------
// Uma grade de 20 dosagens por 6 linhas, com o total aproximado embaixo. Do
// .gfx saem a posicao (colunas em x = 101, 201, 302, 402, 502 e 603; linhas de
// y = 131 a 531, passo 21) e as legendas.
//
// As tags sao os registros do AOI RegistrosConsumo, instanciado uma vez por
// linha: RegistroConsumos_L1 a L6. O CLP grava em
// RegistroConsumos_Lx.RegistrosConsumo.Consumo_NN - com o nivel do tipo -,
// enquanto as telas publicadas leem o caminho curto. Aqui tenta-se um e depois
// o outro.
//
// O total nao e tag: a legenda do projeto diz "Total aproximado" e a propria
// tela soma a coluna.
// ---------------------------------------------------------------------------

'use strict';

// A MESMA logo das telas extraidas, na mesma caixa. Antes estas telas usavam
// outro arquivo, em 96x56: ao navegar, o cabecalho mudava de tamanho e de
// desenho de uma tela para a outra.
const LOGO = 'Logo-LS-Brasil-RGB_ff000080_ffffffff_T.png';

const LARGURA = 800, ALTURA = 600;
const CREME = '#EFEFD5';
const DOSAGENS = 20;
const COLUNAS = [101, 201, 302, 402, 502, 603];
const LARG = 99, ALT = 21;
const Y0 = 131;

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 10, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: false,
    alinha: o.alinha || 'middleCenter', fundo: o.fundo || null,
  };
}

// o valor de um registro, tentando o caminho com o tipo e depois o curto
function consumo(linha, n) {
  const nn = (n < 10 ? '0' : '') + n;
  return '(v("RegistroConsumos_L' + linha + '.RegistrosConsumo.Consumo_' + nn + '")'
    + ' || v("RegistroConsumos_L' + linha + '.Consumo_' + nn + '") || 0)';
}

function somaDaColuna(linha) {
  const partes = [];
  for (let n = 1; n <= DOSAGENS; n++) partes.push(consumo(linha, n));
  return '(' + partes.join(' + ') + ')';
}

function montar() {
  const el = [];

  el.push({
    t: 'forma', id: 'ColunaEsquerda',
    d: 'M0 45H88V' + ALTURA + 'H0Z', preenche: CREME, traco: '#D8D8BE', espessura: 1,
  });

  el.push(texto('Text-titulo', 250, 10, 300, 30, 'TABELA DE LIQUIDOS', { fonte: 19 }));
  el.push({ t: 'imagem', id: 'Image7', x: 700, y: 0, w: 100, h: 60, arq: LOGO });

  // --- cabecalho: o numero da linha e o produto que esta nela ----------------
  COLUNAS.forEach(function (x, i) {
    const n = i + 1;
    el.push(texto('h-linha' + n, x, 88, LARG, 20, 'Linha ' + n, { fonte: 11 }));
    el.push({
      t: 'cadeia', id: 'StringDisplay' + n, x: x, y: 112, w: LARG, h: 22,
      texto: '', fonte: 9, cor: '#1A4FA0', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: null, borda: '#9A9A9A', bordaEsp: 1,
      valor: 'v("MainProgram.NombreLiquido' + n + '")',
    });
  });
  el.push(texto('h-produto', 2, 112, 96, 22, 'Produto', { fonte: 11, alinha: 'middleRight' }));

  // --- a grade ----------------------------------------------------------------
  for (let d = 0; d < DOSAGENS; d++) {
    const y = Y0 + d * ALT;
    el.push(texto('rot-d' + d, 2, y, 96, ALT, 'Dosagem ' + (d + 1), { fonte: 10, alinha: 'middleRight' }));
    COLUNAS.forEach(function (x, i) {
      el.push({
        t: 'numero', id: 'c' + (i + 1) + '_' + (d + 1), x: x, y: y, w: LARG, h: ALT,
        texto: '', fonte: 9, cor: '#1A4FA0', negrito: false, italico: false,
        alinha: 'middleCenter', fundo: null, borda: '#C8C8C8', bordaEsp: 1,
        casas: 1, digitos: 6, completa: 'none',
        valor: consumo(i + 1, d + 1),
      });
    });
  }

  // --- total aproximado -------------------------------------------------------
  el.push(texto('rot-total', 2, 560, 96, 40, 'Total\naproximado', { fonte: 10, alinha: 'middleRight' }));
  COLUNAS.forEach(function (x, i) {
    el.push({
      t: 'numero', id: 'total' + (i + 1), x: x, y: 567, w: LARG, h: 26,
      texto: '', fonte: 11, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: '#EAEAEA', borda: '#9A9A9A', bordaEsp: 1,
      casas: 0, digitos: 7, completa: 'none',
      valor: somaDaColuna(i + 1),
    });
  });

  el.push({
    t: 'botao', id: 'GotoDisplayButton6', modo: 'ir', x: 720, y: 550, w: 80, h: 46,
    forma: 'reto', esp: 2, destino: 'MAIN',
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#8FCEED', escuro: '#1E8FC5',
      legenda: { texto: 'VOLTAR', fonte: 14, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });

  return {
    nome: 'Consumos', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
