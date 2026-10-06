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

// As familias: a geometria e a mesma nas seis telas e so a tag muda de linha.
//
// A POSICAO VEM JUNTO porque _gfx-faltantes.json so cobre as telas que o
// ViewPoint publicou - as copias derivadas nao estao la. Como as telas da
// familia sao identicas (conferido no binario: mesma contagem de elementos e
// mesma geometria), a posicao da gemea publicada vale para todas.
const ENTRADAS_POR_FAMILIA = [
  {
    tela: /^Calibra Balanza Tk L(\d)$/,
    campos: {
      NumericInputCursorPoint1: {
        tag: n => 'MainProgram.Peso_Patron_Tk_L' + n, casas: 1,
        onde: { x: 318, y: 244, w: 70, h: 27 },
      },
    },
  },
  {
    tela: /^Calibra Liquido (\d)$/,
    campos: {
      NumericInputCursorPoint2: {
        tag: () => 'MainProgram.Tolerancia_Cal_L', casas: 1,
        onde: { x: 203, y: 198, w: 48, h: 21 },
      },
      NumericInputCursorPoint1: {
        tag: () => 'MainProgram.Vol_de_Probeta', casas: 1,
        onde: { x: 603, y: 382, w: 66, h: 21 },
      },
    },
  },
];

// Os campos que a familia manda e que nenhum vao do .gfx cobre - o caso das
// telas derivadas, que nao entraram no inventario.
function entradasDaFamilia(nome, jaPostos) {
  const fora = [];
  for (const fam of ENTRADAS_POR_FAMILIA) {
    const m = fam.tela.exec(nome);
    if (!m) continue;
    for (const id of Object.keys(fam.campos)) {
      if (jaPostos.has(id)) continue;
      const c = fam.campos[id];
      fora.push({
        vao: { id: id, x: c.onde.x, y: c.onde.y, w: c.onde.w, h: c.onde.h },
        conf: { tag: c.tag(m[1]), casas: c.casas },
      });
    }
  }
  return fora;
}

const ENTRADAS = {
  'Calibra Balanza Probeta': {
    NumericInputCursorPoint1: { tag: 'MainProgram.Peso_Patron_Probeta', casas: 1 },
  },
  'Calibra Balanza semilla': {
    NumericInputEnable1: { tag: 'MainProgram.Peso_Patron_Semilla', casas: 1 },
  },
  Homogenizador: {
    NumericInputCursorPoint1: { tag: 'MainProgram.RefFrecCTF', casas: 0 },
    NumericInputCursorPoint2: { tag: 'MainProgram.RefFrecASP', casas: 0 },
  },
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

// --- 4. defeitos do projeto que valem reparar na leitura ----------------------
// Nao e maquiagem: sao erros que estao no arquivo do cliente e que, repetidos
// aqui, apareceriam como defeito NOSSO. Cada um esta reportado para correcao no
// projeto; enquanto nao for, a simulacao usa o valor certo.

const CORRECOES = [
  {
    // vale para a 1 e para todas as copias que saem dela
    tela: /^Calibra Liquido \d$/,
    // Alguem colou um link do YouTube dentro do campo de tag do NumericDisplay2
    // ao editar a tela. A tag virou "MainProgram.T" + a URL + "[0]", que nao
    // existe - na maquina real esse campo nao mostra nada. Qual era a tag certa
    // sabe-se comparando com a tela irma: "Calibra Liquido 2" tem
    // TablaVol_Cal_L[0] nessa mesma posicao.
    de: /MainProgram\.Thttps[^"')]*\[0\]/g,
    para: 'MainProgram.TablaVol_Cal_L[0]',
    porque: 'URL colada por engano dentro do nome da tag',
  },
  {
    tela: /^Liquido L5$/,
    // A tela da linha 5 mostra o peso do TANQUE 4: copia-e-cola que ficou para
    // tras quando a tela foi duplicada.
    de: /MainProgram\.Peso_Tk_L4\b/g,
    para: 'MainProgram.Peso_Tk_L5',
    porque: 'tela da linha 5 lia o peso do tanque 4',
  },
];

function corrigir(telas) {
  const feitas = [];
  for (const c of CORRECOES) {
    for (const nome of Object.keys(telas)) {
      if (!c.tela.test(nome)) continue;
      const tela = telas[nome];
      let n = 0;
    (function anda(lista) {
      for (const e of lista) {
        for (const campo of ['valor', 'escreve', 'indicador']) {
          if (typeof e[campo] === 'string' && c.de.test(e[campo])) {
            c.de.lastIndex = 0;
            e[campo] = e[campo].replace(c.de, c.para); n++;
          }
          c.de.lastIndex = 0;
        }
        if (e.visivel && typeof e.visivel.expr === 'string') {
          if (c.de.test(e.visivel.expr)) { c.de.lastIndex = 0; e.visivel.expr = e.visivel.expr.replace(c.de, c.para); n++; }
          c.de.lastIndex = 0;
        }
        if (e.filhos) anda(e.filhos);
      }
      })(tela.elementos);
      if (n) feitas.push(nome + ': ' + c.porque);
    }
  }
  return feitas;
}

function cadaElemento(tela, fn) {
  (function anda(lista) { for (const e of lista) { fn(e); if (e.filhos) anda(e.filhos); } })(tela.elementos);
}

function aplicar(telas) {
  const conta = { coluna: 0, entrada: 0, alarmes: 0 };

  // repara os defeitos do projeto antes de qualquer coisa, para as telas
  // derivadas ja saírem do valor certo
  const reparos = corrigir(telas);
  reparos.forEach(r => console.log("  reparo        : " + r));

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

    const postos = new Set();
    for (const vao of (vaos[nome] || [])) {
      let c = ENTRADAS[nome] && ENTRADAS[nome][vao.id];
      if (!c) {
        for (const fam of ENTRADAS_POR_FAMILIA) {
          const m = fam.tela.exec(nome);
          if (!m || !fam.campos[vao.id]) continue;
          const base = fam.campos[vao.id];
          c = { tag: base.tag(m[1]), casas: base.casas };
          break;
        }
      }
      if (c) {
        tela.elementos.push(campoNumerico(vao, c));
        postos.add(vao.id); conta.entrada++;
        continue;
      }
      if (vao.t === 'alarme' && /^AlarmList/.test(vao.id)) {
        tela.elementos.push(listaDeAlarmes(vao));
        conta.alarmes++;
      }
    }

    // as copias derivadas nao tem vao no inventario: a familia traz a posicao
    for (const x of entradasDaFamilia(nome, postos)) {
      tela.elementos.push(campoNumerico(x.vao, x.conf));
      conta.entrada++;
    }
  }
  return conta;
}

module.exports = { aplicar };
