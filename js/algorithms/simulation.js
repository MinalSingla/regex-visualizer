// ════════════════════════════════════════════════════════════
// §4  SIMULATION (NFA & DFA)
// ════════════════════════════════════════════════════════════

// Simple NFA simulation
function simulateNFA(nfaSnap, str) {
    if (!nfaSnap) return null;

    var tm = {};

    nfaSnap.trans.forEach(function (t) {
        if (!tm[t.from]) tm[t.from] = {};
        if (!tm[t.from][t.sym]) tm[t.from][t.sym] = [];
        tm[t.from][t.sym].push(t.to);
    });

    var cur = epsClosure([nfaSnap.startId], tm);

    for (var i = 0; i < str.length; i++) {

        var ch = str[i];
        var nxt = {};

        Object.keys(cur).forEach(function (sid) {
            (tm[sid] && tm[sid][ch] || []).forEach(function (nid) {
                nxt[nid] = true;
            });
        });

        cur = epsClosure(Object.keys(nxt).map(Number), tm);

        if (!Object.keys(cur).length) {
            return false;
        }
    }

    return !!cur[nfaSnap.acceptId];
}

// Simple DFA simulation
function simulateDFA(dfaSnap, str) {
    if (!dfaSnap) return null;

    var tm = {};

    dfaSnap.trans.forEach(function (t) {
        if (!tm[t.from]) tm[t.from] = {};
        tm[t.from][t.sym] = t.to;
    });

    var cur = dfaSnap.startLabel;

    for (var i = 0; i < str.length; i++) {

        var nx = tm[cur] && tm[cur][str[i]];

        if (!nx || nx === '∅') {
            return false;
        }

        cur = nx;
    }

    return !!dfaSnap.accepts[cur];
}

// Step-by-step NFA simulation
function simulateNFAWithSteps(nfaSnap, str) {
    if (!nfaSnap) return null;

    var tm = {};

    nfaSnap.trans.forEach(function (t) {
        if (!tm[t.from]) tm[t.from] = {};
        if (!tm[t.from][t.sym]) tm[t.from][t.sym] = [];
        tm[t.from][t.sym].push(t.to);
    });

    var cur = epsClosure([nfaSnap.startId], tm);

    var steps = [];

    var initIds = Object.keys(cur)
        .map(Number)
        .sort(function (a, b) { return a - b; });

    steps.push({
        input: null,
        stateIds: initIds,
        desc:
            'ε-closure({q' +
            nfaSnap.startId +
            '}) = {q' +
            initIds.join(', q') +
            '}'
    });

    for (var i = 0; i < str.length; i++) {

        var ch = str[i];
        var nxt = {};

        Object.keys(cur).forEach(function (sid) {
            (tm[sid] && tm[sid][ch] || []).forEach(function (nid) {
                nxt[nid] = true;
            });
        });

        var moved = Object.keys(nxt)
            .map(Number)
            .sort(function (a, b) { return a - b; });

        cur = epsClosure(
            Object.keys(nxt).map(Number),
            tm
        );

        var afterIds = Object.keys(cur)
            .map(Number)
            .sort(function (a, b) { return a - b; });

        steps.push({
            input: ch,
            stateIds: afterIds,
            desc: moved.length
                ? 'move→{q' +
                  moved.join(',q') +
                  '} → ε-closure→{q' +
                  afterIds.join(',q') +
                  '}'
                : 'move→∅ (no transition on "' + ch + '")'
        });

        if (!afterIds.length) {
            return {
                accepted: false,
                steps: steps,
                deadOn: ch
            };
        }
    }

    return {
        accepted: !!cur[nfaSnap.acceptId],
        steps: steps
    };
}

// Step-by-step DFA simulation
function simulateDFAWithSteps(dfaSnap, str) {
    if (!dfaSnap) return null;

    var tm = {};

    dfaSnap.trans.forEach(function (t) {
        if (!tm[t.from]) tm[t.from] = {};
        tm[t.from][t.sym] = t.to;
    });

    var cur = dfaSnap.startLabel;

    var steps = [];

    steps.push({
        input: null,
        state: cur,
        desc: 'Start state: ' + cur
    });

    for (var i = 0; i < str.length; i++) {

        var ch = str[i];
        var nx = tm[cur] && tm[cur][ch];

        if (!nx || nx === '∅') {

            steps.push({
                input: ch,
                state: '∅',
                desc:
                    'δ(' +
                    cur +
                    ', "' +
                    ch +
                    '") = ∅ → dead state'
            });

            return {
                accepted: false,
                steps: steps
            };
        }

        steps.push({
            input: ch,
            state: nx,
            desc:
                'δ(' +
                cur +
                ', "' +
                ch +
                '") = ' +
                nx +
                (dfaSnap.accepts[nx] ? ' [accept]' : '')
        });

        cur = nx;
    }

    return {
        accepted: !!dfaSnap.accepts[cur],
        steps: steps,
        finalState: cur
    };
}

// ============================
// Exports
// ============================

window.simulateNFA = simulateNFA;
window.simulateDFA = simulateDFA;
window.simulateNFAWithSteps = simulateNFAWithSteps;
window.simulateDFAWithSteps = simulateDFAWithSteps;