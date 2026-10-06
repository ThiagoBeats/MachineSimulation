// ---------------------------------------------------------------------------
// TELA "LIQUIDO Lx" - desenhada, nao extraida
// ---------------------------------------------------------------------------
// Esta tela so existe no binario .gfx, e dele sai quase tudo: a posicao e o
// tamanho de cada controle (conferidos em 100% contra as telas que existem nos
// dois formatos), a lista exata de legendas e a lista exata de tags.
//
// O QUE NAO SAI, e por isso esta desenhado aqui: o tracado da tubulacao. As
// formas do .gfx entregam so a caixa delimitadora, e os vertices nao estao em
// nenhuma codificacao que eu tenha reconhecido - testei inteiro, inteiro
// escalado, float e double. Entao os canos foram tracados do print da maquina,
// encaixando nos pontos que os controles extraidos fixam.
//
// Como L1 a L6 sao o mesmo desenho, ha uma definicao so: o numero da linha
// entra nas tags e nos rotulos.
// ---------------------------------------------------------------------------

'use strict';

const LARGURA = 800, ALTURA = 600;
const CREME = '#EFEFD5';
const CANO = '#9A9A9A';
const CANO_GROSSO = 4;

// --- pecas de montagem --------------------------------------------------------

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 11, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: false,
    alinha: o.alinha || 'middleCenter', fundo: o.fundo || null,
  };
}

function numero(id, x, y, w, h, tag, o) {
  o = o || {};
  return {
    t: 'numero', id: id, x: x, y: y, w: w, h: h, texto: '',
    fonte: o.fonte || 11, cor: o.cor || 'black', negrito: !!o.negrito, italico: false,
    alinha: 'middleCenter', fundo: o.fundo || '#FFFFFF',
    borda: o.borda || '#707070', bordaEsp: 1,
    casas: o.casas === undefined ? 1 : o.casas, digitos: 6, completa: 'none',
    valor: 'v("' + tag + '")' + (o.escala ? '/' + o.escala : ''),
  };
}

function cadeia(id, x, y, w, h, tag, o) {
  o = o || {};
  return {
    t: 'cadeia', id: id, x: x, y: y, w: w, h: h, texto: '',
    fonte: o.fonte || 14, cor: o.cor || 'black', negrito: !!o.negrito, italico: false,
    alinha: 'middleCenter', fundo: o.fundo || null, borda: 'none', bordaEsp: 0,
    valor: 'v("' + tag + '")',
  };
}

function imagem(id, x, y, w, h, arq, visivel) {
  const e = { t: 'imagem', id: id, x: x, y: y, w: w, h: h, arq: arq };
  if (visivel) e.visivel = { expr: visivel, quando: 'visible' };
  return e;
}

function cano(id, d, o) {
  o = o || {};
  const e = {
    t: 'forma', id: id, d: d, preenche: 'none',
    traco: o.cor || CANO, espessura: o.esp || CANO_GROSSO,
  };
  if (o.visivel) e.visivel = { expr: o.visivel, quando: 'visible' };
  return e;
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
      id: '0', valor: 0,
      fundo: o.fundo || '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: {
        texto: rotulo, fonte: o.fonte || 11, cor: o.cor || 'black',
        negrito: false, italico: false, alinha: 'middleCenter',
      },
    }],
  };
}

// --- a tela -------------------------------------------------------------------

function montar(n) {
  const L = String(n);
  const el = [];

  // a faixa de cabecalho quem desenha e o renderizador; aqui comeca abaixo dela
  el.push({
    t: 'forma', id: 'ColunaEsquerda',
    d: 'M0 45H88V' + ALTURA + 'H0Z', preenche: CREME, traco: '#D8D8BE', espessura: 1,
  });

  // --- titulo e produto -------------------------------------------------------
  el.push(texto('Text9', 330, 14, 139, 31, 'LIQUIDO L' + L, { fonte: 20 }));
  el.push(imagem('Image3', 700, 2, 96, 56, 'ls - 753 x 294 px.jpg'));
  el.push(cadeia('StringDisplay1', 264, 65, 273, 30, 'MainProgram.RecetaEnProceso.Nombre_L' + L,
    { fonte: 16, negrito: true }));

  // --- leituras do alto da esquerda -------------------------------------------
  el.push(numero('NumericDisplay6', 96, 68, 31, 17, 'MainProgram.MedicionCaudalL' + L, { casas: 1, fonte: 10 }));
  el.push(texto('Text8', 130, 69, 30, 15, 'ml/s', { fonte: 9, alinha: 'middleLeft' }));
  el.push(numero('NumericDisplay1', 96, 91, 31, 17, 'MainProgram.Temperatura_L' + L, { casas: 1, fonte: 10 }));
  el.push(texto('Text14', 130, 92, 20, 15, '°C', { fonte: 9, alinha: 'middleLeft' }));

  // --- a tubulacao ------------------------------------------------------------
  // Tracada do print. Os encaixes sao os controles extraidos: as valvulas em
  // 612,400 / 191,358 / 253,431, o tanque em 384,279, a bomba abaixo dele, a
  // proveta em 130,477 e o IBC em 596,500.
  el.push(cano('cano-topo', 'M172 118H690'));
  el.push(cano('cano-esq-desce', 'M172 118V330'));
  el.push(cano('cano-v05-sobe', 'M307 196V118'));
  el.push(cano('cano-v05-tanque', 'M307 196V262H421V279'));
  el.push(cano('cano-tanque-bomba', 'M421 369V450'));
  el.push(cano('cano-bomba-esq', 'M421 450H290'));
  el.push(cano('cano-v03-proveta', 'M253 449H137V477'));
  el.push(cano('cano-v02-triplice', 'M209 376V330H172'));
  el.push(cano('cano-ibc-sobe', 'M644 500V418'));
  el.push(cano('cano-v01-tanque', 'M612 418H500V300H459'));
  el.push(cano('cano-bomba-dir', 'M459 450H690V118'));

  // o caminho da injecao acende quando a linha esta dosando
  el.push(cano('cano-injecao', 'M459 450H690V118', {
    cor: '#F99746', esp: 5, visivel: 'v("MainProgram.Ini_Iny_L' + L + '")',
  }));

  // --- equipamentos -----------------------------------------------------------
  el.push(imagem('Image5', 384, 279, 75, 90, 'Tank 1.png'));
  el.push(imagem('Image2', 596, 500, 97, 84, 'Tank 1.png'));
  el.push(imagem('Image1', 560, 170, 120, 84, 'Simple blower.png'));
  el.push(imagem('ImageBomba', 390, 452, 64, 52, 'Simple blower.png'));

  // Agitadores: ficam junto ao tanque, nao na coluna da esquerda - a caixa
  // "AGITADORES" do print esta em 288,176, que e onde o .gfx poe os dois botoes
  // de comando. O que fica na coluna esquerda e o seletor AUTO/MAN.
  el.push(caixa('painel-agit', 286, 172, 96, 52, { preenche: '#111111', traco: '#000000' }));
  el.push(texto('rot-agit', 286, 174, 96, 14, 'AGITADORES', { fonte: 8, cor: 'white' }));
  el.push(imagem('Image18', 296, 190, 28, 28, 'Turbine agitator 3.png'));
  el.push(imagem('Image17', 296, 190, 28, 28, 'Turbine agitator 3 (verde).png',
    'v("MainProgram.STT_A_TP1.1")'));
  el.push(imagem('Image18b', 340, 190, 28, 28, 'Turbine agitator 3.png'));
  el.push(imagem('Image17b', 340, 190, 28, 28, 'Turbine agitator 3 (verde).png',
    'v("MainProgram.STT_A_TP2_L' + L + '.1")'));

  // valvulas: cinza fechada, verde aberta
  const valvulas = [
    { id: 1, x: 612, y: 400, tag: 'Valvula1_L' + L },
    { id: 2, x: 191, y: 358, tag: 'Valvula2_L' + L },
    { id: 3, x: 253, y: 431, tag: 'Valvula3_L' + L },
  ];
  valvulas.forEach(function (v) {
    el.push(imagem('valv' + v.id + '-fechada', v.x, v.y, 36, 36, 'Gate valve (gris).png'));
    el.push(imagem('valv' + v.id + '-aberta', v.x, v.y, 36, 36, 'Gate valve (verde).png',
      'v("MainProgram.' + v.tag + '.PosAbierta")'));
    el.push(texto('rotulo-valv' + v.id, v.x - 8, v.y - 28, 52, 26, 'Valv\n0' + v.id, { fonte: 9 }));
  });

  // --- painel da bomba --------------------------------------------------------
  el.push(caixa('painel-bomba', 410, 418, 92, 80, { preenche: '#111111', traco: '#000000' }));
  el.push(texto('Text-bomba', 410, 420, 92, 14, 'BOMBA', { fonte: 9, cor: 'white' }));
  el.push(numero('NumericDisplay2', 418, 438, 46, 17, 'MainProgram.InputBDL' + L + '.OutputFreq',
    { casas: 0, fundo: '#C8E6C9', fonte: 10 }));
  el.push(texto('Text-rpm', 466, 439, 30, 15, 'RPM', { fonte: 8, cor: 'white', alinha: 'middleLeft' }));
  el.push(numero('NumericInputCursorPoint2', 418, 464, 46, 26, 'MainProgram.RefFrecBDL' + L,
    { casas: 0, fundo: '#FFFF80', fonte: 11 }));
  el.push(texto('Text-pct', 466, 470, 22, 15, '%', { fonte: 8, cor: 'white', alinha: 'middleLeft' }));

  // --- peso do tanque e proveta ----------------------------------------------
  el.push(numero('NumericDisplay5', 395, 371, 45, 17, 'MainProgram.Peso_Tk_L' + L, { casas: 1, fonte: 10 }));
  el.push(texto('Text-kg', 443, 372, 20, 15, 'Kg', { fonte: 9, alinha: 'middleLeft' }));
  el.push(imagem('Scale3', 128, 477, 18, 60, 'weight.png'));
  el.push(numero('NumericDisplay7', 113, 545, 45, 17, 'MainProgram.Vol_de_Probeta', { casas: 1, fonte: 10 }));

  // --- rotulos do desenho -----------------------------------------------------
  el.push(texto('rot-ibc', 596, 474, 97, 20, 'IBC', { fonte: 11 }));
  el.push(texto('rot-diafr', 556, 140, 128, 26, 'Bomba\nDiafragma', { fonte: 9 }));
  el.push(texto('rot-agua', 694, 330, 70, 26, 'Água\nLimpa', { fonte: 9, alinha: 'middleLeft' }));
  el.push(texto('rot-triplice', 100, 300, 76, 26, 'Triplice\nLavagem', { fonte: 9 }));

  // --- seletor AUTO/MAN -------------------------------------------------------
  // O .gfx poe as duas imagens do seletor em 30,213 e o botao em 23,211: e a
  // mesma peca, imagem por baixo e area de toque por cima.
  el.push(texto('rot-auto', 8, 198, 70, 13, 'AUTO', { fonte: 8, negrito: true }));
  el.push(imagem('Image16', 30, 213, 43, 51, 'Selector switch 2 (up).png'));
  el.push(imagem('Image13', 30, 213, 43, 51, 'Selector switch 2 (left).png',
    'v("MainProgram.aManual")'));
  el.push(texto('rot-man', 8, 266, 70, 13, 'MAN', { fonte: 8, negrito: true }));

  // --- coluna da esquerda -----------------------------------------------------
  el.push(navegar('GotoDisplayButton2', 2, 320, 84, 44, 'CALIBRAR\nBALANÇA DA\nPROVETA',
    'Calibra Balanza Probeta', { fundo: '#37A9E0', fonte: 7 }));
  el.push(navegar('GotoDisplayButton3', 2, 370, 84, 44, 'CALIBRAR\nBALANÇA DO\nTANQUE',
    'Calibra Balanza Tk L' + L, { fundo: '#37A9E0', fonte: 7 }));
  el.push(navegar('GotoDisplayButton5', 2, 420, 84, 44, 'CALIBRAR\nLÍQUIDO',
    'Calibra Liquido ' + L, { fundo: '#37A9E0', fonte: 8 }));
  el.push(navegar('GotoDisplayButton13', 2, 550, 84, 32, 'Lavagem', 'Lavagem', { fonte: 9 }));

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
  el.push(imagem('icone-home', 742, 558, 36, 30, 'Home01.png'));

  // --- emergencia e lockout ---------------------------------------------------
  el.push(texto('Text1', 4, 50, 80, 16, 'EMERGENCIA', {
    fonte: 9, cor: 'white', fundo: '#E02020', negrito: true,
  }));
  el.push(imagem('Padlock', 128, 206, 16, 16, 'Padlock 2.png',
    'v("MainProgram.LockOut_AgL' + L + '")'));

  return {
    nome: 'Liquido L' + L, largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 6 };
