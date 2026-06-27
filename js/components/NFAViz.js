// NFA Viz
function NFAViz(props) {
  var snap = props.snap;
  var activeIds = props.activeIds || null;
  var simResult = props.simResult;
  var cref = useRef(null);
  var ds = useState({ w: 700, h: 380 }); var dims = ds[0], setDims = ds[1];
  // viewBox state: {x,y,w,h} or null = fit all
  var vbs = useState(null); var vb = vbs[0], setVb = vbs[1];
  var dragging = useRef(null);

  useEffect(function () {
    function m() { if (cref.current) { var r = cref.current.getBoundingClientRect(); if (r.width > 20 && r.height > 20) setDims({ w: r.width, h: r.height }); } }
    m(); window.addEventListener('resize', m); var t = setTimeout(m, 120);
    return function () { window.removeEventListener('resize', m); clearTimeout(t); };
  }, [snap]);
  // reset view when snap changes
  useEffect(function () { setVb(null); }, [snap]);

  if (!snap || !snap.states || !snap.states.length) {
    return (
      React.createElement('div', {
        ref: cref, style: {
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '.9rem', color: 'var(--muted)',
          textAlign: 'center', pointerEvents: 'none'
        }
      }
        , React.createElement('div', { style: { fontSize: '2.4rem', opacity: .2 } }, "◎")
        , React.createElement('div', { style: { fontSize: '.77rem', maxWidth: '190px', lineHeight: 1.75 } }, "Enter a regex and press "
          , React.createElement('strong', { style: { color: 'var(--accent)' } }, "Build NFA")
        )
      )
    );
  }
  var cW = dims.w, cH = dims.h, R = 24;
  var layout = layoutNFA(snap, cW, cH);
  var pos = layout.pos, W = layout.canvasW, H = layout.canvasH;
  var getPos = function (id) { return pos[id]; };
  var edges = buildEdges(snap.states, snap.trans, getPos, R, false);
  var activeSet = {};
  if (activeIds) activeIds.forEach(function (id) { activeSet[id] = true; });
  var simMode = activeIds !== null;
  var fragStateSet = {};
  if (snap.fragStateIds) snap.fragStateIds.forEach(function (id) { fragStateSet[id] = true; });
  var hasFrag = !simMode && snap.fragStateIds && snap.fragStateIds.length > 0;

  // Compute current viewBox (null = show full canvas)
  var cvb = vb || { x: 0, y: 0, w: W, h: H };
  var zoomPct = W / cvb.w;

  function zoomAt(factor, cx, cy) {
    var nw = cvb.w / factor, nh = cvb.h / factor;
    var nx = cx - (cx - cvb.x) / factor, ny = cy - (cy - cvb.y) / factor;
    setVb({ x: nx, y: ny, w: nw, h: nh });
  }
  function zoomIn() { zoomAt(1.3, cvb.x + cvb.w / 2, cvb.y + cvb.h / 2); }
  function zoomOut() { zoomAt(1 / 1.3, cvb.x + cvb.w / 2, cvb.y + cvb.h / 2); }
  function fit() { setVb(null); }

  function onWheel(e) {
    e.preventDefault();
    var factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
    var rect = cref.current.getBoundingClientRect();
    var mx = (e.clientX - rect.left) / rect.width * cvb.w + cvb.x;
    var my = (e.clientY - rect.top) / rect.height * cvb.h + cvb.y;
    zoomAt(factor, mx, my);
  }
  function onMouseDown(e) {
    if (e.button !== 0) return;
    dragging.current = { sx: e.clientX, sy: e.clientY, vb: { x: cvb.x, y: cvb.y, w: cvb.w, h: cvb.h } };
  }
  function onMouseMove(e) {
    if (!dragging.current) return;
    var rect = cref.current.getBoundingClientRect();
    var dx = (e.clientX - dragging.current.sx) / rect.width * dragging.current.vb.w;
    var dy = (e.clientY - dragging.current.sy) / rect.height * dragging.current.vb.h;
    setVb({
      w: dragging.current.vb.w, h: dragging.current.vb.h,
      x: dragging.current.vb.x - dx, y: dragging.current.vb.y - dy
    });
  }
  function onMouseUp() { dragging.current = null; }

  return (
    React.createElement('div', {
      ref: cref, style: { position: 'absolute', inset: 0, overflow: 'hidden', cursor: 'grab' },
      onMouseDown: onMouseDown, onMouseMove: onMouseMove, onMouseUp: onMouseUp, onMouseLeave: onMouseUp
    }
      , React.createElement(ZoomBar, { zoom: zoomPct, zoomIn: zoomIn, zoomOut: zoomOut, fit: fit })
      , React.createElement('svg', {
        width: cW, height: cH,
        viewBox: cvb.x + ' ' + cvb.y + ' ' + cvb.w + ' ' + cvb.h,
        style: { position: 'absolute', inset: 0 },
        onWheel: onWheel
      }
        , React.createElement(SvgMarkers)
        , React.createElement('defs')
        , edges.map(function (e) {
          var edgeDim = simMode && !activeSet[parseInt(e.k)];
          var fromId = parseInt(e.k.split('-')[0]);
          var toId = parseInt(e.k.split('-')[1]);
          var edgeInFrag = hasFrag && (fragStateSet[fromId] || fragStateSet[toId]);
          var edgePrevOnly = hasFrag && !edgeInFrag;
          var labelStr = e.labels.join(',');
          var labelW = labelStr.length * 6.5 + 8;
          return (
            React.createElement('g', { key: e.k, style: { opacity: edgeDim ? .3 : edgePrevOnly ? .25 : 1, transition: 'opacity .3s' } }
              , React.createElement('path', {
                d: e.d, fill: "none", stroke: e.color, strokeWidth: "1.65",
                strokeDasharray: e.allEps ? '5,3' : 'none', markerEnd: e.marker, opacity: ".87"
              })
              , React.createElement('rect', { x: e.lx - labelW / 2, y: e.ly - 9, width: labelW, height: 13, rx: 3, fill: 'var(--bg)', opacity: .85 })
              , React.createElement('text', {
                x: e.lx, y: e.ly, fill: e.color, textAnchor: "middle",
                fontSize: "10", fontFamily: "JetBrains Mono,monospace", fontWeight: "700"
              }, labelStr)
            )
          );
        })
        , snap.states.map(function (s) {
          var p = pos[s.id]; if (!p) return null;
          var isStart = s.id === snap.startId, isAccept = s.id === snap.acceptId;
          var isActive = simMode && activeSet[s.id];
          var isFinalStep = simResult !== null && simResult !== undefined;
          var isFinalActive = isFinalStep && isActive;
          var finalColor = isFinalActive ? (simResult ? '#43e97b' : '#ff6b6b') : null;
          var fill = '#1e2740', stroke = '#5b8cff', sw = 1.5;
          if (isAccept) { fill = '#0d2318'; stroke = '#43e97b'; sw = 2.4; }
          if (isStart && !isAccept) { fill = '#1a1030'; stroke = '#9b59b6'; }
          if (isStart && isAccept) { fill = '#0c1a10'; stroke = '#43e97b'; sw = 2.4; }
          if (isActive && !isFinalStep) { fill = '#2a1a00'; stroke = '#f7971e'; sw = 2.8; }
          if (isFinalActive) { fill = simResult ? '#0a2218' : '#2a0a0a'; stroke = finalColor; sw = 3; }
          var isInFrag = !hasFrag || fragStateSet[s.id];
          var dim = (simMode && !isActive) || (hasFrag && !isInFrag);
          var pulseClass = isFinalActive ? (simResult ? 'sim-accept-pulse' : 'sim-reject-pulse') : (isActive ? 'sim-active-pulse' : '');
          var stateLabel = isFinalActive ? (simResult ? 'ACCEPT ✓' : 'REJECT ✗') : (isAccept ? 'ACCEPT' : '');
          var stateLabelColor = isFinalActive ? finalColor : '#43e97b';
          return (
            React.createElement('g', { key: s.id, style: { opacity: dim ? .25 : 1, transition: 'opacity .3s' } }
              , isStart && (React.createElement('g', null
                , React.createElement('line', { x1: p.x - R - 24, y1: p.y, x2: p.x - R - 1, y2: p.y, stroke: isFinalActive ? finalColor : (isActive ? '#f7971e' : '#9b59b6'), strokeWidth: "1.5", markerEnd: "url(#ap)" })
                , React.createElement('text', { x: p.x - R - 26, y: p.y - 7, fill: isFinalActive ? finalColor : (isActive ? '#f7971e' : '#9b59b6'), fontSize: "7.5", textAnchor: "end", fontFamily: "JetBrains Mono,monospace" }, "START")
              ))
              , isAccept && (React.createElement('circle', { cx: p.x, cy: p.y, r: R + 5, fill: "none", stroke: isFinalActive ? finalColor : (isActive ? '#f7971e' : '#43e97b'), strokeWidth: ".8", opacity: ".4" }))
              , isFinalActive && !isAccept && (React.createElement('circle', { cx: p.x, cy: p.y, r: R + 5, fill: "none", stroke: finalColor, strokeWidth: ".8", opacity: ".5" }))
              , isActive && (React.createElement('circle', { cx: p.x, cy: p.y, r: R + 10, fill: "none", stroke: stroke, strokeWidth: "1.5", opacity: ".35", className: pulseClass }))
              , React.createElement('circle', {
                cx: p.x, cy: p.y, r: R, fill: fill, stroke: stroke, strokeWidth: sw,
                style: { filter: 'drop-shadow(0 0 ' + (isActive ? '9px' : '5px') + ' ' + stroke + '60)', transition: 'all .3s' }
              })
              , React.createElement('text', {
                x: p.x, y: p.y + 4, textAnchor: "middle", fill: isActive ? '#fff' : "#e2e8f8", fontSize: "9.5",
                fontFamily: "JetBrains Mono,monospace", fontWeight: "600"
              }, "q", s.id)
              , (isAccept || isFinalActive) && stateLabel && (React.createElement('text', {
                x: p.x, y: p.y + R + 15, textAnchor: "middle", fill: stateLabelColor,
                fontSize: "7", fontFamily: "JetBrains Mono,monospace"
              }, stateLabel))
            )
          );
        })
      )
    )
  );
}

window.NFAViz = NFAViz;