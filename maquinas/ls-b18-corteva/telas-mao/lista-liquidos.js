// ---------------------------------------------------------------------------
// TELA "LIQUIDOS" (Lista Liquidos) - desenhada, nao extraida
// ---------------------------------------------------------------------------
// O cadastro dos 20 produtos: nome, densidade, offset de correcao e tres
// chaves - se tem agitador, se tem recirculacao e se e dosado em 1000S.
//
// Do .gfx saem a posicao (colunas em x = 6, 177, 250, 323, 396 e 469; linhas de
// y = 64 a 564, passo 26,3) e as legendas, inclusive as expressoes que revelam
// a ligacao em ListaLiquidos[00..19].
//
// UMA SUTILEZA QUE INVERTE O SINAL: as colunas se chamam "c/Agit" e "c/Recir",
// de COM agitador e COM recirculacao, mas as tags sao SinAgitador e
// SinRecirculacion - de SEM. O verde aceso quer dizer tag em ZERO. Ler ao pe
// da letra deixaria a tela inteira ao contrario.
// ---------------------------------------------------------------------------

'use strict';

// A MESMA logo das telas extraidas, na mesma caixa. Antes estas telas usavam
// outro arquivo, em 96x56: ao navegar, o cabecalho mudava de tamanho e de
// desenho de uma tela para a outra.
const LOGO = 'Logo-LS-Brasil-RGB_ff000080_ffffffff_T.png';

const LARGURA = 800, ALTURA = 600;
const ITENS = 20;
const Y0 = 64, PASSO = 26.3, ALT = 22;
const COL = { produto: 6, densidade: 177, offset: 250, agit: 323, recir: 396, mil: 469 };
const AMARELO = '#FFFF80';

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 10, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: false,
    alinha: o.alinha || 'middleCenter', fundo: o.fundo || null,
  };
}

function campo(id, x, y, w, tag, casas) {
  return {
    t: 'numero', id: id, x: x, y: y, w: w, h: ALT,
    texto: '', fonte: 10, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: '#FFFFFF', borda: '#9A9A9A', bordaEsp: 1,
    casas: casas, digitos: 6, completa: 'none',
    valor: 'v("' + tag + '")', escreve: tag, rotulo: id,
  };
}

// A chave liga/desliga.
//
// Em "c/Agit" e "c/Recir" o sinal se INVERTE: a coluna diz COM, a tag diz SEM
// (SinAgitador, SinRecirculacion), entao o verde e a tag em ZERO. Ja "1000S" e
// direta - verde quer dizer tag em UM. Inverter as tres deixaria a coluna do
// 1000S acesa na tela inteira.
function chave(id, x, y, w, tag, inverte) {
  return {
    t: 'botao', id: id, modo: 'mantido', x: x, y: y, w: w, h: ALT,
    forma: 'reto', esp: 1, escreve: tag,
    indicador: inverte ? 'v("' + tag + '") ? 0 : 1' : 'v("' + tag + '") ? 1 : 0',
    estados: [
      {
        id: '0', valor: 0, fundo: '#C8C8C8', claro: '#FFFFFF', escuro: '#909090',
        legenda: { texto: '', fonte: 9, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
      },
      {
        id: '1', valor: 1, fundo: '#10EB10', claro: '#8FEF8F', escuro: '#0A8F0A',
        legenda: { texto: '', fonte: 9, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
      },
    ],
  };
}

function navegar(id, x, y, w, h, rotulo, destino) {
  return {
    t: 'botao', id: id, modo: 'ir', x: x, y: y, w: w, h: h, forma: 'reto', esp: 2,
    destino: destino,
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#8FCEED', escuro: '#1E8FC5',
      legenda: { texto: rotulo, fonte: 14, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  };
}

function montar() {
  const el = [];

  el.push(texto('Text-titulo', 240, 8, 240, 30, 'LIQUIDOS', { fonte: 18, negrito: true }));
  el.push({ t: 'imagem', id: 'Image7', x: 700, y: 0, w: 100, h: 60, arq: LOGO });

  // --- cabecalho das colunas --------------------------------------------------
  el.push(texto('h-prod', COL.produto, 40, 148, 22, 'PRODUTO', { fonte: 10, negrito: true }));
  el.push(texto('h-dens', COL.densidade, 40, 50, 22, 'Densidade', { fonte: 9, negrito: true }));
  el.push(texto('h-off', COL.offset, 40, 50, 22, 'Offset', { fonte: 9, negrito: true }));
  el.push(texto('h-agit', COL.agit, 40, 50, 22, 'c/Agit', { fonte: 9, negrito: true }));
  el.push(texto('h-rec', COL.recir, 40, 50, 22, 'c/Recir', { fonte: 9, negrito: true }));
  el.push(texto('h-mil', COL.mil, 40, 50, 22, '1000S', { fonte: 9, negrito: true }));

  // --- as vinte linhas --------------------------------------------------------
  for (let i = 0; i < ITENS; i++) {
    const y = Math.round(Y0 + i * PASSO);
    const ii = (i < 10 ? '0' : '') + i;

    el.push({
      t: 'cadeia', id: 'StringInputEnable' + (i + 1), x: COL.produto, y: y, w: 148, h: ALT,
      texto: '', fonte: 10, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: AMARELO, borda: '#9A9A9A', bordaEsp: 1,
      valor: 'v("MainProgram.ListaLiquidos[' + ii + ']")',
    });
    el.push(campo('dens' + i, COL.densidade, y, 50, 'MainProgram.PesoEspec[' + ii + ']', 3));
    el.push(campo('off' + i, COL.offset, y, 50, 'MainProgram.OffsetLiquidos[' + ii + ']', 3));
    el.push(chave('agit' + i, COL.agit, y, 50, 'MainProgram.SinAgitador[' + ii + ']', true));
    el.push(chave('recir' + i, COL.recir, y, 50, 'MainProgram.SinRecirculacion[' + ii + ']', true));
    el.push(chave('mil' + i, COL.mil, y, 50, 'MainProgram.Liquido_1000s[' + ii + ']'));
  }

  // --- trilho -----------------------------------------------------------------
  const trilho = [
    ['GotoDisplayButton12', 70, 'LIQUIDO 1', 'Liquido L1'],
    ['GotoDisplayButton8', 120, 'LIQUIDO 2', 'Liquido L2'],
    ['GotoDisplayButton11', 170, 'LIQUIDO 3', 'Liquido L3'],
    ['GotoDisplayButton10', 220, 'LIQUIDO 4', 'Liquido L4'],
    ['GotoDisplayButton9', 270, 'LIQUIDO 5', 'Liquido L5'],
    ['GotoDisplayButton7', 320, 'PRÉ\nMISTURA', 'Liquido L6'],
  ];
  trilho.forEach(function (b) { el.push(navegar(b[0], 720, b[1], 80, 46, b[2], b[3])); });
  el.push(navegar('GotoDisplayButton1', 720, 550, 80, 46, '', 'MAIN'));
  el.push({ t: 'imagem', id: 'icone-home', x: 742, y: 558, w: 36, h: 30, arq: 'Home01.png' });

  return {
    nome: 'Lista Liquidos', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
