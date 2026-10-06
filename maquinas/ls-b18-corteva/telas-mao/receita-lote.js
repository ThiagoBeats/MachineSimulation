// ---------------------------------------------------------------------------
// TELA "RECEITA DO LOTE" (Receta en proceso) - desenhada, nao extraida
// ---------------------------------------------------------------------------
// Mostra a receita que esta rodando agora. E a irma da tela de Receituario: o
// mesmo quadro de seis linhas, mas sobre RecetaEnProceso em vez do receituario,
// e sem a lista de escolha.
//
// Do .gfx saem a posicao de cada controle e as legendas. O arranjo e regular:
// seis linhas em y = 161, 188, 215, 242, 269 e 297, com as colunas em x = 85,
// 260, 334, 412, 489 e 565.
//
// Um detalhe do projeto: ha seis campos em y = 638 a 774, ou seja ABAIXO dos
// 600 px da tela. Ficaram fora da area visivel na maquina tambem, entao nao
// entram aqui.
// ---------------------------------------------------------------------------

'use strict';

const LARGURA = 800, ALTURA = 600;
const CREME = '#EFEFD5';
const AMARELO = '#FFFF80';

const LINHAS = [161, 188, 215, 242, 269, 297];
const COL = { rotulo: 50, produto: 85, dose: 260, ordem: 334, atraso: 412, injecao: 489, aspersor: 565 };
const ALT = 22, LARG = 50;
const ROTULOS = ['L1', 'L2', 'L3', 'L4', 'L5', 'PM'];

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 11, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: false,
    alinha: o.alinha || 'middleCenter', fundo: o.fundo || null,
  };
}

function campo(id, x, y, w, h, expr, casas, fundo) {
  return {
    t: 'numero', id: id, x: x, y: y, w: w, h: h,
    texto: '', fonte: 11, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: fundo || AMARELO, borda: '#707070', bordaEsp: 1,
    casas: casas, digitos: 7, completa: 'none', valor: expr,
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

// O CLP copia a receita para RecetaEnProceso.RECETA.<membro> - COM o nivel do
// tipo. Lendo sem ele, todo numero sai zero: foi o que aconteceu na primeira
// versao desta tela. E a mesma convencao dos membros de AOI.
const R = m => 'v("MainProgram.RecetaEnProceso.RECETA.' + m + '")';

// Os NOMES sao a excecao: a rotina Gestion_Recetas copia dose, ordem, tempos e
// velocidades, mas nao os nomes - quem os escreve e a IHM. O XAML das telas
// publicadas os le no caminho curto, entao aqui tenta-se um e depois o outro.
const NOME = m =>
  '(v("MainProgram.RecetaEnProceso.RECETA.' + m + '") || v("MainProgram.RecetaEnProceso.' + m + '") || "")';

function montar() {
  const el = [];

  el.push({
    t: 'forma', id: 'ColunaEsquerda',
    d: 'M0 45H88V' + ALTURA + 'H0Z', preenche: CREME, traco: '#D8D8BE', espessura: 1,
  });

  el.push(texto('Text-titulo', 250, 10, 300, 30, 'RECEITA DO LOTE', { fonte: 19 }));
  el.push({ t: 'imagem', id: 'Image3', x: 700, y: 2, w: 96, h: 56, arq: 'ls - 753 x 294 px.jpg' });

  // a faixa com o nome da receita que esta rodando
  el.push({
    t: 'cadeia', id: 'StringDisplay1', x: 64, y: 58, w: 611, h: 27,
    texto: '', fonte: 15, cor: 'black', negrito: true, italico: false,
    alinha: 'middleCenter', fundo: '#D9D9D9', borda: '#9A9A9A', bordaEsp: 1,
    valor: R('Nombre'),
  });

  // --- cabecalho das colunas --------------------------------------------------
  el.push(texto('h-produto', COL.produto, 110, 148, 44, 'PRODUTO', { fonte: 11, negrito: true }));
  el.push(texto('h-dose', COL.dose - 8, 106, 66, 48, 'Dose\n(ml/100Kg)', { fonte: 9 }));
  el.push(texto('h-ordem', COL.ordem - 8, 106, 66, 48, 'Ordem de\ninjeção', { fonte: 9 }));
  el.push(texto('h-atraso', COL.atraso - 8, 106, 66, 48, 'Atraso de\ninjeção', { fonte: 9 }));
  el.push(texto('h-injecao', COL.injecao - 8, 106, 66, 48, 'Tempo de\nInjeção', { fonte: 9 }));
  el.push(texto('h-asp', COL.aspersor - 8, 106, 70, 48, 'Velocidade\nAspersor(%)', { fonte: 9 }));

  // --- as seis linhas ---------------------------------------------------------
  LINHAS.forEach(function (y, i) {
    const n = i + 1;
    el.push(texto('rot' + n, COL.rotulo, y, 30, ALT, ROTULOS[i], { fonte: 13, negrito: true }));
    el.push({
      t: 'cadeia', id: 'StringDisplay' + (i + 2), x: COL.produto, y: y, w: 148, h: ALT,
      texto: '', fonte: 11, cor: 'black', negrito: false, italico: false,
      alinha: 'middleCenter', fundo: '#FFFFFF', borda: '#707070', bordaEsp: 1,
      valor: NOME('Nombre_L' + n),
    });
    el.push(campo('dose' + n, COL.dose, y, LARG, ALT, R('Dosis_L' + n), 2));
    // a ordem o CLP calcula, entao e so leitura: fundo branco, nao amarelo
    el.push(campo('ordem' + n, COL.ordem, y, LARG, ALT, R('Orden_L' + n), 0, '#FFFFFF'));
    el.push(campo('atraso' + n, COL.atraso, y, LARG, ALT, R('T_demora_L' + n) + ' / 1000', 0));
    el.push(campo('injecao' + n, COL.injecao, y, LARG, ALT, R('T_inyeccion_L' + n) + ' / 1000', 0));
    el.push(campo('asp' + n, COL.aspersor, y, LARG, ALT, R('Vel_aspersor_L' + n), 0));
  });

  // --- homogenizador e descarga -----------------------------------------------
  el.push(texto('rot-homog', 130, 358, 200, 24, 'Homogenizador', { fonte: 14, alinha: 'middleRight' }));
  el.push(campo('homog-pct', 338, 364, LARG, ALT, R('Vel_homogenizado'), 0));
  el.push(texto('u-homog-pct', 390, 365, 26, 20, '(%)', { fonte: 10 }));
  el.push(campo('homog-s', 423, 364, LARG, ALT, R('T_homogenizado') + ' / 1000', 0));
  el.push(texto('u-homog-s', 475, 365, 26, 20, '(s)', { fonte: 10 }));

  el.push(texto('rot-desc', 130, 407, 200, 24, 'Descarga', { fonte: 14, alinha: 'middleRight' }));
  el.push(campo('desc-pct', 338, 413, LARG, ALT, R('Vel_descarga'), 0));
  el.push(texto('u-desc-pct', 390, 414, 26, 20, '(%)', { fonte: 10 }));
  el.push(campo('desc-s', 423, 413, LARG, ALT, R('T_descarga') + ' / 1000', 0));
  el.push(texto('u-desc-s', 475, 414, 26, 20, '(s)', { fonte: 10 }));

  // --- trilho -----------------------------------------------------------------
  el.push(navegar('GotoDisplayButton1', 720, 500, 80, 46, 'RECEITAS', 'Recetario'));
  el.push(navegar('GotoDisplayButton2', 720, 550, 80, 46, '', 'MAIN'));
  el.push({ t: 'imagem', id: 'icone-home', x: 742, y: 558, w: 36, h: 30, arq: 'Home01.png' });

  el.push(texto('Text-emerg', 4, 50, 80, 16, 'EMERGENCIA', {
    fonte: 9, cor: 'white', fundo: '#E02020', negrito: true,
  }));

  return {
    nome: 'Receta en proceso', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
