// ---------------------------------------------------------------------------
// CENARIO INICIAL DA LS-B150
// ---------------------------------------------------------------------------
// Informe so os campos que interessam: o que faltar e preenchido com o valor
// neutro do tipo correto. O que o aluno alterar pela tela fica no localStorage
// dele e tem precedencia; abrir com ?reset=1 volta a este cenario.
//
// ATENCAO aos limites dos controles da tela de Receitas: as velocidades
// aceitam 0..150 e os tempos 0..100. Valor fora da faixa e IGNORADO pelo
// controle, e o campo aparece zerado na tela.
// ---------------------------------------------------------------------------
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.TCHMI_SIM_VALORES = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // --- Produtos liquidos (linhas L1..L12) ---------------------------------
  const LIQUIDOS = [
    { ProductName: 'CRUISER 350 FS',   Density: 1.230, Offset: 0.0, SprinklerSpeed: 60, Mixer: true,  Recirculate: true,  ExpirationDate: '2027-03-15T00:00:00' },
    { ProductName: 'MAXIM XL',         Density: 1.080, Offset: 0.0, SprinklerSpeed: 55, Mixer: true,  Recirculate: false, ExpirationDate: '2027-01-20T00:00:00' },
    { ProductName: 'STANDAK TOP',      Density: 1.150, Offset: 0.0, SprinklerSpeed: 65, Mixer: true,  Recirculate: true,  ExpirationDate: '2026-11-30T00:00:00' },
    { ProductName: 'VITAVAX THIRAM',   Density: 1.310, Offset: 0.0, SprinklerSpeed: 50, Mixer: false, Recirculate: true,  ExpirationDate: '2027-06-10T00:00:00' },
    { ProductName: 'DERMACOR',         Density: 1.190, Offset: 0.0, SprinklerSpeed: 58, Mixer: true,  Recirculate: true,  ExpirationDate: '2027-08-22T00:00:00' },
    { ProductName: 'FORTENZA',         Density: 1.120, Offset: 0.0, SprinklerSpeed: 52, Mixer: true,  Recirculate: false, ExpirationDate: '2027-04-18T00:00:00' },
    { ProductName: 'INOCULANTE LIQ.',  Density: 1.030, Offset: 0.0, SprinklerSpeed: 48, Mixer: false, Recirculate: true,  ExpirationDate: '2026-12-05T00:00:00' },
    { ProductName: 'PROTETOR SOLAR',   Density: 1.060, Offset: 0.0, SprinklerSpeed: 45, Mixer: false, Recirculate: false, ExpirationDate: '2027-09-30T00:00:00' },
    { ProductName: 'MICRONUTRIENTE',   Density: 1.270, Offset: 0.0, SprinklerSpeed: 62, Mixer: true,  Recirculate: true,  ExpirationDate: '2027-02-14T00:00:00' },
    { ProductName: 'POLIMERO AZUL',    Density: 1.040, Offset: 0.0, SprinklerSpeed: 45, Mixer: false, Recirculate: false, ExpirationDate: '2028-02-01T00:00:00' },
    { ProductName: 'POLIMERO VERMELHO', Density: 1.045, Offset: 0.0, SprinklerSpeed: 45, Mixer: false, Recirculate: false, ExpirationDate: '2028-03-12T00:00:00' },
    { ProductName: 'AGUA',             Density: 1.000, Offset: 0.0, SprinklerSpeed: 40, Mixer: false, Recirculate: false, ExpirationDate: '2030-12-31T00:00:00' }
  ];

  // --- Produtos em po (linhas P1..P2) -------------------------------------
  const POS = [
    { ProductName: 'GRAFITE PO',       Correction: 1.00, ExpirationDate: '2028-05-20T00:00:00' },
    { ProductName: 'TALCO INDUSTRIAL', Correction: 0.98, ExpirationDate: '2028-08-12T00:00:00' }
  ];

  // --- Receitas salvas na biblioteca --------------------------------------
  function linha(step, dose, tempo, atraso, produto) {
    return { Step: step, Dosage: dose, InjectionTime: tempo, InjectionDelay: atraso, ProductID: produto };
  }
  const VAZIA = linha(0, 0, 0, 0, 0);

  const RECEITAS = [
    {
      RecipeName: 'SOJA PADRAO', BatchWeight: 500.0,
      MixerSpeed: 85.0, MixingTime: 45, UnloadSpeed: 70.0, UnloadTime: 30,
      liquidos: [linha(1, 250.0, 8.0, 0.5, 1), linha(2, 120.0, 6.0, 0.5, 2), linha(3, 80.0, 5.0, 0.5, 10)],
      pos: [linha(1, 400.0, 7.0, 0.5, 1)]
    },
    {
      RecipeName: 'SOJA COMPLETA', BatchWeight: 600.0,
      MixerSpeed: 90.0, MixingTime: 55, UnloadSpeed: 72.0, UnloadTime: 32,
      liquidos: [linha(1, 280.0, 9.0, 0.5, 1), linha(2, 150.0, 7.0, 0.5, 5),
                 linha(3, 100.0, 6.0, 0.5, 9), linha(4, 90.0, 5.0, 0.5, 10)],
      pos: [linha(1, 420.0, 7.0, 0.5, 1)]
    },
    {
      RecipeName: 'MILHO PREMIUM', BatchWeight: 750.0,
      MixerSpeed: 95.0, MixingTime: 60, UnloadSpeed: 75.0, UnloadTime: 35,
      liquidos: [linha(1, 300.0, 9.0, 0.5, 1), linha(2, 200.0, 7.0, 0.5, 3), linha(3, 150.0, 6.0, 0.5, 11)],
      pos: [linha(1, 500.0, 8.0, 0.5, 1), linha(2, 250.0, 6.0, 0.5, 2)]
    },
    {
      RecipeName: 'TRIGO INDUSTRIAL', BatchWeight: 600.0,
      MixerSpeed: 80.0, MixingTime: 50, UnloadSpeed: 65.0, UnloadTime: 28,
      liquidos: [linha(1, 180.0, 7.0, 0.5, 4), linha(2, 90.0, 5.0, 0.5, 12)],
      pos: [linha(1, 350.0, 6.0, 0.5, 2)]
    },
    {
      RecipeName: 'ALGODAO ESPECIAL', BatchWeight: 850.0,
      MixerSpeed: 110.0, MixingTime: 70, UnloadSpeed: 85.0, UnloadTime: 40,
      liquidos: [linha(1, 350.0, 10.0, 0.5, 3), linha(2, 260.0, 8.0, 0.5, 6),
                 linha(3, 120.0, 6.0, 0.5, 7), linha(4, 100.0, 5.0, 0.5, 10)],
      pos: [linha(1, 450.0, 7.0, 0.5, 1), linha(2, 200.0, 5.0, 0.5, 2)]
    }
  ];

  // -------------------------------------------------------------------------
  // Montagem das estruturas. Daqui para baixo raramente se mexe.
  // -------------------------------------------------------------------------
  const N_SLOTS = 100;

  function montarReceita(r, slotJson) {
    const liquidos = [];
    for (let i = 0; i < 25; i++) liquidos.push(r.liquidos[i] || Object.assign({}, VAZIA));
    const pos = [];
    for (let i = 0; i < 10; i++) pos.push(r.pos[i] || Object.assign({}, VAZIA));

    let total = 0;
    for (let etapa = 1; etapa <= LIQUIDOS.length; etapa++) {
      let pico = 0;
      for (const l of r.liquidos) if (l.Step === etapa) pico = Math.max(pico, l.InjectionDelay + l.InjectionTime);
      for (const p of r.pos) if (p.Step === etapa) pico = Math.max(pico, p.InjectionDelay + p.InjectionTime);
      total += pico;
    }
    total += r.MixingTime + r.UnloadTime;

    return {
      RecipeId: slotJson + 1, RecipeName: r.RecipeName, BatchWeight: r.BatchWeight,
      MixerSpeed: r.MixerSpeed, MixingTime: r.MixingTime,
      UnloadSpeed: r.UnloadSpeed, UnloadTime: r.UnloadTime, TotalTime: total,
      LiquidsConfig: liquidos, PowderConfig: pos
    };
  }

  const biblioteca = [];
  const comboReceitas = [];
  for (let i = 0; i < N_SLOTS; i++) {
    const r = RECEITAS[i];
    biblioteca.push(r ? montarReceita(r, i) : undefined);
    comboReceitas.push({ id: i + 1, value: i + 1, text: r ? r.RecipeName : 'Vazio' });
  }

  function montarTabela(lista, tamanho) {
    const out = [];
    for (let i = 0; i < tamanho; i++) out.push(lista[i] ? lista[i] : undefined);
    return out;
  }
  function montarCombo(lista, tamanho) {
    const out = [];
    for (let i = 0; i < tamanho; i++) {
      out.push({ id: i + 1, value: i + 1, text: lista[i] ? lista[i].ProductName : 'Vazio' });
    }
    return out;
  }

  // --- Consumo: dose alvo por linha e 20 dosagens realizadas ---------------
  const N_LINHAS = LIQUIDOS.length + POS.length;
  function doseAlvo(linha) { return 260 - linha * 16; }

  const alvos = [];
  for (let l = 0; l < 25; l++) alvos.push(l < N_LINHAS ? doseAlvo(l) : 0);

  const consumo = [];
  for (let dose = 0; dose < 20; dose++) {
    const linhaDose = [];
    for (let l = 0; l < 15; l++) {
      if (l < N_LINHAS) {
        const variacao = ((dose * 7 + l * 13) % 11) - 5;
        linhaDose.push(Math.round((doseAlvo(l) + variacao) * 10) / 10);
      } else {
        linhaDose.push(0);
      }
    }
    consumo.push(linhaDose);
  }

  return {
    // Configuracao da maquina
    'PLC1.MachineParameters.LiquidsQty': LIQUIDOS.length,
    'PLC1.MachineParameters.PowderQty': POS.length,

    // Permissivos: TRUE quando esta tudo OK. No CLP, quando GeneralEMG cai,
    // o modo automatico e derrubado e a marcha nao sobe.
    'PLC1.MainGVL.RunMode': false,
    'PLC1.MainGVL.AutoMode': false,
    'PLC1.MainGVL.SimulationMode': true,
    'PLC1.MainGVL.AirPressureOK': true,
    'PLC1.MainGVL.GeneralEMG': true,

    // Comeca parada e sem lote. Sequencia: carregar o lote na ordem de
    // producao, passar para automatico e dar marcha (3 s de pre-marcha).
    'PLC1.Batches.BatchLoaded': false,
    'PLC1.BatchManager.IsSaved': true,

    // Equipamentos disponiveis: o neutro (false) seria lido como falha e o
    // cabecalho acusaria alarme assim que entrasse em marcha.
    'PLC1.Powder_01.DoserAvailable': true,
    'PLC1.Powder_02.DoserAvailable': true,
    'PLC1.Homogenizer.PeripheralsEnabled': true,

    // Tabelas de produtos e seus comboboxes
    'PLC1.Liquids.LiquidsTable': montarTabela(LIQUIDOS, 64),
    'PLC1.Powders.PowdersTable': montarTabela(POS, 64),
    'PLC1.Liquids.ComboboxLiquids': montarCombo(LIQUIDOS, 64),
    'PLC1.Powders.ComboboxPowders': montarCombo(POS, 64),

    // Receitas
    'PLC1.Recipes.RecipesLibrary': biblioteca,
    'PLC1.Recipes.aComboboxRecipes': comboReceitas,
    'PLC1.Recipes.RecipeLoaded': false,
    'PLC1.RecipesLogic.RecipeIndex': 1,

    // Consumo
    'PLC1.Consumption.LastDosis': consumo,
    'PLC1.Consumption.GoalDosis': alvos,

    // Lote exibido na tela inicial
    'PLC1.Batches.LoadedBatch.BatchName': 'OP-2026-0915',
    'PLC1.Batches.LoadedBatch.BatchWeight': 18000.0,
    'PLC1.Batches.ProcessedWeight': 6240.0
  };
});
