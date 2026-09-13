// ---------------------------------------------------------------------------
// LOGICA DO CLP EMULADA EM JAVASCRIPT - PURA, roda em Node e no navegador.
//
// ATENCAO: este arquivo e uma COPIA da logica que roda no CLP, transcrita do
// POU  POUs^Recipes^RecipesLogic  e de suas acoes RecipeValidation,
// RecipeNameDuplicate, TimeCalculation, LiquidsList e PowdersList.
//
// Se alguem alterar o ST no projeto do CLP, ESTE ARQUIVO FICA DESATUALIZADO em
// silencio. Ele existe para que a simulacao se comporte como a maquina em
// treinamentos - nunca deve ser tratado como fonte da verdade.
//
// Convencao de indices: o CLP usa o indice declarado no ARRAY (normalmente
// base 1); o armazem e o framework usam array JSON base 0. As funcoes lib(),
// cbx() e cfg() convertem lendo o startOffset do proprio schema.
// ---------------------------------------------------------------------------
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.SimLogica = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let esquema = null;
  let estado = null;
  let ler = null;
  let escrever = null;

  const P = 'PLC1.';
  const R = P + 'Recipes.';
  const L = P + 'RecipesLogic.';

  let OFF_LIB = 1, OFF_CBX = 1, OFF_LIQ = 1, OFF_POW = 1, OFF_TAB_LIQ = 1, OFF_TAB_POW = 1;
  let SCHEMA_RECEITA = null;
  let CAMPOS_RECEITA = [];

  function configurar(cfg) {
    esquema = cfg.esquema;
    estado = cfg.estado;
    ler = estado.ler;
    escrever = estado.escrever;

    OFF_LIB = esquema.startOffsetOf(R + 'RecipesLibrary');
    OFF_CBX = esquema.startOffsetOf(R + 'aComboboxRecipes');
    OFF_LIQ = esquema.startOffsetOf(R + 'InterfaceRecipe.LiquidsConfig');
    OFF_POW = esquema.startOffsetOf(R + 'InterfaceRecipe.PowderConfig');
    OFF_TAB_LIQ = esquema.startOffsetOf(P + 'Liquids.LiquidsTable');
    OFF_TAB_POW = esquema.startOffsetOf(P + 'Powders.PowdersTable');

    SCHEMA_RECEITA = esquema.flatten(esquema.schemaForSymbol(R + 'RecipesLibrary[0]'));
    CAMPOS_RECEITA = Object.keys((SCHEMA_RECEITA && SCHEMA_RECEITA.properties) || {});
  }

  function lib(i, campo) {
    return R + 'RecipesLibrary[' + (i - OFF_LIB) + ']' + (campo ? '.' + campo : '');
  }
  function cbx(i, campo) {
    return R + 'aComboboxRecipes[' + (i - OFF_CBX) + ']' + (campo ? '.' + campo : '');
  }
  function cfgLiq(base, i, campo) {
    return base + '.LiquidsConfig[' + (i - OFF_LIQ) + ']' + (campo ? '.' + campo : '');
  }
  function cfgPow(base, i, campo) {
    return base + '.PowderConfig[' + (i - OFF_POW) + ']' + (campo ? '.' + campo : '');
  }

  // A IHM nao expoe "InterfaceRecipe" como simbolo unico, so alguns campos.
  // Por isso toda copia de receita e feita CAMPO A CAMPO: assim cada campo vai
  // para o simbolo mapeado correspondente. Copiar a struct de uma vez seria
  // silenciosamente ignorado.
  function lerReceita(base) {
    const o = {};
    for (const campo of CAMPOS_RECEITA) o[campo] = ler(base + '.' + campo);
    return o;
  }
  function escreverReceita(base, receita) {
    for (const campo of CAMPOS_RECEITA) escrever(base + '.' + campo, estado.clonar(receita[campo]));
  }
  function zerarReceita(base) {
    escreverReceita(base, esquema.neutralValue(SCHEMA_RECEITA, 0) || {});
  }

  function qtdLiquidos() { return Number(ler(P + 'MachineParameters.LiquidsQty')) || 0; }
  function qtdPos() { return Number(ler(P + 'MachineParameters.PowderQty')) || 0; }

  function indiceReceita() {
    let idx = Number(ler(L + 'RecipeIndex')) || 0;
    if (idx === 0) idx = OFF_LIB;
    return idx;
  }

  // --- acao RecipeValidation -----------------------------------------------
  // RecipeOK: 0 OK | 1 sem dados | 2 dose <= 0 | 3 injecao <= 0 | 4 vel. mixer
  //           5 vel. descarga | 6 tempo mistura | 7 tempo descarga
  function recipeValidation() {
    const IR = R + 'InterfaceRecipe';
    const nLiq = qtdLiquidos();
    const nPow = qtdPos();
    let recipeOK = 0;

    for (let i = OFF_LIQ; i < OFF_LIQ + nLiq; i++) {
      if (ler(cfgLiq(IR, i, 'Step')) !== 0) { recipeOK = 0; break; }
      recipeOK = 1;
    }
    if (recipeOK === 1) {
      for (let i = OFF_POW; i < OFF_POW + nPow; i++) {
        if (ler(cfgPow(IR, i, 'Step')) !== 0) { recipeOK = 0; break; }
        recipeOK = 1;
      }
    }

    let linhaLiq = Number(ler(L + 'LineLiqLog')) || 0;
    if (recipeOK === 0) {
      linhaLiq = 0;
      for (let i = OFF_LIQ; i < OFF_LIQ + nLiq; i++) {
        if (ler(cfgLiq(IR, i, 'Step')) !== 0) {
          if (ler(cfgLiq(IR, i, 'Dosage')) <= 0) { recipeOK = 2; linhaLiq = i; break; }
          if (ler(cfgLiq(IR, i, 'InjectionTime')) <= 0) { recipeOK = 3; linhaLiq = i; break; }
          linhaLiq = 0; recipeOK = 0;
        }
      }
    }

    let linhaPow = Number(ler(L + 'LinePowLog')) || 0;
    if (recipeOK === 0) {
      linhaPow = 0;
      for (let i = OFF_POW; i < OFF_POW + nPow; i++) {
        if (ler(cfgPow(IR, i, 'Step')) !== 0) {
          if (ler(cfgPow(IR, i, 'Dosage')) <= 0) { recipeOK = 2; linhaPow = i; break; }
          if (ler(cfgPow(IR, i, 'InjectionTime')) <= 0) { recipeOK = 3; linhaPow = i; break; }
          linhaPow = 0; recipeOK = 0;
        }
      }
    }

    if (recipeOK === 0) {
      if (ler(IR + '.MixerSpeed') <= 0) recipeOK = 4;
      else if (ler(IR + '.UnloadSpeed') <= 0) recipeOK = 5;
      else if (ler(IR + '.MixingTime') <= 0) recipeOK = 6;
      else if (ler(IR + '.UnloadTime') <= 0) recipeOK = 7;
      else recipeOK = 0;
    }

    escrever(L + 'RecipeOK', recipeOK);
    escrever(L + 'LineLiqLog', linhaLiq);
    escrever(L + 'LinePowLog', linhaPow);

    // No CLP: NOT MEMCMP(iface, lib[idx]) AND lib[idx].RecipeName <> ''
    const idx = indiceReceita();
    const iface = lerReceita(IR);
    const salva = lerReceita(lib(idx));
    const nomeSalvo = ler(lib(idx, 'RecipeName'));
    escrever(L + 'IsSaved', JSON.stringify(iface) === JSON.stringify(salva) && nomeSalvo !== '');

    const nomeMaquina = ler(R + 'MachineRecipe.RecipeName');
    const nomeIface = ler(IR + '.RecipeName');
    escrever(L + 'IsLoaded', nomeMaquina === nomeIface && nomeMaquina !== '');
  }

  // --- acao RecipeNameDuplicate --------------------------------------------
  // Se o nome ja existir em outro slot, marca ExistingName e APAGA o digitado.
  function recipeNameDuplicate() {
    const idx = indiceReceita();
    const nome = ler(R + 'InterfaceRecipe.RecipeName');
    let existe = false;
    for (let i = OFF_LIB; i < OFF_LIB + 100; i++) {
      if (nome !== '' && i !== idx && ler(lib(i, 'RecipeName')) === nome) {
        existe = true;
        escrever(R + 'InterfaceRecipe.RecipeName', '');
        break;
      }
    }
    escrever(L + 'ExistingName', existe);
    return existe;
  }

  // --- acao TimeCalculation ------------------------------------------------
  function timeCalculation() {
    const idx = indiceReceita();
    const nLiq = qtdLiquidos();
    const nPow = qtdPos();
    const base = R + 'RecipesLibrary[' + (idx - OFF_LIB) + ']';
    let total = 0;

    for (let etapa = 1; etapa <= nLiq; etapa++) {
      let pico = 0;
      for (let j = 1; j <= nLiq + nPow; j++) {
        if (ler(cfgLiq(base, j + OFF_LIQ - 1, 'Step')) === etapa) {
          const v = (ler(cfgLiq(base, j + OFF_LIQ - 1, 'InjectionDelay')) || 0) +
                    (ler(cfgLiq(base, j + OFF_LIQ - 1, 'InjectionTime')) || 0);
          if (v > pico) pico = v;
        } else if (ler(cfgPow(base, j + OFF_POW - 1, 'Step')) === etapa) {
          const v = (ler(cfgPow(base, j + OFF_POW - 1, 'InjectionDelay')) || 0) +
                    (ler(cfgPow(base, j + OFF_POW - 1, 'InjectionTime')) || 0);
          if (v > pico) pico = v;
        }
      }
      total += pico;
    }

    total += (ler(base + '.MixingTime') || 0) + (ler(base + '.UnloadTime') || 0);
    escrever(base + '.TotalTime', total);
    escrever(R + 'InterfaceRecipe.TotalTime', total);
  }

  // --- acoes LiquidsList / PowdersList -------------------------------------
  function listasDeProdutos() {
    for (let i = 0; i < 64; i++) {
      const nomeL = ler(P + 'Liquids.LiquidsTable[' + i + '].ProductName');
      escrever(P + 'Liquids.ComboboxLiquids[' + i + '].text', nomeL ? nomeL : 'Vazio');
      escrever(P + 'Liquids.ComboboxLiquids[' + i + '].id', i + OFF_TAB_LIQ);

      const nomeP = ler(P + 'Powders.PowdersTable[' + i + '].ProductName');
      escrever(P + 'Powders.ComboboxPowders[' + i + '].text', nomeP ? nomeP : 'Vazio');
      escrever(P + 'Powders.ComboboxPowders[' + i + '].id', i + OFF_TAB_POW);
    }
  }

  // --- corpo do PROGRAM RecipesLogic ---------------------------------------
  function umCiclo() {
    if ((Number(ler(L + 'RecipeIndex')) || 0) === 0) escrever(L + 'RecipeIndex', OFF_LIB);
    const idx = indiceReceita();

    if (ler(L + 'RefreshList')) {
      listasDeProdutos();
      escrever(L + 'RefreshList', false);
    }

    recipeValidation();

    if (ler(L + 'ShowLoaded')) {
      escrever(L + 'RecipeIndex', ler(R + 'MachineRecipe.RecipeId'));
      escrever(L + 'ShowLoaded', false);
      escrever(L + 'Refresh', true);
    }

    // Trocou a receita no combobox: traz a selecionada para a tela.
    if (ler(L + 'Refresh')) {
      escreverReceita(R + 'InterfaceRecipe', lerReceita(lib(indiceReceita())));
      escrever(L + 'Refresh', false);
    }

    if (ler(L + 'LoadToMachine')) {
      escreverReceita(R + 'MachineRecipe', lerReceita(R + 'InterfaceRecipe'));
      escrever(R + 'RecipeLoaded', true);
      escrever(L + 'LoadToMachine', false);
    }

    if (ler(L + 'UnloadRecipe')) {
      zerarReceita(R + 'MachineRecipe');
      escrever(R + 'RecipeLoaded', false);
      escrever(L + 'UnloadRecipe', false);
    }

    if (ler(L + 'SaveRecipe')) {
      recipeNameDuplicate();
      const nome = ler(R + 'InterfaceRecipe.RecipeName');
      if (nome !== '' && !ler(L + 'ExistingName')) {
        escreverReceita(lib(idx), lerReceita(R + 'InterfaceRecipe'));
        escrever(lib(idx, 'RecipeId'), idx);
        escrever(cbx(idx, 'text'), nome);
        escrever(cbx(idx, 'id'), idx);
        timeCalculation();
      }
      escrever(L + 'SaveRecipe', false);
    }

    if (ler(L + 'ExcludeRecipe')) {
      zerarReceita(lib(idx));
      zerarReceita(R + 'InterfaceRecipe');
      escrever(cbx(idx, 'text'), 'Vazio');
      escrever(cbx(idx, 'id'), idx);
      escrever(L + 'Refresh', true);
      escrever(L + 'ExcludeRecipe', false);
    }
  }

  const COMANDOS = ['Refresh', 'RefreshList', 'ShowLoaded', 'LoadToMachine',
                    'UnloadRecipe', 'SaveRecipe', 'ExcludeRecipe'];

  function pendente() {
    return COMANDOS.some(c => !!ler(L + c));
  }

  // Alguns comandos setam outros (ExcludeRecipe liga Refresh). No CLP isso
  // resolve no ciclo seguinte; aqui rodamos ate estabilizar.
  function ciclo() {
    for (let i = 0; i < 6; i++) {
      umCiclo();
      if (!pendente()) break;
    }
    // A validacao roda no INICIO do ciclo do CLP, entao os comandos tratados
    // agora so refletiriam em RecipeOK, IsSaved e IsLoaded no scan seguinte.
    // Aqui esse "scan seguinte" e imediato.
    recipeValidation();
  }

  return { configurar, ciclo, listasDeProdutos };
});
