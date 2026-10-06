// ---------------------------------------------------------------------------
// TELA "RECEITAS" (Recetario) - desenhada, nao extraida
// ---------------------------------------------------------------------------
// So existe no binario .gfx. De la saem a posicao de cada controle e a tabela
// de legendas - que nesta tela deu de brinde as EXPRESSOES da lista:
//
//   "1 - /*S:0 {[B18_CORTEVA]RECETARIO[00].Nombre}*/"  ate
//   "20 - /*S:0 {[B18_CORTEVA]RECETARIO[19].Nombre}*/"
//
// E dai se descobre uma coisa que muda o endereco de tudo: o receituario e
// BASE ZERO. A linha 8 da tela e RECETARIO[07], nao RECETARIO[08].
//
// A tela trabalha com dois registros:
//   RECETARIO[Indice_RECETARIO].RECETA.*   a receita escolhida na lista
//   RECETA_EDICION.RECETA.*                o rascunho que o botao EDITAR abre
//
// Aqui mostra-se a escolhida. Editar e salvar sao do CLP; o que esta ligado e
// a navegacao da lista e a carga da receita para o processo.
// ---------------------------------------------------------------------------

'use strict';

const LARGURA = 800, ALTURA = 600;
const CREME = '#EFEFD5';
const AMARELO = '#FFFF80';

const LINHAS = [160, 195, 231, 266, 302, 338];
const COL = { rotulo: 168, produto: 198, dose: 360, ordem: 438, demora: 506, injecao: 575, aspersor: 644 };
const ALT = 27, LARG = 50;

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

// O indice vem de uma tag, entao o endereco se monta na hora da leitura.
function doReceituario(membro) {
  return 'v("RECETARIO[" + v("Indice_RECETARIO") + "].RECETA.' + membro + '")';
}

function campo(id, x, y, w, membro, casas) {
  return {
    t: 'numero', id: id, x: x, y: y, w: w, h: ALT,
    texto: '', fonte: 12, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: AMARELO, borda: '#707070', bordaEsp: 1,
    casas: casas, digitos: 7, completa: 'none',
    valor: doReceituario(membro),
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

function comando(id, x, y, w, h, rotulo, tag, modo, o) {
  o = o || {};
  return {
    t: 'botao', id: id, modo: modo, x: x, y: y, w: w, h: h, forma: 'reto', esp: 2,
    escreve: tag,
    estados: [{
      id: '0', valor: 0, fundo: o.fundo || '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: {
        texto: rotulo, fonte: o.fonte || 11, cor: 'black',
        negrito: false, italico: false, alinha: 'middleCenter',
      },
    }],
  };
}

function montar() {
  const el = [];

  // Esta tela nao tem a coluna creme nem o aviso de emergencia: no print a
  // lista de receitas ocupa a esquerda inteira.

  el.push(texto('Text-titulo', 300, 10, 200, 30, 'RECEITAS', { fonte: 20 }));
  el.push({ t: 'imagem', id: 'Image3', x: 700, y: 2, w: 96, h: 56, arq: 'ls - 753 x 294 px.jpg' });

  // --- a lista das 20 receitas ------------------------------------------------
  el.push(caixa('quadro-lista', 8, 84, 150, 405, { preenche: '#FFFFFF', traco: '#4A4A4A', esp: 2 }));
  el.push(texto('Text-receita', 8, 62, 150, 20, 'RECEITA', { fonte: 12, negrito: true }));
  for (let i = 0; i < 20; i++) {
    // o vetor e base zero: a linha 1 mostra RECETARIO[00]
    el.push({
      t: 'cadeia', id: 'lista' + i, x: 12, y: 88 + i * 19, w: 142, h: 18,
      texto: '', fonte: 10, cor: 'black', negrito: false, italico: false,
      alinha: 'middleLeft', fundo: null, borda: 'none', bordaEsp: 0,
      valor: '(' + (i + 1) + ') + " - " + (v("RECETARIO[' + i + '].RECETA.Nombre") || "")',
    });
    // a linha escolhida fica destacada
    el.push({
      t: 'forma', id: 'sel' + i,
      d: 'M10 ' + (87 + i * 19) + 'H154V' + (105 + i * 19) + 'H10Z',
      preenche: 'none', traco: '#1E6FD9', espessura: 2,
      visivel: { expr: 'v("Indice_RECETARIO") === ' + i, quando: 'visible' },
    });
  }

  // --- nome da receita escolhida ----------------------------------------------
  el.push({
    t: 'cadeia', id: 'StringInputEnable3', x: 337, y: 62, w: 148, h: 24,
    texto: '', fonte: 12, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: AMARELO, borda: '#707070', bordaEsp: 1,
    valor: doReceituario('Nombre'),
  });

  // --- cabecalho das colunas --------------------------------------------------
  el.push(texto('Text-produto', 198, 108, 148, 40, 'PRODUTO', { fonte: 11, negrito: true }));
  el.push(texto('Text-dose', 352, 104, 66, 44, 'Dose\n(ml/100 kg)', { fonte: 10 }));
  el.push(texto('Text-ordem', 430, 104, 66, 44, 'Ordem de\ninjeção', { fonte: 10 }));
  el.push(texto('Text-demora', 498, 104, 66, 44, 'Demora (s)', { fonte: 10 }));
  el.push(texto('Text-injecao', 567, 104, 66, 44, 'Injeção (s)', { fonte: 10 }));
  el.push(texto('Text-asp', 636, 104, 70, 44, 'Velocidade\nAspersor(%)', { fonte: 10 }));

  // --- as seis linhas ---------------------------------------------------------
  LINHAS.forEach(function (y, i) {
    const n = i + 1;
    el.push(texto('rot-L' + n, COL.rotulo, y, 28, ALT, 'L' + n, { fonte: 13, negrito: true }));
    el.push({
      t: 'cadeia', id: 'StringDisplay' + n, x: COL.produto, y: y, w: 148, h: ALT,
      texto: '', fonte: 11, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: '#FFFFFF', borda: '#707070', bordaEsp: 1,
      valor: doReceituario('Nombre_L' + n),
    });
    el.push(campo('dose' + n, COL.dose, y, LARG, 'Dosis_L' + n, 2));
    el.push(campo('ordem' + n, COL.ordem, y, LARG, 'Orden_L' + n, 0));
    // os tempos sao guardados em milissegundos e mostrados em segundos
    el.push({
      t: 'numero', id: 'demora' + n, x: COL.demora, y: y, w: LARG, h: ALT,
      texto: '', fonte: 12, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: AMARELO, borda: '#707070', bordaEsp: 1,
      casas: 0, digitos: 6, completa: 'none',
      valor: doReceituario('T_demora_L' + n) + ' / 1000',
    });
    el.push({
      t: 'numero', id: 'injecao' + n, x: COL.injecao, y: y, w: LARG, h: ALT,
      texto: '', fonte: 12, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: AMARELO, borda: '#707070', bordaEsp: 1,
      casas: 0, digitos: 6, completa: 'none',
      valor: doReceituario('T_inyeccion_L' + n) + ' / 1000',
    });
    el.push(campo('asp' + n, COL.aspersor, y, LARG, 'Vel_aspersor_L' + n, 0));
  });

  // --- homogeneizador e descarga ----------------------------------------------
  el.push(texto('rot-homog', 300, 392, 210, 24, 'Homogeneizador', { fonte: 14, alinha: 'middleRight' }));
  el.push(campo('homog-pct', 526, 396, LARG, 'Vel_homogenizado', 0));
  el.push(texto('rot-homog-pct', 578, 398, 26, 20, '(%)', { fonte: 10 }));
  el.push({
    t: 'numero', id: 'homog-s', x: 610, y: 396, w: LARG, h: ALT,
    texto: '', fonte: 12, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: AMARELO, borda: '#707070', bordaEsp: 1,
    casas: 0, digitos: 6, completa: 'none',
    valor: doReceituario('T_homogenizado') + ' / 1000',
  });
  el.push(texto('rot-homog-s', 662, 398, 26, 20, '(s)', { fonte: 10 }));

  el.push(texto('rot-desc', 300, 441, 210, 24, 'Descarga', { fonte: 14, alinha: 'middleRight' }));
  el.push(campo('desc-pct', 526, 445, LARG, 'Vel_descarga', 0));
  el.push(texto('rot-desc-pct', 578, 447, 26, 20, '(%)', { fonte: 10 }));
  el.push({
    t: 'numero', id: 'desc-s', x: 610, y: 445, w: LARG, h: ALT,
    texto: '', fonte: 12, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: AMARELO, borda: '#707070', bordaEsp: 1,
    casas: 0, digitos: 6, completa: 'none',
    valor: doReceituario('T_descarga') + ' / 1000',
  });
  el.push(texto('rot-desc-s', 662, 447, 26, 20, '(s)', { fonte: 10 }));

  // --- navegacao da lista -----------------------------------------------------
  // Sobe, desce e confirma. O indice anda entre 0 e 19 porque o vetor e base
  // zero; a tela mostra 1 a 20.
  el.push({
    t: 'botao', id: 'MoveUpButton2', modo: 'momentaneo', x: 7, y: 489, w: 44, h: 60,
    forma: 'reto', esp: 3, escreve: 'Indice_RECETARIO',
    passo: -1, limite: [0, 19],
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: { texto: '▲', fonte: 18, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
  el.push({
    t: 'botao', id: 'MoveDownButton2', modo: 'momentaneo', x: 114, y: 489, w: 44, h: 60,
    forma: 'reto', esp: 3, escreve: 'Indice_RECETARIO',
    passo: 1, limite: [0, 19],
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: { texto: '▼', fonte: 18, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
  el.push(comando('EnterButton2', 51, 489, 63, 60, '↵', 'Carga_Receta_Proceso', 'momentaneo',
    { fonte: 20, fundo: '#9FD69F' }));

  // --- editar, salvar, sair ---------------------------------------------------
  el.push(comando('MaintainedPushButton1', 313, 520, 93, 37, 'EDITAR', 'Editar_Receta', 'mantido',
    { fundo: '#2F5BD9', fonte: 11 }));
  el.push(comando('MomentaryPushButton1', 422, 520, 162, 37, 'SALVAR ALTERAÇÕES',
    'Guardar_Receta', 'momentaneo', { fonte: 10 }));
  el.push(navegar('MomentaryPushButton3', 599, 520, 93, 37, 'SAIR', 'MAIN', { fonte: 11 }));

  // --- trilho -----------------------------------------------------------------
  el.push(navegar('GotoDisplayButton2', 720, 550, 80, 46, '', 'MAIN'));
  el.push({ t: 'imagem', id: 'icone-home', x: 742, y: 558, w: 36, h: 30, arq: 'Home01.png' });

  return {
    nome: 'Recetario', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
