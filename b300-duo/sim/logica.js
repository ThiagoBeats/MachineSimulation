// ---------------------------------------------------------------------------
// LOGICA DO CLP DA LS-B300 DUO EMULADA EM JAVASCRIPT
//
// ATENCAO: copia, em JavaScript, de logica que roda no CLP - transcrita de
//   POU^Inicio  (Ladder): marcha, pre-marcha e carga de lote
//
// Se alguem alterar o ST/Ladder no projeto do CLP, ESTE ARQUIVO FICA
// DESATUALIZADO em silencio. Existe para o treinamento se comportar como a
// maquina; nunca e fonte da verdade.
//
// O CLP da B300 DUO nao tem nada em comum com o da LS-B130: outro software,
// outros nomes (em espanhol), outra estrutura de GVLs. Por isso cada maquina
// tem o seu proprio logica.js.
//
// Polaridade dos permissivos, conforme os comentarios do proprio CLP:
//   Seguridad.PB_Emergencia  "Fica em TRUE quando a emergencia esta ok"
//   Seguridad.ParadaDePorta  "Fica em TRUE quando as portas estao fechadas"
//   Entradas.TR_S_PDI        "presion aire ok"
//   System.SlaveWithoutConn  INT - endereco do escravo em falha; 0 = sem falha
// ---------------------------------------------------------------------------
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.SimLogica = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let estado = null;
  let ler = null;
  let escrever = null;

  const P = 'PLC1.';
  const H = P + 'HMI.';
  const SEG = P + 'Seguridad.';
  const DP = P + 'DatosProceso.';
  const ENT = P + 'Entradas.';
  const PRE_MARCHA = P + 'Inicio.Premarcha';      // variavel local do POU

  const PRE_MARCHA_MS = 3000;                      // TmrPremarcha: T#3s

  let tonInicio = null;
  let loteAntes = false;

  function configurar(cfg) {
    estado = cfg.estado;
    ler = estado.ler;
    escrever = estado.escrever;
  }

  // --- PROGRAM Inicio (Ladder) ---------------------------------------------
  function ciclo(agora) {
    agora = typeof agora === 'number' ? agora : Date.now();

    const emergenciaOK = !!ler(SEG + 'PB_Emergencia');
    const portasOK = !!ler(SEG + 'ParadaDePorta');
    const arOK = !!ler(ENT + 'TR_S_PDI');
    const semFalhaRede = (Number(ler(P + 'System.SlaveWithoutConn')) || 0) === 0;

    // [1] Reset do modo automatico: cai se a emergencia ou as portas abrirem.
    if (!emergenciaOK || !portasOK) escrever(H + 'bModo_Auto', false);

    // [2] Carregar lote: borda de subida seta LoteCargado e limpa o comando.
    const pedidoLote = !!ler(DP + 'CargarLote');
    if (pedidoLote && !loteAntes) {
      escrever(DP + 'LoteCargado', true);
      escrever(DP + 'CargarLote', false);
    }
    loteAntes = pedidoLote;

    const auto = !!ler(H + 'bModo_Auto');
    const parada = !!ler(H + 'bParada');
    const lote = !!ler(DP + 'LoteCargado');
    const rodando = !!ler(H + 'bRun');

    // [4] Pre-marcha, com selo (a propria Premarcha se mantem).
    const partida = !!ler(H + 'bMarcha') && arOK && !rodando;
    const permissivos = auto && !parada && portasOK && emergenciaOK && semFalhaRede && lote;
    const preMarcha = (partida || !!ler(PRE_MARCHA)) && permissivos;
    escrever(PRE_MARCHA, preMarcha);

    // [5] TmrPremarcha (TON de 3 s)
    if (!preMarcha) tonInicio = null;
    else if (tonInicio === null) tonInicio = agora;
    const tempoOK = preMarcha && tonInicio !== null && (agora - tonInicio) >= PRE_MARCHA_MS;

    // [6] Marcha: tambem com selo - uma vez rodando, segue enquanto os
    //     permissivos valerem (nao depende mais da pre-marcha).
    const marcha = (tempoOK || rodando) && !parada && portasOK && emergenciaOK && auto;
    escrever(H + 'bRun', marcha);

    // [7][8] Os bits de comando valem um ciclo so.
    if (ler(H + 'bMarcha')) escrever(H + 'bMarcha', false);
    if (ler(H + 'bParada')) escrever(H + 'bParada', false);
  }

  return { configurar, ciclo };
});
