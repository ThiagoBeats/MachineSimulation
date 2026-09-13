// ---------------------------------------------------------------------------
// Adaptador de NAVEGADOR: faz o papel do TcHmi Server sem servidor nenhum.
//
// O TcHmiFramework.js fala com o servidor por duas portas de entrada:
//   1. XMLHttpRequest para GET /Config/ServerState/v2
//   2. um WebSocket na mesma origem
// Este arquivo substitui as duas dentro da propria pagina. Precisa ser
// carregado ANTES dos scripts do framework (o build cuida disso).
//
// Estado: cada aluno tem o seu, no localStorage do proprio navegador.
// Para zerar, abra a pagina com ?reset=1 ou use o botao do portal.
// ---------------------------------------------------------------------------
(function () {
  'use strict';

  const dados = window.TCHMI_SIM_DADOS;
  if (!dados) {
    console.error('[sim] dados.js nao foi carregado - a simulacao nao vai subir.');
    return;
  }

  const MAQUINA = window.TCHMI_SIM_MAQUINA || 'maquina';
  const CHAVE = 'simulacao:' + MAQUINA + ':estado';

  // --- estado do aluno, no proprio navegador --------------------------------
  const armazenamento = {
    carregar: function () {
      try {
        const bruto = window.localStorage.getItem(CHAVE);
        return bruto ? JSON.parse(bruto) : {};
      } catch (e) { return {}; }
    },
    salvar: function (obj) {
      try { window.localStorage.setItem(CHAVE, JSON.stringify(obj)); } catch (e) { /* cota cheia ou bloqueado */ }
    },
    limpar: function () {
      try { window.localStorage.removeItem(CHAVE); } catch (e) { /* ignora */ }
    }
  };

  try {
    if (/[?&]reset=1/.test(window.location.search)) armazenamento.limpar();
  } catch (e) { /* ignora */ }

  // --- monta o nucleo -------------------------------------------------------
  const esquema = window.SimEsquema;
  const estado = window.SimEstado;
  const logica = window.SimLogica;

  esquema.configurar(dados);
  estado.configurar({
    esquema: esquema,
    sementes: window.TCHMI_SIM_VALORES || {},
    armazenamento: armazenamento
  });
  logica.configurar({ esquema: esquema, estado: estado });

  const protocolo = window.SimProtocolo.criar({ esquema: esquema, estado: estado, logica: logica });
  protocolo.arrancar();

  // O CLP varre continuamente. Sem isso, temporizadores como a pre-marcha de
  // 3 s da marcha nunca avancariam, porque o simulador so reagia a cliques.
  const INTERVALO_SCAN = 200;
  setInterval(function () {
    try { protocolo.scan(); } catch (e) { console.error('[sim] erro no scan:', e); }
  }, INTERVALO_SCAN);

  // Util para depurar pelo console do navegador.
  window.SIM = {
    ler: estado.ler,
    escrever: function (caminho, valor) { const r = estado.escrever(caminho, valor); logica.ciclo(); protocolo.difundir(); return r; },
    resetar: function () { armazenamento.limpar(); window.location.reload(); },
    desconhecidos: protocolo.simbolosDesconhecidos
  };

  // --- porta 1: XMLHttpRequest ---------------------------------------------
  // So intercepta o ServerState; todo o resto (telas, imagens, temas) segue
  // para o XHR de verdade e e servido como arquivo estatico normal.
  const XHRNativo = window.XMLHttpRequest;
  const ROTA_ESTADO = /\/Config\/ServerState(\/v2)?$/;

  function XHRSimulado() {
    const xhr = new XHRNativo();
    const abrirNativo = xhr.open;
    const enviarNativo = xhr.send;
    let simulado = false;

    xhr.open = function (metodo, url) {
      simulado = ROTA_ESTADO.test(String(url));
      if (simulado) return;
      return abrirNativo.apply(xhr, arguments);
    };

    xhr.send = function () {
      if (!simulado) return enviarNativo.apply(xhr, arguments);
      const corpo = JSON.stringify(protocolo.estadoDoServidor());
      try {
        Object.defineProperty(xhr, 'status', { value: 200, configurable: true });
        Object.defineProperty(xhr, 'statusText', { value: 'OK', configurable: true });
        Object.defineProperty(xhr, 'readyState', { value: 4, configurable: true });
        Object.defineProperty(xhr, 'responseText', { value: corpo, configurable: true });
        Object.defineProperty(xhr, 'response', { value: corpo, configurable: true });
      } catch (e) { /* navegador antigo */ }
      setTimeout(function () {
        if (typeof xhr.onreadystatechange === 'function') xhr.onreadystatechange();
        xhr.dispatchEvent(new Event('load'));
      }, 0);
    };

    return xhr;
  }
  XHRSimulado.UNSENT = 0; XHRSimulado.OPENED = 1; XHRSimulado.HEADERS_RECEIVED = 2;
  XHRSimulado.LOADING = 3; XHRSimulado.DONE = 4;
  window.XMLHttpRequest = XHRSimulado;

  // --- porta 2: WebSocket ---------------------------------------------------
  function WebSocketSimulado(url) {
    const ws = this;
    this.url = String(url);
    this.readyState = 0;                 // CONNECTING
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
    this.__ouvintes = {};

    this.__sessao = protocolo.novaSessao(function (texto) {
      const evento = { data: texto, type: 'message' };
      if (typeof ws.onmessage === 'function') ws.onmessage(evento);
      (ws.__ouvintes.message || []).forEach(function (fn) { fn(evento); });
    });

    setTimeout(function () {
      ws.readyState = 1;                 // OPEN
      const evento = { type: 'open' };
      if (typeof ws.onopen === 'function') ws.onopen(evento);
      (ws.__ouvintes.open || []).forEach(function (fn) { fn(evento); });
    }, 0);
  }

  WebSocketSimulado.prototype.send = function (texto) {
    if (this.readyState !== 1) return;
    // Assincrono de proposito: o framework espera resposta depois do retorno.
    const sessao = this.__sessao;
    setTimeout(function () { sessao.tratar(texto); }, 0);
  };

  WebSocketSimulado.prototype.close = function (codigo) {
    if (this.readyState === 3) return;
    this.readyState = 3;                 // CLOSED
    this.__sessao.encerrar();
    const evento = { type: 'close', code: codigo || 1000, wasClean: true };
    if (typeof this.onclose === 'function') this.onclose(evento);
    (this.__ouvintes.close || []).forEach(function (fn) { fn(evento); });
  };

  WebSocketSimulado.prototype.addEventListener = function (tipo, fn) {
    (this.__ouvintes[tipo] = this.__ouvintes[tipo] || []).push(fn);
  };
  WebSocketSimulado.prototype.removeEventListener = function (tipo, fn) {
    const lista = this.__ouvintes[tipo];
    if (!lista) return;
    const i = lista.indexOf(fn);
    if (i >= 0) lista.splice(i, 1);
  };

  WebSocketSimulado.CONNECTING = 0;
  WebSocketSimulado.OPEN = 1;
  WebSocketSimulado.CLOSING = 2;
  WebSocketSimulado.CLOSED = 3;
  window.WebSocket = WebSocketSimulado;

  console.log('[sim] simulador local pronto (' + Object.keys(dados.SYMBOLS).length + ' simbolos, maquina ' + MAQUINA + ')');
})();
