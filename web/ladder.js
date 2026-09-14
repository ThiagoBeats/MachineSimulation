// ---------------------------------------------------------------------------
// INTERPRETADOR DE LADDER
// ---------------------------------------------------------------------------
// Executa, no navegador, o programa que foi lido do .ACD. Nao ha transcricao:
// o que roda aqui e o ladder do CLP, na ordem de varredura dele. O que esta
// escrito neste arquivo e o SIGNIFICADO de cada instrucao, uma vez so.
//
// Modelo de execucao, igual ao do Logix:
//   - a energia entra pela esquerda do rung e vale "verdadeiro";
//   - elementos em serie passam a energia adiante em cadeia;
//   - elementos em paralelo recebem a mesma energia e o resultado e o OU;
//   - instrucao de entrada (XIC, EQU, CMP...) deixa passar ou nao;
//   - instrucao de saida (OTE, MOV, TON...) age quando recebe energia, e a
//     repassa inalterada.
//
// O que NAO existe aqui, e nao tem como existir: as entradas de campo. Nenhum
// sensor, balanca ou inversor esta ligado. Quem faz esse papel e planta.js.
// ---------------------------------------------------------------------------
(function (raiz) {
  'use strict';

  var programa = null;
  var lerTag = null;
  var escreverTag = null;
  var periodo = 200;
  var agora = 0;

  var escopo = null;            // escopo do AOI em execucao
  var pilha = [];               // rotinas em execucao, para barrar recursao
  var naoImplementadas = {};    // conta o que foi ignorado, para o relatorio
  var orcamento = 0;            // limite de passos por varredura

  // --- resolucao de nomes -----------------------------------------------------
  // Dentro de um AOI, "EV_MonoEstable.Valvula" quer dizer o argumento que foi
  // passado naquela posicao, e "EV_MonoEstable.ManCerrar" (que nao e
  // parametro) quer dizer o membro da instancia.
  function resolver(t) {
    if (!escopo) return t;
    var prefixo = escopo.aoi + '.';
    if (t.lastIndexOf(prefixo, 0) !== 0) return t;
    var resto = t.slice(prefixo.length);
    var ponto = resto.indexOf('.');
    var membro = ponto < 0 ? resto : resto.slice(0, ponto);
    var cauda = ponto < 0 ? '' : resto.slice(ponto);
    if (escopo.params[membro] !== undefined) return escopo.params[membro] + cauda;
    return escopo.instancia + '.' + resto;
  }

  var RE_BIT = /^(.*)\.(\d{1,2})$/;

  function ler(ref) {
    if (typeof ref === 'number') return ref;
    if (ref === undefined || ref === null || ref === '' || ref === '?') return 0;
    if (/^-?[0-9]/.test(ref)) return Number(ref);
    var r = resolver(String(ref));
    var m = RE_BIT.exec(r);
    if (m) return (Number(lerTag(m[1])) >> Number(m[2])) & 1;
    var v = lerTag(r);
    return typeof v === 'boolean' ? (v ? 1 : 0) : (Number(v) || 0);
  }

  function escrever(ref, valor) {
    if (ref === undefined || ref === null || ref === '' || ref === '?') return;
    if (/^-?[0-9]/.test(ref)) return;                 // constante: nao ha onde gravar
    var r = resolver(String(ref));
    var m = RE_BIT.exec(r);
    if (m) {
      var base = Number(lerTag(m[1])) | 0;
      var bit = 1 << Number(m[2]);
      escreverTag(m[1], valor ? (base | bit) : (base & ~bit));
      return;
    }
    escreverTag(r, valor);
  }

  // --- expressoes de CPT e CMP ---------------------------------------------------
  function avaliar(e) {
    if (!e) return 0;
    switch (e.t) {
      case 'n': return e.v;
      case 'tag': return ler(e.c);
      case 'neg': return -avaliar(e.a);
      case 'op': {
        var a = avaliar(e.a), b = avaliar(e.b);
        if (e.o === '+') return a + b;
        if (e.o === '-') return a - b;
        if (e.o === '*') return a * b;
        if (e.o === '/') return b === 0 ? 0 : a / b;
        return 0;
      }
      case 'cmp': {
        var x = avaliar(e.a), y = avaliar(e.b);
        if (e.o === '>') return x > y ? 1 : 0;
        if (e.o === '<') return x < y ? 1 : 0;
        if (e.o === '>=') return x >= y ? 1 : 0;
        if (e.o === '<=') return x <= y ? 1 : 0;
        if (e.o === '<>') return x !== y ? 1 : 0;
        return x === y ? 1 : 0;
      }
    }
    return 0;
  }

  // --- membros de temporizador e contador ------------------------------------------
  // TON(X,?,?) nao diz onde ficam PRE, ACC e DN. O extrator ja descobriu, para
  // cada base, se o caminho e X.TIMER.PRE ou X.PRE.
  function membro(base, nome) {
    var p = (programa.temporizadores && programa.temporizadores[base]) || '.';
    return base + p + nome;
  }

  // --- instrucoes ---------------------------------------------------------------------
  // Entrada: recebe energia e devolve se ela passa.
  var ENTRADAS = {
    XIC: function (a, e) { return e && !!ler(a[0]); },
    XIO: function (a, e) { return e && !ler(a[0]); },
    EQU: function (a, e) { return e && ler(a[0]) === ler(a[1]); },
    NEQ: function (a, e) { return e && ler(a[0]) !== ler(a[1]); },
    LES: function (a, e) { return e && ler(a[0]) < ler(a[1]); },
    GRT: function (a, e) { return e && ler(a[0]) > ler(a[1]); },
    LEQ: function (a, e) { return e && ler(a[0]) <= ler(a[1]); },
    GEQ: function (a, e) { return e && ler(a[0]) >= ler(a[1]); },
    LIM: function (a, e) { var l = ler(a[0]), t = ler(a[1]), h = ler(a[2]);
                           return e && (l <= h ? (t >= l && t <= h) : (t >= l || t <= h)); },
    CMP: function (a, e) { return e && !!avaliar(a[0].v); },
    AFI: function () { return false; },
    // Um tiro so: passa energia apenas na subida.
    ONS: function (a, e) { var antes = !!ler(a[0]); escrever(a[0], e ? 1 : 0); return e && !antes; },
    // Estas nao mudam o desenho do rung: sao marcas que o Studio 5000 deixa
    // quando converte bloco funcional para ladder.
    NOP: function (a, e) { return e; },
    IRD: function (a, e) { return e; },
    ATI: function (a, e) { return e; },
    LBL: function (a, e) { return e; },
    NTCH: function (a, e) { return e; },
    start_block: function (a, e) { return e; },
    end_block1: function (a, e) { return e; },
    end_block2: function (a, e) { return e; }
  };

  // Saida: age quando recebe energia e repassa a energia inalterada.
  var SAIDAS = {
    OTE: function (a, e) { escrever(a[0], e ? 1 : 0); },
    OTL: function (a, e) { if (e) escrever(a[0], 1); },
    OTU: function (a, e) { if (e) escrever(a[0], 0); },
    MOV: function (a, e) { if (e) escrever(a[1], ler(a[0])); },
    CLR: function (a, e) { if (e) escrever(a[0], 0); },
    ADD: function (a, e) { if (e) escrever(a[2], ler(a[0]) + ler(a[1])); },
    SUB: function (a, e) { if (e) escrever(a[2], ler(a[0]) - ler(a[1])); },
    MUL: function (a, e) { if (e) escrever(a[2], ler(a[0]) * ler(a[1])); },
    DIV: function (a, e) { if (e) { var d = ler(a[1]); escrever(a[2], d === 0 ? 0 : ler(a[0]) / d); } },
    NEG: function (a, e) { if (e) escrever(a[1], -ler(a[0])); },
    ABS: function (a, e) { if (e) escrever(a[1], Math.abs(ler(a[0]))); },
    CPT: function (a, e) { if (e) escrever(a[0], avaliar(a[1].v)); },
    MVM: function (a, e) { if (e) { var m = ler(a[1]) | 0;
                            escrever(a[2], ((ler(a[0]) | 0) & m) | ((ler(a[2]) | 0) & ~m)); } },

    // Copia de bloco: X[i] para Y[j], n elementos.
    COP: function (a, e) {
      if (!e) return;
      var n = ler(a[2]);
      if (!(n > 0) || n > 4096) return;
      var de = indexavel(a[0]), para = indexavel(a[1]);
      for (var k = 0; k < n; k++) escrever(para(k), ler(de(k)));
    },

    TON: function (a, e) { temporizador(a[0], e, 'TON'); },
    TOF: function (a, e) { temporizador(a[0], e, 'TOF'); },
    RTO: function (a, e) { temporizador(a[0], e, 'RTO'); },
    RTOR: function (a, e) { temporizador(a[0], e, 'RTO'); },
    TONR: function (a, e) { temporizador(a[0], e, 'RTO'); },

    CTU: function (a, e) {
      var b = a[0];
      var antes = !!ler(membro(b, 'CU'));
      escrever(membro(b, 'CU'), e ? 1 : 0);
      if (e && !antes) escrever(membro(b, 'ACC'), ler(membro(b, 'ACC')) + 1);
      escrever(membro(b, 'DN'), ler(membro(b, 'ACC')) >= ler(membro(b, 'PRE')) ? 1 : 0);
    },
    RES: function (a, e) {
      if (!e) return;
      escrever(membro(a[0], 'ACC'), 0);
      escrever(membro(a[0], 'DN'), 0);
      escrever(membro(a[0], 'TT'), 0);
      escrever(membro(a[0], 'EN'), 0);
    },

    JMP: function (a, e) { if (e) contexto.salto = a[0]; },
    JSR: function (a, e) { if (e) rodarRotina(a[0]); },

    // Um tiro so com bit de memoria separado do bit de saida.
    OSR: function (a, e) {
      var antes = !!ler(a[0]);
      escrever(a[0], e ? 1 : 0);
      escrever(a[1], (e && !antes) ? 1 : 0);
    },
    OSF: function (a, e) {
      var antes = !!ler(a[0]);
      escrever(a[0], e ? 1 : 0);
      escrever(a[1], (!e && antes) ? 1 : 0);
    },

    // Distribui um campo de bits: BTD(origem, bitOrigem, destino, bitDestino, quantos)
    BTD: function (a, e) {
      if (!e) return;
      var origem = ler(a[0]) | 0, bo = ler(a[1]) | 0;
      var bd = ler(a[3]) | 0, n = ler(a[4]) | 0;
      if (n <= 0 || n > 32) return;
      var mascara = (n >= 32 ? -1 : ((1 << n) - 1));
      var campo = (origem >> bo) & mascara;
      var atual = ler(a[2]) | 0;
      escrever(a[2], (atual & ~(mascara << bd)) | (campo << bd));
    },

    // --- blocos funcionais convertidos para ladder pelo Studio 5000 -----------
    // Estes vem do editor de blocos. Cada um guarda os pinos numa estrutura com
    // nome fixo, que o proprio codigo referencia: SEL_01.SELECT.In1 e assim por
    // diante.
    SEL: function (a, e) {
      if (!e) return;
      var b = a[0] + '.SELECT.';
      escrever(b + 'Out', ler(b + 'SelectorIn') ? ler(b + 'In2') : ler(b + 'In1'));
    },
    SETD: function (a, e) {
      if (!e) return;
      var b = a[0] + '.DOMINANT_SET.';
      if (ler(b + 'Set')) escrever(b + 'Out', 1);
      else if (ler(b + 'Reset')) escrever(b + 'Out', 0);
    },
    MVMT: function (a, e) {
      if (!e) return;
      var b = a[0] + '.FBD_MASKED_MOVE.';
      var m = ler(b + 'Mask') | 0;
      escrever(b + 'Dest', ((ler(b + 'Source') | 0) & m) | ((ler(b + 'Target') | 0) & ~m));
    },
    OSRI: function (a, e) {
      if (!e) return;
      var b = a[0] + '.FBD_ONESHOT.';
      var entrada = !!ler(b + 'InputBit');
      var antes = !!ler(b + 'AnteriorSim');
      escrever(b + 'OutputBit', (entrada && !antes) ? 1 : 0);
      escrever(b + 'AnteriorSim', entrada ? 1 : 0);
    },
    OSFI: function (a, e) {
      if (!e) return;
      var b = a[0] + '.FBD_ONESHOT.';
      var entrada = !!ler(b + 'InputBit');
      var antes = !!ler(b + 'AnteriorSim');
      escrever(b + 'OutputBit', (!entrada && antes) ? 1 : 0);
      escrever(b + 'AnteriorSim', entrada ? 1 : 0);
    },

    // O PID do Logix tem muito mais do que isto - banda morta, filtro na
    // derivada, transferencia sem solavanco, ganho adaptativo. Aqui vale um PI
    // discreto com os mesmos ganhos e os mesmos limites de saida. Para o
    // treinamento o que importa e a bomba acompanhar a vazao pedida; o ajuste
    // fino do laco nao e assunto de curso de operacao.
    PID: function (a, e) {
      var b = a[0] + '.';
      if (!e) { escrever(b + 'IntegralSim', 0); return; }
      var sp = ler(b + 'SP');
      var pv = ler(a[1]);
      var kp = ler(b + 'KP');
      var ki = ler(b + 'KI');
      var maxo = ler(b + 'MAXO') || 100;
      var mino = ler(b + 'MINO');
      var erro = sp - pv;
      var integral = ler(b + 'IntegralSim') + ki * erro * (periodo / 1000);
      var saida = kp * erro + integral;
      if (saida > maxo) { saida = maxo; integral = ler(b + 'IntegralSim'); }
      if (saida < mino) { saida = mino; integral = ler(b + 'IntegralSim'); }
      escrever(b + 'IntegralSim', integral);
      escrever(b + 'PV', pv);
      escrever(b + 'OUT', saida);
      if (a[3] && !/^-?[0-9]/.test(a[3])) escrever(a[3], saida);
    }
  };

  function indexavel(ref) {
    var m = /^(.*)\[([0-9]+)\]$/.exec(String(ref));
    if (!m) return function (k) { return k === 0 ? ref : ref + '[' + k + ']'; };
    var base = m[1], ini = Number(m[2]);
    return function (k) { return base + '[' + (ini + k) + ']'; };
  }

  function temporizador(base, energia, tipo) {
    var pre = ler(membro(base, 'PRE'));
    var acc = ler(membro(base, 'ACC'));
    var en = !!ler(membro(base, 'EN'));

    if (tipo === 'TOF') {
      if (energia) { escrever(membro(base, 'EN'), 1); escrever(membro(base, 'ACC'), 0);
                     escrever(membro(base, 'DN'), 1); escrever(membro(base, 'TT'), 0); return; }
      if (en) { escrever(membro(base, 'EN'), 0); acc = 0; }
      if (acc < pre) { acc += periodo; escrever(membro(base, 'ACC'), acc); escrever(membro(base, 'TT'), 1); }
      if (acc >= pre) { escrever(membro(base, 'DN'), 0); escrever(membro(base, 'TT'), 0); }
      return;
    }

    if (!energia) {
      escrever(membro(base, 'EN'), 0);
      escrever(membro(base, 'TT'), 0);
      if (tipo !== 'RTO') { escrever(membro(base, 'ACC'), 0); escrever(membro(base, 'DN'), 0); }
      return;
    }
    escrever(membro(base, 'EN'), 1);
    if (acc < pre) {
      acc += periodo;
      escrever(membro(base, 'ACC'), acc);
    }
    var pronto = acc >= pre;
    escrever(membro(base, 'DN'), pronto ? 1 : 0);
    escrever(membro(base, 'TT'), pronto ? 0 : 1);
  }

  // --- execucao de um elemento ------------------------------------------------------
  var contexto = { salto: null };

  function executar(no, energia) {
    if (!no) return energia;
    if (orcamento-- < 0) return false;

    if (no.t === 'serie') {
      var e = energia;
      for (var i = 0; i < no.i.length; i++) e = executar(no.i[i], e);
      return e;
    }
    if (no.t === 'par') {
      var saiu = false;
      for (var j = 0; j < no.r.length; j++) if (executar(no.r[j], energia)) saiu = true;
      return saiu;
    }
    if (no.t !== 'i') return energia;

    var nome = no.n, args = no.a || [];

    if (ENTRADAS[nome]) return ENTRADAS[nome](args, energia);
    if (SAIDAS[nome]) { SAIDAS[nome](args, energia); return energia; }

    // chamada de AOI
    if (programa.aoi[nome]) { if (energia) rodarAoi(nome, args); return energia; }

    naoImplementadas[nome] = (naoImplementadas[nome] || 0) + 1;
    return energia;
  }

  // --- rotinas ------------------------------------------------------------------------
  function contemRotulo(no, rotulo) {
    if (!no || typeof no !== 'object') return false;
    if (no.t === 'i') return no.n === 'LBL' && no.a && no.a[0] === rotulo;
    if (no.t === 'serie') return no.i.some(function (x) { return contemRotulo(x, rotulo); });
    if (no.t === 'par') return no.r.some(function (x) { return contemRotulo(x, rotulo); });
    return false;
  }

  function rodarRotina(nome) {
    var blocos = programa.rotinas[nome];
    if (!blocos) return;
    if (pilha.indexOf(nome) >= 0) return;            // barra recursao
    pilha.push(nome);

    var i = 0, guarda = 0;
    while (i < blocos.length && guarda++ < blocos.length * 4 + 200) {
      contexto.salto = null;
      executar(blocos[i], true);
      if (contexto.salto) {
        var destino = -1;
        for (var k = 0; k < blocos.length; k++) {
          if (contemRotulo(blocos[k], contexto.salto)) { destino = k; break; }
        }
        contexto.salto = null;
        if (destino >= 0) { i = destino + 1; continue; }
      }
      i++;
    }
    pilha.pop();
  }

  function rodarAoi(nome, args) {
    var def = programa.aoi[nome];
    var anterior = escopo;
    var novo = { aoi: nome, instancia: resolver(String(args[0])), params: {} };
    for (var i = 0; i < def.parametros.length; i++) {
      var a = args[i + 1];
      novo.params[def.parametros[i]] = (a === undefined) ? '0' : (/^-?[0-9]/.test(a) ? a : resolver(String(a)));
    }
    escopo = novo;
    rodarRotina(def.rotina);
    escopo = anterior;
  }

  // --- varredura ------------------------------------------------------------------------
  function varrer() {
    if (!programa) return;
    agora += periodo;
    orcamento = 400000;
    escopo = null;
    pilha.length = 0;
    for (var i = 0; i < programa.entradas.length; i++) rodarRotina(programa.entradas[i]);
  }

  raiz.Ladder = {
    configurar: function (cfg) {
      programa = cfg.programa;
      lerTag = cfg.ler;
      escreverTag = cfg.escrever;
      periodo = cfg.periodo || 200;
      naoImplementadas = {};
    },
    varrer: varrer,
    naoImplementadas: function () { return naoImplementadas; },
    resumo: function () {
      if (!programa) return null;
      var n = 0;
      for (var r in programa.rotinas) n += programa.rotinas[r].filter(Boolean).length;
      return { rotinas: Object.keys(programa.rotinas).length, blocos: n, entradas: programa.entradas };
    }
  };
})(typeof window !== 'undefined' ? window : this);
