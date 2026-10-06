// ---------------------------------------------------------------------------
// TELA "TRIPLICE LAVAGEM" - desenhada, nao extraida
// ---------------------------------------------------------------------------
// O circuito de lavagem triplice: o tanque de lavagem, o de descarte, quatro
// valvulas e a bomba. Do .gfx saem a posicao de cada controle - as quatro
// estacoes de valvula em (357,148), (357,287), (357,429) e (272,467), e o
// painel da bomba em (574,433) - e as legendas, que trazem ate a tag de cada
// valvula no desenho: XV-515, XV-520, XV-540 e XV-545.
//
// No CLP elas sao XV_515, XV_520, XV_540 e XV_545, cada uma com _Controle (os
// comandos) e _Status (a posicao).
//
// Como nas outras telas de processo, o tracado da tubulacao foi feito do print:
// o .gfx entrega so a caixa das formas.
// ---------------------------------------------------------------------------

'use strict';

const LARGURA = 800, ALTURA = 600;
const CREME = '#EFEFD5';
const CANO = '#9A9A9A';
const AZUL = '#6B8FD4';

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 10, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: false,
    alinha: o.alinha || 'middleCenter', fundo: o.fundo || null,
  };
}

function cano(id, d, o) {
  o = o || {};
  const e = {
    t: 'forma', id: id, d: d, preenche: 'none',
    traco: o.cor || CANO, espessura: o.esp || 4,
  };
  if (o.visivel) e.visivel = { expr: o.visivel, quando: 'visible' };
  return e;
}

function caixa(id, x, y, w, h, o) {
  o = o || {};
  return {
    t: 'forma', id: id,
    d: 'M' + x + ' ' + y + 'H' + (x + w) + 'V' + (y + h) + 'H' + x + 'Z',
    preenche: o.preenche || '#F0F0F0', traco: o.traco || '#5A5A5A', espessura: o.esp || 1,
  };
}

function navegar(id, x, y, w, h, rotulo, destino) {
  return {
    t: 'botao', id: id, modo: 'ir', x: x, y: y, w: w, h: h, forma: 'reto', esp: 3,
    destino: destino,
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: { texto: rotulo, fonte: 11, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  };
}

// Uma estacao de valvula: o simbolo, o rotulo e os dois comandos.
function valvula(el, nome, x, y, rotuloX, rotuloY) {
  const base = 'MainProgram.XV_' + nome;
  el.push({ t: 'imagem', id: 'v' + nome + '-f', x: x, y: y, w: 33, h: 37, arq: 'Gate valve (gris).png' });
  el.push({
    t: 'imagem', id: 'v' + nome + '-a', x: x, y: y, w: 33, h: 37, arq: 'Gate valve (verde).png',
    visivel: { expr: 'v("' + base + '_Status")', quando: 'visible' },
  });
  el.push(texto('rot-' + nome, rotuloX, rotuloY, 54, 16, 'XV-' + nome, { fonte: 9 }));
  // abrir e fechar, nos dois quadradinhos ao lado
  el.push({
    t: 'botao', id: 'b' + nome + '-abre', modo: 'momentaneo', x: x - 34, y: y - 4, w: 25, h: 25,
    forma: 'reto', esp: 2, escreve: base + '_Controle.0',
    estados: [{
      id: '0', valor: 0, fundo: '#C8E6C9', claro: '#FFFFFF', escuro: '#808080',
      legenda: { texto: '▲', fonte: 10, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
  el.push({
    t: 'botao', id: 'b' + nome + '-fecha', modo: 'momentaneo', x: x - 34, y: y + 16, w: 25, h: 25,
    forma: 'reto', esp: 2, escreve: base + '_Controle.3',
    estados: [{
      id: '0', valor: 0, fundo: '#F4C7C3', claro: '#FFFFFF', escuro: '#808080',
      legenda: { texto: '▼', fonte: 10, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
}

function montar() {
  const el = [];

  el.push({
    t: 'forma', id: 'ColunaEsquerda',
    d: 'M0 45H88V' + ALTURA + 'H0Z', preenche: CREME, traco: '#D8D8BE', espessura: 1,
  });

  el.push(texto('Text-titulo', 250, 10, 300, 30, 'TRIPLICE LAVAGEM', { fonte: 19 }));
  el.push({ t: 'imagem', id: 'Image3', x: 700, y: 2, w: 96, h: 56, arq: 'ls - 753 x 294 px.jpg' });

  // --- tubulacao, tracada do print -------------------------------------------
  el.push(cano('c-tanque-cima', 'M218 265V166H340'));            // tanque sobe ate a XV-515
  el.push(cano('c-515-retorno', 'M390 166H560'));                // XV-515 ao retorno dos tanques
  el.push(cano('c-coluna', 'M373 190V287'));                     // coluna entre 515 e 545
  el.push(cano('c-545-descarte', 'M390 305H530'));               // XV-545 ao descarte
  el.push(cano('c-coluna2', 'M373 324V429'));                    // coluna entre 545 e 540
  el.push(cano('c-540-bomba', 'M390 447H470'));                  // XV-540 a bomba
  el.push(cano('c-agua-520', 'M150 485H272'));                   // agua potavel ate a XV-520
  el.push(cano('c-520-linha', 'M305 485H470'));                  // XV-520 a linha da bomba
  el.push(cano('c-tanque-baixo', 'M218 340V485'));               // tanque desce ate a linha
  el.push(cano('c-premistura', 'M470 485V530H560'));             // saida para a pre mistura

  // --- os dois tanques --------------------------------------------------------
  el.push(caixa('tq-lavagem', 165, 265, 106, 75, { preenche: AZUL, traco: '#3D5C96' }));
  el.push(texto('rot-tq', 165, 285, 106, 36, 'TRIPLICE\nLAVAGEM', { fonte: 11, cor: 'white', negrito: true }));
  el.push(caixa('tq-descarte', 530, 265, 110, 75, { preenche: AZUL, traco: '#3D5C96' }));
  el.push(texto('rot-desc', 530, 292, 110, 20, 'DESCARTE', { fonte: 11, cor: 'white', negrito: true }));

  // --- as quatro valvulas -----------------------------------------------------
  valvula(el, '515', 357, 148, 396, 132);
  valvula(el, '545', 357, 287, 396, 271);
  valvula(el, '540', 357, 429, 396, 413);
  valvula(el, '520', 272, 467, 258, 508);

  // --- bomba ------------------------------------------------------------------
  el.push({ t: 'imagem', id: 'bomba', x: 440, y: 455, w: 64, h: 56, arq: 'Simple blower.png' });
  el.push(caixa('painel-bomba', 565, 420, 92, 110, { preenche: '#111111', traco: '#000000' }));
  el.push(texto('rot-bomba', 565, 422, 92, 14, 'BOMBA', { fonte: 9, cor: 'white' }));
  el.push({
    t: 'numero', id: 'NumericDisplay2', x: 574, y: 439, w: 46, h: 17,
    texto: '', fonte: 10, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: '#C8E6C9', borda: '#707070', bordaEsp: 1,
    casas: 0, digitos: 5, completa: 'none',
    valor: 'v("MainProgram.TL_RefFreq")',
  });
  el.push(texto('u-rpm', 622, 440, 30, 15, 'RPM', { fonte: 8, cor: 'white', alinha: 'middleLeft' }));
  el.push({
    t: 'numero', id: 'NumericInputCursorPoint2', x: 574, y: 463, w: 46, h: 26,
    texto: '', fonte: 11, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: '#FFFF80', borda: '#707070', bordaEsp: 1,
    casas: 0, digitos: 5, completa: 'none',
    valor: 'v("MainProgram.TL_RefFreq")', escreve: 'MainProgram.TL_RefFreq',
    rotulo: 'Referência da bomba (%)',
  });
  el.push(texto('u-pct', 622, 468, 22, 15, '%', { fonte: 8, cor: 'white', alinha: 'middleLeft' }));
  el.push({
    t: 'botao', id: 'MomentaryPushButton5', modo: 'momentaneo', x: 571, y: 497, w: 34, h: 28,
    forma: 'reto', esp: 2, escreve: 'MainProgram.TL_Control.0',
    estados: [{
      id: '0', valor: 0, fundo: '#10EB10', claro: '#8FEF8F', escuro: '#0A8F0A',
      legenda: { texto: '', fonte: 9, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
  el.push({
    t: 'botao', id: 'MomentaryPushButton1', modo: 'momentaneo', x: 612, y: 497, w: 34, h: 28,
    forma: 'reto', esp: 2, escreve: 'MainProgram.TL_Control.11',
    estados: [{
      id: '0', valor: 0, fundo: '#E02020', claro: '#F08080', escuro: '#8F0A0A',
      legenda: { texto: '', fonte: 9, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });

  // --- rotulos do desenho -----------------------------------------------------
  el.push(texto('rot-retorno', 562, 150, 110, 30, 'RETORNO DOS\nTANQUES', { fonte: 9, alinha: 'middleLeft' }));
  el.push(texto('rot-agua', 96, 468, 60, 30, 'ÁGUA\nPOTÁVEL', { fonte: 9 }));
  el.push(texto('rot-pm', 562, 522, 90, 16, 'Pré mistura', { fonte: 9, alinha: 'middleLeft' }));

  // --- seletor AUTO/MAN -------------------------------------------------------
  el.push(texto('rot-auto', 8, 198, 70, 13, 'AUTO', { fonte: 8, negrito: true }));
  el.push({ t: 'imagem', id: 'MultistatePushButton1', x: 25, y: 212, w: 50, h: 50, arq: 'Selector switch 2 (up).png' });
  el.push({
    t: 'imagem', id: 'MultistatePushButton2', x: 25, y: 212, w: 50, h: 50,
    arq: 'Selector switch 2 (left).png',
    visivel: { expr: 'v("MainProgram.aManual")', quando: 'visible' },
  });
  el.push(texto('rot-man', 8, 264, 70, 13, 'MAN', { fonte: 8, negrito: true }));

  el.push(texto('Text-emerg', 4, 50, 80, 16, 'EMERGENCIA', {
    fonte: 9, cor: 'white', fundo: '#E02020', negrito: true,
  }));

  // --- trilho -----------------------------------------------------------------
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
  trilho.forEach(function (b) { el.push(navegar(b[0], 720, b[1], 80, 46, b[2], b[3])); });
  el.push(navegar('GotoDisplayButton1', 720, 550, 80, 46, '', 'MAIN'));
  el.push({ t: 'imagem', id: 'icone-home', x: 742, y: 558, w: 36, h: 30, arq: 'Home01.png' });

  return {
    nome: 'TripliceLavagem', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
