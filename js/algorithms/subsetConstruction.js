// ════════════════════════════════════════════════════════════
// §3  SUBSET CONSTRUCTION  →  step-by-step DFA
// ════════════════════════════════════════════════════════════
function epsClosure(ids, tm) {
  var set = {}, q = [];
  ids.forEach(function (id) { set[id] = true; q.push(id); });
  while (q.length) {
    var cur = q.shift();
    (tm[cur] && tm[cur]['ε'] || []).forEach(function (nid) {
      if (!set[nid]) { set[nid] = true; q.push(nid); }
    });
  }
  return set;
}
function setKey(obj) { return Object.keys(obj).map(Number).sort(function (a, b) { return a - b; }).join(','); }

/**
 * subsetConstruct(nfaSnap) → { steps, dfaSnap, alphabet }
 *
 * Each step = {
 *   dfaStateLabel, nfaSet (sorted ids), symbol (or null for start),
 *   targetLabel, isAccept, isNew, tableRows (full table so far),
 *   why, partialDfa (snapshot of DFA built so far)
 * }
 */
function subsetConstruct(nfaSnap) {
  if (!nfaSnap) return null;

  // Build NFA transition map
  var tm = {};
  nfaSnap.trans.forEach(function (t) {
    if (!tm[t.from]) tm[t.from] = {};
    if (!tm[t.from][t.sym]) tm[t.from][t.sym] = [];
    tm[t.from][t.sym].push(t.to);
  });

  // Collect alphabet (exclude ε)
  var alphaSet = {};
  nfaSnap.trans.forEach(function (t) { if (t.sym !== 'ε') alphaSet[t.sym] = true; });
  var alpha = Object.keys(alphaSet).sort();

  var steps = [];
  var labelMap = {};   // setKey → DFA label e.g. "A","B",...
  var labelChar = 65;  // 'A'
  var queue = [];
  var dfaTrans = [];   // [{from:label,sym,to:label}]
  var dfaAccepts = {}; // {label:true}
  var dfaStates = [];  // [{label,nfaIds,isAccept}]
  var tableRows = [];  // [{label,nfaSet,bySymbol:{sym:label},isAccept}]

  // Start state = ε-closure(nfa.start)
  var startClosure = epsClosure([nfaSnap.startId], tm);
  var startKey = setKey(startClosure);
  var startLabel = String.fromCharCode(labelChar++);
  labelMap[startKey] = startLabel;

  var startIsAccept = !!startClosure[nfaSnap.acceptId];
  if (startIsAccept) dfaAccepts[startLabel] = true;
  dfaStates.push({ label: startLabel, nfaIds: Object.keys(startClosure).map(Number).sort(function (a, b) { return a - b; }), isAccept: startIsAccept });
  queue.push({ label: startLabel, closure: startClosure });

  // Step 0: creation of start state
  var row0 = { label: startLabel, nfaIds: Object.keys(startClosure).map(Number).sort(function (a, b) { return a - b; }), bySymbol: {}, isAccept: startIsAccept };
  alpha.forEach(function (s) { row0.bySymbol[s] = '?'; });
  tableRows.push(row0);

  steps.push({
    type: 'start',
    dfaLabel: startLabel,
    nfaIds: Object.keys(startClosure).map(Number).sort(function (a, b) { return a - b; }),
    isAccept: startIsAccept,
    symbol: null,
    why: 'Compute ε-closure of NFA start state q' + nfaSnap.startId + '. This gives us the initial DFA state ' + startLabel + ' = {' + Object.keys(startClosure).sort().join(',') + '}.' + (startIsAccept ? ' It contains the NFA accept state q' + nfaSnap.acceptId + ', so ' + startLabel + ' is an accept state.' : ''),
    tableRows: tableRows.map(function (r) { return Object.assign({}, r, { bySymbol: Object.assign({}, r.bySymbol) }); }),
    partialDfa: { states: dfaStates.slice(), trans: dfaTrans.slice(), accepts: Object.assign({}, dfaAccepts), startLabel: startLabel }
  });

  while (queue.length) {
    var item = queue.shift();
    var curLabel = item.label, curClosure = item.closure;
    var tableRow = null;
    for (var ri = 0; ri < tableRows.length; ri++) { if (tableRows[ri].label === curLabel) { tableRow = tableRows[ri]; break; } }

    for (var ai = 0; ai < alpha.length; ai++) {
      var sym = alpha[ai];
      // Move: all states reachable from curClosure on sym
      var moved = {};
      Object.keys(curClosure).forEach(function (sid) {
        (tm[sid] && tm[sid][sym] || []).forEach(function (nid) { moved[nid] = true; });
      });
      // ε-closure of moved
      var newClosure = epsClosure(Object.keys(moved).map(Number), tm);
      var newKey = setKey(newClosure);
      var newIds = Object.keys(newClosure).map(Number).sort(function (a, b) { return a - b; });
      var isNew = false, targetLabel;

      if (newIds.length === 0) {
        targetLabel = '∅'; // dead state
        // Add dead state to dfaStates if not already there
        if (!dfaStates.find(function (s) { return s.label === '∅'; })) {
          dfaStates.push({ label: '∅', nfaIds: [], isAccept: false, isDead: true });
          // Dead state loops to itself on all alphabet symbols
          alpha.forEach(function (as2) {
            dfaTrans.push({ from: '∅', sym: as2, to: '∅' });
          });
          var deadRow = { label: '∅', nfaIds: [], bySymbol: {}, isAccept: false, isDead: true };
          alpha.forEach(function (s2) { deadRow.bySymbol[s2] = '∅'; });
          tableRows.push(deadRow);
        }
      } else if (labelMap[newKey]) {
        targetLabel = labelMap[newKey];
      } else {
        targetLabel = String.fromCharCode(labelChar++);
        labelMap[newKey] = targetLabel;
        isNew = true;
        var newIsAccept = !!newClosure[nfaSnap.acceptId];
        if (newIsAccept) dfaAccepts[targetLabel] = true;
        dfaStates.push({ label: targetLabel, nfaIds: newIds, isAccept: newIsAccept });
        queue.push({ label: targetLabel, closure: newClosure });
        var newRow = { label: targetLabel, nfaIds: newIds, bySymbol: {}, isAccept: newIsAccept };
        alpha.forEach(function (s) { newRow.bySymbol[s] = '?'; });
        tableRows.push(newRow);
      }

      dfaTrans.push({ from: curLabel, sym: sym, to: targetLabel });
      if (tableRow) tableRow.bySymbol[sym] = targetLabel;

      steps.push({
        type: 'transition',
        dfaLabel: curLabel,
        symbol: sym,
        nfaIds: Object.keys(curClosure).map(Number).sort(function (a, b) { return a - b; }),
        targetLabel: targetLabel,
        targetNfaIds: newIds,
        isNew: isNew,
        isAccept: newIds.length > 0 && !!newClosure[nfaSnap.acceptId],
        why: 'From DFA state ' + curLabel + ' (NFA states {' + Object.keys(curClosure).sort().join(',') + '}) on symbol "' + sym + '":\n'
          + '  move → {' + Object.keys(moved).sort().join(',') + '}\n'
          + '  ε-closure → {' + newIds.join(',') + '} = DFA state ' + targetLabel + (isNew ? ' [NEW]' : '') + '.'
          + (newIds.length > 0 && !!newClosure[nfaSnap.acceptId] ? ' ' + targetLabel + ' contains NFA accept q' + nfaSnap.acceptId + ' → accept state.' : ''),
        tableRows: tableRows.map(function (r) { return Object.assign({}, r, { bySymbol: Object.assign({}, r.bySymbol) }); }),
        partialDfa: { states: dfaStates.slice(), trans: dfaTrans.slice(), accepts: Object.assign({}, dfaAccepts), startLabel: startLabel }
      });
    }
  }

  // Final step
  var hasFinalDead = dfaStates.find(function (s) { return s.label === '∅'; });
  steps.push({
    type: 'final',
    why: 'Subset construction complete. The DFA has ' + dfaStates.length + ' state(s) and ' + dfaTrans.length + ' transition(s). Accept states: {' + (Object.keys(dfaAccepts).join(', ') || 'none') + '}.' +
      (hasFinalDead ? ' A dead state ∅ is shown — some NFA transitions lead to an empty set of states.' : ' No dead state needed — every symbol from every state reaches at least one NFA state (the language structure ensures full coverage).'),
    tableRows: tableRows.map(function (r) { return Object.assign({}, r, { bySymbol: Object.assign({}, r.bySymbol) }); }),
    partialDfa: { states: dfaStates.slice(), trans: dfaTrans.slice(), accepts: Object.assign({}, dfaAccepts), startLabel: startLabel }
  });

  return { steps: steps, dfaSnap: { states: dfaStates, trans: dfaTrans, accepts: dfaAccepts, startLabel: startLabel }, alphabet: alpha };
}

window.epsClosure = epsClosure;
window.setKey = setKey;
window.subsetConstruct = subsetConstruct;