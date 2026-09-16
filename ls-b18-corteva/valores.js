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
  // O print da BALANCA mostra 'Tempo excedido Carga 10 Seg' e 'Descarga 10 Seg'.
  // O preset do CLP conta em MILISSEGUNDOS: gravar 10 estoura o tempo de carga
  // na primeira varredura e a maquina nem parte.
  'MainProgram.T_MaxCargaBalanza': 10000,
  'MainProgram.T_MaxDescBalanza': 10000,

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
  // A UNICA COISA AQUI QUE CONTRARIA O PRINT, e de proposito. Na tela
  // PARAMETROS da maquina real esta 'Simulacao de peso DESLIGADA', porque la
  // ha celula de carga de verdade. Aqui nao ha: e esta rotina do proprio CLP
  // que gera o peso. Desligando, a balanca nunca carrega e a maquina nao sai
  // do lugar - foi exatamente o que aconteceu quando copiei o print ao pe da
  // letra.
  'MainProgram.SimulacionPeso': 1,
  'MainProgram.ClockSimulacionPeso.TIMER.PRE': 200,
  'MainProgram.Delta_peso_simula': 40,             // kg por tique de 200 ms

  // --- tempos da comporta de carga da balanca ---
  // A rotina ValvulaCargaBalanza carrega estes dois no preset dos seus
  // temporizadores (rungs #4 e #8). Sao configuracao de maquina.
  'MainProgram.V_TOnResetAbrirCargaB': 800,
  'MainProgram.V_TOnResetCerrarCargaB': 800,

  // --- parametros do lote e da pesagem --------------------------------------
  // LIDOS DOS PRINTS da IHM de 25/06/2025, tela "BALANCA". Antes eram
  // estimativa minha; agora sao os numeros da maquina.
  'MainProgram.kg_a_Procesar': 99999,               // print "TRATADORA": SOLICITADO
  'MainProgram.BandaMuertaVacia': 3.5,              // print: "Balanca vazia 3,5 Kg"
  'MainProgram.PesoSemilla': 150,                   // print: "Peso da batelada 150"
  'MainProgram.Tolerancia': 10,                     // print: "Tolerancia 10 %"
  'MainProgram.CorteGruesoSemilla': 110,            // print: "Corte grosso 110"
  'MainProgram.CorteFinoSemilla': 147,              // print: "Corte fino 147,0"

  // --- parametros dos tanques ------------------------------------------------
  // Print "PARAMETROS": os seis tanques tem os mesmos limites e a mesma vazao.
  // A tela de parametros e uma das que so existem no .gfx; estes valores vieram
  // do print dela.

  // --- receita em uso ---------------------------------------------------------
  // O receituario mora em RECETARIO[], tag de CONTROLADOR (sem prefixo de
  // programa - escrever "MainProgram.RECETARIO" nao chega em lugar nenhum).
  // O CLP copia RECETARIO[Indice_RecetaEnProceso] para RecetaEnProceso quando
  // recebe Carga_Receta_Proceso, que e um botao da tela de Receituario - uma
  // das telas que so existem no .gfx. Enquanto ela nao entra, a simulacao abre
  // com a receita ja carregada.
  //
  // ESTA E A RECEITA REAL DO CLIENTE, lida do print "RECEITA DO LOTE" de
  // 25/06/2025. Ela ocupa o SLOT 8 do receituario, que tem 20 posicoes - o
  // print da tela RECEITAS mostra a lista inteira, e a linha 8 esta destacada.
  // O "43" e parte do NOME da receita, nao o indice dela: ler errado apontava
  // para RECETARIO[43], que nao existe, e a maquina parava de produzir sem
  // dizer por que. Antes daqui havia uma receita inventada de tres linhas.
  'Carga_Receta_Proceso': 1,
  'Indice_RecetaEnProceso': 8,
  'Indice_RECETARIO': 8,

  // Dose em mL por 100 kg de semente. Todas as linhas tem ordem 1 - nesta
  // receita elas injetam juntas, nao em sequencia.
  'RECETARIO[8].RECETA.Dosis_L1': 379.20,
  'RECETARIO[8].RECETA.Orden_L1': 1,
  'RECETARIO[8].RECETA.T_inyeccion_L1': 10000,
  'RECETARIO[8].RECETA.T_demora_L1': 0,
  'RECETARIO[8].RECETA.Vel_aspersor_L1': 80,

  'RECETARIO[8].RECETA.Dosis_L2': 260.02,
  'RECETARIO[8].RECETA.Orden_L2': 1,
  'RECETARIO[8].RECETA.T_inyeccion_L2': 10000,
  'RECETARIO[8].RECETA.T_demora_L2': 0,
  'RECETARIO[8].RECETA.Vel_aspersor_L2': 80,

  'RECETARIO[8].RECETA.Dosis_L3': 54.17,
  'RECETARIO[8].RECETA.Orden_L3': 1,
  'RECETARIO[8].RECETA.T_inyeccion_L3': 10000,
  'RECETARIO[8].RECETA.T_demora_L3': 0,
  'RECETARIO[8].RECETA.Vel_aspersor_L3': 80,

  'RECETARIO[8].RECETA.Dosis_L4': 300.00,
  'RECETARIO[8].RECETA.Orden_L4': 1,
  'RECETARIO[8].RECETA.T_inyeccion_L4': 10000,
  'RECETARIO[8].RECETA.T_demora_L4': 0,
  'RECETARIO[8].RECETA.Vel_aspersor_L4': 80,

  // a linha 5 esta vazia na receita 43: ordem 0 desliga a linha
  'RECETARIO[8].RECETA.Dosis_L5': 0,
  'RECETARIO[8].RECETA.Orden_L5': 0,

  'RECETARIO[8].RECETA.Dosis_L6': 600.00,
  'RECETARIO[8].RECETA.Orden_L6': 1,
  'RECETARIO[8].RECETA.T_inyeccion_L6': 10000,
  'RECETARIO[8].RECETA.T_demora_L6': 0,
  'RECETARIO[8].RECETA.Vel_aspersor_L6': 80,

  // homogeneizacao e descarga, do mesmo print
  'RECETARIO[8].RECETA.Vel_homogenizado': 80,
  'RECETARIO[8].RECETA.T_homogenizado': 10000,
  'RECETARIO[8].RECETA.Vel_descarga': 85,
  'RECETARIO[8].RECETA.T_descarga': 10000,

  // Os nomes: o CLP guarda como vetor de caracteres e a IHM le direto. Saem do
  // print "RECEITA DO LOTE"; a linha 5 esta em branco na maquina tambem.
  'MainProgram.RecetaEnProceso.Nombre': '43 - Max1.5+Ran+Lumi',
  'MainProgram.RecetaEnProceso.Nombre_L1': 'PONCHO',
  'MainProgram.RecetaEnProceso.Nombre_L2': 'DEMACOR',
  'MainProgram.RecetaEnProceso.Nombre_L3': 'LUMIALZA',
  'MainProgram.RecetaEnProceso.Nombre_L4': 'POLIMERO',
  'MainProgram.RecetaEnProceso.Nombre_L5': '',
  'MainProgram.RecetaEnProceso.Nombre_L6': 'PRE MISTURA',

  // --- o lote que estava rodando quando os prints foram tirados --------------
  'MainProgram.Variedad': 'Variedade 1',            // print: HIBRIDO
  'MainProgram.Lote': 'BRV8380PWUE-X1-00',          // print: LOTE

  // --- densidade e offset de cada produto ------------------------------------
  // Print "LIQUIDOS": a tabela de produtos, com densidade e offset de correcao.
  // O CLP usa o offset no calculo do alvo de cada dose.
  'MainProgram.Densidad_L1': 1.200, 'MainProgram.Offset_L1': 0.065,   // PONCHO
  'MainProgram.Densidad_L2': 1.200, 'MainProgram.Offset_L2': 0.015,   // DEMACOR
  'MainProgram.Densidad_L3': 1.210, 'MainProgram.Offset_L3': -0.20,   // LUMIALZA
  'MainProgram.Densidad_L4': 1.190, 'MainProgram.Offset_L4': 0.051,   // POLIMERO
  'MainProgram.Densidad_L6': 1.000, 'MainProgram.Offset_L6': 0.039,   // PRE MISTURA

  // --- lote de exemplo, para a tela abrir com algo escrito ---
  'MainProgram.Total_Procesado': 0
};
