// ---------------------------------------------------------------------------
// Analisador do ladder em texto neutro
// ---------------------------------------------------------------------------
// O .ACD guarda cada rung no mesmo formato de texto do export L5K:
//
//     [XIC(a) [XIC(b) ,XIO(c) ] ,XIO(a) ]MOV(x,y)TON(t,?,?);
//
// A leitura e direta quando se sabe o que cada coisa significa:
//   - elementos lado a lado         -> serie  (E logico: a energia passa por
//                                              todos, na ordem)
//   - colchetes com virgula dentro  -> ramo   (OU logico: a energia passa por
//                                              qualquer um dos caminhos)
//   - NOME(argumentos)              -> instrucao
//
// A saida e uma arvore em JSON, que o interpretador do navegador executa. Nao
// transcrevemos o ladder para JavaScript a mao: o programa continua sendo o do
// CLP, e o que escrevemos uma vez so e o significado de cada instrucao.
// ---------------------------------------------------------------------------
'use strict';

// --- separa os argumentos respeitando parenteses e colchetes ------------------
function separarArgumentos(s) {
  const fora = [];
  let nivel = 0, atual = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '(' || c === '[') nivel++;
    else if (c === ')' || c === ']') nivel--;
    if (c === ',' && nivel === 0) { fora.push(atual.trim()); atual = ''; continue; }
    atual += c;
  }
  if (atual.trim() || fora.length) fora.push(atual.trim());
  return fora;
}

// --- expressoes de CPT e CMP ---------------------------------------------------
// Gramatica pequena: comparacao sobre soma sobre produto sobre termo.
function analisarExpressao(texto) {
  const s = String(texto || '');
  let i = 0;

  function espacos() { while (i < s.length && /\s/.test(s[i])) i++; }

  function termo() {
    espacos();
    if (s[i] === '(') {
      i++;
      const e = disjuncao();
      espacos();
      if (s[i] === ')') i++;
      return e;
    }
    if (s[i] === '-') { i++; return { t: 'neg', a: termo() }; }
    const m = /^[0-9]+(\.[0-9]+)?/.exec(s.slice(i));
    if (m) { i += m[0].length; return { t: 'n', v: Number(m[0]) }; }
    const t = /^[A-Za-z_][A-Za-z0-9_.:]*(\[[^\]]*\])?([A-Za-z0-9_.]*)?/.exec(s.slice(i));
    if (t) { i += t[0].length; return { t: 'tag', c: t[0] }; }
    i++;
    return { t: 'n', v: 0 };
  }

  function produto() {
    let e = termo();
    for (;;) {
      espacos();
      const c = s[i];
      if (c !== '*' && c !== '/') return e;
      i++;
      e = { t: 'op', o: c, a: e, b: termo() };
    }
  }

  function soma() {
    let e = produto();
    for (;;) {
      espacos();
      const c = s[i];
      if (c !== '+' && c !== '-') return e;
      i++;
      e = { t: 'op', o: c, a: e, b: produto() };
    }
  }

  function comparacao() {
    const e = soma();
    espacos();
    const dois = s.slice(i, i + 2);
    if (dois === '>=' || dois === '<=' || dois === '<>' || dois === '!=') {
      i += 2;
      return { t: 'cmp', o: (dois === '<>' || dois === '!=') ? '<>' : dois, a: e, b: soma() };
    }
    if (s.slice(i, i + 2) === '==') { i += 2; return { t: 'cmp', o: '=', a: e, b: soma() }; }
    const c = s[i];
    if (c === '>' || c === '<' || c === '=') {
      i++;
      return { t: 'cmp', o: c, a: e, b: soma() };
    }
    return e;
  }

  // Os blocos funcionais convertidos trazem expressoes logicas dentro do CMP:
  //   CMP(TONR_01.FBD_TIMER.DN && __lD9F2CF5567E28EBB)
  // Sem tratar && , || e ! o CMP devolvia sempre falso, e a dosagem nunca
  // terminava - o Fin_Test do Control_Liquido depende de uma dessas.
  function negacao() {
    espacos();
    if (s[i] === '!' && s[i + 1] !== '=') { i++; return { t: 'nao', a: negacao() }; }
    return comparacao();
  }

  function conjuncao() {
    let e = negacao();
    for (;;) {
      espacos();
      if (s.slice(i, i + 2) !== '&&') return e;
      i += 2;
      e = { t: 'e', a: e, b: negacao() };
    }
  }

  function disjuncao() {
    let e = conjuncao();
    for (;;) {
      espacos();
      if (s.slice(i, i + 2) !== '||') return e;
      i += 2;
      e = { t: 'ou', a: e, b: conjuncao() };
    }
  }

  return disjuncao();
}

// --- instrucoes que carregam expressao em vez de lista de tags ------------------
const COM_EXPRESSAO = { CMP: 0, CPT: 1, LIM: -1 };

// --- analisa um rung ------------------------------------------------------------
function analisarRung(texto) {
  const s = String(texto || '').replace(/;\s*$/, '');
  let i = 0;

  function serie(ate) {
    const itens = [];
    for (;;) {
      while (i < s.length && /[\s]/.test(s[i])) i++;
      if (i >= s.length) break;
      const c = s[i];
      if (c === ']' || c === ',') break;
      if (c === '[') { i++; itens.push(ramo()); continue; }
      const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*\(/.exec(s.slice(i));
      if (!m) { i++; continue; }                    // lixo, ignora
      i += m[0].length;
      const inicio = i;
      let nivel = 1;
      while (i < s.length && nivel > 0) {
        if (s[i] === '(') nivel++;
        else if (s[i] === ')') nivel--;
        if (nivel > 0) i++;
      }
      const dentro = s.slice(inicio, i);
      if (s[i] === ')') i++;
      itens.push(instrucao(m[1], dentro));
    }
    return itens.length === 1 ? itens[0] : { t: 'serie', i: itens };
  }

  function ramo() {
    const ramos = [];
    for (;;) {
      ramos.push(serie());
      while (i < s.length && /\s/.test(s[i])) i++;
      if (s[i] === ',') { i++; continue; }
      if (s[i] === ']') { i++; break; }
      if (i >= s.length) break;
      i++;
    }
    return ramos.length === 1 ? ramos[0] : { t: 'par', r: ramos };
  }

  function instrucao(nome, dentro) {
    const no = { t: 'i', n: nome };
    const posExpr = COM_EXPRESSAO[nome];
    const args = separarArgumentos(dentro);
    if (posExpr !== undefined && posExpr >= 0) {
      no.a = args.map(function (x, k) {
        return k === posExpr ? { t: 'e', v: analisarExpressao(x) } : x;
      });
    } else if (posExpr === -1) {
      no.a = args;
    } else {
      no.a = args;
    }
    return no;
  }

  const arvore = serie();
  return arvore;
}

// --- tudo que um rung le e escreve, para conferencia e para a montagem --------------
function tagsDe(no, saida) {
  saida = saida || new Set();
  if (!no || typeof no !== 'object') return saida;
  if (no.t === 'serie') no.i.forEach(function (x) { tagsDe(x, saida); });
  else if (no.t === 'par') no.r.forEach(function (x) { tagsDe(x, saida); });
  else if (no.t === 'i') {
    (no.a || []).forEach(function (a) {
      if (typeof a === 'string') {
        if (/^[A-Za-z_]/.test(a)) saida.add(a);
      } else if (a && a.t === 'e') tagsDaExpressao(a.v, saida);
    });
  }
  return saida;
}

function tagsDaExpressao(e, saida) {
  if (!e || typeof e !== 'object') return;
  if (e.t === 'tag') saida.add(e.c);
  if (e.a) tagsDaExpressao(e.a, saida);
  if (e.b) tagsDaExpressao(e.b, saida);
}

module.exports = { analisarRung, analisarExpressao, tagsDe, separarArgumentos };
