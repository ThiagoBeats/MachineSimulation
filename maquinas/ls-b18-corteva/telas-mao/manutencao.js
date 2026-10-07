// ---------------------------------------------------------------------------
// TELA "MANUTENÇÃO" - desenhada, nao extraida
// ---------------------------------------------------------------------------
// Esta tela nao fala com o CLP. Os seis botoes de cima sao do runtime do
// FactoryTalk - cadastro de usuarios do terminal -, os dois do meio levam ao
// modo de configuracao e ao desligamento do painel. Nenhum deles tem tag.
//
// Do .gfx vem a geometria (tres colunas em x = 145, 300 e 455; linhas em
// y = 160, 254, 389 e 495; botoes de 120x50) e as legendas, do fluxo
// ls00002c0a, que casam uma a uma com os nomes dos objetos:
//
//   AddUserGroupButton2          -> "Adicionar usuário"
//   DeleteUserGroupButton3       -> "Deletar usuário"
//   EnableUserButton4            -> "Habilitar usuário"
//   DisableUserButton5           -> "Desabilitar usuário"
//   ChangeUserPropertiesButton6  -> "Alterar propriedades do usuário"
//   UnlockUserButton1            -> "Desbloquear usuário"
//   GotoConfigureModeButton7     -> "Modo de configuração"
//   ShutdownButton1              -> "Desligar"
//   GotoDisplayButton2           -> "Arquitetura de rede"
//
// O QUE ESTES BOTOES FAZEM AQUI: nada, de proposito. Eles mexem no terminal
// PanelView de verdade - criam conta, desligam o painel, saem do runtime - e
// nao ha terminal nenhum atras desta simulacao. Fingir que funcionam seria
// pior do que deixa-los quietos, entao ficam desenhados e inertes, com o
// aviso embaixo dizendo por que. So "Arquitetura de rede" navega, porque
// navegar e a unica coisa que esta simulacao sabe fazer de verdade.
// ---------------------------------------------------------------------------

'use strict';

// A MESMA logo das telas extraidas, na mesma caixa. Antes estas telas usavam
// outro arquivo, em 96x56: ao navegar, o cabecalho mudava de tamanho e de
// desenho de uma tela para a outra.
const LOGO = 'Logo-LS-Brasil-RGB_ff000080_ffffffff_T.png';

const LARGURA = 800, ALTURA = 600;
const LARG = 120, ALT = 50;
const COLS = [145, 300, 455];

// nome do objeto, coluna, linha (y), legenda
const BOTOES = [
  ['AddUserGroupButton2', 0, 160, 'Adicionar\nusuário'],
  ['DeleteUserGroupButton3', 1, 160, 'Deletar\nusuário'],
  ['EnableUserButton4', 2, 160, 'Habilitar\nusuário'],
  ['DisableUserButton5', 0, 254, 'Desabilitar\nusuário'],
  ['ChangeUserPropertiesButton6', 1, 254, 'Alterar propriedades\ndo usuário'],
  ['UnlockUserButton1', 2, 254, 'Desbloquear\nusuário'],
  ['GotoConfigureModeButton7', 0, 389, 'Modo de\nconfiguração'],
  ['ShutdownButton1', 2, 389, 'Desligar'],
];

function texto(id, x, y, w, h, t, o) {
  o = o || {};
  return {
    t: 'texto', id: id, x: x, y: y, w: w, h: h, texto: t,
    fonte: o.fonte || 11, cor: o.cor || 'black',
    negrito: !!o.negrito, italico: !!o.italico,
    alinha: o.alinha || 'middleCenter', fundo: o.fundo || null,
  };
}

// Um botao sem nenhum comportamento: desenhado, legivel, e nao faz nada.
// Nao e um botao quebrado - e um botao do terminal, que nao existe aqui.
function inerte(id, x, y, rotulo) {
  return {
    t: 'botao', id: id, modo: 'mantido', x: x, y: y, w: LARG, h: ALT,
    forma: 'reto', esp: 3,
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#FFFFFF', escuro: '#808080',
      legenda: {
        texto: rotulo, fonte: 10, cor: '#505050',
        negrito: false, italico: false, alinha: 'middleCenter',
      },
    }],
  };
}

function montar() {
  const el = [];

  el.push({
    t: 'forma', id: 'Polygon2',
    d: 'M0 0H' + LARGURA + 'V60H0Z', preenche: '#D4D0C8', traco: '#A0A0A0', espessura: 1,
  });
  el.push({ t: 'imagem', id: 'Image7', x: 700, y: 0, w: 100, h: 60, arq: LOGO });
  el.push(texto('Text9', 316, 14, 168, 31, 'MANUTENÇÃO', { fonte: 18, negrito: true }));
  el.push(texto('Text2', 10, 19, 74, 15, 'EMERGENCIA', {
    fonte: 9, cor: 'white', fundo: '#E02020', negrito: true,
  }));
  el.push({
    t: 'forma', id: 'Polygon3',
    d: 'M710 60H800V600H710Z', preenche: '#D4D0C8', traco: '#A0A0A0', espessura: 1,
  });

  // --- a moldura do bloco de usuarios ---------------------------------------
  el.push({
    t: 'forma', id: 'Group1',
    d: 'M130 145H590V320H130Z', preenche: '#F4F4F0', traco: '#C0C0C0', espessura: 1,
  });
  el.push(texto('rot-usuarios', 130, 120, 460, 20, 'Usuários do terminal',
    { fonte: 11, negrito: true }));

  BOTOES.forEach(function (b) {
    el.push(inerte(b[0], COLS[b[1]], b[2], b[3]));
  });

  // --- o unico botao que faz algo -------------------------------------------
  el.push({
    t: 'botao', id: 'GotoDisplayButton2', modo: 'ir', x: 145, y: 495, w: LARG, h: ALT,
    forma: 'reto', esp: 2, destino: 'ArquiteturaDeRede',
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#8FCEED', escuro: '#1E8FC5',
      legenda: {
        texto: 'Arquitetura\nde rede', fonte: 10, cor: 'black',
        negrito: false, italico: false, alinha: 'middleCenter',
      },
    }],
  });

  el.push(texto('aviso', 130, 340, 460, 34,
    'Os botões acima pertencem ao terminal PanelView e não têm efeito na simulação.',
    { fonte: 9, cor: '#707070', italico: true }));

  el.push({
    t: 'botao', id: 'GotoDisplayButton1', modo: 'ir', x: 720, y: 550, w: 80, h: 46,
    forma: 'reto', esp: 2, destino: 'MAIN',
    estados: [{
      id: '0', valor: 0, fundo: '#D4D0C8', claro: '#8FCEED', escuro: '#1E8FC5',
      legenda: { texto: '', fonte: 14, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' },
    }],
  });
  el.push({ t: 'imagem', id: 'Image8', x: 744, y: 557, w: 32, h: 32, arq: 'Home01.png' });

  return {
    nome: 'Manutencao', largura: LARGURA, altura: ALTURA,
    fundo: '#FFFFFF', elementos: el,
  };
}

module.exports = { montar: montar, quantas: 1 };
