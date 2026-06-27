// Helper: shared render logic for DFA/MinDFA node+edge SVG
function renderDFAContent(snap, pos, R, edges, simMode, activeLabel, simResult, accentColor, markerUrl) {
  var isFinalStep = simResult !== null && simResult !== undefined;
  return [
    edges.map(function (e) {
      var isDeadEdge = e.k.indexOf('∅') !== -1;
      var labelStr = e.labels.join(','); var labelW = labelStr.length * 6.5 + 8;
      return React.createElement('g', { key: e.k, style: { transition: 'opacity .3s', opacity: isDeadEdge ? .55 : 1 } },
        React.createElement('path', {
          d: e.d, fill: 'none', stroke: isDeadEdge ? '#ff6b6b' : e.color,
          strokeWidth: isDeadEdge ? '1.2' : '1.65', strokeDasharray: isDeadEdge ? '4,3' : 'none',
          markerEnd: isDeadEdge ? 'url(#adead)' : e.marker, opacity: isDeadEdge ? '.6' : '.87'
        }),
        React.createElement('rect', { x: e.lx - labelW / 2, y: e.ly - 9, width: labelW, height: 13, rx: 3, fill: 'var(--bg)', opacity: .85 }),
        React.createElement('text', {
          x: e.lx, y: e.ly, fill: isDeadEdge ? '#ff6b6b' : e.color, textAnchor: 'middle',
          fontSize: '10', fontFamily: 'JetBrains Mono,monospace', fontWeight: '700'
        }, labelStr)
      );
    }),
    snap.states.map(function (s) {
      var p = pos[s.label]; if (!p) return null;
      var isDead = s.label === '∅' || s.isDead;
      if (isDead) return React.createElement('g', { key: s.label, style: { opacity: .75 } },
        React.createElement('circle', {
          cx: p.x, cy: p.y, r: R, fill: '#1a0808', stroke: '#ff6b6b', strokeWidth: '1.5',
          strokeDasharray: '4,2', style: { filter: 'drop-shadow(0 0 5px #ff6b6b44)' }
        }),
        React.createElement('text', {
          x: p.x, y: p.y + 5, textAnchor: 'middle', fill: '#ff6b6b', fontSize: '14',
          fontFamily: 'JetBrains Mono,monospace', fontWeight: '700'
        }, '∅'),
        React.createElement('text', {
          x: p.x, y: p.y + R + 14, textAnchor: 'middle', fill: '#ff6b6b',
          fontSize: '7', fontFamily: 'JetBrains Mono,monospace'
        }, 'DEAD')
      );
      var isStart = s.label === snap.startLabel;
      var isAccept = snap.accepts[s.label];
      var isActive = simMode && s.label === activeLabel;
      var dim = simMode && !isActive;
      var isFinalActive = isFinalStep && isActive;
      var finalColor = isFinalActive ? (simResult ? '#43e97b' : '#ff6b6b') : null;
      var fill = '#1c1535', stroke = accentColor, sw = 1.5;
      if (isAccept) { fill = '#0d2318'; stroke = '#43e97b'; sw = 2.4; }
      if (isStart && isAccept) { fill = '#0c1a10'; stroke = '#43e97b'; sw = 2.4; }
      if (isActive && !isFinalStep) { fill = isAccept ? '#1a2a00' : '#2a1a00'; stroke = '#f7971e'; sw = 2.8; }
      if (isFinalActive) { fill = simResult ? '#0a2218' : '#2a0a0a'; stroke = finalColor; sw = 3; }
      var pulseClass = isFinalActive ? (simResult ? 'sim-accept-pulse' : 'sim-reject-pulse') : (isActive ? 'sim-active-pulse' : '');
      var stateLabel = isFinalActive ? (simResult ? 'ACCEPT ✓' : 'REJECT ✗') : (isAccept ? 'ACCEPT' : '');
      var nfaLabel = s.nfaIds && s.nfaIds.length ? '{q' + s.nfaIds.join(',q') + '}' : '{}';
      return React.createElement('g', { key: s.label, style: { opacity: dim ? .25 : 1, transition: 'opacity .3s' } },
        isStart && React.createElement('g', null,
          React.createElement('line', {
            x1: p.x - R - 26, y1: p.y, x2: p.x - R - 1, y2: p.y,
            stroke: isFinalActive ? finalColor : (isActive ? '#f7971e' : accentColor), strokeWidth: '1.5', markerEnd: markerUrl
          }),
          React.createElement('text', {
            x: p.x - R - 28, y: p.y - 7, fill: isFinalActive ? finalColor : (isActive ? '#f7971e' : accentColor),
            fontSize: '7.5', textAnchor: 'end', fontFamily: 'JetBrains Mono,monospace'
          }, 'START')
        ),
        isAccept && React.createElement('circle', {
          cx: p.x, cy: p.y, r: R + 5, fill: 'none',
          stroke: isFinalActive ? finalColor : (isActive ? '#f7971e' : '#43e97b'), strokeWidth: '.8', opacity: '.4'
        }),
        isFinalActive && !isAccept && React.createElement('circle', { cx: p.x, cy: p.y, r: R + 5, fill: 'none', stroke: finalColor, strokeWidth: '.8', opacity: '.5' }),
        isActive && React.createElement('circle', { cx: p.x, cy: p.y, r: R + 10, fill: 'none', stroke: stroke, strokeWidth: '1.5', opacity: '.35', className: pulseClass }),
        React.createElement('circle', {
          cx: p.x, cy: p.y, r: R, fill: fill, stroke: stroke, strokeWidth: sw,
          style: { filter: 'drop-shadow(0 0 ' + (isActive ? '9px' : '6px') + ' ' + stroke + '55)', transition: 'all .3s' }
        }),
        React.createElement('text', {
          x: p.x, y: p.y + 1, textAnchor: 'middle', fill: isActive ? '#fff' : '#e2e8f8',
          fontSize: '11', fontFamily: 'JetBrains Mono,monospace', fontWeight: '700'
        }, s.label),
        (isAccept || isFinalActive) && stateLabel && React.createElement('text', {
          x: p.x, y: p.y + R + 15, textAnchor: 'middle',
          fill: isFinalActive ? finalColor : '#43e97b', fontSize: '7', fontFamily: 'JetBrains Mono,monospace'
        }, stateLabel),
        React.createElement('text', {
          x: p.x, y: p.y + R + 26, textAnchor: 'middle', fill: 'var(--muted)',
          fontSize: '7', fontFamily: 'JetBrains Mono,monospace'
        }, nfaLabel)
      );
    })
  ];
}

window.renderDFAContent = renderDFAContent;