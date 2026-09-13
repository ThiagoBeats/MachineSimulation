// ---------------------------------------------------------------------------
// Camada de schemas - PURA, roda em Node e no navegador.
//
// Recebe as definicoes de tipo ja carregadas (quem carrega e o ambiente) e
// sabe responder: qual o schema de um simbolo, qual o valor neutro dele e
// onde comeca o indice de um array no CLP.
// ---------------------------------------------------------------------------
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.SimEsquema = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let DEFINITIONS = {};
  let SYMBOLS = {};
  let SYMBOL_LIST = {};

  function configurar(dados) {
    DEFINITIONS = (dados && dados.DEFINITIONS) || {};
    SYMBOLS = (dados && dados.SYMBOLS) || {};
    SYMBOL_LIST = {};
    for (const nome of Object.keys(SYMBOLS)) {
      if (SYMBOLS[nome] && SYMBOLS[nome].SCHEMA) SYMBOL_LIST[nome] = { SCHEMA: SYMBOLS[nome].SCHEMA };
    }
  }

  function resolveRef(ref) {
    const m = /^tchmi:([^#]+)#\/(.+)$/.exec(ref);
    if (!m) return null;
    let no = DEFINITIONS[m[1]];
    if (!no) return null;
    for (const parte of m[2].split('/')) {
      no = no && no[decodeURIComponent(parte)];
      if (!no) return null;
    }
    return no;
  }

  // Achata $ref e allOf ate sobrar um schema com informacao de tipo.
  function flatten(schema, vistos, prof) {
    vistos = vistos || new Set();
    prof = prof || 0;
    if (!schema || typeof schema !== 'object' || prof > 20) return null;
    if (typeof schema.$ref === 'string') {
      if (vistos.has(schema.$ref)) return null;       // ciclo (struct recursiva)
      vistos.add(schema.$ref);
      return flatten(resolveRef(schema.$ref), vistos, prof + 1);
    }
    if (Array.isArray(schema.allOf)) {
      const junto = {};
      for (const ramo of schema.allOf) {
        const f = flatten(ramo, vistos, prof + 1);
        if (f) for (const k of Object.keys(f)) if (!(k in junto)) junto[k] = f[k];
      }
      for (const k of Object.keys(schema)) if (k !== 'allOf' && !(k in junto)) junto[k] = schema[k];
      return junto;
    }
    return schema;
  }

  // Valor neutro do tipo declarado. REAL e um anyOf entre numero e os valores
  // especiais ("NaN", "Infinity"): preferimos sempre o ramo concreto.
  function neutralValue(schema, prof) {
    prof = prof || 0;
    const s = flatten(schema, new Set(), 0);
    if (!s || prof > 10) return null;
    if ('default' in s) return s.default;

    const ramos = s.anyOf || s.oneOf;
    if (Array.isArray(ramos) && ramos.length) {
      const achatados = [];
      for (const r of ramos) {
        const f = flatten(r, new Set(), 0);
        if (f) achatados.push(f);
      }
      const escolhido = achatados.find(f => !f.enum) || achatados[0];
      if (escolhido) return neutralValue(escolhido, prof + 1);
    }
    if (Array.isArray(s.enum) && s.enum.length) return s.enum[0];

    let tipo = s.type;
    if (Array.isArray(tipo)) tipo = tipo[0];
    if (!tipo && s.properties) tipo = 'object';
    if (!tipo && s.items) tipo = 'array';

    switch (tipo) {
      case 'integer':
      case 'number': return 0;
      case 'string': return '';
      case 'boolean': return false;
      case 'null': return null;
      case 'array': {
        const saida = [];
        const n = s.minItems || 0;
        for (let i = 0; i < n; i++) saida.push(neutralValue(s.items, prof + 1));
        return saida;
      }
      case 'object': {
        const saida = {};
        for (const chave of Object.keys(s.properties || {})) {
          saida[chave] = neutralValue(s.properties[chave], prof + 1);
        }
        return saida;
      }
    }
    return null;
  }

  // Desce um nivel: propriedade de struct ou item de array.
  function descend(schema, parte) {
    const s = flatten(schema, new Set(), 0);
    if (!s) return null;
    if (/^\[?\d+\]?$/.test(parte) && s.items) return s.items;
    if (s.properties && s.properties[parte]) return s.properties[parte];
    return null;
  }

  // Quebra um caminho no simbolo mapeado mais proximo + o resto.
  // "PLC1.Recipes.InterfaceRecipe.RecipeName" -> dono "PLC1.Recipes.InterfaceRecipe",
  // resto ["RecipeName"]. Tambem lida com indice: "PLC1.X.Y[3]".
  function resolveOwner(nome) {
    let base = nome;
    const resto = [];
    for (;;) {
      if (SYMBOLS[base] && SYMBOLS[base].SCHEMA) return { owner: base, rest: resto.slice().reverse() };
      const m = /^(.*?)(?:\.([^.[\]]+)|\[(\d+)\])$/.exec(base);
      if (!m || !m[1]) return null;
      resto.push(m[2] !== undefined ? m[2] : m[3]);
      base = m[1];
    }
  }

  function schemaForSymbol(nome) {
    const o = resolveOwner(nome);
    if (!o) return null;
    let schema = SYMBOLS[o.owner].SCHEMA;
    for (const parte of o.rest) {
      schema = descend(schema, parte);
      if (!schema) return null;
    }
    return schema;
  }

  // Limite inferior do array no CLP (ARRAY[1..100] -> 1). O framework e o
  // armazem usam array JSON base zero; a logica emulada usa o indice do CLP.
  function startOffsetOf(nome) {
    const s = flatten(schemaForSymbol(nome), new Set(), 0);
    return (s && typeof s.startOffset === 'number') ? s.startOffset : 0;
  }

  return {
    configurar,
    flatten, neutralValue, descend, resolveOwner, schemaForSymbol, startOffsetOf,
    get DEFINITIONS() { return DEFINITIONS; },
    get SYMBOLS() { return SYMBOLS; },
    get SYMBOL_LIST() { return SYMBOL_LIST; }
  };
});
