// ---------------------------------------------------------------------------
// TELA "HISTORIA DE PESAGENS" - desenhada, nao extraida
// ---------------------------------------------------------------------------
// Duas colunas e dez linhas: o peso de cada uma das ultimas dez bateladas e o
// erro em relacao ao alvo. Do .gfx saem a posicao (colunas em x = 293 e 370,
// linhas em y = 153 a 513, passo 40) e as legendas.
//
// As tags saem do inventario da propria tela: Pesadas[00..09] e
// Error_Pesada[00..09]. Quem as preenche e o CLP, a cada batelada fechada.
// ---------------------------------------------------------------------------

'use strict';

// A MESMA logo das telas extraidas, na mesma caixa. Antes estas telas usavam
// outro arquivo, em 96x56: ao navegar, o cabecalho mudava de tamanho e de
// desenho de uma tela para a outra.
const LOGO = 'Logo-LS-Brasil-RGB_ff000080_ffffffff_T.png';

const LARGURA = 800, ALTURA = 600;
const CREME = '#EFEFD5';
const LINHAS = 10;
const Y0 = 153, PASSO = 40;
const COL = { rotulo: 250, peso: 293, erro: 370 };

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 11, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: false,
    alinha: o.alinha || 'middleCenter', fundo: o.fundo || null,
  };
}

function campo(id, x, y, w, h, expr, o) {
  o = o || {};
  return {
    t: 'numero', id: id, x: x, y: y, w: w, h: h,
    texto: '', fonte: o.fonte || 12, cor: 'black', negrito: false, italico: false,
    alinha: 'middleCenter', fundo: o.fundo || '#FFFFFF', borda: '#4A4A8A', bordaEsp: 1,
    casas: 1, digitos: 6, completa: 'none', valor: expr,
  };
}

function montar() {
  const el = [];

  el.push({
    t: 'forma', id: 'ColunaEsquerda',
    d: 'M0 45H88V' + ALTURA + 'H0Z', preenche: CREME, traco: '#D8D8BE', espessura: 1,
  });
  el.push({ t: 'imagem', id: 'Image7', x: 700, y: 0, w: 100, h: 60, arq: LOGO });

  el.push(texto('h-peso', COL.peso - 10, 118, 80, 26, 'Pesagens (Kg)', { fonte: 11 }));
  el.push(texto('h-erro', COL.erro, 118, 56, 26, 'Erro', { fonte: 11 }));

  for (let i = 0; i < LINHAS; i++) {
    const y = Y0 + i * PASSO;
    const ii = (i < 10 ? '0' : '') + i;          // o vetor e base zero
    el.push(texto('rot' + i, COL.rotulo, y, 34, 26, String(i + 1), { fonte: 12, alinha: 'middleRight' }));
    el.push(campo('peso' + i, COL.peso, y, 54, 26, 'v("MainProgram.Pesadas[' + ii + ']")'));
    el.push(campo('erro' + i, COL.erro, y, 55, 26, 'v("MainProgram.Error_Pesada[' + ii + ']")',
      { fundo: '#E8E8F4' }));
  }

  el.push({
    t: 'botao', id: 'ReturntoDisplayButton1', modo: 'ir', x: 720, y: 550, w: 80, h: 46,
    forma: 'reto', esp: 2, destino: 'Balanza',
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#8FCEED', escuro: '#1E8FC5',
      legenda: { texto: 'VOLTAR', fonte: 14, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });

  el.push(texto('Text-emerg', 4, 50, 80, 16, 'EMERGENCIA', {
    fonte: 9, cor: 'white', fundo: '#E02020', negrito: true,
  }));

  return {
    nome: 'Historia pesajes', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
