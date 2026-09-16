// ---------------------------------------------------------------------------
// APARENCIA: o que os prints da IHM mostram e o .mer publicado nao entrega
// ---------------------------------------------------------------------------
// ESTE ARQUIVO E RECONSTRUCAO, NAO EXTRACAO. Assim como planta.js, ele e escrito
// a mao. A diferenca e que aqui ha referencia: 16 prints da IHM real, tirados em
// 25/06/2025, com a maquina em producao.
//
// Por que ele precisa existir:
//
// 1. O .mer que temos e de 01/06/2025 e os prints sao de 25/06. A IHM mudou no
//    meio: o trilho de navegacao passou de azul para cinza com relevo, e
//    entraram botoes que o nosso arquivo nao tem (PRE MISTURA, TRIPLICE
//    LAVAGEM, CONSUMO, MANUT). Nao ha .mer mais novo disponivel.
//
// 2. O publish do ViewPoint e com perda. Ele grava a legenda de 48 dos 110
//    botoes em branco, e descarta os campos de entrada numerica inteiros: a
//    tela da BALANCA real tem 8 (peso da batelada, corte grosso, corte fino,
//    tolerancia, balanca vazia, tempo de carga e de descarga), e o XAML
//    publicado traz 1.
//
// Cada correcao abaixo diz de qual print saiu. O que nao se ve em print nenhum
// nao entra aqui.
// ---------------------------------------------------------------------------

'use strict';

// --- 1. a pele dos botoes -----------------------------------------------------
// Nos prints, o trilho de navegacao e cinza com relevo - a aparencia padrao do
// FactoryTalk. O azul #37A9E0 que o .mer de junho traz ficou so nos botoes de
// acao da coluna da esquerda (Calibrar, Hist. Pesagem, ACIONAR VENTILADOR), que
// nos prints continuam azuis.

const CINZA = { fundo: '#D4D0C8', claro: '#FFFFFF', escuro: '#808080' };

// O trilho fica encostado na borda direita; os botoes de acao, na esquerda.
function noTrilho(el, tela) {
  return el.x + el.w > tela.largura - 160;
}

// --- 2. botoes que a versao de 25/jun tem e a de 01/jun nao -------------------
// Print "TRATADORA DE SEMENTES": o trilho tem nove botoes, nesta ordem. O .mer
// tem seis e dois vaos vazios exatamente onde os novos entraram.

const TRILHO_MAIN = [
  { rotulo: 'LIQUIDOS', destino: 'Liquido L1' },
  { rotulo: 'PARAM', destino: 'Parametros' },
  { rotulo: 'RECEITAS', destino: 'Receta en proceso' },
  { rotulo: 'TAMBOR', destino: 'Homogenizador' },
  { rotulo: 'TRIPLICE\nLAVAGEM', destino: 'Triplice lavagem' },
  { rotulo: 'BALANÇA', destino: 'Balanza' },
  { rotulo: 'CONSUMO', destino: 'Consumo' },
  { rotulo: 'MANUT', destino: 'Manutencao' },
  { rotulo: 'ALARMAS', destino: 'Alarmas' },
];

// Print "BALANCA" e "ALARMES": o trilho das telas de processo ganhou PRE MISTURA
// entre LIQUIDO 6 e o resto. No .mer ha um vao vazio no lugar exato.
const PRE_MISTURA = { rotulo: 'PRÉ\nMISTURA', destino: 'Pre mistura' };

// --- 3. as legendas que o publish gravou em branco ----------------------------
// ESTA E A PARTE MAIS FRAGIL DESTE ARQUIVO, e vale dizer por que.
//
// O print de 25/jun mostra seis botoes na coluna esquerda da BALANCA: Corte
// Grosso, Corte Fino, Fechar Corte, Descer Pesos, Abrir descarga e Fechar
// descarga. O .mer de 01/jun tem seis botoes sem legenda nessa tela, mas em
// outro lugar - tres empilhados em x=619 e tres soltos. A versao de 25/jun
// mudou o arranjo.
//
// O casamento abaixo e por AGRUPAMENTO, nao por coordenada: os tres que estao
// na mesma coluna e em sequencia sao o trio do corte, na ordem de cima para
// baixo; os outros tres seguem a mesma ordem vertical do print. E a leitura
// mais defensavel dos dados, mas continua sendo leitura - se aparecer um .mer
// de 25/jun, ela deve ser jogada fora e substituida pelo que vier dele.

const LEGENDAS = {
  Balanza: {
    MaintainedPushButton2: 'Corte\nGrosso',
    MaintainedPushButton3: 'Corte\nFino',
    MaintainedPushButton4: 'Fechar\nCorte',
    MaintainedPushButton5: 'Descer\nPesos',
    MaintainedPushButton1: 'Abrir\ndescarga',
    MomentaryPushButton11: 'Fechar\ndescarga',
  },
  Homogenizador: {
    MaintainedPushButton1: 'Abrir\ndescarga',
  },
};

// --- 4. os campos de entrada que o ViewPoint descartou ------------------------
// O publish nao leva os NumericInput. Na BALANCA real ha sete; no XAML, nenhum.
//
// A POSICAO NAO E CHUTE: sai de _gfx-faltantes.json, que o inventario-gfx.js
// produz comparando o binario .gfx com o XAML - a geometria do binario acerta
// 99,7% contra as telas que existem nos dois formatos. O que o binario nao diz
// e QUAL tag cada campo mostra; isso vem dos prints, lendo de cima para baixo.
//
// O rotulo e a unidade ("Kg", "%", "Seg") ja existem no XAML como texto solto:
// o publish descartou so a caixa do meio. Por isso aqui nao se cria rotulo
// nenhum - so o campo que faltava, no vao que ficou.

const AMARELO = '#FFFF80';

const ENTRADAS = {
  // Print "BALANCA", de cima para baixo: tres no quadro dos pesos, dois no da
  // tolerancia, dois no do tempo excedido.
  Balanza: {
    NumericInputCursorPoint2: { tag: 'MainProgram.PesoSemilla', casas: 0 },
    NumericInputCursorPoint1: { tag: 'MainProgram.CorteGruesoSemilla', casas: 0 },
    NumericInputCursorPoint3: { tag: 'MainProgram.CorteFinoSemilla', casas: 1 },
    NumericInputCursorPoint4: { tag: 'MainProgram.Tolerancia', casas: 0 },
    NumericInputCursorPoint5: { tag: 'MainProgram.BandaMuertaVacia', casas: 1 },
    NumericInputCursorPoint6: { tag: 'MainProgram.T_MaxCargaBalanza', casas: 0 },
    NumericInputCursorPoint7: { tag: 'MainProgram.T_MaxDescBalanza', casas: 0 },
  },
};

// --- 4b. a coluna creme da esquerda -------------------------------------------
// Em todos os prints de tela de processo - MAIN, BALANCA, HOMOGENEIZADOR,
// TRIPLICE LAVAGEM, PRE MISTURA, LIQUIDO L1 - a faixa da esquerda, onde ficam o
// seletor AUTO/MAN e os botoes de acao, tem fundo creme. No .mer publicado essa
// faixa e branca. E a marca visual mais presente da IHM real.

const CREME = '#EFEFD5';
const COLUNA = { largura: 140, topo: 72 };

const TELAS_COM_COLUNA = ['MAIN', 'Balanza', 'Homogenizador', 'Liquidos'];

function colunaDaEsquerda(tela) {
  return {
    t: 'forma', id: 'ColunaEsquerda', reconstruido: true,
    d: 'M0 ' + COLUNA.topo + 'H' + COLUNA.largura + 'V' + tela.altura + 'H0Z',
    preenche: CREME, traco: '#D8D8BE', espessura: 1,
  };
}

// --- 4c. a lista de alarmes ---------------------------------------------------
// O publish do ViewPoint nao leva o objeto AlarmList: a tela de alarmes sai
// vazia. O .gfx diz onde ele fica, e o .mal traz as 25 mensagens com a tag que
// dispara cada uma - entao a lista e alimentada pela logica emulada, e nao por
// um roteiro escrito a mao.

function listaDeAlarmes(vao) {
  return {
    t: 'listaAlarmes', id: vao.id, reconstruido: true,
    x: vao.x, y: vao.y, w: vao.w, h: vao.h,
  };
}

// --- 5. o que o MAIN mostra em cada linha de liquido --------------------------
// Print "TRATADORA DE SEMENTES": as caixas nao dizem "LIQUIDO 1", dizem o nome
// do produto da receita em processo - PONCHO, DEMACOR, LUMIALZA, POLIMERO. Sao
// as tags RecetaEnProceso.Nombre_Lx, que o CLP ja preenche.

const NOME_DA_LINHA = /^\s*LIQUIDO\s*([1-6])\s*$/;

// ---------------------------------------------------------------------------

function cadaElemento(tela, fn) {
  (function anda(lista, pai) {
    for (const e of lista) { fn(e, pai); if (e.filhos) anda(e.filhos, e); }
  })(tela.elementos, null);
}

// Remover so da lista de cima nao basta: quase todo botao esta dentro de um
// grupo, e o que sobra fica desenhado atras do substituto.
function remover(tela, alvos) {
  const fora = new Set(alvos);
  (function anda(lista) {
    for (let i = lista.length - 1; i >= 0; i--) {
      if (fora.has(lista[i])) { lista.splice(i, 1); continue; }
      if (lista[i].filhos) anda(lista[i].filhos);
    }
  })(tela.elementos);
}

function estadoDeRepouso(el) {
  return el.estados.find(s => s.id === '0')
    || el.estados.find(s => s.id !== 'Error')
    || el.estados[0];
}

function botaoDeNavegacao(molde, rotulo, destino, x, y, w, h) {
  return {
    t: 'botao', id: 'Trilho_' + destino.replace(/[^\w]/g, ''), modo: 'ir',
    x, y, w, h, forma: 'reto', esp: 3, destino,
    reconstruido: true,
    estados: [{
      id: '0', valor: 0, fundo: CINZA.fundo, claro: CINZA.claro, escuro: CINZA.escuro,
      legenda: {
        texto: rotulo, fonte: molde.fonte || 18.6662, cor: 'black',
        negrito: false, italico: false, alinha: 'middleCenter',
      },
    }],
  };
}

// A caixa vem do .gfx (posicao e tamanho); o resto, do print: fundo amarelo,
// borda fina, numero centralizado.
function campoNumerico(vao, c) {
  return {
    t: 'numero', id: vao.id, reconstruido: true,
    x: vao.x, y: vao.y, w: vao.w, h: vao.h,
    texto: '', fonte: 16, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: AMARELO, borda: '#707070', bordaEsp: 1,
    casas: c.casas, digitos: 7, completa: 'none',
    valor: 'v("' + c.tag + '")',
  };
}

function aplicar(telas) {
  const conta = { pele: 0, legenda: 0, trilho: 0, entrada: 0, produto: 0 };

  // os vaos que o publish deixou: posicao medida no binario .gfx
  let vaos = {};
  try {
    vaos = require('./_gfx-faltantes.json').telas || {};
  } catch (e) {
    console.warn('  aparencia: sem _gfx-faltantes.json, os campos de entrada '
      + 'descartados pelo publish nao entram. Rode o inventario-gfx.js.');
  }

  for (const nome of Object.keys(telas)) {
    const tela = telas[nome];

    // a coluna creme vai por baixo de tudo
    if (TELAS_COM_COLUNA.indexOf(nome) >= 0) {
      tela.elementos.unshift(colunaDaEsquerda(tela));
      conta.coluna = (conta.coluna || 0) + 1;
    }

    cadaElemento(tela, el => {
      // 1. a pele cinza do trilho
      if (el.t === 'botao' && el.modo === 'ir' && noTrilho(el, tela)) {
        for (const s of el.estados) {
          if (s.fundo === '#37A9E0' || s.fundo === '#ECB3BF') {
            s.fundo = CINZA.fundo; s.claro = CINZA.claro; s.escuro = CINZA.escuro;
            if (s.legenda) s.legenda.cor = 'black';
            conta.pele++;
          }
        }
      }

      // 3. as legendas em branco
      const tabela = LEGENDAS[nome];
      if (tabela && el.t === 'botao' && tabela[el.id]) {
        for (const s of el.estados) {
          if (s.legenda && !s.legenda.texto) { s.legenda.texto = tabela[el.id]; conta.legenda++; }
        }
      }

      // 5. o nome do produto no lugar de "LIQUIDO n"
      if (nome === 'MAIN' && el.t === 'texto') {
        const m = NOME_DA_LINHA.exec(el.texto || '');
        if (m) {
          // vira campo de texto vivo: o rotulo fixo passa a mostrar a tag
          el.t = 'cadeia';
          el.texto = '';
          el.borda = el.borda || 'none';
          el.bordaEsp = el.bordaEsp || 0;
          el.valor = 'v("MainProgram.RecetaEnProceso.Nombre_L' + m[1] + '")';
          el.reconstruido = true;
          conta.produto++;
        }
      }
    });

    // 2. os botoes que faltam no trilho
    if (nome === 'MAIN') {
      const antigos = [];
      cadaElemento(tela, el => {
        if (el.t === 'botao' && el.modo === 'ir' && noTrilho(el, tela)) antigos.push(el);
      });
      if (antigos.length) {
        const molde = estadoDeRepouso(antigos[0]).legenda;
        const w = antigos[0].w, h = antigos[0].h, x = antigos[0].x;
        const passo = 68, topo = 180;
        // remove os antigos e redesenha o trilho inteiro, na ordem do print
        remover(tela, antigos);
        TRILHO_MAIN.forEach((b, i) => {
          tela.elementos.push(botaoDeNavegacao(molde, b.rotulo, b.destino, x, topo + i * passo, w, h));
          conta.trilho++;
        });
      }
    }

    // PRE MISTURA entra no vao vazio das telas de processo
    if (nome === 'Balanza' || nome === 'Liquidos' || nome === 'Homogenizador') {
      const trilho = [];
      cadaElemento(tela, el => {
        if (el.t === 'botao' && el.modo === 'ir' && noTrilho(el, tela)) trilho.push(el);
      });
      const liq6 = trilho.find(e => {
        const s = estadoDeRepouso(e);
        return s && s.legenda && /LIQUIDO 6/.test(s.legenda.texto || '');
      });
      if (liq6) {
        const molde = estadoDeRepouso(liq6).legenda;
        tela.elementos.push(botaoDeNavegacao(
          molde, PRE_MISTURA.rotulo, PRE_MISTURA.destino,
          liq6.x, liq6.y + 72, liq6.w, liq6.h));
        conta.trilho++;
      }
    }

    // 4. os campos de entrada descartados pelo publish, no vao que o .gfx aponta
    if (ENTRADAS[nome] && vaos[nome]) {
      for (const vao of vaos[nome]) {
        const c = ENTRADAS[nome][vao.id];
        if (c) { tela.elementos.push(campoNumerico(vao, c)); conta.entrada++; }
      }
    }

    // 4c. a lista de alarmes, tambem no vao que o .gfx aponta
    if (vaos[nome]) {
      for (const vao of vaos[nome]) {
        if (vao.t === 'alarme' && /^AlarmList/.test(vao.id)) {
          tela.elementos.push(listaDeAlarmes(vao));
          conta.alarmes = (conta.alarmes || 0) + 1;
        }
      }
    }
  }

  return conta;
}

module.exports = { aplicar };
