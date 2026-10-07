// ---------------------------------------------------------------------------
// TELA "PARAMETROS" - desenhada, nao extraida
// ---------------------------------------------------------------------------
// Uma grade simples: cinco colunas de produto e tres linhas de parametro -
// peso minimo, peso maximo e vazao nominal da bomba. Mais o botao que liga e
// desliga a simulacao de peso.
//
// Do .gfx saem a posicao de cada controle (colunas em x = 116, 234, 352, 470 e
// 588; linhas em y = 409, 448 e 487) e as legendas: "Peso Minimo",
// "Peso Maximo", "Vazao nominal", "Simulação de peso", "LIGADA", "DESLIGADA".
//
// ATENCAO ao botao da simulacao de peso. Na maquina real ele fica DESLIGADO,
// porque la ha celula de carga; aqui ele precisa ficar LIGADO, senao a balanca
// nunca carrega e nada anda - e a rotina SimulacionPeso do proprio CLP que
// gera o peso. O botao funciona, e desliga-lo para a producao de proposito.
// ---------------------------------------------------------------------------

'use strict';

// A MESMA logo das telas extraidas, na mesma caixa. Antes estas telas usavam
// outro arquivo, em 96x56: ao navegar, o cabecalho mudava de tamanho e de
// desenho de uma tela para a outra.
const LOGO = 'Logo-LS-Brasil-RGB_ff000080_ffffffff_T.png';

const LARGURA = 800, ALTURA = 600;
const CREME = '#EFEFD5';
const AMARELO = '#FFFF80';

const COLUNAS = [116, 234, 352, 470, 588];
const LARG = 100, ALT = 28;
const Y = { cabecalho: 366, minimo: 409, maximo: 448, vazao: 487 };

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 11, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: false,
    alinha: o.alinha || 'middleCenter', fundo: o.fundo || null,
  };
}

function campo(id, x, y, tag, casas) {
  return {
    t: 'numero', id: id, x: x, y: y, w: LARG, h: ALT,
    texto: '', fonte: 12, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: AMARELO, borda: '#707070', bordaEsp: 1,
    casas: casas, digitos: 7, completa: 'none',
    valor: 'v("' + tag + '")',
    escreve: tag,
    rotulo: id,
  };
}

function montar() {
  const el = [];

  el.push({
    t: 'forma', id: 'ColunaEsquerda',
    d: 'M0 45H88V' + ALTURA + 'H0Z', preenche: CREME, traco: '#D8D8BE', espessura: 1,
  });

  el.push(texto('Text-titulo', 280, 10, 240, 30, 'PARAMETROS', { fonte: 19 }));
  el.push({ t: 'imagem', id: 'Image7', x: 700, y: 0, w: 100, h: 60, arq: LOGO });

  // --- simulacao de peso ------------------------------------------------------
  el.push(texto('rot-sim', 100, 236, 140, 28, 'Simulação de peso', { fonte: 13, alinha: 'middleRight' }));
  el.push({
    t: 'botao', id: 'MaintainedPushButton1', modo: 'mantido', x: 251, y: 234, w: 69, h: 32,
    forma: 'reto', esp: 2, escreve: 'MainProgram.SimulacionPeso',
    indicador: 'v("MainProgram.SimulacionPeso")',
    estados: [
      {
        id: '0', valor: 0, fundo: '#C8C8C8', claro: '#FFFFFF', escuro: '#808080',
        legenda: { texto: 'DESLIGADA', fonte: 9, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
      },
      {
        id: '1', valor: 1, fundo: '#10EB10', claro: '#8FEF8F', escuro: '#0A8F0A',
        legenda: { texto: 'LIGADA', fonte: 9, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
      },
    ],
  });

  // --- a grade ----------------------------------------------------------------
  el.push(texto('rot-min', 2, Y.minimo, 112, ALT, 'Peso Minimo', { fonte: 11, alinha: 'middleRight' }));
  el.push(texto('rot-max', 2, Y.maximo, 112, ALT, 'Peso Maximo', { fonte: 11, alinha: 'middleRight' }));
  el.push(texto('rot-vaz', 2, Y.vazao, 112, ALT, 'Vazão nominal', { fonte: 11, alinha: 'middleRight' }));

  COLUNAS.forEach(function (x, i) {
    const n = i + 1;
    // o cabecalho mostra o produto que esta na linha
    el.push({
      t: 'cadeia', id: 'produto' + n, x: x, y: Y.cabecalho, w: 104, h: 30,
      texto: '', fonte: 11, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: '#D9D9D9', borda: '#9A9A9A', bordaEsp: 1,
      valor: 'v("MainProgram.NombreLiquido' + n + '")',
    });
    el.push(campo('min' + n, x + 2, Y.minimo, 'MainProgram.Peso_Min_Tk_L' + n, 1));
    el.push(campo('max' + n, x + 2, Y.maximo, 'MainProgram.Peso_Max_Tk_L' + n, 1));
    el.push(campo('vaz' + n, x + 2, Y.vazao, 'Caudal_Nominal_Bomba_L' + n, 1));
  });

  // --- trilho -----------------------------------------------------------------
  el.push({
    t: 'botao', id: 'GotoDisplayButton1', modo: 'ir', x: 720, y: 550, w: 80, h: 46,
    forma: 'reto', esp: 2, destino: 'MAIN',
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#8FCEED', escuro: '#1E8FC5',
      legenda: { texto: '', fonte: 14, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
  el.push({ t: 'imagem', id: 'icone-home', x: 742, y: 558, w: 36, h: 30, arq: 'Home01.png' });

  el.push(texto('Text-emerg', 4, 50, 80, 16, 'EMERGENCIA', {
    fonte: 9, cor: 'white', fundo: '#E02020', negrito: true,
  }));

  return {
    nome: 'Parametros', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
