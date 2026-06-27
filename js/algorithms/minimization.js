// ════════════════════════════════════════════════════════════
// §3b  HOPCROFT'S DFA MINIMIZATION
// ════════════════════════════════════════════════════════════
function minimizeDFA(dfaSnap, alpha) {
  // Remove unreachable states first
  var reachable = {};
  var queue = [dfaSnap.startLabel];
  reachable[dfaSnap.startLabel] = true;
  var tm = {};
  dfaSnap.trans.forEach(function (t) {
    if (!tm[t.from]) tm[t.from] = {};
    tm[t.from][t.sym] = t.to;
  });
  while (queue.length) {
    var cur = queue.shift();
    alpha.forEach(function (sym) {
      var nx = tm[cur] && tm[cur][sym];
      if (nx && nx !== '∅' && !reachable[nx]) { reachable[nx] = true; queue.push(nx); }
    });
  }
  var states = dfaSnap.states.filter(function (s) { return reachable[s.label]; });
  var stateLabels = states.map(function (s) { return s.label; });

  // Hopcroft's algorithm
  var acceptSet = stateLabels.filter(function (l) { return dfaSnap.accepts[l]; });
  var nonAcceptSet = stateLabels.filter(function (l) { return !dfaSnap.accepts[l]; });
  var partition = [];
  if (acceptSet.length) partition.push(acceptSet.slice());
  if (nonAcceptSet.length) partition.push(nonAcceptSet.slice());
  var worklist = partition.slice();
  var steps = [{ desc: 'Initial partition: P = {Accept states} ∪ {Non-accept states}', partition: partition.map(function (g) { return g.slice(); }) }];

  function findGroup(lbl) {
    for (var i = 0; i < partition.length; i++) {
      if (partition[i].indexOf(lbl) !== -1) return i;
    }
    return -1;
  }

  var iter = 0;
  while (worklist.length && iter < 200) {
    iter++;
    var splitter = worklist.shift();
    var splitterSet = {};
    splitter.forEach(function (l) { splitterSet[l] = true; });

    alpha.forEach(function (sym) {
      // For each partition group, try to split on (sym, splitter)
      var newPartition = [];
      var didSplit = false;
      partition.forEach(function (group) {
        var goesIn = [], goesOut = [];
        group.forEach(function (lbl) {
          var nx = tm[lbl] && tm[lbl][sym];
          if (nx && splitterSet[nx]) goesIn.push(lbl);
          else goesOut.push(lbl);
        });
        if (goesIn.length > 0 && goesOut.length > 0) {
          newPartition.push(goesIn);
          newPartition.push(goesOut);
          worklist.push(goesIn.length <= goesOut.length ? goesIn : goesOut);
          didSplit = true;
          steps.push({
            desc: 'Split group {' + group.join(',') + '}  on symbol "' + sym + '" → {' + goesIn.join(',') + '}  and  {' + goesOut.join(',') + '}',
            partition: newPartition.concat(partition.slice(newPartition.length - 2 >= 0 ? partition.indexOf(group) + 1 : 0)).map(function (g) { return g.slice(); })
          });
        } else {
          newPartition.push(group);
        }
      });
      if (didSplit) partition = newPartition;
    });
  }

  steps.push({ desc: 'Minimization complete. Final partition has ' + partition.length + ' group(s).', partition: partition.map(function (g) { return g.slice(); }) });

  // Build minimized DFA from partition
  function repOf(lbl) {
    for (var i = 0; i < partition.length; i++) {
      if (partition[i].indexOf(lbl) !== -1) return partition[i][0];
    }
    return lbl;
  }

  var minStates = [], seen2 = {};
  partition.forEach(function (group) {
    var rep = group[0];
    var orig = states.find(function (s) { return s.label === rep; });
    var isAccept = !!dfaSnap.accepts[rep];
    var nfaIds = orig ? orig.nfaIds : [];
    // Merge nfaIds from whole group
    var mergedNfa = {};
    group.forEach(function (lbl) {
      var s = states.find(function (x) { return x.label === lbl; });
      if (s && s.nfaIds) s.nfaIds.forEach(function (id) { mergedNfa[id] = true; });
    });
    minStates.push({ label: rep, nfaIds: Object.keys(mergedNfa).map(Number).sort(function (a, b) { return a - b; }), isAccept: isAccept, group: group });
  });

  var minTrans = [], seenTr = {};
  partition.forEach(function (group) {
    var rep = group[0];
    alpha.forEach(function (sym) {
      var nx = tm[rep] && tm[rep][sym];
      if (!nx || nx === '∅') return;
      var nxRep = repOf(nx);
      var key = rep + '|' + sym + '|' + nxRep;
      if (!seenTr[key]) { seenTr[key] = true; minTrans.push({ from: rep, sym: sym, to: nxRep }); }
    });
  });

  var minAccepts = {};
  minStates.forEach(function (s) { if (s.isAccept) minAccepts[s.label] = true; });
  var minStartLabel = repOf(dfaSnap.startLabel);

  // Add dead state if any state in the minimized DFA had transitions to ∅
  var needsDead = false;
  partition.forEach(function (group) {
    var rep = group[0];
    alpha.forEach(function (sym) {
      var nx = tm[rep] && tm[rep][sym];
      if (!nx) needsDead = true; // missing transition → implicit dead
    });
  });
  // Also preserve explicit ∅ transitions from DFA
  var hasDead = dfaSnap.states.find(function (s) { return s.label === '∅'; });
  if (hasDead || needsDead) {
    minStates.push({ label: '∅', nfaIds: [], isAccept: false, isDead: true, group: ['∅'] });
    // Add self-loops on dead state
    alpha.forEach(function (sym) {
      var key = '∅|' + sym + '|∅';
      if (!seenTr[key]) { seenTr[key] = true; minTrans.push({ from: '∅', sym: sym, to: '∅' }); }
    });
    // Add transitions from real states to dead state for missing symbols
    partition.forEach(function (group) {
      var rep = group[0];
      alpha.forEach(function (sym) {
        var nx = tm[rep] && tm[rep][sym];
        if (!nx || nx === '∅') {
          var key = rep + '|' + sym + '|∅';
          if (!seenTr[key]) { seenTr[key] = true; minTrans.push({ from: rep, sym: sym, to: '∅' }); }
        }
      });
    });
  }

  return {
    steps: steps,
    minSnap: { states: minStates, trans: minTrans, accepts: minAccepts, startLabel: minStartLabel },
    origCount: stateLabels.length,
    minCount: partition.length
  };
}

window.minimizeDFA = minimizeDFA;