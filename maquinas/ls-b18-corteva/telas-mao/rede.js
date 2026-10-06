// ---------------------------------------------------------------------------
// TELA "ARQUITETURA DE REDE" - desenhada, nao extraida
// ---------------------------------------------------------------------------
// Uma tabela de catorze dispositivos da rede EtherNet/IP: nome, endereco e
// estado da conexao. E a tela de diagnostico que o tecnico abre quando a
// maquina reclama de comunicacao.
//
// Do .gfx vem tudo:
//
//   - a geometria (painel de 631x30 por linha, de y=139 a y=530, passo 30;
//     nome em x=73, IP em x=291, estado em x=506);
//   - as legendas, do fluxo ls00002c0a - os catorze nomes e os catorze IPs,
//     na ordem em que os objetos aparecem;
//   - a expressao de cada estado, do fluxo Contents:
//       If {::[B18_CORTEVA]PU1_19:I.ConnectionFaulted}
//         then "Falha de comunicacao" else "Comunicacao OK"
//
// DUAS ARMADILHAS NOS NOMES DAS TAGS, as duas do projeto:
//
//   - o rotulo da primeira linha e TR_03 mas a tag e TR_3, sem o zero;
//   - o sufixo do modulo alterna entre ":I." e ":I1." sem regra visivel -
//     PU1_2 e ":I", PU1_3 e ":I1". Montar o caminho por formula daria sete
//     linhas mudas.
//
// Por isso a tabela abaixo traz o caminho inteiro de cada um, copiado do
// .gfx, em vez de derivar o caminho do nome.
// ---------------------------------------------------------------------------

'use strict';

const LARGURA = 800, ALTURA = 600;
const Y0 = 139, PASSO = 30, ALT = 30;
const COL = { nome: 73, ip: 291, estado: 506 };

// nome na tela, endereco, caminho da tag - os tres lidos do .gfx
const APARELHOS = [
  ['TR_03', '192.168.1.140', 'TR_3:I.ConnectionFaulted'],
  ['TR_04', '192.168.1.141', 'TR_04:I.ConnectionFaulted'],
  ['TR_05', '192.168.1.142', 'TR_05:I.ConnectionFaulted'],
  ['TR_06', '192.168.1.143', 'TR_06:I.ConnectionFaulted'],
  ['PU1_2', '192.168.1.144', 'PU1_2:I.ConnectionFaulted'],
  ['PU1_3', '192.168.1.145', 'PU1_3:I1.ConnectionFaulted'],
  ['PU1_5', '192.168.1.146', 'PU1_5:I.ConnectionFaulted'],
  ['PU1_7', '192.168.1.147', 'PU1_7:I.ConnectionFaulted'],
  ['PU1_8', '192.168.1.148', 'PU1_8:I1.ConnectionFaulted'],
  ['PU1_13', '192.168.1.151', 'PU1_13:I1.ConnectionFaulted'],
  ['PU1_15', '192.168.1.152', 'PU1_15:I.ConnectionFaulted'],
  ['PU1_17', '192.168.1.153', 'PU1_17:I.ConnectionFaulted'],
  ['PU1_19', '192.168.1.155', 'PU1_19:I.ConnectionFaulted'],
  ['PU1_20', '192.168.1.156', 'PU1_20:I1.ConnectionFaulted'],
];

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 11, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: false,
    alinha: o.alinha || 'middleLeft', fundo: o.fundo || null,
  };
}

function montar() {
  const el = [];

  el.push({
    t: 'forma', id: 'Polygon2',
    d: 'M0 0H' + LARGURA + 'V60H0Z', preenche: '#D4D0C8', traco: '#A0A0A0', espessura: 1,
  });
  el.push({ t: 'imagem', id: 'Image7', x: 700, y: 2, w: 96, h: 56, arq: 'ls - 753 x 294 px.jpg' });
  el.push(texto('Text9', 258, 14, 285, 31, 'ARQUITETURA DE REDE',
    { fonte: 18, negrito: true, alinha: 'middleCenter' }));
  el.push(texto('Text2', 10, 19, 74, 15, 'EMERGENCIA', {
    fonte: 9, cor: 'white', fundo: '#E02020', negrito: true, alinha: 'middleCenter',
  }));
  el.push({
    t: 'forma', id: 'Polygon3',
    d: 'M710 60H800V600H710Z', preenche: '#D4D0C8', traco: '#A0A0A0', espessura: 1,
  });

  // --- cabecalho das colunas -------------------------------------------------
  el.push(texto('Text1', COL.nome, 97, 60, 18, 'NOME', { fonte: 11, negrito: true }));
  el.push(texto('Text3', COL.ip, 96, 40, 18, 'IP', { fonte: 11, negrito: true }));
  el.push(texto('Text4', COL.estado + 47, 98, 60, 18, 'STATUS', { fonte: 11, negrito: true }));

  // --- as catorze linhas -----------------------------------------------------
  APARELHOS.forEach(function (a, i) {
    const y = Y0 + i * PASSO;
    const nome = a[0], ip = a[1], tag = a[2];

    el.push({
      t: 'forma', id: 'Panel' + (i + 1),
      d: 'M40 ' + y + 'H671V' + (y + ALT) + 'H40Z',
      preenche: i % 2 ? '#F4F4F0' : '#FFFFFF', traco: '#B0B0B0', espessura: 1,
    });
    el.push(texto('nome' + i, COL.nome, y + 6, 60, 18, nome, { fonte: 11, negrito: true }));
    el.push(texto('ip' + i, COL.ip, y + 6, 93, 18, ip, { fonte: 11 }));

    // O estado e um display de cadeia, nao uma luz: o projeto escreve a frase
    // inteira na tela. Vermelho quando falha, para o tecnico achar a linha de
    // longe - isso sim e meu, o projeto deixa tudo preto.
    el.push({
      t: 'cadeia', id: 'StringDisplay' + (i + 1), x: COL.estado, y: y + 3, w: 148, h: 27,
      texto: '', fonte: 10, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: null, borda: null, bordaEsp: 0,
      valor: 'v("' + tag + '") ? "Falha de comunicação" : "Comunicação OK"',
      animaCor: {
        expr: 'v("' + tag + '") ? 1 : 0',
        itens: [
          { valor: 0, frente: '#107010', fundo: null, piscaFrente: null, piscaFundo: null },
          { valor: 1, frente: '#C00000', fundo: null, piscaFrente: null, piscaFundo: null },
        ],
      },
    });
  });

  el.push({
    t: 'botao', id: 'GotoDisplayButton1', modo: 'ir', x: 720, y: 550, w: 80, h: 46,
    forma: 'reto', esp: 3, destino: 'MAIN',
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: { texto: '', fonte: 11, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
  el.push({ t: 'imagem', id: 'Image8', x: 744, y: 557, w: 32, h: 32, arq: 'Home01.png' });

  return {
    nome: 'ArquiteturaDeRede', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
