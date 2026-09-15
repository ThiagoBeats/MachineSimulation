// ---------------------------------------------------------------------------
// A PARTE FISICA DA MAQUINA
// ---------------------------------------------------------------------------
// O programa do CLP roda inteiro em ladder.js, exatamente como esta no .ACD.
// Mas um CLP sozinho nao faz nada: ele le sensores. Aqui nao ha sensor nenhum,
// nem balanca, nem inversor, nem fim de curso.
//
// ESTE ARQUIVO E A UNICA PARTE INVENTADA da simulacao. Ele finge ser a
// maquina: quando o CLP manda abrir uma valvula, o fim de curso responde
// depois de um tempo; quando manda a bomba girar, o inversor confirma e a
// vazao aparece. Nada disso saiu do projeto - e aproximacao escrita a mao,
// suficiente para o operador ver a maquina se comportar.
//
// Duas partes:
//
//   1. REALIMENTACOES, montadas sozinhas a partir das chamadas de AOI que o
//      extrator gravou. Toda valvula chamada por EV_MonoEstable tem comando e
//      dois fins de curso; todo motor chamado por ArranqueDirecto tem contator
//      e confirmacao; todo inversor chamado por ArranqueVariador fala com um
//      PowerFlex. Como isso vem da estrutura do proprio programa, cobre as 27
//      valvulas, os 13 motores e os 9 inversores sem lista escrita a mao.
//
//   2. PROCESSO, escrito a mao: semente entrando na balanca, liquido saindo
//      das bombas, tambor girando. E a parte grosseira, e esta assumida.
// ---------------------------------------------------------------------------
(function (raiz) {
  'use strict';

  var ATRASO_VALVULA = 700;    // ms de curso do atuador pneumatico
  var ATRASO_MOTOR = 400;      // ms ate o contator confirmar
  var ATRASO_INVERSOR = 600;   // ms ate o inversor dizer que esta girando

  var regras = { valvulas: [], motores: [], inversores: [] };
  var cronometros = {};
  var permissivos = [];        // entradas de campo que valem 1 com a maquina sa
  var falhas = [];             // entradas de campo que valem 0 com a maquina sa

  // Classifica as entradas de campo pelo nome. A lista de entradas vem do
  // extrator - sao as tags que o programa le e nunca escreve.
  var SAO_UM = [
    /LockOut/i,                      // chave de liberacao do equipamento
    /PowerFlex.*:I:0\.Active$/,      // inversor presente e energizado
    /ConnectionsOK/i,                // rede de E/S respondendo
    /Siempre1/i,                     // bit sempre ligado do projeto
    /Presion_Aire/i,                 // ar comprimido na linha
    /^MainProgram\.PE$/              // cadeia de emergencia liberada
  ];
  var SAO_ZERO = [
    /Faulted$/,                      // inversor sem falha
    /SinSemilla/i,                   // ha semente na tolva
    /^MainProgram\.Peleteo$/          // sem peletizacao neste cenario
  ];

  // Estas o programa tambem escreve em algum ponto, entao nao entram na lista
  // de entradas de campo - mas no mundo real quem manda nelas e a botoeira e a
  // cadeia de seguranca, e sem elas a maquina nao sai do lugar.
  var SEMPRE_UM = [
    'MainProgram.PE',                // cadeia de emergencia liberada
    'MainProgram.Presion_Aire',      // ar comprimido na linha
    'MainProgram.Siempre1',
    'ConnectionsOK'
  ];

  // Le o argumento que foi passado numa posicao de parametro do AOI.
  function arg(chamada, parametros, nome) {
    var i = parametros.indexOf(nome);
    if (i < 0) return null;
    var v = chamada.args[i + 1];
    if (!v || /^-?[0-9]/.test(v)) return null;     // constante: nao e tag
    return v;
  }

  function preparar(programa) {
    regras = { valvulas: [], motores: [], inversores: [] };
    cronometros = {};
    permissivos = [];
    falhas = [];

    var campo = programa.entradasDeCampo || [];
    for (var k = 0; k < campo.length; k++) {
      var t = campo[k];
      if (SAO_UM.some(function (re) { return re.test(t); })) permissivos.push(t);
      else if (SAO_ZERO.some(function (re) { return re.test(t); })) falhas.push(t);
    }

    for (var i = 0; i < programa.chamadasDeAoi.length; i++) {
      var c = programa.chamadasDeAoi[i];
      var def = programa.aoi[c.aoi];
      if (!def) continue;
      var p = def.parametros;

      if (c.aoi === 'EV_MonoEstable' || c.aoi === 'EV_SimpleEfecto2Pos') {
        var cmd = arg(c, p, 'Valvula');
        if (!cmd) continue;
        regras.valvulas.push({
          comando: cmd,
          aberto: arg(c, p, 'PosAbierta'),
          fechado: arg(c, p, 'PosCerrada'),
          chave: 'v' + i
        });

      } else if (c.aoi === 'ArranqueDirecto') {
        var contator = arg(c, p, 'Contactor');
        var confirma = arg(c, p, 'ConfirmaM');
        if (!contator || !confirma) continue;
        regras.motores.push({ contator: contator, confirma: confirma, chave: 'm' + i });

      } else if (c.aoi === 'ArranqueVariador') {
        var saida = arg(c, p, 'OutputPF');
        var entrada = arg(c, p, 'InputPF');
        if (!saida || !entrada) continue;
        regras.inversores.push({
          partida: saida + '.AB:PowerFlex525V_E2P_Drive:O:0.Start',
          parada: saida + '.AB:PowerFlex525V_E2P_Drive:O:0.Stop',
          frequencia: saida + '.AB:PowerFlex525V_E2P_Drive:O:0.FreqCommand',
          estado: entrada + '.AB:PowerFlex525V_E2P_Drive:I:0.DriveStatus',
          ativo: entrada + '.AB:PowerFlex525V_E2P_Drive:I:0.Active',
          falha: entrada + '.AB:PowerFlex525V_E2P_Drive:I:0.Faulted',
          saidaHz: entrada + '.AB:PowerFlex525V_E2P_Drive:I:0.OutputFreq',
          chave: 'i' + i
        });
      }
    }
    // A maquina comeca PARADA E ASSENTADA, nao em transito. Sem isso, no
    // primeiro instante os dois fins de curso de cada valvula ficam
    // desligados - o que para o CLP quer dizer "atuador a caminho" - e o
    // temporizador de falha de posicao comeca a contar. Depois de 2 s as 29
    // valvulas entram em falha e a maquina nao dosa mais nada.
    for (var j = 0; j < regras.valvulas.length; j++) {
      cronometros[regras.valvulas[j].chave] = ATRASO_VALVULA;
      cronometros[regras.valvulas[j].chave + 'e'] = false;
    }

    return regras;
  }

  // Conta quanto tempo uma condicao esta valendo. Devolve true quando ja
  // passou do tempo pedido.
  function estavel(chave, condicao, ms, periodo) {
    if (!condicao) { cronometros[chave] = 0; return false; }
    cronometros[chave] = (cronometros[chave] || 0) + periodo;
    return cronometros[chave] >= ms;
  }

  function bit(ler, caminho) {
    var m = /^(.*)\.(\d{1,2})$/.exec(caminho);
    if (!m) return !!ler(caminho);
    return ((Number(ler(m[1])) >> Number(m[2])) & 1) === 1;
  }

  function escreverBit(ler, escrever, caminho, valor) {
    var m = /^(.*)\.(\d{1,2})$/.exec(caminho);
    if (!m) { escrever(caminho, valor ? 1 : 0); return; }
    var base = Number(ler(m[1])) | 0;
    var mascara = 1 << Number(m[2]);
    escrever(m[1], valor ? (base | mascara) : (base & ~mascara));
  }

  function passo(ler, escrever, periodo) {
    var i, r;

    // --- 1. permissivos: a maquina esta sa -----------------------------------
    // Varias destas sao verdadeiras quando esta TUDO BEM. Deixar em zero
    // equivale a abrir a simulacao com a maquina em falha - e foi exatamente
    // o que aconteceu na primeira tentativa: a maquina partia e nao dosava,
    // porque as chaves de liberacao estavam em zero.
    for (i = 0; i < SEMPRE_UM.length; i++) escrever(SEMPRE_UM[i], 1);
    for (i = 0; i < permissivos.length; i++) escrever(permissivos[i], 1);
    for (i = 0; i < falhas.length; i++) escrever(falhas[i], 0);

    // --- 2. realimentacao das valvulas ---------------------------------------
    for (i = 0; i < regras.valvulas.length; i++) {
      r = regras.valvulas[i];
      var aberta = bit(ler, r.comando);
      var chegou = estavel(r.chave, true, 0, periodo);   // mantem o cronometro vivo
      var mudou = (cronometros[r.chave + 'e'] !== aberta);
      if (mudou) { cronometros[r.chave + 'e'] = aberta; cronometros[r.chave] = 0; }
      var noFim = (cronometros[r.chave] || 0) >= ATRASO_VALVULA;
      if (r.aberto) escreverBit(ler, escrever, r.aberto, noFim && aberta);
      if (r.fechado) escreverBit(ler, escrever, r.fechado, noFim && !aberta);
    }

    // --- 3. realimentacao dos motores diretos --------------------------------
    for (i = 0; i < regras.motores.length; i++) {
      r = regras.motores[i];
      var ligado = bit(ler, r.contator);
      escreverBit(ler, escrever, r.confirma, estavel(r.chave, ligado, ATRASO_MOTOR, periodo));
    }

    // --- 4. realimentacao dos inversores -------------------------------------
    for (i = 0; i < regras.inversores.length; i++) {
      r = regras.inversores[i];
      var quer = bit(ler, r.partida) && !bit(ler, r.parada);
      var girando = estavel(r.chave, quer, ATRASO_INVERSOR, periodo);
      escreverBit(ler, escrever, r.estado + '.01', girando);   // bit de "em marcha"
      escrever(r.ativo, girando ? 1 : 0);
      escrever(r.falha, 0);
      // a frequencia de saida persegue a de comando
      var alvo = girando ? Number(ler(r.frequencia)) || 0 : 0;
      var atual = Number(ler(r.saidaHz)) || 0;
      escrever(r.saidaHz, atual + (alvo - atual) * 0.25);
    }

    // --- 5. processo ----------------------------------------------------------
    processo(ler, escrever, periodo);
  }

  // -------------------------------------------------------------------------
  // A parte grosseira: o que acontece dentro da maquina.
  // -------------------------------------------------------------------------
  function processo(ler, escrever, periodo) {
    var s = periodo / 1000;

    // Semente sempre disponivel na tolva.
    escrever('MainProgram.SinSemilla', 0);

    // A BALANCA NAO E MODELADA AQUI. O proprio CLP tem a rotina
    // MainProgram.SimulacionPeso, que integra o peso quando o bit de
    // simulacao esta ligado (ver valores.js). Deixar o CLP fazer isso e mais
    // fiel do que uma balanca inventada, e foi assim que a fabricante
    // comissionou a maquina.

    // Nivel da tolva de semente: ha semente para carregar.
    escrever('MainProgram.LSL_TO_C', 1);

    // Sensores de produto na entrada. Com SemProduto ligado, o rung Pesada #0
    // desarma HMI_Inicio e o lote nao comeca - foi assim que a maquina se
    // recusou a rodar na primeira tentativa, e estava certa.
    escrever('MainProgram.SemProduto', 0);
    escrever('MainProgram.DetenerCargaBolson', 0);

    // Sensor de posicao da comporta de carga: o atuador chegou ao fim do
    // curso. A rotina ValvulaCargaBalanza espera por ele para liberar a fase
    // de corte fino; sem isso a pesagem para no corte grosso.
    escrever('MainProgram.Z_VA2_W', 1);

    // Descarga habilitada. No projeto isso vem de uma entrada digital pela
    // rotina MainProgram.IO_Mapping - que e codigo morto: nenhum JSR aponta
    // para ela. Na maquina quem manda e uma chave de habilitacao no campo.
    escrever('MainProgram.DescHab', 1);

    // BalanzaVacia nao entra aqui: quem a aciona e o proprio CLP, no rung
    // Pesada #3, comparando o peso com a banda morta. So precisamos que a
    // banda morta tenha valor - esta em valores.js.

    // --- medidores de vazao das 6 linhas de liquido -------------------------
    // E por aqui que a dosagem termina. O CLP calcula quantos litros a
    // batelada precisa - (PesoSemilla/100) x (Dosis/1000), corrigido pelo
    // offset - e fica comparando com o totalizador do medidor ate passar do
    // alvo. Sem o medidor contando, a valvula abre e nunca mais fecha.
    //
    // A vazao acompanha a frequencia que o CLP manda no inversor da bomba.
    for (var n = 1; n <= 6; n++) {
      var injetando = !!ler('Inyectar_L' + n);
      var hz = Number(ler('MainProgram.InputBDL' + n + '.OutputFreq')) || 0;
      var nominal = Number(ler('Caudal_Nominal_Bomba_L' + n)) || 0;

      // Enquanto o inversor nao responde, a bomba ainda assim empurra liquido:
      // a dosagem da B18 usa bomba de diafragma, que parte junto com a valvula.
      var fracao = hz > 0 ? (hz / 50) : (injetando ? 1 : 0);
      var vazao = injetando ? nominal * fracao : 0;        // litros por hora

      escrever('MainProgram.MedicionCaudalL' + n, vazao);
      if (vazao > 0) {
        var tot = Number(ler('MainProgram.Totalizador_L' + n)) || 0;
        escrever('MainProgram.Totalizador_L' + n, tot + vazao / 3600 * s);
      }
    }
  }

  raiz.PLANTA = {
    descricao: 'modelo aproximado da parte fisica - escrito a mao, nao veio do projeto',
    preparar: preparar,
    passo: passo,
    regras: function () {
      return { valvulas: regras.valvulas.length, motores: regras.motores.length, inversores: regras.inversores.length };
    }
  };
})(typeof window !== 'undefined' ? window : this);
