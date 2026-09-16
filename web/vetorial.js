// ---------------------------------------------------------------------------
// MOTOR DAS TELAS VETORIAIS
// ---------------------------------------------------------------------------
// Desenha em SVG as telas extraidas de um projeto FactoryTalk View ME e as
// mantem vivas: cada elemento que tem ligacao com o CLP e reavaliado a cada
// varredura, do mesmo jeito que a IHM de verdade faz.
//
// Nao ha CLP nem rede aqui. O estado mora em memoria, a logica emulada roda em
// logica.js e o resultado e desenhado. Nada sai do navegador.
// ---------------------------------------------------------------------------
(function (raiz) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  // O FactoryTalk View desenha em Tahoma, que e visivelmente mais estreita que
  // a Arial nas maiusculas. Com Arial, titulos como "TRATADORA DE SEMENTES"
  // estouram a caixa e quebram em duas linhas, o que na maquina nao acontece.
  var FONTE = 'Tahoma, Verdana, "Segoe UI", Arial, sans-serif';
  var PERIODO = 200;                        // ms entre varreduras

  // --- estado --------------------------------------------------------------
  var valores = {};
  var ouvintes = [];

  function ler(caminho) {
    var v = valores[caminho];
    return v === undefined ? 0 : v;
  }

  function escrever(caminho, valor) {
    if (valores[caminho] === valor) return false;
    valores[caminho] = valor;
    return true;
  }

  // --- avaliacao das expressoes --------------------------------------------
  // As expressoes ja vieram compiladas em funcoes pelo build. Se uma delas
  // estourar (tag que nao existe, divisao esquisita), o elemento so nao anima
  // - a tela inteira nao pode cair por causa de um campo.
  function avaliar(fn, padrao) {
    if (!fn) return padrao;
    try {
      var v = fn(ler);
      if (v === true) return 1;
      if (v === false) return 0;
      if (typeof v === 'number' && !isFinite(v)) return padrao;
      return v === undefined || v === null ? padrao : v;
    } catch (e) {
      return padrao;
    }
  }

  // --- desenho --------------------------------------------------------------
  function criar(tag, atributos) {
    var n = document.createElementNS(NS, tag);
    for (var k in atributos) {
      if (atributos[k] !== null && atributos[k] !== undefined) n.setAttribute(k, atributos[k]);
    }
    return n;
  }

  function ancora(alinha) {
    if (/Left$/.test(alinha || '')) return 'start';
    if (/Right$/.test(alinha || '')) return 'end';
    return 'middle';
  }

  function textoX(alinha, x, w) {
    if (/Left$/.test(alinha || '')) return x + 3;
    if (/Right$/.test(alinha || '')) return x + w - 3;
    return x + w / 2;
  }

  function textoY(alinha, y, h, fonte, linhas) {
    var altura = fonte * 1.15 * (linhas - 1);
    if (/^top/.test(alinha || '')) return y + fonte;
    if (/^bottom/.test(alinha || '')) return y + h - 3 - altura;
    return y + h / 2 + fonte * 0.35 - altura / 2;
  }

  // O SVG nao quebra linha sozinho, e as legendas dos botoes do projeto sao
  // quase todas maiores que o botao. Medimos com um canvas fora da tela, que
  // funciona mesmo com o SVG ainda desmontado - getComputedTextLength() so
  // responde depois que o no esta no documento, e ai ja seria tarde.
  var medidor = null;
  function larguraDe(texto, fonte, negrito) {
    if (!medidor) medidor = document.createElement('canvas').getContext('2d');
    medidor.font = (negrito ? 'bold ' : '') + fonte + 'px ' + FONTE;
    return medidor.measureText(texto).width;
  }

  function quebrar(texto, largura, est) {
    var linhas = [];
    var partes = String(texto === null || texto === undefined ? '' : texto).split(/\r?\n/);
    for (var i = 0; i < partes.length; i++) {
      var palavras = partes[i].split(' ');
      var atual = '';
      for (var j = 0; j < palavras.length; j++) {
        var tentativa = atual ? atual + ' ' + palavras[j] : palavras[j];
        if (atual && larguraDe(tentativa, est.fonte, est.negrito) > largura) {
          linhas.push(atual);
          atual = palavras[j];
        } else {
          atual = tentativa;
        }
      }
      linhas.push(atual);
    }
    return linhas;
  }

  // Desenha uma legenda de varias linhas e devolve os <text> criados, para
  // quem precisar trocar o texto depois.
  function legenda(pai, texto, x, y, w, h, est, semQuebra) {
    var linhas = semQuebra
      ? String(texto === null || texto === undefined ? '' : texto).split(/\r?\n/)
      : quebrar(texto, w - 6, est);
    var base = textoY(est.alinha, y, h, est.fonte, linhas.length);
    var nos = [];
    for (var i = 0; i < linhas.length; i++) {
      var t = criar('text', {
        x: textoX(est.alinha, x, w),
        y: base + i * est.fonte * 1.15,
        'text-anchor': ancora(est.alinha),
        'font-family': FONTE,
        'font-size': est.fonte,
        'font-weight': est.negrito ? 'bold' : 'normal',
        'font-style': est.italico ? 'italic' : 'normal',
        fill: est.cor || 'black'
      });
      t.textContent = linhas[i];
      pai.appendChild(t);
      nos.push(t);
    }
    return nos;
  }

  function formatarNumero(v, el) {
    var n = Number(v);
    if (!isFinite(n)) n = 0;
    var s = n.toFixed(el.casas || 0);
    if (el.completa === 'zeros') {
      var neg = s.charAt(0) === '-';
      if (neg) s = s.slice(1);
      var alvo = (el.digitos || 0) + (el.casas ? el.casas + 1 : 0);
      while (s.length < alvo) s = '0' + s;
      if (neg) s = '-' + s;
    }
    return s;
  }

  // --- monta uma tela --------------------------------------------------------
  // Devolve { svg, animados } onde animados e a lista do que precisa ser
  // reavaliado a cada varredura.
  // --- faixa de cabecalho -------------------------------------------------------
  // Na maquina real ela e um display ancorado, sempre por cima de qualquer tela,
  // com o operador logado e o relogio. Nao sai no XAML publicado, que traz so o
  // conteudo de cada tela - por isso e desenhada aqui, e nao vem dos dados.

  var CAB = { altura: 72, painel: 258, painelAltura: 56 };

  function doisDigitos(n) { return (n < 10 ? '0' : '') + n; }

  function agora() {
    var d = new Date();
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' '
      + doisDigitos(d.getHours()) + ':' + doisDigitos(d.getMinutes()) + ':' + doisDigitos(d.getSeconds());
  }

  function montarCabecalho(svg, tela, cfg, animados) {
    var g = criar('g', { class: 'cabecalho' });
    var id = 'grad-cab';

    var defs = criar('defs', {});
    var grad = criar('linearGradient', { id: id, x1: '0', y1: '0', x2: '0', y2: '1' });
    [['0', '#FCFCFC'], ['0.45', '#EFEFEF'], ['1', '#DCDCDC']].forEach(function (p) {
      grad.appendChild(criar('stop', { offset: p[0], 'stop-color': p[1] }));
    });
    defs.appendChild(grad);
    g.appendChild(defs);

    g.appendChild(criar('rect', { x: 0, y: 0, width: tela.largura, height: CAB.altura, fill: 'url(#' + id + ')' }));
    g.appendChild(criar('line', {
      x1: 0, y1: CAB.altura, x2: tela.largura, y2: CAB.altura,
      stroke: '#B4B4B4', 'stroke-width': 1
    }));

    // o quadro do operador, em relevo, no canto esquerdo
    g.appendChild(criar('rect', {
      x: 0, y: 0, width: CAB.painel, height: CAB.painelAltura,
      fill: '#F4F4F4', stroke: '#BDBDBD', 'stroke-width': 1
    }));
    g.appendChild(criar('path', {
      d: 'M0 ' + CAB.painelAltura + 'H' + CAB.painel + 'V0',
      fill: 'none', stroke: '#9E9E9E', 'stroke-width': 1
    }));

    var est = { fonte: 13, cor: '#1A1A1A', negrito: false, italico: false, alinha: 'middleLeft' };
    legenda(g, cfg.operador || 'Operador', 9, 2, CAB.painel - 18, 26, est, true);

    var relogio = criar('g', {});
    g.appendChild(relogio);
    function pintarRelogio() {
      while (relogio.firstChild) relogio.removeChild(relogio.firstChild);
      legenda(relogio, agora(), 9, 26, CAB.painel - 18, 26, est, true);
    }
    pintarRelogio();
    animados.push({ tipo: 'relogio', pintar: pintarRelogio });

    svg.appendChild(g);
  }

  function montarTela(tela, ctx) {
    var svg = criar('svg', {
      xmlns: NS,
      viewBox: '0 0 ' + tela.largura + ' ' + tela.altura,
      width: '100%', height: '100%'
    });
    svg.appendChild(criar('rect', { width: tela.largura, height: tela.altura, fill: tela.fundo || '#FFFFFF' }));

    var animados = [];
    if (ctx.cabecalho) montarCabecalho(svg, tela, ctx.cabecalho, animados);

    function registrar(no, el, extra) {
      if (el.visivel) animados.push({ tipo: 'visivel', no: no, fn: el.visivel.expr, quando: el.visivel.quando });
      if (el.animaCor) animados.push({ tipo: 'cor', no: no, fn: el.animaCor.expr,
        itens: el.animaCor.itens, modo: el.animaCor.modo, el: el });
      if (extra) animados.push(extra);
    }

    function desenhar(el, pai) {
      var no;
      switch (el.t) {
        case 'grupo':
          no = criar('g', {});
          pai.appendChild(no);
          for (var i = 0; i < el.filhos.length; i++) desenhar(el.filhos[i], no);
          break;

        case 'forma':
          no = criar('path', {
            d: el.d,
            fill: el.preenche || 'none',
            stroke: el.traco || 'none',
            'stroke-width': el.espessura,
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round'
          });
          pai.appendChild(no);
          break;

        case 'texto':
          no = criar('g', {});
          pai.appendChild(no);
          if (el.fundo) no.appendChild(criar('rect', { x: el.x, y: el.y, width: el.w, height: el.h, fill: el.fundo }));
          // Objeto de texto do FactoryTalk nao quebra linha sozinho: o autor
          // digita as linhas. Quebrar por conta propria desalinha rotulo de
          // campo e faz titulo virar duas linhas.
          legenda(no, el.texto, el.x, el.y, el.w, el.h, el, true);
          break;

        case 'numero':
        case 'cadeia': {
          no = criar('g', {});
          pai.appendChild(no);
          var caixa = criar('rect', {
            x: el.x, y: el.y, width: el.w, height: el.h,
            fill: el.fundo || 'none',
            stroke: el.borda || 'none',
            'stroke-width': el.bordaEsp
          });
          no.appendChild(caixa);
          // Campo de valor nao quebra linha: e sempre uma linha so.
          var alvo = legenda(no, '', el.x, el.y, el.w, el.h, el, true)[0];
          registrar(no, el, {
            tipo: 'mostrar', no: alvo, caixa: caixa, fn: el.valor, el: el
          });
          return;
        }

        case 'listaAlarmes': {
          no = montarListaAlarmes(el, ctx, animados);
          pai.appendChild(no);
          break;
        }

        case 'imagem':
          if (!el.arq) return;
          no = criar('image', {
            x: el.x, y: el.y, width: el.w, height: el.h,
            preserveAspectRatio: 'none',
            href: ctx.pasta + 'imagens/' + el.arq
          });
          no.setAttributeNS('http://www.w3.org/1999/xlink', 'href', ctx.pasta + 'imagens/' + el.arq);
          pai.appendChild(no);
          break;

        case 'barra': {
          no = criar('g', {});
          pai.appendChild(no);
          no.appendChild(criar('rect', { x: el.x, y: el.y, width: el.w, height: el.h, fill: el.fundo, stroke: '#888' }));
          var cheio = criar('rect', { x: el.x, y: el.y + el.h, width: el.w, height: 0, fill: el.cheio });
          no.appendChild(cheio);
          registrar(no, el, { tipo: 'barra', no: cheio, fn: el.valor, el: el });
          return;
        }

        case 'botao':
          no = montarBotao(el, ctx, animados);
          pai.appendChild(no);
          break;

        default:
          return;
      }

      if (el.transforma) no.setAttribute('transform', el.transforma);
      if (el.oculto) no.setAttribute('visibility', 'hidden');
      registrar(no, el, null);
    }

    for (var i = 0; i < tela.elementos.length; i++) desenhar(tela.elementos[i], svg);
    return { svg: svg, animados: animados };
  }

  // --- lista de alarmes ---------------------------------------------------------
  // O objeto AlarmList nao sai no publish do ViewPoint: a tela de alarmes vem
  // vazia. Ele e redesenhado aqui, e alimentado pela tabela do .mal - 25
  // mensagens, cada uma com a tag do CLP que a dispara. Entao a lista e de
  // verdade: quem escreve nela e a logica emulada, nao um roteiro.

  var ALT_LINHA = 15, ALT_CABECALHO = 17;

  function montarListaAlarmes(el, ctx, animados) {
    var tabela = (ctx.alarmes && ctx.alarmes.alarmes) || [];
    var g = criar('g', {});

    g.appendChild(criar('rect', {
      x: el.x, y: el.y, width: el.w, height: el.h,
      fill: '#FFFFFF', stroke: '#FF0000', 'stroke-width': 2
    }));
    g.appendChild(criar('rect', {
      x: el.x + 2, y: el.y + 2, width: el.w - 4, height: ALT_CABECALHO,
      fill: '#D4D0C8', stroke: '#9A9A9A', 'stroke-width': 1
    }));

    var estilo = { fonte: 11, cor: 'black', negrito: false, italico: false, alinha: 'middleLeft' };
    legenda(g, 'Data/hora', el.x + 6, el.y + 2, 150, ALT_CABECALHO, estilo, true);
    legenda(g, 'Descrição', el.x + 132, el.y + 2, 400, ALT_CABECALHO, estilo, true);

    var corpo = criar('g', {});
    g.appendChild(corpo);

    // o registro: uma linha por disparo, com a hora em que aconteceu
    var registro = [];
    var antes = {};

    function carimbo() {
      var d = new Date();
      return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' '
        + doisDigitos(d.getHours()) + ':' + doisDigitos(d.getMinutes()) + ':' + doisDigitos(d.getSeconds());
    }

    // Quase toda tag de alarme e uma falha: vale 1 quando o alarme esta de pe.
    // A excecao e o permissivo - PE, a parada de emergencia - que e o
    // contrario: vale 1 enquanto esta TUDO BEM, e cair para 0 e que e o
    // alarme. Sem esta distincao a maquina abre com EMERGENCIA na lista.
    function estaDePe(tag) {
      var v = !!ler('MainProgram.' + tag) || !!ler(tag);
      return /^Falla/i.test(tag) ? v : !v;
    }

    function varrerAlarmes() {
      var mudou = false;
      for (var i = 0; i < tabela.length; i++) {
        var a = tabela[i];
        if (!a.tag) continue;
        var v = estaDePe(a.tag);
        if (v && !antes[a.tag]) {
          registro.unshift({ quando: carimbo(), texto: a.texto, tag: a.tag, ativo: true });
          if (registro.length > 60) registro.pop();
          mudou = true;
        } else if (!v && antes[a.tag]) {
          for (var k = 0; k < registro.length; k++) {
            if (registro[k].tag === a.tag && registro[k].ativo) { registro[k].ativo = false; mudou = true; break; }
          }
        }
        antes[a.tag] = v;
      }
      if (mudou) pintar();
    }

    function pintar() {
      while (corpo.firstChild) corpo.removeChild(corpo.firstChild);
      var cabem = Math.floor((el.h - ALT_CABECALHO - 6) / ALT_LINHA);
      for (var i = 0; i < registro.length && i < cabem; i++) {
        var r = registro[i];
        var y = el.y + 2 + ALT_CABECALHO + i * ALT_LINHA;
        // vermelho enquanto o alarme esta de pe; azul depois que normalizou,
        // como no painel da maquina
        corpo.appendChild(criar('rect', {
          x: el.x + 2, y: y, width: el.w - 4, height: ALT_LINHA,
          fill: r.ativo ? '#FF0000' : '#000080'
        }));
        var est = { fonte: 11, cor: '#FFFFFF', negrito: false, italico: false, alinha: 'middleLeft' };
        legenda(corpo, r.quando, el.x + 6, y, 150, ALT_LINHA, est, true);
        legenda(corpo, r.texto, el.x + 132, y, el.w - 140, ALT_LINHA, est, true);
      }
    }

    animados.push({ tipo: 'alarmes', varrer: varrerAlarmes });
    varrerAlarmes();
    return g;
  }

  // --- botoes ------------------------------------------------------------------
  function montarBotao(el, ctx, animados) {
    var g = criar('g', { class: 'botao' });
    var est = el.estados[0] || {};
    var raioX = el.forma === 'redondo' ? Math.min(el.w, el.h) / 2 : 0;

    var fundo = criar('rect', {
      x: el.x, y: el.y, width: el.w, height: el.h, rx: raioX,
      fill: est.fundo, stroke: est.escuro, 'stroke-width': el.esp
    });
    var luz = criar('path', {
      d: 'M' + (el.x + el.esp / 2) + ' ' + (el.y + el.h - el.esp / 2)
        + 'V' + (el.y + el.esp / 2) + 'H' + (el.x + el.w - el.esp / 2),
      fill: 'none', stroke: est.claro, 'stroke-width': el.esp
    });
    g.appendChild(fundo);
    g.appendChild(luz);

    // O icone fica entre o fundo e a legenda, com uma folga para nao encostar
    // na borda em relevo.
    if (el.icone) {
      var folga = el.esp + 3;
      var img = criar('image', {
        x: el.x + folga, y: el.y + folga,
        width: Math.max(1, el.w - folga * 2), height: Math.max(1, el.h - folga * 2),
        preserveAspectRatio: el.icone.esticado ? 'xMidYMid meet' : 'xMidYMid slice',
        href: ctx.pasta + 'imagens/' + el.icone.arq
      });
      img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', ctx.pasta + 'imagens/' + el.icone.arq);
      g.appendChild(img);
    }

    var texto = criar('g', {});
    g.appendChild(texto);

    // A legenda de um botao nao pode transbordar a caixa: na maquina o autor
    // escolheu um corpo que coubesse, e as caixas pequenas do .mer publicado
    // guardam legendas de duas palavras. Entao encolhe ate caber, em vez de
    // deixar a letra escapar por cima do botao vizinho.
    function corpoQueCabe(estilo, linhas, largura) {
      var corpo = estilo.fonte;
      for (var i = 0; i < 14 && corpo > 7; i++) {
        var maior = 0;
        for (var k = 0; k < linhas.length; k++) {
          maior = Math.max(maior, larguraDe(linhas[k], corpo, estilo.negrito));
        }
        if (maior <= largura) break;
        corpo -= 1;
      }
      return corpo;
    }

    function pintar(estado) {
      if (!estado) return;
      fundo.setAttribute('fill', estado.fundo);
      fundo.setAttribute('stroke', estado.escuro);
      luz.setAttribute('stroke', estado.claro);
      while (texto.firstChild) texto.removeChild(texto.firstChild);
      var linhas = String(estado.legenda.texto || '').split(/\r?\n/);
      var estilo = estado.legenda;
      var corpo = corpoQueCabe(estilo, linhas, el.w - el.esp * 2 - 6);
      if (corpo !== estilo.fonte) {
        estilo = Object.assign({}, estilo, { fonte: corpo });
      }
      legenda(texto, estado.legenda.texto, el.x, el.y, el.w, el.h, estilo, true);
    }

    // estado em repouso: o "0", ou o primeiro que nao seja o de erro
    var repouso = null;
    for (var i = 0; i < el.estados.length; i++) {
      if (el.estados[i].id === '0') { repouso = el.estados[i]; break; }
      if (!repouso && el.estados[i].id !== 'Error') repouso = el.estados[i];
    }
    pintar(repouso || est);

    // area de toque transparente por cima, para o clique pegar a caixa inteira
    var toque = criar('rect', {
      x: el.x, y: el.y, width: el.w, height: el.h, rx: raioX,
      fill: 'transparent', style: 'cursor:pointer'
    });
    g.appendChild(toque);

    if (el.indicador) {
      animados.push({ tipo: 'estado', no: g, fn: el.indicador, el: el, pintar: pintar });
    }

    ligarComando(toque, el, ctx);
    return g;
  }

  function ligarComando(alvo, el, ctx) {
    if (el.modo === 'ir' && el.destino) {
      alvo.addEventListener('click', function () { ctx.ir(el.destino); });
      return;
    }
    if (el.modo === 'voltar' || el.modo === 'fechar') {
      alvo.addEventListener('click', function () { ctx.voltar(); });
      return;
    }
    if (!el.escreve) return;

    if (el.modo === 'momentaneo') {
      // O botao momentaneo vale 1 enquanto esta pressionado. Solto sempre no
      // pointerup do documento: se o dedo sair de cima do botao antes de
      // soltar, a tag nao pode ficar presa em 1.
      var segurar = function (ev) {
        ev.preventDefault();
        escrever(el.escreve, 1);
        ctx.varrer();
        var soltar = function () {
          escrever(el.escreve, 0);
          ctx.varrer();
          document.removeEventListener('pointerup', soltar);
          document.removeEventListener('pointercancel', soltar);
        };
        document.addEventListener('pointerup', soltar);
        document.addEventListener('pointercancel', soltar);
      };
      alvo.addEventListener('pointerdown', segurar);
      return;
    }

    if (el.modo === 'mantido') {
      alvo.addEventListener('click', function () {
        escrever(el.escreve, ler(el.escreve) ? 0 : 1);
        ctx.varrer();
      });
      return;
    }

    if (el.modo === 'multiestado') {
      alvo.addEventListener('click', function () {
        var n = el.estados.filter(function (e) { return e.valor !== null; }).length || 1;
        escrever(el.escreve, (Number(ler(el.escreve)) + 1) % n);
        ctx.varrer();
      });
    }
  }

  // --- atualizacao -------------------------------------------------------------
  var pisca = false;

  function atualizar(animados) {
    for (var i = 0; i < animados.length; i++) {
      var a = animados[i];

      if (a.tipo === 'visivel') {
        var v = !!avaliar(a.fn, 0);
        var mostrar = (a.quando === 'visible') ? v : !v;
        a.no.setAttribute('visibility', mostrar ? 'visible' : 'hidden');

      } else if (a.tipo === 'mostrar') {
        var bruto = avaliar(a.fn, a.el.t === 'numero' ? 0 : '');
        a.no.textContent = a.el.t === 'numero' ? formatarNumero(bruto, a.el) : String(bruto);

      } else if (a.tipo === 'estado') {
        var n = Number(avaliar(a.fn, 0));
        var achado = null;
        for (var k = 0; k < a.el.estados.length; k++) {
          if (a.el.estados[k].valor === n) { achado = a.el.estados[k]; break; }
        }
        if (achado) a.pintar(achado);

      } else if (a.tipo === 'relogio') {
        a.pintar();

      } else if (a.tipo === 'alarmes') {
        a.varrer();

      } else if (a.tipo === 'barra') {
        var val = Number(avaliar(a.fn, 0));
        var fr = Math.max(0, Math.min(1, (val - a.el.min) / ((a.el.max - a.el.min) || 1)));
        a.no.setAttribute('height', a.el.h * fr);
        a.no.setAttribute('y', a.el.y + a.el.h * (1 - fr));

      } else if (a.tipo === 'cor') {
        var valor = Number(avaliar(a.fn, 0));
        var item = a.itens[0];
        for (var j = 0; j < a.itens.length; j++) if (a.itens[j].valor === valor) { item = a.itens[j]; break; }
        if (!item) continue;
        var f = (pisca && item.piscaFundo) ? item.piscaFundo : item.fundo;
        var c = (pisca && item.piscaFrente) ? item.piscaFrente : item.frente;
        pintarNo(a.no, f, c);
      }
    }
  }

  // FillColorMode 2 quer dizer que a cor de fundo pinta o interior da forma.
  function pintarNo(no, fundo, frente) {
    var formas = no.tagName === 'path' || no.tagName === 'rect' ? [no] : no.querySelectorAll('path,rect');
    for (var i = 0; i < formas.length; i++) {
      if (fundo) formas[i].setAttribute('fill', fundo);
    }
    if (!frente) return;
    var textos = no.tagName === 'text' ? [no] : no.querySelectorAll('text');
    for (var j = 0; j < textos.length; j++) textos[j].setAttribute('fill', frente);
  }

  raiz.Vetorial = {
    ler: ler,
    escrever: escrever,
    valores: function () { return valores; },
    definirValores: function (v) { valores = v; },
    montarTela: montarTela,
    atualizar: atualizar,
    avaliar: avaliar,
    periodo: PERIODO,
    trocarPisca: function () { pisca = !pisca; return pisca; }
  };
})(typeof window !== 'undefined' ? window : this);
