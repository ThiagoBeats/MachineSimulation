// ---------------------------------------------------------------------------
// Compila as expressoes do FactoryTalk para JavaScript
// ---------------------------------------------------------------------------
// As expressoes ficam nos arquivos .conn e dizem o que cada objeto da tela
// mostra. A grande maioria e uma tag sozinha; 46 das 440 tem operador. O
// vocabulario inteiro do projeto e este:
//
//     AND   OR   NOT   (   )   >   <   >=   *   /
//
// Uma referencia de tag vem numa destas formas:
//     {::[B18_CORTEVA]Program:MainProgram.ServOk}   tag de programa
//     {::[LSB18]Program:MainProgram.RefFrecBDL1}    idem, com outro atalho de
//                                                   controlador (o projeto usa
//                                                   os dois nomes)
//     {[B18_CORTEVA]Caudal_Nominal_Bomba_L1}        tag de controlador
//     {::[B18_CORTEVA]Aspersor:I.Active}            ponto de E/S de um modulo
//
// A saida e uma string de codigo JavaScript que usa uma funcao v(caminho) para
// ler o valor. Ela vira funcao de verdade na hora do build, entao o navegador
// nunca precisa compilar texto.
// ---------------------------------------------------------------------------
'use strict';

// Tira o atalho do controlador e o prefixo de escopo, deixando so o caminho.
// "Program:MainProgram.X" vira "MainProgram.X"; tag de controlador fica nua.
function normalizarTag(bruta) {
  let t = bruta.trim();
  t = t.replace(/^::/, '');
  t = t.replace(/^\[[^\]]*\]/, '');            // atalho do controlador
  t = t.replace(/^Program:/, '');              // escopo de programa
  return t;
}

function compilar(expr, registrarTag) {
  if (expr === null || expr === undefined) return null;

  // O XML chega com as entidades ainda escapadas.
  let s = String(expr)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
  if (!s) return null;

  const pedacos = [];
  let i = 0;
  let achouAlgo = false;

  while (i < s.length) {
    const c = s[i];

    if (c === '{') {                                   // referencia de tag
      const fim = s.indexOf('}', i);
      if (fim < 0) return null;                        // expressao truncada
      const tag = normalizarTag(s.slice(i + 1, fim));
      if (!tag) return null;
      if (registrarTag) registrarTag(tag);
      pedacos.push('v(' + JSON.stringify(tag) + ')');
      achouAlgo = true;
      i = fim + 1;
      continue;
    }

    if (/\s/.test(c)) { pedacos.push(' '); i++; continue; }

    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] || ''))) {
      const m = /^[0-9]*\.?[0-9]+/.exec(s.slice(i));
      pedacos.push(m[0]);
      i += m[0].length;
      continue;
    }

    if (/[A-Za-z_]/.test(c)) {                         // palavra: so operadores
      const m = /^[A-Za-z_][A-Za-z_0-9]*/.exec(s.slice(i));
      const p = m[0].toUpperCase();
      if (p === 'AND') pedacos.push('&&');
      else if (p === 'OR') pedacos.push('||');
      else if (p === 'NOT') pedacos.push('!');
      else if (p === 'XOR') pedacos.push('!==');
      else return null;                                // funcao que nao suporto
      i += m[0].length;
      continue;
    }

    // operadores de dois caracteres primeiro
    const dois = s.slice(i, i + 2);
    if (dois === '>=' || dois === '<=') { pedacos.push(dois); i += 2; continue; }
    if (dois === '<>') { pedacos.push('!=='); i += 2; continue; }

    if ('+-*/()<>'.indexOf(c) >= 0) { pedacos.push(c); i++; continue; }
    if (c === '=') { pedacos.push('=='); i++; continue; }

    return null;                                       // simbolo desconhecido
  }

  if (!achouAlgo) return null;                         // sem nenhuma tag, nao serve

  // O NOT do FactoryTalk vale sobre o proximo termo. Em JavaScript "!" tem
  // precedencia maior que "&&", entao o comportamento coincide - menos quando
  // vem antes de parenteses, que tambem coincide. Nao ha caso ambiguo no
  // projeto (conferido nas 46 expressoes com operador).
  return pedacos.join('');
}

module.exports = { compilar, normalizarTag };
