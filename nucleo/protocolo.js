// ---------------------------------------------------------------------------
// Protocolo do TcHmi Server - PURO, roda em Node e no navegador.
//
// Responde ao que o TcHmiFramework.js pede, na ordem em que ele pede:
//   1. GET {origem}/Config/ServerState/v2        -> estadoDoServidor()
//   2. WebSocket na mesma origem                 -> novaSessao()
//   3. Diagnostics::LICENSE  = { STATE: "OK" }   (portao: sem isso nada renderiza)
//   4. GetDefinitions x4 (general/framework/server/project)
//   5. ListSymbols                               (tipa cada binding da tela)
//
// Detalhe que custa horas se esquecido: a resposta de GetDefinitions PRECISA
// ecoar o writeValue recebido - e por ele que o TypeManager sabe a qual
// namespace a resposta pertence.
// ---------------------------------------------------------------------------
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.SimProtocolo = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function criar(cfg) {
    const esquema = cfg.esquema;
    const estado = cfg.estado;
    const logica = cfg.logica;
    const aoRegistrar = cfg.aoRegistrar || function () {};

    const sessoes = new Set();
    const desconhecidos = new Map();

    // NAO inclua frameworkApiVersion aqui: se existir e for >= 1.0.0.0, o
    // framework exige um handshake extra no simbolo __FrameworkHandshake.
    function estadoDoServidor() {
      return {
        serverTime: new Date().toISOString(),
        publishInProgress: false,
        maintenanceMode: { isActive: false, isMaintenanceUser: false },
        timedClient: { isTimed: false }
      };
    }

    function valorDe(simbolo, cmd) {
      switch (simbolo) {
        case 'Diagnostics::LICENSE': return { STATE: 'OK' };
        case 'ADS.CheckLicense': return { STATE: 'OK' };
        case '__FrameworkHandshake': return { frameworkApiVersion: '1.0.0.0' };
        case 'IsAuthRequired': return false;
        case 'GetCurrentUser': return {
          name: 'Treinamento', domain: 'TcHmiSrv',
          groups: ['__SystemAdministrators', 'Administrators', '__SystemUsers'],
          locale: 'pt-BR'
        };
        case 'Login': return true;
        case 'Logout': return true;
        case 'ForceLogout': return true;
        case 'ListSymbols': return esquema.SYMBOL_LIST;
        case 'ListUserNames': return ['Treinamento'];
        case 'GetDefinitions': {
          const ns = cmd && cmd.writeValue && cmd.writeValue.type;
          return esquema.DEFINITIONS[ns] || { definitions: {} };
        }
        case 'GetSymbolAccess': return { read: true, write: true, observe: true };
        case 'Unsubscribe': {
          for (const s of sessoes) s.inscricoes.delete(cmd && cmd.writeValue);
          return true;
        }
        case 'UnsubscribeEvents': return true;
        case 'SubscribeEvents': return true;
        case 'UpdateEventsSubscription': return true;
        case 'ListEvents': return [];
        case 'Heartbeat': return Date.now();
        case 'SetLocale': return true;
      }

      // Simbolo do CLP.
      if (!esquema.schemaForSymbol(simbolo)) {
        desconhecidos.set(simbolo, (desconhecidos.get(simbolo) || 0) + 1);
        return null;
      }
      if (cmd && 'writeValue' in cmd) estado.escrever(simbolo, cmd.writeValue);
      return estado.ler(simbolo);
    }

    function responder(cmd) {
      const simbolo = cmd.symbol || '';
      const saida = { symbol: simbolo, commandOptions: cmd.commandOptions || [] };
      saida.readValue = valorDe(simbolo, cmd);
      if ('writeValue' in cmd) saida.writeValue = cmd.writeValue;
      return saida;
    }

    // Uma inscricao e afetada se o caminho alterado for o proprio simbolo, um
    // pai ou um filho: inscrito em LiquidsTable, escreveu LiquidsTable[3].Nome.
    function relacionados(a, b) {
      if (a === b) return true;
      const dentro = (x, y) => x.startsWith(y) && (x[y.length] === '.' || x[y.length] === '[');
      return dentro(a, b) || dentro(b, a);
    }

    function difundir() {
      const mudou = estado.coletarMudancas();
      if (!mudou.length) return;
      for (const sessao of sessoes) {
        for (const [id, comandos] of sessao.inscricoes) {
          const afetada = comandos.some(c => c.symbol && mudou.some(m => relacionados(c.symbol, m)));
          if (!afetada) continue;
          sessao.enviar(JSON.stringify({
            id: id,
            commands: comandos.map(c => ({
              symbol: c.symbol,
              commandOptions: c.commandOptions || [],
              readValue: valorDe(c.symbol, null)
            }))
          }));
        }
      }
    }

    function novaSessao(enviar) {
      const sessao = { enviar: enviar, inscricoes: new Map() };
      sessoes.add(sessao);
      aoRegistrar(sessoes.size);

      sessao.tratar = function (texto) {
        let req;
        try { req = JSON.parse(texto); } catch (e) { return; }
        const comandos = req.commands || [];

        if (req.requestType === 'Subscription' && req.id !== undefined) {
          sessao.inscricoes.set(req.id, comandos);
        }

        enviar(JSON.stringify({ id: req.id, commands: comandos.map(responder) }));

        // Um "ciclo de CLP" depois de cada mensagem que escreveu algo.
        if (comandos.some(c => 'writeValue' in c)) logica.ciclo();
        difundir();
      };

      sessao.encerrar = function () {
        sessoes.delete(sessao);
        aoRegistrar(sessoes.size);
      };
      return sessao;
    }

    // Deixa o cenario coerente antes do primeiro cliente.
    function arrancar() {
      logica.listasDeProdutos();
      logica.ciclo();
      estado.coletarMudancas();
    }

    return {
      estadoDoServidor, novaSessao, arrancar, difundir, valorDe,
      simbolosDesconhecidos: () => Object.fromEntries(desconhecidos)
    };
  }

  return { criar };
});
