// ---------------------------------------------------------------------------
// CENARIO INICIAL DA LS-B18 CORTEVA
// ---------------------------------------------------------------------------
// Sao os valores das tags no instante em que a simulacao abre. Tudo que nao
// estiver aqui comeca em 0.
//
// ATENCAO ao sinal das tags de intertravamento: na maquina real varias delas
// sao VERDADEIRAS quando esta tudo bem. Deixar em 0 equivale a abrir a
// simulacao com a maquina em falha, e nada funciona.
// ---------------------------------------------------------------------------
window.VALORES = {
  // --- servicos e seguranca (verdadeiro = OK) ---
  'MainProgram.ServOk': 1,
  'MainProgram.PE': 1,

  // --- modo de operacao ---
  'MainProgram.aManual': 0,
  'MainProgram.Manual': 0,

  // --- lote ---
  'MainProgram.LoteCargado': 0,
  'MainProgram.Total_Procesado': 0
};
