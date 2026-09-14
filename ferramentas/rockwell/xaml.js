// ---------------------------------------------------------------------------
// Converte uma tela XAML do FactoryTalk (.xamle) na descricao que o simulador
// desenha.
// ---------------------------------------------------------------------------
// O .xamle e um Canvas de 1280x800 com TUDO em coordenadas absolutas: cada
// elemento traz Canvas.Left, Canvas.Top, Width, Height, as cores em
// hexadecimal e as legendas em texto. Nao ha layout a calcular, entao a
// conversao para SVG e quase direta.
//
// As animacoes ficam em <FrameworkElement.Resources>, com uma chave que o
// arquivo .conn referencia:
//     <Path x:Name="Polyline6">
//       <FrameworkElement.Resources>
//         <RamlFramework:AnimateVisibility x:Key="Polyline6_av" ... />
// e no .conn:
//     <object id="Polyline6_av"><connection property="Value">{tag}</connection>
// ---------------------------------------------------------------------------
'use strict';

// --- leitor de XML suficiente para este arquivo -------------------------------
function analisar(s) {
  const raiz = { nome: '#raiz', at: {}, filhos: [] };
  const pilha = [raiz];
  const re = /<(\/?)([A-Za-z_][\w.:-]*)((?:\s+[\w.:-]+\s*=\s*"[^"]*")*)\s*(\/?)>/g;
  let m;
  while ((m = re.exec(s))) {
    const [, fecha, nome, attrs, vazio] = m;
    if (fecha) { if (pilha.length > 1) pilha.pop(); continue; }
    const at = {};
    const ra = /([\w.:-]+)\s*=\s*"([^"]*)"/g;
    let a;
    while ((a = ra.exec(attrs))) at[a[1]] = desescapar(a[2]);
    const no = { nome, at, filhos: [] };
    pilha[pilha.length - 1].filhos.push(no);
    if (!vazio) pilha.push(no);
  }
  return raiz;
}

function desescapar(t) {
  return String(t)
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&#([0-9]+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

const num = v => (v === undefined || v === '' ? 0 : Number(v) || 0);
const cor = c => (!c || /^transparent$/i.test(c)) ? null : c;
const bool = v => v === 'true' || v === 'True';
const PT_PARA_PX = 1.3333;                     // a IHM desenha a 96 dpi

// --- geometria ----------------------------------------------------------------
function caminhoDe(no) {
  const p = [];
  for (const g of no.filhos) {
    if (g.nome === 'PathGeometry') {
      const figuras = g.filhos.flatMap(x => x.nome === 'PathFigureCollection' ? x.filhos : [x])
        .filter(x => x.nome === 'PathFigure');
      for (const fig of figuras) {
        if (!fig.at.StartPoint) continue;
        p.push('M' + fig.at.StartPoint.replace(',', ' '));
        const segs = fig.filhos.flatMap(x => x.nome === 'PathSegmentCollection' ? x.filhos : [x]);
        for (const seg of segs) {
          if (seg.nome === 'LineSegment') p.push('L' + seg.at.Point.replace(',', ' '));
          else if (seg.nome === 'PolyLineSegment') {
            (seg.at.Points || '').trim().split(/\s+/).forEach(pt => pt && p.push('L' + pt.replace(',', ' ')));
          } else if (seg.nome === 'ArcSegment') {
            p.push('A' + (seg.at.Size || '1,1').replace(',', ' ')
              + ' ' + num(seg.at.RotationAngle)
              + ' ' + (bool(seg.at.IsLargeArc) ? 1 : 0)
              + ' ' + (seg.at.SweepDirection === 'Clockwise' ? 1 : 0)
              + ' ' + seg.at.Point.replace(',', ' '));
          }
        }
        if (bool(fig.at.IsClosed)) p.push('Z');
      }
    } else if (g.nome === 'RectangleGeometry') {
      const [x, y, w, h] = (g.at.Rect || '0,0,0,0').split(',').map(Number);
      const rx = num(g.at.RadiusX);
      if (rx) {
        p.push(`M${x + rx} ${y}H${x + w - rx}A${rx} ${rx} 0 0 1 ${x + w} ${y + rx}`
          + `V${y + h - rx}A${rx} ${rx} 0 0 1 ${x + w - rx} ${y + h}`
          + `H${x + rx}A${rx} ${rx} 0 0 1 ${x} ${y + h - rx}`
          + `V${y + rx}A${rx} ${rx} 0 0 1 ${x + rx} ${y}Z`);
      } else {
        p.push(`M${x} ${y}H${x + w}V${y + h}H${x}Z`);
      }
    } else if (g.nome === 'EllipseGeometry') {
      const [cx, cy] = (g.at.Center || '0,0').split(',').map(Number);
      const rx = num(g.at.RadiusX), ry = num(g.at.RadiusY);
      p.push(`M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`);
    }
  }
  return p.join('');
}

function transformacaoDe(no) {
  const t = no.filhos.find(f => /\.RenderTransform$/.test(f.nome));
  if (!t) return null;
  const mt = t.filhos.find(f => f.nome === 'MatrixTransform');
  const mx = mt && mt.filhos.find(f => f.nome === 'Matrix');
  const at = (mx && mx.at) || (mt && mt.at);
  if (!at || at.M11 === undefined) return null;
  return `matrix(${num(at.M11)},${num(at.M12)},${num(at.M21)},${num(at.M22)},${num(at.OffsetX)},${num(at.OffsetY)})`;
}

// --- entrada principal ---------------------------------------------------------
function analisarXaml(texto, conn, op) {
  const doc = analisar(texto);
  const canvas = doc.filhos.find(n => n.nome === 'Canvas') || doc.filhos[0];
  const compilar = e => op.compilar(e, op.registrarTag);

  // liga o que o .conn diz a respeito de uma chave (nome de objeto ou recurso)
  function leitura(chave, prop) {
    const o = conn.leitura[chave];
    return o ? compilar(o[prop || 'Value']) : null;
  }

  function animacoes(no, alvo) {
    const res = no.filhos.find(f => /\.Resources$/.test(f.nome));
    if (!res) return;
    for (const r of res.filhos) {
      const chave = r.at['x:Key'];
      if (!chave) continue;
      if (r.nome === 'RamlFramework:AnimateVisibility') {
        const expr = leitura(chave);
        if (expr) alvo.visivel = { expr, quando: r.at.ExpressionTrueState || 'visible' };
      } else if (r.nome === 'RamlFramework:AnimateColor') {
        const expr = leitura(chave);
        if (!expr) continue;
        const itens = r.filhos
          .filter(x => x.nome === 'RamlFramework:AnimationColorItem')
          .map(x => ({
            valor: num(x.at.Value),
            frente: cor(x.at.ForeColor1),
            fundo: cor(x.at.BackColor1),
            piscaFrente: x.at.ForeBehavior === 'blink' ? cor(x.at.ForeColor2) : null,
            piscaFundo: x.at.BackBehavior === 'blink' ? cor(x.at.BackColor2) : null
          }));
        // O campo se chama animaCor, e nao cor, de proposito: os elementos de
        // texto ja usam "cor" para a cor da letra, e os dois se atropelariam.
        if (itens.length) alvo.animaCor = { expr, itens, modo: num(r.at.FillColorMode) || 0 };
      }
    }
  }

  function caixa(a) {
    return {
      x: num(a['Canvas.Left']), y: num(a['Canvas.Top']),
      w: num(a.Width), h: num(a.Height)
    };
  }

  function legendaDe(a, prefixo) {
    const p = prefixo || '';
    return {
      texto: a[p + 'Text'] !== undefined ? a[p + 'Text'] : (a.Caption || ''),
      fonte: num(a[p + 'FontSize'] || a.FontSize || 10) * PT_PARA_PX,
      cor: cor(a[p + 'Color'] || a.ForeColor) || 'black',
      negrito: bool(a[p + 'Bold'] || a.Bold),
      italico: bool(a[p + 'Italic'] || a.Italic),
      alinha: a[p + 'Alignment'] || a.Alignment || 'middleCenter'
    };
  }

  // --- botoes ------------------------------------------------------------------
  const MODOS = {
    'RamlControls:MomentaryButton': 'momentaneo',
    'RamlControls:MaintainedButton': 'mantido',
    'RamlControls:MultistateButton': 'multiestado',
    'RamlControls:GotoButton': 'ir',
    'RamlControls:ReturnToButton': 'voltar',
    'RamlControls:CloseButton': 'fechar'
  };

  function botaoDe(no) {
    const a = no.at;
    const nome = a['x:Name'] || '';
    const el = Object.assign({ t: 'botao', id: nome, modo: MODOS[no.nome] }, caixa(a));
    el.forma = /round|ellipse/i.test(a.Shape || a.ButtonShape || '') ? 'redondo' : 'reto';
    el.esp = num(a.BorderThickness) || 2;

    const lista = (no.filhos.find(f => /\.States$/.test(f.nome)) || { filhos: [] })
      .filhos.filter(x => x.nome === 'RamlControls:State');
    el.estados = lista.map(x => ({
      id: x.at.StateId,
      valor: x.at.Value !== undefined ? num(x.at.Value) : null,
      fundo: cor(x.at.BackColor) || '#D4D0C8',
      claro: cor(x.at.BorderColorH) || '#FFFFFF',
      escuro: cor(x.at.BorderColorL) || '#808080',
      legenda: Object.assign(legendaDe(x.at, 'Caption'), { texto: x.at.CaptionText || '' })
    }));

    // Os botoes de navegacao nao tem lista de estados: a aparencia vem dos
    // atributos do proprio botao e a legenda de <Botao.Caption>.
    if (!el.estados.length) {
      const cap = (no.filhos.find(f => /\.Caption$/.test(f.nome)) || { filhos: [] }).filhos[0];
      el.estados = [{
        id: '0', valor: 0,
        fundo: cor(a.BackColor) || '#D4D0C8',
        claro: cor(a.BorderColorH) || '#FFFFFF',
        escuro: cor(a.BorderColorL) || '#808080',
        legenda: cap
          ? { texto: cap.at.Text || '', fonte: num(cap.at.FontSize || 10) * PT_PARA_PX,
              cor: cor(cap.at.Color) || 'black', negrito: bool(cap.at.Bold),
              italico: bool(cap.at.Italic), alinha: cap.at.Alignment || 'middleCenter' }
          : { texto: a.Display || '', fonte: 13, cor: 'black', negrito: false, italico: false, alinha: 'middleCenter' }
      }];
    }

    // Varios botoes de navegacao nao tem legenda nenhuma: quem identifica e um
    // icone, declarado em <Botao.ImageSettings>.
    const cfgImg = (no.filhos.find(f => /\.ImageSettings$/.test(f.nome)) || { filhos: [] })
      .filhos.find(x => x.nome === 'RamlControls:ImageSettings');
    if (cfgImg && cfgImg.at.ImageName) {
      const arq = op.pegarImagem(cfgImg.at.ImageName);
      if (arq) el.icone = { arq, esticado: bool(cfgImg.at.Scaled) };
    }

    if (el.modo === 'ir') el.destino = a.Display || null;
    const esc = conn.escrita[nome];
    if (esc && esc.Value) {
      const alvo = require('./expressao.js').normalizarTag(esc.Value.replace(/[{}]/g, ''));
      el.escreve = alvo;
      if (op.registrarTag) op.registrarTag(alvo);
    }
    const ind = leitura(nome, 'Indicator');
    if (ind) el.indicador = ind;
    const val = leitura(nome, 'Value');
    if (val && !el.escreve) el.valor = val;
    return el;
  }

  // --- percurso da arvore -------------------------------------------------------
  function converter(no) {
    const a = no.at;
    const nome = a['x:Name'] || '';
    let el = null;

    if (MODOS[no.nome]) {
      el = botaoDe(no);
      animacoes(no, el);
      return el;                                   // nao desce nos filhos
    }

    switch (no.nome) {
      case 'RamlControls:Group': {
        el = { t: 'grupo', id: nome, filhos: no.filhos.map(converter).filter(Boolean) };
        break;
      }
      case 'Path': {
        const d = caminhoDe(no.filhos.find(f => f.nome === 'Path.Data') || { filhos: [] });
        if (!d) return null;
        el = {
          t: 'forma', id: nome, d,
          preenche: cor(a.Fill), traco: cor(a.Stroke),
          espessura: num(a.StrokeThickness) || 1
        };
        break;
      }
      case 'RamlControls:Text': {
        el = Object.assign({ t: 'texto', id: nome }, caixa(a), legendaDe(a));
        el.texto = a.Caption || '';
        el.fundo = a.BackStyle === 'solid' ? cor(a.BackColor) : null;
        break;
      }
      case 'RamlControls:NumericDisplayME':
      case 'RamlControls:StringDisplayME': {
        const numerico = no.nome.indexOf('Numeric') >= 0;
        el = Object.assign({ t: numerico ? 'numero' : 'cadeia', id: nome }, caixa(a), legendaDe(a));
        el.fundo = a.BackStyle === 'solid' ? (cor(a.BackColor) || '#FFFFFF') : null;
        el.borda = cor(a.BorderColor);
        el.bordaEsp = num(a.BorderWidth) || 1;
        if (numerico) {
          el.casas = num(a.DecimalPlaces);
          el.digitos = num(a.NumberOfDigits) || 6;
          el.completa = a.FillLeftWith || 'none';
        }
        el.valor = leitura(nome);
        break;
      }
      case 'RamlControls:ImageControl': {
        el = Object.assign({ t: 'imagem', id: nome }, caixa(a));
        el.arq = op.pegarImagem(a.Source);
        break;
      }
      case 'RamlControls:BarGraphControl': {
        el = Object.assign({ t: 'barra', id: nome }, caixa(a));
        el.min = num(a.MinValue); el.max = num(a.MaxValue) || 100;
        el.cheio = cor(a.ForeColor) || '#37A9E0';
        el.fundo = cor(a.BackColor) || '#FFFFFF';
        el.valor = leitura(nome);
        break;
      }
      // Estes existem no projeto mas nao mudam o desenho da tela: sao marcadores
      // de entrada por teclado, dados de lista e a escala de um grafico.
      case 'RamlControls:NumericInputCursorPoint':
      case 'RamlControls:StringInputEnable':
      case 'RamlControls:ListStateData':
      case 'RamlControls:Scale':
      case 'RamlControls:ControlListSelector':
      case 'RamlFramework:DisplaySettings':
      case 'Canvas':
        return null;
      default:
        if (/^Raml/.test(no.nome)) op.registrarIgnorado(no.nome);
        return null;
    }

    if (!el) return null;
    const tr = transformacaoDe(no);
    if (tr) el.transforma = tr;
    if (a.Visibility === 'Hidden' || a.Visibility === 'Collapsed') el.oculto = true;
    animacoes(no, el);
    return el;
  }

  return {
    largura: num(canvas.at.Width) || 1280,
    altura: num(canvas.at.Height) || 800,
    fundo: cor(canvas.at.Background) || '#FFFFFF',
    elementos: canvas.filhos.map(converter).filter(Boolean)
  };
}

module.exports = { analisarXaml };
