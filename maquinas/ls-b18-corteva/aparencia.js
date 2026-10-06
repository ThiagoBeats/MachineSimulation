// ---------------------------------------------------------------------------
// APARENCIA: o pouco que o projeto nao entrega
// ---------------------------------------------------------------------------
// Este arquivo encolheu muito quando a pasta do projeto chegou. O que antes era
// reconstrucao minha virou dado:
//
//   - o trilho cinza, que eu repintava, ja vem cinza;
//   - os botoes TRIPLICE LAVAGEM, CONSUMO e MANUT, que eu acrescentava a mao,
//     ja existem, com destino certo;
//   - as legendas do trilho, que eu adivinhava, ja vem escritas;
//   - a resolucao, que eu tinha em 1280x800, e 800x600.
//
// Sobrou o que o publish do ViewPoint ainda descarta, e uma coisa que nunca
// esteve em tela nenhuma: a faixa de cabecalho, que na maquina e um display
// ancorado por cima de tudo (essa fica no renderizador, nao aqui).
// ---------------------------------------------------------------------------

'use strict';

// --- 1. a coluna creme da esquerda --------------------------------------------
// Em todo print de tela de processo a faixa onde ficam o seletor AUTO/MAN e os
// botoes de acao tem fundo creme. No XAML publicado ela sai branca.

const CREME = '#EFEFD5';
const COLUNA = { largura: 88, topo: 45 };
const TELAS_COM_COLUNA = ['MAIN', 'Balanza', 'Homogenizador', 'Liquidos'];

function colunaDaEsquerda(tela) {
  return {
    t: 'forma', id: 'ColunaEsquerda', reconstruido: true,
    d: 'M0 ' + COLUNA.topo + 'H' + COLUNA.largura + 'V' + tela.altura + 'H0Z',
    preenche: CREME, traco: '#D8D8BE', espessura: 1,
  };
}

// --- 2. os campos de entrada que o publish descarta ---------------------------
// O ViewPoint nao leva os NumericInput: a BALANCA real tem sete, o XAML tem
// nenhum. A POSICAO sai de _gfx-faltantes.json, que compara o binario .gfx com
// o XAML - geometria medida, nao estimada. Qual tag cada um mostra vem do print
// "BALANCA" de 25/06/2025, lendo de cima para baixo.

const AMARELO = '#FFFF80';

const ENTRADAS = {
  Balanza: {
    NumericInputCursorPoint2: { tag: 'MainProgram.PesoSemilla', casas: 0 },
    NumericInputCursorPoint1: { tag: 'MainProgram.CorteGruesoSemilla', casas: 0 },
    NumericInputCursorPoint3: { tag: 'MainProgram.CorteFinoSemilla', casas: 1 },
    NumericInputCursorPoint4: { tag: 'MainProgram.Tolerancia', casas: 0 },
    NumericInputCursorPoint5: { tag: 'MainProgram.BandaMuertaVacia', casas: 1 },
    // o preset do CLP conta em milissegundos e a tela mostra segundos
    NumericInputCursorPoint6: { tag: 'MainProgram.T_MaxCargaBalanza', casas: 0, escala: 1000 },
    NumericInputCursorPoint7: { tag: 'MainProgram.T_MaxDescBalanza', casas: 0, escala: 1000 },
  },
};

function campoNumerico(vao, c) {
  return {
    t: 'numero', id: vao.id, reconstruido: true,
    x: vao.x, y: vao.y, w: vao.w, h: vao.h,
    texto: '', fonte: 12, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: AMARELO, borda: '#707070', bordaEsp: 1,
    casas: c.casas, digitos: 7, completa: 'none',
    valor: c.escala ? 'v("' + c.tag + '")/' + c.escala : 'v("' + c.tag + '")',
  };
}

// --- 3. a lista de alarmes ----------------------------------------------------
// O objeto AlarmList tambem nao sai no publish: a tela de alarmes vem vazia. A
// posicao vem do .gfx; o conteudo, da tabela do .mal - 76 mensagens, cada uma
// com a tag que a dispara e com a inversao escrita no proprio arquivo.

function listaDeAlarmes(vao) {
  return { t: 'listaAlarmes', id: vao.id, reconstruido: true, x: vao.x, y: vao.y, w: vao.w, h: vao.h };
}

// ---------------------------------------------------------------------------

function cadaElemento(tela, fn) {
  (function anda(lista) { for (const e of lista) { fn(e); if (e.filhos) anda(e.filhos); } })(tela.elementos);
}

function aplicar(telas) {
  const conta = { coluna: 0, entrada: 0, alarmes: 0 };

  let vaos = {};
  try { vaos = require('./_gfx-faltantes.json').telas || {}; }
  catch (e) {
    console.warn('  aparencia: sem _gfx-faltantes.json; os campos que o publish '
      + 'descartou nao entram. Rode o inventario-gfx.js.');
  }

  for (const nome of Object.keys(telas)) {
    const tela = telas[nome];

    if (TELAS_COM_COLUNA.indexOf(nome) >= 0) {
      tela.elementos.unshift(colunaDaEsquerda(tela));
      conta.coluna++;
    }

    if (vaos[nome]) {
      for (const vao of vaos[nome]) {
        const c = ENTRADAS[nome] && ENTRADAS[nome][vao.id];
        if (c) { tela.elementos.push(campoNumerico(vao, c)); conta.entrada++; continue; }
        if (vao.t === 'alarme' && /^AlarmList/.test(vao.id)) {
          tela.elementos.push(listaDeAlarmes(vao));
          conta.alarmes++;
        }
      }
    }
  }
  return conta;
}

module.exports = { aplicar };
