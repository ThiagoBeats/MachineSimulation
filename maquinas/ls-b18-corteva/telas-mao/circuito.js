// ---------------------------------------------------------------------------
// TELA "LIQUIDO CIRCUITO n" - desenhada, nao extraida
// ---------------------------------------------------------------------------
// E onde o operador diz QUAL PRODUTO esta carregado em cada linha. Importa mais
// do que parece: o CLP confere esse nome em VerifNombresServOk, e com ele vazio
// a linha ativa acusa "falta nome".
//
// Do .gfx saem a posicao de cada controle e as legendas, inclusive as da lista:
//
//   "1 - /*S:0 {...MainProgram.ListaLiquidos[00]}*/"  ate  "20 - ...[19]"
//
// UM DEFEITO DO PROJETO, visivel nessa mesma lista: a sexta entrada esta
// rotulada "4 - " e aponta para ListaLiquidos[05]. Os rotulos 1..20 sao texto
// fixo, e esse ficou errado na duplicacao. Aqui a lista sai numerada certo.
//
// Como as seis telas sao o mesmo desenho, ha uma definicao so.
// ---------------------------------------------------------------------------

'use strict';

const LARGURA = 800, ALTURA = 600;
const CREME = '#EFEFD5';
const ITENS = 20;

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
    preenche: o.preenche || '#FFFFFF', traco: o.traco || '#4A4A4A', espessura: o.esp || 2,
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

function montar(n) {
  const L = String(n);
  const indice = 'MainProgram.IndiceL' + L + '_Recetario';
  const el = [];

  el.push({
    t: 'forma', id: 'ColunaEsquerda',
    d: 'M0 45H88V' + ALTURA + 'H0Z', preenche: CREME, traco: '#D8D8BE', espessura: 1,
  });

  el.push(texto('Text-titulo', 250, 10, 300, 30, 'TABELA DE LIQUIDOS', { fonte: 19 }));
  el.push({ t: 'imagem', id: 'Image3', x: 700, y: 2, w: 96, h: 56, arq: 'ls - 753 x 294 px.jpg' });
  el.push(texto('Text-instr', 150, 58, 450, 24,
    'SELECIONE O LIQUIDO PARA O CIRCUITO ' + L + ' E PRESSIONE "ENTER"', { fonte: 11 }));

  // --- a lista dos 20 liquidos ------------------------------------------------
  el.push(caixa('quadro-lista', 228, 87, 293, 405));
  const alt = 19;
  for (let i = 0; i < ITENS; i++) {
    el.push({
      t: 'cadeia', id: 'item' + i, x: 234, y: 91 + i * alt, w: 280, h: alt - 1,
      texto: '', fonte: 11, cor: 'black', negrito: false, italico: false,
      alinha: 'middleLeft', fundo: null, borda: 'none', bordaEsp: 0,
      valor: '(' + (i + 1) + ') + " - " + (v("MainProgram.ListaLiquidos[' + i + ']") || "")',
    });
    el.push({
      t: 'forma', id: 'sel' + i,
      d: 'M231 ' + (90 + i * alt) + 'H518V' + (90 + (i + 1) * alt) + 'H231Z',
      preenche: 'none', traco: '#1E6FD9', espessura: 2,
      visivel: { expr: 'v("' + indice + '") === ' + i, quando: 'visible' },
    });
  }

  // --- navegacao da lista -----------------------------------------------------
  el.push({
    t: 'botao', id: 'MoveUpButton1', modo: 'momentaneo', x: 228, y: 504, w: 60, h: 60,
    forma: 'reto', esp: 3, escreve: indice, passo: -1, limite: [0, ITENS - 1],
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: { texto: '▲', fonte: 20, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
  el.push({
    t: 'botao', id: 'MoveDownButton1', modo: 'momentaneo', x: 461, y: 504, w: 60, h: 60,
    forma: 'reto', esp: 3, escreve: indice, passo: 1, limite: [0, ITENS - 1],
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: { texto: '▼', fonte: 20, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
  // o ENTER copia o produto escolhido para a linha: e esse nome que o CLP
  // confere para liberar a producao
  el.push({
    t: 'botao', id: 'EnterButton1', modo: 'momentaneo', x: 324, y: 504, w: 100, h: 60,
    forma: 'reto', esp: 3,
    copia: {
      de: ler => 'MainProgram.ListaLiquidos[' + (Number(ler(indice)) || 0) + ']',
      para: 'MainProgram.NombreLiquido' + L,
    },
    estados: [{
      id: '0', valor: 0, fundo: '#9FD69F', claro: '#FFFFFF', escuro: '#808080',
      legenda: { texto: 'ENTER', fonte: 13, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });

  // --- o que esta carregado agora ---------------------------------------------
  el.push(texto('rot-atual', 150, 500, 70, 24, 'Atual:', { fonte: 11, alinha: 'middleRight' }));
  el.push({
    t: 'cadeia', id: 'atual', x: 150, y: 526, w: 70, h: 24,
    texto: '', fonte: 10, cor: '#1A5E1A', negrito: true, italico: false,
    alinha: 'middleCenter', fundo: null, borda: 'none', bordaEsp: 0,
    valor: 'v("MainProgram.NombreLiquido' + L + '")',
  });

  // --- trilho -----------------------------------------------------------------
  const trilho = [
    ['GotoDisplayButton3', 70, 'LIQUIDO 1', 'Liquido L1'],
    ['GotoDisplayButton8', 120, 'LIQUIDO 2', 'Liquido L2'],
    ['GotoDisplayButton4', 170, 'LIQUIDO 3', 'Liquido L3'],
    ['GotoDisplayButton2', 220, 'LIQUIDO 4', 'Liquido L4'],
    ['GotoDisplayButton5', 270, 'LIQUIDO 5', 'Liquido L5'],
    ['GotoDisplayButton1', 320, 'PRÉ\nMISTURA', 'Liquido L6'],
  ];
  trilho.forEach(function (b) { el.push(navegar(b[0], 720, b[1], 80, 46, b[2], b[3])); });
  el.push(navegar('ReturntoDisplayButton1', 720, 500, 80, 44, 'VOLTAR', 'Liquido L' + L));
  el.push(navegar('GotoDisplayButton6', 720, 550, 80, 46, '', 'MAIN'));
  el.push({ t: 'imagem', id: 'icone-home', x: 742, y: 558, w: 36, h: 30, arq: 'Home01.png' });

  el.push(texto('Text-emerg', 4, 50, 80, 16, 'EMERGENCIA', {
    fonte: 9, cor: 'white', fundo: '#E02020', negrito: true,
  }));

  // o projeto chama a primeira de "Liquido circuito 1", com c minusculo
  const nome = n === 1 ? 'Liquido circuito 1' : 'Liquido Circuito ' + L;
  return { nome: nome, largura: LARGURA, altura: ALTURA, fundo: '#FFFFFF', elementos: el };
}

module.exports = { montar: montar, quantas: 6 };
