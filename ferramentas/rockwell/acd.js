// ---------------------------------------------------------------------------
// Leitor de projeto Studio 5000 (.ACD)
// ---------------------------------------------------------------------------
// Devolve as tags, as rotinas e o ladder de um projeto Rockwell SEM precisar do
// Studio 5000. O formato nao e documentado; o que esta aqui foi deduzido do
// proprio arquivo, e cada passo tem uma conferencia que acusa se a premissa
// deixou de valer.
//
// O arquivo tem quatro camadas:
//
// 1. TABELA DE REGIOES, no FIM do arquivo (nao no comeco). Registros de 0x210
//    bytes: [+0x04] tamanho, [+0x08] deslocamento, [+0x0c] nome em UTF-16LE.
//
// 2. Cada regiao e um GZIP comum. Nada de compressao propria aqui - isso e so
//    no .mer.
//
// 3. Comps.Idx: a arvore de componentes do projeto. Registros marcados com
//    fa fa: [+0x16] id, [+0x1a] id do pai, [+0x1e] nome em UTF-16LE. Subindo
//    pelos pais sai o caminho completo de cada tag e rotina.
//
// 4. SbRegion.Idx: o codigo. Registros fa fa com [+0x0c] id da regiao,
//    [+0x39] tamanho do texto e [+0x3d] o texto em UTF-16LE, no mesmo formato
//    neutro do export L5K. As tags aparecem como @id@ e sao resolvidas pelo
//    mapa do Comps.
//
// A ORDEM DE VARREDURA nao esta no texto: ela vem de RegnLink.Idx, um vetor de
// registros de 22 bytes a partir de 0x90c que forma uma LISTA LIGADA por
// rotina - [+0x04] dono, [+0x08] regiao anterior, [+0x0c] proxima. Sem isso os
// rungs saem na ordem de gravacao, que e embaralhada, e latch/unlatch e JMP
// passam a dar resultado errado.
// ---------------------------------------------------------------------------
'use strict';

const fs = require('fs');
const zlib = require('zlib');

const PASSO_DIRETORIO = 0x210;
const MARCA = 0xFAFA;            // registro de dado
const MARCA_CONTROLE = 0xFEFE;   // registro de controle, sem conteudo util

function hex(n) { return (n >>> 0).toString(16).padStart(8, '0'); }

// --- 1. tabela de regioes -------------------------------------------------------
function lerDiretorio(b) {
  function registro(o) {
    if (o < 0 || o + PASSO_DIRETORIO > b.length) return null;
    let nome = '';
    for (let i = o + 12; i + 1 < o + 12 + 220; i += 2) {
      const c = b.readUInt16LE(i);
      if (!c) break;
      if (c < 32 || c > 126) return null;
      nome += String.fromCharCode(c);
    }
    if (!nome) return null;
    const desloc = b.readUInt32LE(o + 8);
    if (desloc >= b.length) return null;
    return { nome, tam: b.readUInt32LE(o + 4), desloc, reg: o };
  }

  // A tabela fica no fim. Nao basta achar UM registro valido: um deslocamento
  // desalinhado tambem casa, porque o final de um nome ("...ize.Dat") ainda
  // parece um nome. Entao testamos cada candidato e ficamos com o que forma a
  // cadeia mais longa de 0x210 em 0x210 - a tabela de verdade tem dezenas de
  // entradas, e um casamento por acaso tem duas ou tres.
  // Contar registros nao basta como criterio: um deslocamento 2 bytes a frente
  // tambem forma uma cadeia longa, so que com os nomes comendo a primeira
  // letra ("omps.Idx" em vez de "Comps.Idx"). O criterio que desempata de
  // verdade e o conteudo: as regioes tem de ladrilhar o arquivo, entao a
  // primeira delas comeca no byte zero.
  function cadeiaDe(o) {
    const lista = [];
    for (let p = o; registro(p); p -= PASSO_DIRETORIO) lista.unshift(registro(p));
    for (let p = o + PASSO_DIRETORIO; registro(p); p += PASSO_DIRETORIO) lista.push(registro(p));
    return lista;
  }

  let ents = null, melhor = 0;
  const limite = Math.max(0, b.length - 0x40000);
  for (let o = b.length - PASSO_DIRETORIO; o >= limite; o--) {
    if (!registro(o)) continue;
    const lista = cadeiaDe(o);
    if (lista.length <= melhor) continue;
    if (!lista.some(e => e.desloc === 0)) continue;
    melhor = lista.length;
    ents = lista;
  }
  if (!ents || melhor < 5) throw new Error('nao encontrei a tabela de regioes');

  const inicioDiretorio = ents[0].reg;
  ents.sort((a, c) => a.desloc - c.desloc);

  const regioes = {};
  for (let i = 0; i < ents.length; i++) {
    const fim = (i + 1 < ents.length) ? ents[i + 1].desloc : inicioDiretorio;
    const bruto = b.slice(ents[i].desloc, fim);
    if (bruto[0] === 0x1f && bruto[1] === 0x8b) {
      try {
        regioes[ents[i].nome] = zlib.gunzipSync(bruto, { finishFlush: zlib.constants.Z_SYNC_FLUSH });
      } catch (e) { regioes[ents[i].nome] = bruto; }
    } else {
      regioes[ents[i].nome] = bruto;
    }
  }
  return regioes;
}

// --- percorre os registros de uma regiao --------------------------------------------
// E preciso CAMINHAR de registro em registro pelo tamanho de cada um, e nao
// varrer o arquivo procurando o marcador: o texto do ladder contem bytes que
// parecem marcador, e os registros falsos que saem dai sobrescrevem os bons.
// A cadeia comeca em 0x200 e termina quando o marcador deixa de ser valido.
// Algumas regioes tem mais de uma cadeia, com lacunas entre elas. Quando o
// passo quebra, andamos de byte em byte ate um ponto que volte a parecer uma
// cadeia - e so aceitamos a ressincronizacao se o registro SEGUINTE tambem for
// valido, o que derruba quase todos os falsos positivos.
function ehRegistro(b, p) {
  if (p + 8 > b.length) return 0;
  const marca = b.readUInt16LE(p);
  if (marca !== MARCA && marca !== MARCA_CONTROLE) return 0;
  const tam = b.readUInt32LE(p + 2);
  if (tam < 8 || p + tam > b.length) return 0;
  return tam;
}

function* registros(b) {
  let p = 0x200;
  while (p + 8 <= b.length) {
    const tam = ehRegistro(b, p);
    if (tam) {
      if (b.readUInt16LE(p) === MARCA) yield { off: p, tam };
      p += tam;
      continue;
    }
    let q = p + 1;
    while (q + 8 <= b.length) {
      const t = ehRegistro(b, q);
      if (t && ehRegistro(b, q + t)) break;
      q++;
    }
    if (q + 8 > b.length) return;
    p = q;
  }
}

function utf16Ate(b, ini, fim) {
  let s = '';
  for (let p = ini; p + 1 < fim; p += 2) {
    const c = b.readUInt16LE(p);
    if (!c) break;
    if (c < 32 || c > 0x2000) return null;
    s += String.fromCharCode(c);
  }
  return s;
}

// --- 3. arvore de componentes ------------------------------------------------------
function lerComponentes(b) {
  const porId = new Map();
  for (const r of registros(b)) {
    const nome = utf16Ate(b, r.off + 0x1e, r.off + r.tam);
    if (!nome || nome.length > 200) continue;
    const id = b.readUInt32LE(r.off + 0x16);
      // O byte em +0x302 diz para que serve a tag dentro de um AOI: 100, 104
      // e 108 marcam PARAMETRO (os tres modos de passagem), qualquer outro
      // valor e tag local do AOI. E por isso que a chamada do AOI casa com a
      // lista de parametros posicao por posicao.
      const uso = (r.tam > 0x302) ? b[r.off + 0x302] : 0;
      if (!porId.has(id)) porId.set(id, { id, pai: b.readUInt32LE(r.off + 0x1a), nome, ordem: r.off, uso });
  }

  const caminho = new Map();
  for (const id of porId.keys()) {
    const partes = [];
    const visto = new Set();
    let atual = id;
    while (atual && porId.has(atual) && !visto.has(atual) && partes.length < 12) {
      visto.add(atual);
      partes.unshift(porId.get(atual).nome);
      atual = porId.get(atual).pai;
    }
    caminho.set(id, partes.join('.'));
  }
  return { porId, caminho };
}

// --- 4. o codigo -------------------------------------------------------------------
// Cada regiao tem VARIOS registros, um por atributo, todos com o mesmo id:
// "Rung NT" / "REGION NT" guardam o texto neutro que interessa, e junto vem
// "REGION AST" (a arvore tokenizada), "REGION LE UID", "REGION TE AST" e
// outros. Sem filtrar pelo rotulo, o ultimo registro lido apaga o texto bom.
const ROTULOS = { 'Rung NT': 'Rung', 'REGION NT': 'Region' };

function lerCodigo(b) {
  const textos = new Map();
  const porRotulo = {};
  let conferidos = 0;
  for (const r of registros(b)) {
    let rotulo = '';
    for (let p = r.off + 0x10; p < r.off + 0x39 && b[p]; p++) rotulo += String.fromCharCode(b[p]);
    porRotulo[rotulo] = (porRotulo[rotulo] || 0) + 1;

    const tipo = ROTULOS[rotulo];
    if (!tipo) continue;
    const tamTexto = b.readUInt32LE(r.off + 0x39);
    if (0x3d + tamTexto !== r.tam) continue;              // a conferencia do formato
    conferidos++;

    let s = '';
    for (let p = r.off + 0x3d; p + 1 < r.off + r.tam; p += 2) {
      const c = b.readUInt16LE(p);
      if (!c) break;
      s += String.fromCharCode(c);
    }
    // Regiao vazia tambem conta: ela nao faz nada, mas ocupa uma posicao na
    // rotina. Descartar aqui desloca o indice de todos os blocos seguintes.
    textos.set(b.readUInt32LE(r.off + 0x0c), { tipo, texto: s });
  }
  const esperados = (porRotulo['Rung NT'] || 0) + (porRotulo['REGION NT'] || 0);
  return { textos, conferidos, esperados, porRotulo };
}

// --- ordem de varredura --------------------------------------------------------------
function lerOrdem(b) {
  const proxima = new Map();                 // dono -> Map(de -> para)
  for (let p = 0x90c; p + 22 <= b.length; p += 22) {
    const dono = b.readUInt32LE(p + 4);
    if (dono === 0xFFFFFFFF) continue;
    if (!proxima.has(dono)) proxima.set(dono, new Map());
    proxima.get(dono).set(b.readUInt32LE(p + 8), b.readUInt32LE(p + 12));
  }
  const cadeias = new Map();
  for (const dono of proxima.keys()) {
    const passos = proxima.get(dono);
    const saida = [];
    const visto = new Set();
    let atual = passos.get(dono);            // a cabeca aponta para si mesma
    while (atual !== undefined && atual !== 0xFFFFFFFF && !visto.has(atual)) {
      visto.add(atual);
      saida.push(atual);
      atual = passos.get(atual);
    }
    cadeias.set(dono, saida);
  }
  return cadeias;
}

// --- donos que nao sao componentes ------------------------------------------------------
// Doze rotinas guardam o codigo sob um dono intermediario, que nao aparece no
// Comps. O grafo de Nameless liga esse dono de volta a rotina: cada registro
// tem o pai em +0x0e e o filho em +0x12.
// O grafo precisa valer nos DOIS sentidos. Subir so de filho para pai deixa
// 12 das 71 rotinas sem dono, porque parte das arestas esta gravada ao
// contrario. Como vizinhanca simples, os 107 donos ligam todos.
function lerVizinhos(b) {
  const viz = new Map();
  const juntar = (a, c) => {
    if (!viz.has(a)) viz.set(a, new Set());
    viz.get(a).add(c);
  };
  for (const r of registros(b)) {
    const p = b.readUInt32LE(r.off + 0x0e);
    const f = b.readUInt32LE(r.off + 0x12);
    if (!p || !f || p === 0xFFFFFFFF || f === 0xFFFFFFFF) continue;
    juntar(p, f);
    juntar(f, p);
  }
  return viz;
}

// --- entrada principal ---------------------------------------------------------------------
function abrir(arquivo) {
  const regioes = lerDiretorio(fs.readFileSync(arquivo));
  const precisa = ['Comps.Idx', 'SbRegion.Idx', 'RegnLink.Idx', 'Nameless.Idx'];
  for (const r of precisa) {
    if (!regioes[r]) throw new Error('o projeto nao tem a regiao ' + r);
  }

  const comps = lerComponentes(regioes['Comps.Idx']);
  const codigo = lerCodigo(regioes['SbRegion.Idx']);
  const cadeias = lerOrdem(regioes['RegnLink.Idx']);
  const vizinhos = lerVizinhos(regioes['Nameless.Idx']);

  const curto = p => p.replace(/^[^.]+\./, '').replace(/Rx\w+Collection\./g, '');
  const ehRotina = id => /RxRoutineCollection\.[^.]+$/.test(comps.caminho.get(id) || '');

  // dono -> rotina: direto quando o dono e a propria rotina, senao subindo
  // pelos pais do Nameless ate achar uma.
  // Busca em largura pela vizinhanca ate a primeira rotina que aparecer. Em
  // largura, e nao em profundidade, para pegar sempre a rotina mais proxima
  // quando ha mais de um caminho.
  function rotinaDe(dono) {
    if (ehRotina(dono)) return dono;
    let fronteira = [dono];
    const visto = new Set(fronteira);
    for (let salto = 0; salto < 8 && fronteira.length; salto++) {
      const proxima = [];
      for (const no of fronteira) {
        for (const p of (vizinhos.get(no) || [])) {
          if (visto.has(p)) continue;
          if (ehRotina(p)) return p;
          visto.add(p);
          proxima.push(p);
        }
      }
      fronteira = proxima;
    }
    return null;
  }

  function resolver(t) {
    return t.split(String.fromCharCode(0)).join('').replace(/@([0-9a-f]{8})@/g, (m, h) => {
      const id = parseInt(h, 16);
      return comps.caminho.has(id) ? curto(comps.caminho.get(id)) : '<ID_' + h + '>';
    });
  }

  const porRotina = new Map();
  for (const [dono, regioesDoDono] of cadeias) {
    const rot = rotinaDe(dono);
    if (rot === null) continue;
    const comTexto = regioesDoDono.filter(r => codigo.textos.has(r));
    if (!comTexto.length) continue;
    if (!porRotina.has(rot)) porRotina.set(rot, []);
    porRotina.get(rot).push(...comTexto);
  }

  const blocos = [];
  const rotinas = [];
  for (const [rot, regioesDaRotina] of porRotina) {
    const nome = curto(comps.caminho.get(rot));
    rotinas.push(nome);
    regioesDaRotina.forEach((r, i) => {
      const t = codigo.textos.get(r);
      blocos.push({ rotina: nome, indice: i, tipo: t.tipo, regiao: hex(r), texto: resolver(t.texto) });
    });
  }
  blocos.sort((a, b) => a.rotina < b.rotina ? -1 : a.rotina > b.rotina ? 1 : a.indice - b.indice);

  // tags: tudo que esta sob uma RxTagCollection
  const tags = [];
  for (const [id, cam] of comps.caminho) {
    if (!/RxTagCollection\.[^.]+$/.test(cam)) continue;
    tags.push({ id: hex(id), caminho: curto(cam) });
  }

  // Os parametros de um AOI sao as tags dele, na ordem em que estao gravadas.
  // E assim que a chamada do AOI casa posicao por posicao com os argumentos.
  // O byte 0x302 tambem diz COMO o parametro e passado, e isso muda o
  // comportamento: no Logix, Input e Output sao COPIADOS (a AOI mexe na copia
  // dela), e so InOut e por referencia. Tratar tudo por referencia faz a AOI
  // escrever em tags do programa que ela so deveria ler - foi assim que o
  // ONS(T1s) do ArranqueDirecto zerava o relogio de 1 s do MainRoutine.
  const MODO_DO_USO = { 100: 'entrada', 104: 'saida', 108: 'entradaSaida' };
  const USO_PARAMETRO = new Set([100, 104, 108]);

  function membrosDe(tipo) {
    const alvo = tipo + '.RxTagCollection.';
    const achados = [];
    for (const [id, cam] of comps.caminho) {
      const i = cam.indexOf(alvo);
      if (i < 0) continue;
      const resto = cam.slice(i + alvo.length);
      if (!resto || resto.indexOf('.') >= 0) continue;
      const r = comps.porId.get(id);
      if (!USO_PARAMETRO.has(r.uso)) continue;
      if (resto === 'EnableIn' || resto === 'EnableOut') continue;
      if (/^[$_]/.test(resto)) continue;
      achados.push({ nome: resto, ordem: r.ordem, modo: MODO_DO_USO[r.uso] });
    }
    achados.sort((a, b) => a.ordem - b.ordem);
    return achados.map(x => ({ nome: x.nome, modo: x.modo }));
  }

  // A ordem dos parametros na chamada e a ordem de DECLARACAO do AOI, e quem
  // a preserva e o tipo de dados (RxTypeMemberCollection), nao a colecao de
  // tags. Em RegistrosConsumo as duas discordam: pela colecao de tags sairia
  // "Trigger, Totalizador", e a chamada passa o totalizador no lugar do
  // gatilho. Pelo tipo sai "Totalizador, Trigger", que e o que faz sentido.
  // Os parametros InOut nao existem no tipo (nao ocupam memoria da instancia),
  // entao eles ficam na posicao que a colecao de tags indica.
  function membrosDoTipo(tipo) {
    const alvo = tipo + '.RxTypeMemberCollection.';
    const achados = [];
    for (const [id, cam] of comps.caminho) {
      const i = cam.indexOf(alvo);
      if (i < 0) continue;
      const resto = cam.slice(i + alvo.length);
      if (!resto || resto.indexOf('.') >= 0) continue;
      achados.push({ nome: resto, ordem: comps.porId.get(id).ordem });
    }
    achados.sort((a, b) => a.ordem - b.ordem);
    return achados.map(x => x.nome);
  }

  return {
    membrosDe,
    membrosDoTipo,
    regioes: Object.keys(regioes),
    componentes: comps.caminho.size,
    conferenciaDoCodigo: codigo.conferidos + '/' + codigo.esperados,
    rotinas: rotinas.sort(),
    tags,
    blocos
  };
}

module.exports = { abrir, _lerDiretorio: lerDiretorio, _registros: registros };

if (require.main === module) {
  const p = abrir(process.argv[2]);
  console.log('regioes            : ' + p.regioes.length);
  console.log('componentes        : ' + p.componentes);
  console.log('conferencia codigo : ' + p.conferenciaDoCodigo);
  console.log('rotinas            : ' + p.rotinas.length);
  console.log('tags               : ' + p.tags.length);
  console.log('blocos de codigo   : ' + p.blocos.length);
  if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(p.blocos, null, 1));
}
