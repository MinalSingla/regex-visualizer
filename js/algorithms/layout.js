// ════════════════════════════════════════════════════════════
// §5  LAYOUT ENGINE  (BFS layered + dynamic canvas + force relax)
// ════════════════════════════════════════════════════════════

// Returns {pos, canvasW, canvasH}
function layersToLayout(layers, minW, minH) {
  var lNums = Object.keys(layers).map(Number).sort(function (a, b) { return a - b; });
  var lCount = lNums.length;
  var R = 26;
  var HGAP = R * 2 + 140; // horizontal gap between layer columns
  var VGAP = R * 2 + 120; // vertical gap between nodes in same column
  var PAD_X = 130, PAD_Y = 100;

  var maxPerLayer = Math.max.apply(null, lNums.map(function (l) { return layers[l].length; }));

  // Canvas must be big enough to hold all nodes
  var canvasW = Math.max(minW, PAD_X * 2 + (lCount - 1) * HGAP + 80);
  var canvasH = Math.max(minH, PAD_Y * 2 + (maxPerLayer - 1) * VGAP + 80);

  var pos = {};
  lNums.forEach(function (lNum, li) {
    var ids = layers[lNum], count = ids.length;
    var x = lCount === 1 ? canvasW / 2 : PAD_X + (li / Math.max(lCount - 1, 1)) * (canvasW - PAD_X * 2);
    var totalH = (count - 1) * VGAP;
    var startY = (canvasH - totalH) / 2;
    ids.forEach(function (sid, si) {
      var y = count === 1 ? canvasH / 2 : startY + si * VGAP;
      pos[sid] = { x: x, y: y };
    });
  });

  // Force-directed relaxation (80 iterations) — push overlapping nodes apart
  var allIds = Object.keys(pos);
  for (var iter = 0; iter < 80; iter++) {
    allIds.forEach(function (a) {
      allIds.forEach(function (b) {
        if (a === b) return;
        var pa = pos[a], pb = pos[b];
        var dx = pa.x - pb.x, dy = pa.y - pb.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var minDist = R * 2 + 90;
        if (dist < minDist) {
          var push = (minDist - dist) / 2 + 4;
          var nx = dx / dist, ny = dy / dist;
          // Push both vertically and slightly horizontally
          pos[a] = { x: pa.x + nx * push * 0.3, y: pa.y + ny * push };
          pos[b] = { x: pb.x - nx * push * 0.3, y: pb.y - ny * push };
        }
      });
    });
    // Clamp to canvas bounds
    allIds.forEach(function (id) {
      var p = pos[id];
      pos[id] = {
        x: Math.max(PAD_X / 2, Math.min(canvasW - PAD_X / 2, p.x)),
        y: Math.max(PAD_Y / 2, Math.min(canvasH - PAD_Y / 2, p.y))
      };
    });
  }

  return { pos: pos, canvasW: canvasW, canvasH: canvasH };
}

function layoutNFA(snap, W, H) {
  if (!snap || !snap.states || !snap.states.length) return { pos: {}, canvasW: W, canvasH: H };
  var adj = {};
  snap.trans.forEach(function (t) {
    if (!adj[t.from]) adj[t.from] = [];
    adj[t.from].push(t.to);
  });
  var globalStart = snap.startId !== undefined ? snap.startId :
    snap.states.reduce(function (mn, s) { return s.id < mn ? s.id : mn; }, snap.states[0].id);
  var layers = {}, visited = {}, queue = [{ id: globalStart, layer: 0 }];
  visited[globalStart] = true;
  while (queue.length) {
    var item = queue.shift();
    if (!layers[item.layer]) layers[item.layer] = [];
    layers[item.layer].push(item.id);
    (adj[item.id] || []).forEach(function (nid) {
      if (!visited[nid]) { visited[nid] = true; queue.push({ id: nid, layer: item.layer + 1 }); }
    });
  }
  snap.states.forEach(function (s) {
    if (!visited[s.id]) {
      var maxL = Object.keys(layers).length ? Math.max.apply(null, Object.keys(layers).map(Number)) : 0;
      var nl = maxL + 1; if (!layers[nl]) layers[nl] = [];
      layers[nl].push(s.id);
    }
  });
  return layersToLayout(layers, W, H);
}

function layoutDFA(dfaSnap, W, H) {
  if (!dfaSnap || !dfaSnap.states || !dfaSnap.states.length) return { pos: {}, canvasW: W, canvasH: H };
  var adj = {};
  dfaSnap.trans.forEach(function (t) {
    if (t.to === '∅' || t.from === '∅') return;
    if (!adj[t.from]) adj[t.from] = [];
    if (adj[t.from].indexOf(t.to) === -1) adj[t.from].push(t.to);
  });
  var layers = {}, visited = {}, queue = [{ id: dfaSnap.startLabel, layer: 0 }];
  visited[dfaSnap.startLabel] = true;
  while (queue.length) {
    var item = queue.shift();
    if (!layers[item.layer]) layers[item.layer] = [];
    layers[item.layer].push(item.id);
    (adj[item.id] || []).forEach(function (nid) {
      if (!visited[nid]) { visited[nid] = true; queue.push({ id: nid, layer: item.layer + 1 }); }
    });
  }
  dfaSnap.states.forEach(function (s) {
    if (s.label === '∅') return;
    if (!visited[s.label]) {
      var maxL = Object.keys(layers).length ? Math.max.apply(null, Object.keys(layers).map(Number)) : 0;
      var nl = maxL + 1; if (!layers[nl]) layers[nl] = [];
      layers[nl].push(s.label);
    }
  });
  var layout = layersToLayout(layers, W, H);
  var hasDead = dfaSnap.states.find(function (s) { return s.label === '∅'; });
  if (hasDead) {
    // Place dead state below the last layer, centred
    layout.pos['∅'] = { x: layout.canvasW - 90, y: layout.canvasH - 70 };
    layout.canvasH = Math.max(layout.canvasH, layout.canvasH);
  }
  return layout;
}

// Distance from a point to a line segment
function distPointToSeg(px, py, ax, ay, bx, by) {
    var dx = bx - ax;
    var dy = by - ay;

    var l2 = dx * dx + dy * dy;

    if (l2 < 1e-6) {
        return Math.sqrt(
            (px - ax) * (px - ax) +
            (py - ay) * (py - ay)
        );
    }

    var t = Math.max(
        0,
        Math.min(
            1,
            ((px - ax) * dx + (py - ay) * dy) / l2
        )
    );

    var cx = ax + t * dx - px;
    var cy = ay + t * dy - py;

    return Math.sqrt(cx * cx + cy * cy);
}

function buildEdges(states, trans, getPos, R, isDfa) {

    var allPos = {};

    states.forEach(function (s) {
        var p = getPos(s.id);
        if (p) {
            allPos[String(s.id)] = p;
        }
    });

    var edgeMap = {};
    var seen = {};

    trans.forEach(function (t) {

        var key = t.from + '-' + t.to;

        if (!edgeMap[key]) {
            edgeMap[key] = [];
        }

        if (edgeMap[key].indexOf(t.sym) === -1) {
            edgeMap[key].push(t.sym);
        }

    });

    var edges = [];

    trans.forEach(function (t) {

        var key = t.from + '-' + t.to;
        var reverse = t.to + '-' + t.from;

        if (seen[key]) return;
        seen[key] = true;

        var p1 = getPos(t.from);
        var p2 = getPos(t.to);

        if (!p1 || !p2) return;

        var labels = edgeMap[key];

        var allEps =
            !isDfa &&
            labels.every(function (l) {
                return l === 'ε';
            });

        var color =
            isDfa
                ? '#c77dff'
                : (allEps ? '#f7971e' : '#5b8cff');

        var marker =
            isDfa
                ? 'url(#adfa)'
                : (allEps ? 'url(#ae)' : 'url(#as)');

        var isSelf = t.from === t.to;
        var hasBoth = !!edgeMap[reverse];

        var d, lx, ly;

        if (isSelf) {

            var cx = p1.x;
            var cy = p1.y - 95;

            d =
                'M ' +
                p1.x +
                ',' +
                (p1.y - R) +
                ' C ' +
                (cx - 56) +
                ',' +
                (cy - 46) +
                ' ' +
                (cx + 56) +
                ',' +
                (cy - 46) +
                ' ' +
                p1.x +
                ',' +
                (p1.y - R);

            lx = cx;
            ly = cy - 50;

        } else {

            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;

            var len = Math.sqrt(dx * dx + dy * dy) || 1;

            var ux = dx / len;
            var uy = dy / len;

            var sx = p1.x + ux * R;
            var sy = p1.y + uy * R;

            var ex = p2.x - ux * R;
            var ey = p2.y - uy * R;

            var px2 = -uy;
            var py2 = ux;

            if (hasBoth) {

                var off = 58;

                var qx = (sx + ex) / 2 + px2 * off;
                var qy = (sy + ey) / 2 + py2 * off;

                d =
                    'M ' + sx + ',' + sy +
                    ' Q ' + qx + ',' + qy +
                    ' ' + ex + ',' + ey;

                lx =
                    0.25 * sx +
                    0.5 * qx +
                    0.25 * ex +
                    px2 * 16;

                ly =
                    0.25 * sy +
                    0.5 * qy +
                    0.25 * ey +
                    py2 * 16;

            } else {

                var blocked = null;
                var best = 999;

                Object.keys(allPos).forEach(function (id) {

                    if (
                        id === String(t.from) ||
                        id === String(t.to)
                    ) {
                        return;
                    }

                    var np = allPos[id];

                    var dist =
                        distPointToSeg(
                            np.x,
                            np.y,
                            sx,
                            sy,
                            ex,
                            ey
                        );

                    if (dist < R + 16 && dist < best) {
                        best = dist;
                        blocked = np;
                    }

                });

                if (blocked) {

                    var mx = (sx + ex) / 2;
                    var my = (sy + ey) / 2;

                    var dot =
                        (blocked.x - mx) * px2 +
                        (blocked.y - my) * py2;

                    var side = dot > 0 ? -1 : 1;

                    var curve =
                        R +
                        60 +
                        Math.max(
                            0,
                            (R + 16 - best) * 1.8
                        );

                    var qx2 = mx + px2 * side * curve;
                    var qy2 = my + py2 * side * curve;

                    d =
                        'M ' +
                        sx +
                        ',' +
                        sy +
                        ' Q ' +
                        qx2 +
                        ',' +
                        qy2 +
                        ' ' +
                        ex +
                        ',' +
                        ey;

                    lx =
                        0.25 * sx +
                        0.5 * qx2 +
                        0.25 * ex +
                        px2 * side * 18;

                    ly =
                        0.25 * sy +
                        0.5 * qy2 +
                        0.25 * ey +
                        py2 * side * 18;

                } else {

                    d =
                        'M ' +
                        sx +
                        ',' +
                        sy +
                        ' L ' +
                        ex +
                        ',' +
                        ey;

                    lx = (sx + ex) / 2 + px2 * 22;
                    ly = (sy + ey) / 2 + py2 * 22;
                }
            }
        }

        edges.push({
            k: key,
            d: d,
            lx: lx,
            ly: ly,
            labels: labels,
            color: color,
            marker: marker,
            allEps: allEps
        });

    });

    return edges;
}

// Exports
window.distPointToSeg = distPointToSeg;
window.buildEdges = buildEdges;
window.layersToLayout = layersToLayout;
window.layoutNFA = layoutNFA;
window.layoutDFA = layoutDFA;