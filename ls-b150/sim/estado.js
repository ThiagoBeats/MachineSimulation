// ---------------------------------------------------------------------------
// Armazem de estado - PURO, roda em Node e no navegador.
//
// Tres camadas, nesta ordem de precedencia:
//   1. valor neutro derivado do schema   (sempre existe, tipo correto)
//   2. semente de valores.js             (o cenario inicial da maquina)
//   3. o que foi alterado pela tela      (arquivo em Node, localStorage na web)
//
// O ambiente injeta um "armazenamento" com carregar() e salvar(obj). Sem ele,
// o estado vive apenas na memoria da sessao.
// ---------------------------------------------------------------------------
(function (raiz, fabrica) {
  if (typeof module === 'object' && module.exports) module.exports = fabrica();
  else raiz.SimEstado = fabrica();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let esquema = null;
  let sementes = {};
  let armazenamento = null;

  let dados = {};          // simbolo mapeado -> valor completo materializado
  let virtuais = {};       // caminhos sem simbolo mapeado (ver nota abaixo)
  let persistido = {};     // o que foi alterado, para gravar
  let mudancas = new Set();

  // Nem tudo que o CLP tem esta mapeado na IHM. "Recipes.InterfaceRecipe", por
  // exemplo, so expoe alguns campos - BatchWeight e RecipeId nao existem do
  // lado da IHM. A logica emulada ainda precisa deles para se comportar como o
  // CLP, entao vivem fora da arvore dos simbolos mapeados.

  function configurar(cfg) {
    esquema = cfg.esquema;
    sementes = cfg.sementes || {};
    armazenamento = cfg.armazenamento || null;
    dados = {};
    virtuais = {};
    mudancas = new Set();
    persistido = {};
    if (armazenamento && armazenamento.carregar) {
      try { persistido = armazenamento.carregar() || {}; } catch (e) { persistido = {}; }
    }
  }

  function clonar(v) {
    return (v === null || typeof v !== 'object') ? v : JSON.parse(JSON.stringify(v));
  }

  // Aplica um patch parcial sobre o valor neutro: valores.js pode declarar so
  // os campos que interessam, sem montar a struct inteira.
  function aplicarPatch(base, patch) {
    if (patch === null || typeof patch !== 'object') return clonar(patch);
    if (Array.isArray(patch)) {
      const saida = Array.isArray(base) ? base.slice() : [];
      for (let i = 0; i < patch.length; i++) {
        if (patch[i] === undefined) continue;
        saida[i] = aplicarPatch(saida[i], patch[i]);
      }
      return saida;
    }
    const saida = (base !== null && typeof base === 'object' && !Array.isArray(base)) ? Object.assign({}, base) : {};
    for (const k of Object.keys(patch)) saida[k] = aplicarPatch(saida[k], patch[k]);
    return saida;
  }

  function materializar(dono) {
    if (dono in dados) return dados[dono];
    const simbolo = esquema.SYMBOLS[dono];
    let v = esquema.neutralValue(simbolo && simbolo.SCHEMA, 0);
    if (dono in sementes) v = aplicarPatch(v, sementes[dono]);
    if (dono in persistido) v = aplicarPatch(v, persistido[dono]);
    dados[dono] = v;
    return v;
  }

  function passo(valor, parte) {
    if (valor === null || valor === undefined) return undefined;
    if (Array.isArray(valor) && /^\d+$/.test(parte)) return valor[Number(parte)];
    if (typeof valor === 'object') return valor[parte];
    return undefined;
  }

  function ler(caminho) {
    const o = esquema.resolveOwner(caminho);
    if (!o) return (caminho in virtuais) ? virtuais[caminho] : null;
    let v = materializar(o.owner);
    for (const parte of o.rest) {
      v = passo(v, parte);
      if (v === undefined) return null;
    }
    return v;
  }

  function iguais(a, b) {
    if (a === b) return true;
    if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
    return JSON.stringify(a) === JSON.stringify(b);
  }

  // Escreve em qualquer caminho, criando os nos intermediarios que faltarem.
  function escrever(caminho, valor) {
    const o = esquema.resolveOwner(caminho);
    if (!o) {
      if (iguais(virtuais[caminho], valor)) return false;
      virtuais[caminho] = clonar(valor);
      mudancas.add(caminho);
      return true;
    }
    materializar(o.owner);

    if (o.rest.length === 0) {
      if (iguais(dados[o.owner], valor)) return false;
      dados[o.owner] = clonar(valor);
    } else {
      let no = dados[o.owner];
      for (let i = 0; i < o.rest.length - 1; i++) {
        const parte = o.rest[i];
        let proximo = passo(no, parte);
        if (proximo === undefined || proximo === null || typeof proximo !== 'object') {
          proximo = /^\d+$/.test(o.rest[i + 1]) ? [] : {};
          if (Array.isArray(no) && /^\d+$/.test(parte)) no[Number(parte)] = proximo;
          else no[parte] = proximo;
        }
        no = proximo;
      }
      const ultima = o.rest[o.rest.length - 1];
      const chave = (Array.isArray(no) && /^\d+$/.test(ultima)) ? Number(ultima) : ultima;
      if (iguais(no[chave], valor)) return false;
      no[chave] = clonar(valor);
    }

    mudancas.add(caminho);
    if (o.rest.length) mudancas.add(o.owner);
    persistido[o.owner] = clonar(dados[o.owner]);
    agendarSalvar();
    return true;
  }

  let timer = null;
  function agendarSalvar() {
    if (!armazenamento || !armazenamento.salvar || timer) return;
    timer = setTimeout(function () {
      timer = null;
      try { armazenamento.salvar(persistido); } catch (e) { /* sem persistencia */ }
    }, 400);
  }

  function coletarMudancas() {
    const lista = [...mudancas];
    mudancas.clear();
    return lista;
  }

  function resetar() {
    dados = {};
    virtuais = {};
    persistido = {};
    mudancas = new Set();
    if (armazenamento && armazenamento.limpar) {
      try { armazenamento.limpar(); } catch (e) { /* ignora */ }
    }
  }

  return { configurar, ler, escrever, coletarMudancas, resetar, clonar };
});
