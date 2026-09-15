// ---------------------------------------------------------------------------
// LE O BINARIO NATIVO DAS TELAS DO FactoryTalk View ME (.gfx)
// ---------------------------------------------------------------------------
// O .mer traz cada tela em ate duas formas. A boa e o .ramlz, que e XAML e sai
// completo. A outra e este .gfx, que e serializacao MFC (CArchive) e nao tem
// formato publicado. So 14 das 47 telas tem .ramlz; as outras 33 so existem
// aqui.
//
// O QUE ESTE LEITOR RECUPERA, e com que confianca (medido nas 14 telas que
// existem nos dois formatos, 365 elementos):
//
//   nome do elemento ....... 100%   (365/365, byte a byte)
//   retangulo .............. 99,7%  (364/365)
//   tipo do elemento ....... deduzido do nome que o FactoryTalk gera sozinho
//   tags do CLP da tela .... a lista sai limpa, mas POR TELA, nao por elemento
//
// O QUE ELE NAO RECUPERA:
//
//   qual tag pertence a qual elemento ... a ordem no arquivo nao acompanha a
//     ordem dos elementos; testado contra o XAML, acerta 1 de 255
//   legenda de cada botao ............... mesma razao, 0 de 271
//   cor e fonte ......................... as cores estao la, como RGB0, mas num
//     bloco compartilhado longe do elemento
//
// Por isso este modulo gera um INVENTARIO, nao uma tela navegavel. Uma tela com
// os controles no lugar certo mas ligados na tag errada e pior do que tela
// nenhuma: o aluno aperta um botao e a maquina faz outra coisa.
// ---------------------------------------------------------------------------

'use strict';

// --- 1. o retangulo -----------------------------------------------------------
// Tres arranjos, descobertos comparando com o XAML. Os dois primeiros nunca
// erraram quando deram resposta; o terceiro errou uma vez em 365.

const LARGURA_MAX = 1290;   // a tela e 1280x800; folga para bordas
const ALTURA_MAX = 810;

function valido(r) {
  return r[0] >= 0 && r[1] >= 0 && r[2] - r[0] >= 2 && r[3] - r[1] >= 2
    && r[2] <= LARGURA_MAX && r[3] <= ALTURA_MAX;
}

// (a) na maioria dos elementos o RECT de 16 bits fica 15 bytes antes do nome
function porOffsetFixo(b, p) {
  if (p - 15 < 0) return null;
  const r = [b.readInt16LE(p - 15), b.readInt16LE(p - 13), b.readInt16LE(p - 11), b.readInt16LE(p - 9)];
  return valido(r) ? r : null;
}

// (b) nos textos entra uma cadeia de conexao entre o RECT e o nome, e a
// distancia deixa de ser fixa. Mas logo depois do RECT vem sempre um tag de
// objeto MFC (0x80NN), e isso ancora a busca para tras.
function porTagMfc(b, i, limite) {
  const ate = Math.max(0, i - (limite || 1500));
  for (let o = i - 10; o >= ate; o--) {
    if ((b.readUInt16LE(o + 8) & 0xff00) !== 0x8000) continue;
    const r = [b.readInt16LE(o), b.readInt16LE(o + 2), b.readInt16LE(o + 4), b.readInt16LE(o + 6)];
    if (valido(r)) return r;
  }
  return null;
}

// (c) nas imagens e em alguns botoes o RECT e de 32 bits e vem DEPOIS do nome,
// precedido de um zero e de um codigo pequeno
function porInteiroLongo(b, de) {
  const ate = Math.min(b.length - 24, de + 2000);
  for (let o = de; o < ate; o++) {
    if (b.readInt32LE(o) !== 0) continue;
    const codigo = b.readInt32LE(o + 4);
    if (codigo < 1 || codigo > 64) continue;
    const r = [b.readInt32LE(o + 8), b.readInt32LE(o + 12), b.readInt32LE(o + 16), b.readInt32LE(o + 20)];
    if (valido(r)) return r;
  }
  return null;
}

// --- 2. as cadeias ------------------------------------------------------------
// Nome de elemento vem como [1 byte de tamanho][UTF-16]. Cadeia de conexao vem
// como [2 bytes de tamanho][UTF-16] — foi so descobrir isso que as tags do CLP
// apareceram; antes o leitor reportava zero tags em toda tela.

function cadeiaEm(b, i, larguraDoPrefixo) {
  const n = larguraDoPrefixo === 1 ? b[i] : b.readUInt16LE(i);
  if (n < 1 || n > 400) return null;
  const ini = i + larguraDoPrefixo;
  if (ini + n * 2 > b.length) return null;
  let s = '';
  for (let k = 0; k < n; k++) {
    const c = b.readUInt16LE(ini + k * 2);
    if (c < 32 || c > 0x2000) return null;
    s += String.fromCharCode(c);
  }
  return s;
}

// nome que o FactoryTalk aceita para um objeto de tela
const NOME_DE_ELEMENTO = /^[A-Za-z][A-Za-z0-9 ._-]{1,40}$/;

// --- 3. o tipo ----------------------------------------------------------------
// O FactoryTalk batiza cada objeto novo com o tipo dele mais um numero. Quando
// o programador nao renomeia — e aqui quase nunca renomeou — o nome diz o tipo.

const TIPO_POR_PREFIXO = [
  [/^(Momentary|Maintained|Latched|Multistate|Interlocked|Ramp)PushButton/, 'botao'],
  [/^(GotoDisplay|ReturntoDisplay|CloseDisplay|GotoConfigureMode|Shutdown|Login|Logout)Button/, 'navegacao'],
  [/^(Move(Up|Down|Left|Right)|Enter|Backspace|Home|End|Page(Up|Down))Button/, 'navegacao'],
  [/^(Acknowledge|Clear|Silence|Reset)Alarm/, 'alarme'],
  [/^(Alarm(List|Banner|Status)|DiagnosticsList|InformationMessageDisplay)/, 'alarme'],
  [/^Numeric(Display|Input)/, 'numero'],
  [/^String(Display|Input)/, 'texto_valor'],
  [/^(ControlList|PilotLight|MultistateIndicator|SymbolIndicator|ListIndicator)/, 'indicador'],
  [/^(Bar|Gauge|Scale|Trend)/, 'indicador'],
  [/^Text/, 'texto'],
  [/^Image/, 'imagem'],
  [/^(Rectangle|RoundedRectangle|Ellipse|Line|Polyline|Polygon|Arc|Wedge|Freehand|Panel)/, 'forma'],
  [/^Group/, 'grupo'],
];

function tipoDe(nome) {
  for (const [re, t] of TIPO_POR_PREFIXO) if (re.test(nome)) return t;
  return 'desconhecido';
}

// --- 4. as ligacoes com o CLP -------------------------------------------------
// A cadeia guardada nem sempre e uma tag solta: quando o objeto mostra uma
// conta, ela vem como a expressao inteira, com as tags entre chaves e o resto
// em texto. Ex.: "{...VolPedido_Cal_L}/{...T_inyeccion_L2}/100". Ate aparece
// comentario do FactoryTalk no meio, na forma /*S:0 {tag}*/. Entao a cadeia se
// quebra em tags, e nao se guarda inteira.

const ATALHO = /::\[[^\]]*\](Program:)?/;

function tagsDaExpressao(s) {
  const achadas = [];
  const re = /::\[[^\]]*\](?:Program:)?([A-Za-z_][A-Za-z0-9_]*(?:\[\d+\]|\.[A-Za-z0-9_]+)*)/g;
  let m;
  while ((m = re.exec(s))) achadas.push(m[1]);
  return achadas;
}

// --- 5. a leitura -------------------------------------------------------------

function analisarGfx(b) {
  const elementos = [];
  const tags = new Set();
  const expressoes = new Set();
  const vistos = new Set();

  for (let i = 0; i + 3 < b.length; i++) {
    // Cadeia de ligacao com o CLP: prefixo de 2 bytes. Ler byte a byte tenta
    // tambem posicoes desalinhadas, e a leitura desalinhada devolve um pedaco
    // da cadeia certa, que corta a tag no meio (foi assim que "MainProgram.Li"
    // virou tag). Por isso, quando uma cadeia e aceita, o cursor pula o corpo
    // dela inteiro.
    const longa = cadeiaEm(b, i, 2);
    if (longa && ATALHO.test(longa)) {
      const achadas = tagsDaExpressao(longa);
      achadas.forEach(t => tags.add(t));
      // se sobrou conta em volta das tags, a expressao tambem interessa
      if (achadas.length && longa.replace(/::\[[^\]]*\](Program:)?[A-Za-z0-9_.\[\]]+/g, '').trim()) {
        expressoes.add(longa.replace(/::\[[^\]]*\](Program:)?/g, ''));
      }
      i += 2 + longa.length * 2 - 1;
      continue;
    }

    // nome de elemento: prefixo de 1 byte
    const nome = cadeiaEm(b, i, 1);
    if (!nome || !NOME_DE_ELEMENTO.test(nome)) continue;

    const p = i + 1;
    const r = porOffsetFixo(b, p) || porTagMfc(b, i) || porInteiroLongo(b, p + nome.length * 2);
    if (!r) continue;

    // o mesmo nome pode aparecer mais de uma vez; vale a primeira
    if (vistos.has(nome)) { i += nome.length * 2; continue; }
    vistos.add(nome);

    elementos.push({
      t: tipoDe(nome), id: nome,
      x: r[0], y: r[1], w: r[2] - r[0], h: r[3] - r[1],
    });
    i += nome.length * 2;
  }

  elementos.sort((a, c) => a.y - c.y || a.x - c.x);
  return { elementos, tags: [...tags].sort(), expressoes: [...expressoes].sort() };
}

module.exports = { analisarGfx, tipoDe };
