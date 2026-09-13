// ---------------------------------------------------------------------------
// CENARIO INICIAL DA LS-B300 DUO
// ---------------------------------------------------------------------------
// Informe so os campos que interessam: o que faltar e preenchido com o valor
// neutro do tipo correto. O que o aluno alterar pela tela fica no localStorage
// dele e tem precedencia; abrir com ?reset=1 volta a este cenario.
//
// A maioria dos valores aqui existe por um motivo so: no CLP varios sinais sao
// TRUE quando esta tudo OK. O valor neutro (false) seria lido como falha e a
// maquina abriria cheia de alarme. Os comentarios do proprio CLP dizem qual e
// a polaridade de cada um - estao reproduzidos abaixo.
// ---------------------------------------------------------------------------
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.TCHMI_SIM_VALORES = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Sensores de nivel de oleo das 12 bombas. O gatilho da tela le cada um e,
  // se for falso, abre "NIVEL BAIXO DE OLEO NA BOMBA N" - ou seja, TRUE = ok.
  // Sem isto a simulacao abre com o popup de alarme por cima da tela.
  const oleoOK = {};
  [['PP1', [1, 2, 3, 4]], ['PP2', [5, 6, 7, 8]], ['PP3', [9, 10, 11, 12]]]
    .forEach(function (par) {
      par[1].forEach(function (linha) {
        oleoOK['PLC1.Entradas.b' + par[0] + '_L' + linha + '_BD_MangRota'] = true;
      });
    });

  return Object.assign(oleoOK, {
    // --- Seguranca e permissivos de marcha --------------------------------
    // "Fica em TRUE quando a emergencia esta ok"
    'PLC1.Seguridad.PB_Emergencia': true,
    // "Fica em TRUE quando as portas estao fechadas e foi feito o reset"
    'PLC1.Seguridad.ParadaDePorta': true,
    // "presion aire ok"
    'PLC1.Entradas.TR_S_PDI': true,

    // --- Alarmes -----------------------------------------------------------
    // "Alarme de nivel baixo de oleo nas bombas. Se estiver em falso, alguma
    //  bomba esta com nivel baixo" - sem isto a tela abre com o popup de
    //  nivel baixo de oleo na bomba.
    'PLC1.AlarmesDaMaquina.AlrLL': true,

    // --- Estado inicial da maquina ----------------------------------------
    // Comeca parada, em manual e sem lote, como de manha. A sequencia de
    // treinamento e: carregar o lote, passar para automatico e dar marcha
    // (3 s de pre-marcha ate bRun subir).
    'PLC1.HMI.bModo_Auto': false,
    'PLC1.HMI.bRun': false,
    'PLC1.DatosProceso.LoteCargado': false
  });
});
