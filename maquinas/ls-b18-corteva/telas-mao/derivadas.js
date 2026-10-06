// ---------------------------------------------------------------------------
// TELAS DERIVADAS: as copias por linha
// ---------------------------------------------------------------------------
// Varias telas do projeto existem seis vezes, uma por linha de liquido, e sao
// identicas fora o numero. O ViewPoint publicou so a primeira de cada familia;
// as outras ficaram no binario .gfx.
//
// Em vez de desenhar cada uma, derivam-se da gemea publicada. Foi conferido no
// proprio binario que a diferenca e so o numero: comparando "Calibra Liquido 1"
// com "Calibra Liquido 2", a unica legenda diferente e o titulo e as unicas
// tags diferentes sao as que carregam o sufixo da linha.
//
// A troca e feita so onde e segura:
//   - nas tags, dentro das expressoes de leitura e escrita;
//   - no destino dos botoes que voltam para a tela da propria linha;
//   - no titulo da tela.
// O trilho NAO entra: os botoes "LIQUIDO 1".."LIQUIDO 5" apontam para as outras
// linhas de proposito, e renumera-los quebraria a navegacao.
// ---------------------------------------------------------------------------

'use strict';

// ---------------------------------------------------------------------------
// DUAS FALHAS DA IHM ORIGINAL, encontradas ao conferir as copias.
//
// Numa tela "da linha N", toda tag com sufixo de linha deveria terminar em N.
// Duas nao terminam, e sao copia-e-cola que ficou para tras:
//
//   Calibra Balanza Tk L3  usa  Cmd_Calib_Tk_L2
//       apertar "calibrar" na tela do tanque 3 manda o comando para o TANQUE 2.
//
//   Liquido L5             usa  Peso_Tk_L4
//       a tela da linha 5 mostra o peso do TANQUE 4.
//
// Aqui as copias saem com a tag CERTA. Repetir o defeito faria o aluno aprender
// errado, e na simulacao ele pareceria defeito nosso. Os dois estao reportados
// para correcao no projeto.
// ---------------------------------------------------------------------------

const FAMILIAS = [
  {
    // a gemea publicada                 as que faltam
    fonte: 'Calibra Balanza Tk L1', numeros: [3, 4, 5, 6],
    nome: n => 'Calibra Balanza Tk L' + n,
    titulo: { de: /CALIBRAR BALANÇA DO TANQUE 1/, para: n => 'CALIBRAR BALANÇA DO TANQUE ' + n },
  },
  {
    fonte: 'Calibra Liquido 1', numeros: [2, 3, 4, 5, 6],
    nome: n => 'Calibra Liquido ' + n,
    titulo: { de: /CALIBRAÇÃO LIQUIDO 1/, para: n => 'CALIBRAÇÃO LIQUIDO ' + n },
  },
];

// Troca o numero da linha so no fim de um nome de tag.
//
// O sublinhado conta como letra para a borda de palavra, entao "_L1\b" NAO casa
// em "Dosis_L1_corregida" - o \b falha entre o "1" e o "_" seguinte. Por isso o
// caso com sufixo vem antes e explicito.
function trocarTags(texto, n) {
  return String(texto)
    .replace(/_L1_corregida\b/g, '_L' + n + '_corregida')
    .replace(/_Tk_L1\b/g, '_Tk_L' + n)
    .replace(/_L1\b/g, '_L' + n)
    .replace(/\bOffsetL1\b/g, 'OffsetL' + n)
    .replace(/\bIniCalibrar_L1\b/g, 'IniCalibrar_L' + n);
}

function clonar(v) {
  return JSON.parse(JSON.stringify(v));
}

function derivarUma(origem, fam, n) {
  const t = clonar(origem);
  t.nome = fam.nome(n);

  (function anda(lista) {
    for (const e of lista) {
      // as expressoes de leitura e de comando
      for (const campo of ['valor', 'escreve']) {
        if (typeof e[campo] === 'string') e[campo] = trocarTags(e[campo], n);
      }
      if (e.visivel && typeof e.visivel.expr === 'string') e.visivel.expr = trocarTags(e.visivel.expr, n);
      if (e.animaCor && typeof e.animaCor.expr === 'string') e.animaCor.expr = trocarTags(e.animaCor.expr, n);
      if (typeof e.indicador === 'string') e.indicador = trocarTags(e.indicador, n);

      // o botao que volta para a tela da propria linha
      if (e.destino === 'Liquido L1') e.destino = 'Liquido L' + n;

      // o titulo
      if (e.t === 'texto' && typeof e.texto === 'string' && fam.titulo.de.test(e.texto)) {
        e.texto = e.texto.replace(fam.titulo.de, fam.titulo.para(n));
      }
      if (e.estados) {
        for (const s of e.estados) {
          if (s.legenda && typeof s.legenda.texto === 'string' && fam.titulo.de.test(s.legenda.texto)) {
            s.legenda.texto = s.legenda.texto.replace(fam.titulo.de, fam.titulo.para(n));
          }
        }
      }

      if (e.filhos) anda(e.filhos);
    }
  })(t.elementos);

  t.derivadaDe = origem.nome;
  return t;
}

function derivar(telas) {
  const feitas = [];
  for (const fam of FAMILIAS) {
    const origem = telas[fam.fonte];
    if (!origem) {
      console.warn('  derivadas: nao achei a tela "' + fam.fonte + '"; a familia dela fica de fora');
      continue;
    }
    for (const n of fam.numeros) {
      const nome = fam.nome(n);
      if (telas[nome]) continue;              // ja veio do XAML
      telas[nome] = derivarUma(origem, fam, n);
      feitas.push(nome);
    }
  }
  return feitas;
}

module.exports = { derivar };
