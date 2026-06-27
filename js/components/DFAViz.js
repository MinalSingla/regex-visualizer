var useState = React.useState;
var useEffect = React.useEffect;
var useRef = React.useRef;

// DFA Viz
function DFAViz(props) {
  var dfaSnap = props.dfaSnap, activeLabel = props.activeLabel || null, simResult = props.simResult;
  var vzs = useViewZoom(dfaSnap);
  var cref = vzs.cref, dims = vzs.dims, vb = vzs.vb, setVb = vzs.setVb, dragging = vzs.dragging;

  if (!dfaSnap || !dfaSnap.states || !dfaSnap.states.length) {
    return React.createElement('div', {
      ref: cref, style: {
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '.9rem', color: 'var(--muted)', textAlign: 'center', pointerEvents: 'none'
      }
    },
      React.createElement('div', { style: { fontSize: '2.4rem', opacity: .2 } }, '⬡'),
      React.createElement('div', { style: { fontSize: '.77rem', maxWidth: '200px', lineHeight: 1.75 } }, 'Build the NFA first, then press ',
        React.createElement('strong', { style: { color: 'var(--a5)' } }, 'Convert → DFA'))
    );
  }

  var R = 24;
  var layout = layoutDFA(dfaSnap, dims.w, dims.h);
  var pos = layout.pos, W = layout.canvasW, H = layout.canvasH;
  var getPos = function (lbl) { return pos[lbl]; };
  var allStateIds = dfaSnap.states.map(function (s) { return { id: s.label }; });
  var edges = buildEdges(allStateIds, dfaSnap.trans.map(function (t) { return { from: t.from, sym: t.sym, to: t.to }; }), getPos, R, true);

  var cvb = vb || { x: 0, y: 0, w: W, h: H };
  var zoomPct = W / cvb.w;
  function zoomAt(f, cx, cy) { var nw = cvb.w / f, nh = cvb.h / f, nx = cx - (cx - cvb.x) / f, ny = cy - (cy - cvb.y) / f; setVb({ x: nx, y: ny, w: nw, h: nh }); }
  function zoomIn() { zoomAt(1.3, cvb.x + cvb.w / 2, cvb.y + cvb.h / 2); }
  function zoomOut() { zoomAt(1 / 1.3, cvb.x + cvb.w / 2, cvb.y + cvb.h / 2); }
  function fit() { setVb(null); }
  function onWheel(e) { e.preventDefault(); var f = e.deltaY < 0 ? 1.18 : 1 / 1.18; var r = cref.current.getBoundingClientRect(); zoomAt(f, (e.clientX - r.left) / r.width * cvb.w + cvb.x, (e.clientY - r.top) / r.height * cvb.h + cvb.y); }
  function onMouseDown(e) { if (e.button !== 0) return; dragging.current = { sx: e.clientX, sy: e.clientY, vb: { x: cvb.x, y: cvb.y, w: cvb.w, h: cvb.h } }; }
  function onMouseMove(e) { if (!dragging.current) return; var r = cref.current.getBoundingClientRect(); var dx = (e.clientX - dragging.current.sx) / r.width * dragging.current.vb.w, dy = (e.clientY - dragging.current.sy) / r.height * dragging.current.vb.h; setVb({ w: dragging.current.vb.w, h: dragging.current.vb.h, x: dragging.current.vb.x - dx, y: dragging.current.vb.y - dy }); }
  function onMouseUp() { dragging.current = null; }

  return React.createElement('div', {
    ref: cref, style: { position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'grab' },
    onMouseDown: onMouseDown, onMouseMove: onMouseMove, onMouseUp: onMouseUp, onMouseLeave: onMouseUp
  },
    React.createElement(ZoomBar, { zoom: zoomPct, zoomIn: zoomIn, zoomOut: zoomOut, fit: fit }),
    React.createElement('svg', {
      width: dims.w, height: dims.h, viewBox: cvb.x + ' ' + cvb.y + ' ' + cvb.w + ' ' + cvb.h,
      style: { position: 'absolute', inset: 0 }, onWheel: onWheel
    },
      React.createElement(SvgMarkers),
      React.createElement('defs', null,
        React.createElement('marker', { id: 'amin', markerWidth: '9', markerHeight: '6', refX: '8', refY: '3', orient: 'auto' },
          React.createElement('polygon', { points: '0 0,9 3,0 6', fill: '#f7971e' }))),
      renderDFAContent(dfaSnap, pos, R, edges, activeLabel !== null, activeLabel, simResult, '#c77dff', 'url(#adfa)')
    )
  );
}

window.DFAViz = DFAViz;