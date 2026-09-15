// ---------------------------------------------------------------------------
// CENARIO INICIAL DA LS-B18 CORTEVA
// ---------------------------------------------------------------------------
// O programa do CLP foi lido do .ACD e roda inteiro. O que NAO veio de la sao
// os valores iniciais das tags: o .ACD guarda presets de temporizador,
// constantes de calibracao e receitas num canto do arquivo que ainda nao
// deciframos. Sem eles todo temporizador nasce com preset zero - ou seja,
// termina no mesmo instante em que comeca - e a maquina atravessa cada etapa
// rapido demais.
//
// Este arquivo tapa esse buraco, e so ele. Tudo aqui e valor ASSUMIDO, nao
// lido do projeto:
//
//   - Os relogios dizem o periodo no proprio nome (T1sA, T500msB, T1500msA),
//     entao esses sao certos.
//   - A pre-marcha de 3 s e a mesma das outras maquinas da linha.
//   - O resto e estimativa, para o treinamento ficar coerente.
//
// 36 dos 100 temporizadores do programa nao precisam de nada aqui: eles
// recebem o preset por MOV, a partir das constantes das chamadas de AOI.
//
// Se um dia alguem ler os valores iniciais do .ACD, este arquivo encolhe.
// ---------------------------------------------------------------------------
window.VALORES = {

  // --- relogios do programa (o nome diz o periodo) ---
  'MainProgram.T1sA.TIMER.PRE': 1000,
  'MainProgram.T1sB.TIMER.PRE': 1000,
  'MainProgram.T1500msA.TIMER.PRE': 1500,
  'MainProgram.T500msB.TIMER.PRE': 500,

  // --- marcha ---
  'MainProgram.TOnPreMarcha.TIMER.PRE': 3000,      // aviso acustico antes de partir
  'MainProgram.TOffDemoraHabPausa.TIMER.PRE': 2000,
  'MainProgram.TOffResetF.TIMER.PRE': 1000,

  // --- batelada e homogeneizador ---
  'MainProgram.TOnBatch.TIMER.PRE': 8000,          // mistura no tambor
  'MainProgram.TOnCentrif.TIMER.PRE': 4000,
  'MainProgram.TOnZL_VA_H.TIMER.PRE': 2000,
  'MainProgram.TOn_Y_VA3_W.TIMER.PRE': 1500,

  // --- balanca ---
  'MainProgram.TOF_BalancaVazia.TIMER.PRE': 2000,
  'MainProgram.TOF_PesarProduto.TIMER.PRE': 1500,
  'MainProgram.T_MaxCargaBalanza': 25000,          // limite de carga, em gramas
  'MainProgram.T_MaxDescBalanza': 20000,

  // --- atraso de dosagem por linha ---
  'TON_AtrasoDosagem_L1.TIMER.PRE': 1000,
  'TON_AtrasoDosagem_L2.TIMER.PRE': 1000,
  'TON_AtrasoDosagem_L3.TIMER.PRE': 1000,
  'TON_AtrasoDosagem_L4.TIMER.PRE': 1000,
  'TON_AtrasoDosagem_L5.TIMER.PRE': 1000,
  'TON_AtrasoDosagem_L6.TIMER.PRE': 1000,

  // --- vazao nominal das bombas, que a IHM mostra e o laco usa ---
  'Caudal_Nominal_Bomba_L1': 120,
  'Caudal_Nominal_Bomba_L2': 120,
  'Caudal_Nominal_Bomba_L3': 120,
  'Caudal_Nominal_Bomba_L4': 120,
  'Caudal_Nominal_Bomba_L5': 120,
  'Caudal_Nominal_Bomba_L6': 120,

  // --- simulacao de peso, que e do proprio CLP ---
  // O programa tem uma rotina MainProgram.SimulacionPeso: com o bit ligado,
  // ele mesmo integra o peso da balanca em vez de ler a celula de carga. E o
  // modo que a fabricante usa para comissionar sem semente. Usar o dela sai
  // mais fiel do que inventar uma balanca aqui.
  'MainProgram.SimulacionPeso': 1,
  'MainProgram.ClockSimulacionPeso.TIMER.PRE': 200,
  'MainProgram.Delta_peso_simula': 40,             // kg por tique de 200 ms

  // --- tempos da comporta de carga da balanca ---
  // A rotina ValvulaCargaBalanza carrega estes dois no preset dos seus
  // temporizadores (rungs #4 e #8). Sao configuracao de maquina.
  'MainProgram.V_TOnResetAbrirCargaB': 800,
  'MainProgram.V_TOnResetCerrarCargaB': 800,

  // --- parametros do lote e da pesagem ---
  // Sem estes o CLP se recusa a comecar, e com razao: 'kg_a_Procesar' em zero
  // faz Total_Procesado >= kg_a_Procesar valer de saida, o que aciona
  // Fin_Lote e desarma o Inicio. A banda morta em zero tambem deixa a
  // balanca "nunca vazia". Sao valores de receita, que moram nos valores
  // iniciais do .ACD.
  'MainProgram.kg_a_Procesar': 1000,               // tamanho do lote, kg
  'MainProgram.BandaMuertaVacia': 3,               // abaixo disto a balanca esta vazia
  'MainProgram.PesoSemilla': 200,                  // batelada, kg
  'MainProgram.Tolerancia': 5,                     // % de tolerancia da batelada
  'MainProgram.CorteGruesoSemilla': 180,           // corte grosso; o CLP copia para CorteGruesoReal
  'MainProgram.CorteFinoSemilla': 196,             // corte fino


  // --- receita em uso -------------------------------------------------------
  // O receituario mora em RECETARIO[], tag de CONTROLADOR (sem prefixo de
  // programa - escrever "MainProgram.RECETARIO" nao chega em lugar nenhum).
  // O CLP copia RECETARIO[Indice_RecetaEnProceso] para RecetaEnProceso quando
  // recebe Carga_Receta_Proceso, que e um botao da tela de Receituario - uma
  // das telas que so existem no .gfx. Enquanto ela nao entra, a simulacao abre
  // com a receita ja carregada.
  'Carga_Receta_Proceso': 1,
  'Indice_RecetaEnProceso': 1,
  'Indice_RECETARIO': 1,

  // Tres linhas ativas. Dose em mL por 100 kg de semente; ordem 0 desliga a
  // linha (a IHM mostra o campo so quando Ord_Iny_Lx > 0).
  'RECETARIO[1].RECETA.Dosis_L1': 300,
  'RECETARIO[1].RECETA.Orden_L1': 1,
  'RECETARIO[1].RECETA.T_inyeccion_L1': 4000,
  'RECETARIO[1].RECETA.T_demora_L1': 500,
  'RECETARIO[1].RECETA.Vel_aspersor_L1': 60,

  'RECETARIO[1].RECETA.Dosis_L2': 150,
  'RECETARIO[1].RECETA.Orden_L2': 2,
  'RECETARIO[1].RECETA.T_inyeccion_L2': 3000,
  'RECETARIO[1].RECETA.T_demora_L2': 500,
  'RECETARIO[1].RECETA.Vel_aspersor_L2': 60,

  'RECETARIO[1].RECETA.Dosis_L3': 80,
  'RECETARIO[1].RECETA.Orden_L3': 3,
  'RECETARIO[1].RECETA.T_inyeccion_L3': 2500,
  'RECETARIO[1].RECETA.T_demora_L3': 500,
  'RECETARIO[1].RECETA.Vel_aspersor_L3': 60,

  // homogeneizacao e descarga
  'RECETARIO[1].RECETA.Vel_homogenizado': 70,
  'RECETARIO[1].RECETA.T_homogenizado': 6000,
  'RECETARIO[1].RECETA.Vel_descarga': 50,
  'RECETARIO[1].RECETA.T_descarga': 4000,

  // o nome e um vetor de caracteres no CLP; a IHM le este campo direto
  'MainProgram.RecetaEnProceso.Nombre': 'MILHO 2B',
  'MainProgram.RecetaEnProceso.Nombre_L1': 'FUNGICIDA',
  'MainProgram.RecetaEnProceso.Nombre_L2': 'INSETICIDA',
  'MainProgram.RecetaEnProceso.Nombre_L3': 'POLIMERO',

  // --- lote de exemplo, para a tela abrir com algo escrito ---
  'MainProgram.Total_Procesado': 0
};
