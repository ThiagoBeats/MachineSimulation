// ---------------------------------------------------------------------------
// TELA "LAVAGEM DAS LINHAS" - desenhada, nao extraida
// ---------------------------------------------------------------------------
// Esta tela so existe no binario .gfx. De la saem a posicao e o tamanho de
// cada controle (conferidos em 100%) e a lista exata de legendas:
//
//   "LAVAGEM DAS LINHAS", "Tempo de limpeza", "Iniciar", "Parar", "Status",
//   "LINHA 1".."LINHA 5", "AUTO", "MAN", "EMERGENCIA"
//
// O arranjo e regular - cinco linhas iguais em y = 211, 270, 329, 388 e 447 -,
// entao a tela sai de um laco em vez de um a um.
//
// As tags vem do AOI "Lavagem", que o CLP instancia cinco vezes (Lavagem_L1 a
// Lavagem_L5) e que o interpretador JA executa: encher, recircular pelo tempo
// pedido, esvaziar. Membro de AOI mora em <instancia>.<tipo>.<membro>.
// ---------------------------------------------------------------------------

'use strict';

const LARGURA = 800, ALTURA = 600;
const CREME = '#EFEFD5';

const LINHAS = [211, 270, 329, 388, 447];
const COL = { rotulo: 112, tempo: 194, iniciar: 358, parar: 444, status: 548 };
const ALT = 33;

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 11, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: false,
    alinha: o.alinha || 'middleCenter', fundo: o.fundo || null,
  };
}

function caixa(id, x, y, w, h, o) {
  o = o || {};
  return {
    t: 'forma', id: id,
    d: 'M' + x + ' ' + y + 'H' + (x + w) + 'V' + (y + h) + 'H' + x + 'Z',
    preenche: o.preenche || '#F0F0F0', traco: o.traco || '#9A9A9A', espessura: o.esp || 1,
  };
}

function navegar(id, x, y, w, h, rotulo, destino, o) {
  o = o || {};
  return {
    t: 'botao', id: id, modo: 'ir', x: x, y: y, w: w, h: h, forma: 'reto', esp: 3,
    destino: destino,
    estados: [{
      id: '0', valor: 0, fundo: o.fundo || '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: {
        texto: rotulo, fonte: o.fonte || 11, cor: 'black',
        negrito: false, italico: false, alinha: 'middleCenter',
      },
    }],
  };
}

// Botao que escreve numa tag enquanto esta apertado.
function comando(id, x, y, w, h, rotulo, tag, o) {
  o = o || {};
  return {
    t: 'botao', id: id, modo: 'momentaneo', x: x, y: y, w: w, h: h,
    forma: 'reto', esp: 2, escreve: tag,
    estados: [{
      id: '0', valor: 0, fundo: o.fundo || '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: {
        texto: rotulo, fonte: o.fonte || 11, cor: o.cor || 'black',
        negrito: false, italico: false, alinha: 'middleCenter',
      },
    }],
  };
}

function montar() {
  const el = [];

  el.push({
    t: 'forma', id: 'ColunaEsquerda',
    d: 'M0 45H88V' + ALTURA + 'H0Z', preenche: CREME, traco: '#D8D8BE', espessura: 1,
  });

  // --- titulo -----------------------------------------------------------------
  el.push(texto('Text9', 267, 14, 266, 31, 'LAVAGEM DAS LINHAS', { fonte: 20 }));
  el.push({ t: 'imagem', id: 'Image7', x: 700, y: 2, w: 96, h: 56, arq: 'ls - 753 x 294 px.jpg' });

  // --- o quadro que agrupa as cinco linhas ------------------------------------
  el.push(caixa('quadro', 98, 162, 604, 330, { preenche: '#D9D9D9', traco: '#A8A8A8' }));
  el.push(texto('Text4', 194, 175, 149, 25, 'Tempo de limpeza', { fonte: 12 }));
  el.push(texto('Text3', 548, 175, 142, 25, 'Status', { fonte: 12 }));

  // --- as cinco linhas --------------------------------------------------------
  LINHAS.forEach(function (y, i) {
    const n = i + 1;
    const inst = 'Lavagem_L' + n + '.Lavagem.';

    el.push(texto('Text-linha' + n, COL.rotulo, y, 69, ALT, 'LINHA ' + n, { fonte: 12, negrito: true }));

    // Tempo de limpeza, em minutos: o CLP multiplica por 60000 para virar o
    // preset do temporizador de recirculacao. E campo de ENTRADA - tocar nele
    // abre o teclado, como no terminal. O CLP so aceita acima de 1 minuto.
    el.push({
      t: 'numero', id: 'NumericInput' + n, x: COL.tempo, y: y, w: 148, h: ALT,
      texto: '', fonte: 13, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: '#FFFFFF', borda: '#707070', bordaEsp: 1,
      casas: 0, digitos: 4, completa: 'none',
      valor: 'v("' + inst + 'Minutos")',
      escreve: inst + 'Minutos',
      rotulo: 'Tempo de limpeza da linha ' + n + ' (min)',
    });

    el.push(comando('Iniciar' + n, COL.iniciar, y, 87, ALT, 'Iniciar', inst + 'Iniciar'));
    el.push(comando('Parar' + n, COL.parar, y, 87, ALT, 'Parar', inst + 'Parar', { fundo: '#8C8C8C' }));

    // O CLP escreve a frase do estado direto nesta tag ("Pronto para iniciar",
    // "Lavagem em processo", "Esvaziar tanque antes de iniciar"). Enquanto
    // ninguem escreveu nada ela vale zero, e um "0" na coluna de status so
    // confunde - entao mostra-se vazio.
    el.push({
      t: 'cadeia', id: 'StringDisplay' + n, x: COL.status, y: y, w: 142, h: ALT,
      texto: '', fonte: 11, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: '#FFFFFF', borda: '#707070', bordaEsp: 1,
      valor: '(function(x){return typeof x === "string" ? x : "";})(v("' + inst + 'Status"))',
    });
  });

  // --- seletor AUTO/MAN e emergencia ------------------------------------------
  el.push(texto('Text2', 4, 50, 80, 16, 'EMERGENCIA', {
    fonte: 9, cor: 'white', fundo: '#E02020', negrito: true,
  }));
  el.push(texto('Text27', 8, 198, 70, 13, 'AUTO', { fonte: 8, negrito: true }));
  el.push({ t: 'imagem', id: 'Image16', x: 30, y: 213, w: 43, h: 51, arq: 'Selector switch 2 (up).png' });
  el.push({
    t: 'imagem', id: 'Image13', x: 30, y: 213, w: 43, h: 51,
    arq: 'Selector switch 2 (left).png',
    visivel: { expr: 'v("MainProgram.aManual")', quando: 'visible' },
  });
  el.push(texto('Text28', 8, 266, 70, 13, 'MAN', { fonte: 8, negrito: true }));

  // --- trilho da direita ------------------------------------------------------
  const trilho = [
    ['GotoDisplayButton12', 70, 'LIQUIDO 1', 'Liquido L1'],
    ['GotoDisplayButton8', 120, 'LIQUIDO 2', 'Liquido L2'],
    ['GotoDisplayButton11', 170, 'LIQUIDO 3', 'Liquido L3'],
    ['GotoDisplayButton10', 220, 'LIQUIDO 4', 'Liquido L4'],
    ['GotoDisplayButton9', 270, 'LIQUIDO 5', 'Liquido L5'],
    ['GotoDisplayButton7', 320, 'PRÉ\nMISTURA', 'Liquido L6'],
    ['GotoDisplayButton6', 450, 'LISTA', 'Lista Liquidos'],
    ['GotoDisplayButton4', 500, 'BALANÇA', 'Balanza'],
  ];
  trilho.forEach(function (b) {
    el.push(navegar(b[0], 720, b[1], 80, 46, b[2], b[3]));
  });
  el.push(navegar('GotoDisplayButton1', 720, 550, 80, 46, '', 'MAIN'));
  el.push({ t: 'imagem', id: 'icone-home', x: 742, y: 558, w: 36, h: 30, arq: 'Home01.png' });

  return {
    nome: 'Lavagem', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
