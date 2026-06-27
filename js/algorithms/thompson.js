// ===== Thompson Construction =====

var SC = 0;

// Create a new state
function ns() {
    return {
        id: SC++,
        trans: {}
    };
}

// Add a transition from one state to another
function addT(state, symbol, targetId) {
    if (!state.trans[symbol]) {
        state.trans[symbol] = [];
    }

    state.trans[symbol].push(targetId);
}

// Create a snapshot of the current fragment
function snapFrag(fragment) {
    return {
        startId: fragment.start.id,
        acceptId: fragment.accept.id,

        states: fragment.ls.map(function (state) {
            return {
                id: state.id
            };
        }),

        trans: fragment.ft.map(function (transition) {
            return {
                from: transition.from,
                sym: transition.sym,
                to: transition.to
            };
        })
    };
}

// Create an NFA fragment
function mkF(start, accept, states, transitions) {
    return {
        start: start,
        accept: accept,
        ls: states,
        ft: transitions
    };
}

// Create an NFA fragment for a single symbol
function fSym(symbol) {
    var start = ns();
    var accept = ns();

    addT(start, symbol, accept.id);

    return mkF(
        start,
        accept,
        [start, accept],
        [
            {
                from: start.id,
                sym: symbol,
                to: accept.id
            }
        ]
    );
}

// Concatenate two fragments
function fConcat(first, second) {

    addT(first.accept, 'ε', second.start.id);

    return mkF(
        first.start,
        second.accept,

        first.ls.concat(second.ls),

        first.ft.concat(
            second.ft,
            [
                {
                    from: first.accept.id,
                    sym: 'ε',
                    to: second.start.id
                }
            ]
        )
    );
}

// Union (|)
function fUnion(first, second) {

    var start = ns();
    var accept = ns();

    addT(start, 'ε', first.start.id);
    addT(start, 'ε', second.start.id);

    addT(first.accept, 'ε', accept.id);
    addT(second.accept, 'ε', accept.id);

    var transitions = [
        { from: start.id, sym: 'ε', to: first.start.id },
        { from: start.id, sym: 'ε', to: second.start.id },
        { from: first.accept.id, sym: 'ε', to: accept.id },
        { from: second.accept.id, sym: 'ε', to: accept.id }
    ];

    return mkF(
        start,
        accept,
        [start, accept].concat(first.ls, second.ls),
        first.ft.concat(second.ft, transitions)
    );
}

// Kleene Star (*)
function fKleene(fragment) {

    var start = ns();
    var accept = ns();

    addT(start, 'ε', fragment.start.id);
    addT(start, 'ε', accept.id);

    addT(fragment.accept, 'ε', fragment.start.id);
    addT(fragment.accept, 'ε', accept.id);

    var transitions = [
        { from: start.id, sym: 'ε', to: fragment.start.id },
        { from: start.id, sym: 'ε', to: accept.id },
        { from: fragment.accept.id, sym: 'ε', to: fragment.start.id },
        { from: fragment.accept.id, sym: 'ε', to: accept.id }
    ];

    return mkF(
        start,
        accept,
        [start, accept].concat(fragment.ls),
        fragment.ft.concat(transitions)
    );
}

// One or more (+)
function fPlus(fragment) {

    var start = ns();
    var accept = ns();

    addT(start, 'ε', fragment.start.id);

    addT(fragment.accept, 'ε', fragment.start.id);
    addT(fragment.accept, 'ε', accept.id);

    var transitions = [
        { from: start.id, sym: 'ε', to: fragment.start.id },
        { from: fragment.accept.id, sym: 'ε', to: fragment.start.id },
        { from: fragment.accept.id, sym: 'ε', to: accept.id }
    ];

    return mkF(
        start,
        accept,
        [start, accept].concat(fragment.ls),
        fragment.ft.concat(transitions)
    );
}

// Zero or one (?)
function fQuestion(fragment) {

    var start = ns();
    var accept = ns();

    addT(start, 'ε', fragment.start.id);
    addT(start, 'ε', accept.id);

    addT(fragment.accept, 'ε', accept.id);

    var transitions = [
        { from: start.id, sym: 'ε', to: fragment.start.id },
        { from: start.id, sym: 'ε', to: accept.id },
        { from: fragment.accept.id, sym: 'ε', to: accept.id }
    ];

    return mkF(
        start,
        accept,
        [start, accept].concat(fragment.ls),
        fragment.ft.concat(transitions)
    );
}

// Build ε-NFA using Thompson's Construction
function buildNFA(regex) {

    resetStateCounter();

    var postfix = toPostfix(
        insertConcat(
            normalizeUnion(regex.trim())
        )
    );

    var stack = [];
    var steps = [];

    // Accumulated visualization
    var allStates = [];
    var allTrans = [];

    for (var i = 0; i < postfix.length; i++) {

        var tok = postfix[i];
        var frag;
        var rule;
        var why;
        var res;

        if (tok === '.') {

            var f2 = stack.pop();
            var f1 = stack.pop();

            frag = fConcat(f1, f2);

            rule = 'Concatenation';

            why =
                'Chain two fragments: an ε-transition from q' +
                f1.accept.id +
                ' (accept of left) to q' +
                f2.start.id +
                ' (start of right). No input is consumed at the join.';

            res =
                'q' +
                f1.start.id +
                ' ──...──▶ q' +
                f1.accept.id +
                ' ──ε──▶ q' +
                f2.start.id +
                ' ──...──▶ q' +
                f2.accept.id;

        }
        else if (tok === '|') {

            var f2u = stack.pop();
            var f1u = stack.pop();

            frag = fUnion(f1u, f2u);

            rule = 'Union (+)';

            why =
                'New start q' +
                frag.start.id +
                ' branches via ε to both sub-NFAs. Both accept states merge via ε into new accept q' +
                frag.accept.id +
                '. Either path leads to acceptance.';

            res =
                'q' +
                frag.start.id +
                ' ──ε──▶ {q' +
                f1u.start.id +
                ', q' +
                f2u.start.id +
                '} → ... → q' +
                frag.accept.id;

        }
        else if (tok === '*') {

            var fk = stack.pop();

            frag = fKleene(fk);

            rule = 'Kleene Star (*)';

            why =
                'New start q' +
                frag.start.id +
                ' can skip to accept (zero times) or enter q' +
                fk.start.id +
                '. After matching, q' +
                fk.accept.id +
                ' loops back for repetition or exits to accept q' +
                frag.accept.id +
                '.';

            res =
                'q' +
                frag.start.id +
                ' ──ε──▶ q' +
                fk.start.id +
                ' (enter) | q' +
                frag.accept.id +
                ' (skip). Loop: q' +
                fk.accept.id +
                ' ──ε──▶ q' +
                fk.start.id;

        }
        else if (tok === '+') {

            var fp = stack.pop();

            frag = fPlus(fp);

            rule = 'Plus (+)';

            why =
                'Must enter q' +
                fp.start.id +
                ' at least once (no skip path). After matching, q' +
                fp.accept.id +
                ' can loop back to q' +
                fp.start.id +
                ' or exit to accept q' +
                frag.accept.id +
                '.';

            res =
                'q' +
                frag.start.id +
                ' ──ε──▶ q' +
                fp.start.id +
                ' (mandatory). q' +
                fp.accept.id +
                ' loops or exits to q' +
                frag.accept.id;

        }
        else if (tok === '?') {

            var fq = stack.pop();

            frag = fQuestion(fq);

            rule = 'Optional (?)';

            why =
                'New start q' +
                frag.start.id +
                ' either skips directly to accept q' +
                frag.accept.id +
                ' (zero times) via ε, or enters q' +
                fq.start.id +
                ' for exactly one match.';

            res =
                'q' +
                frag.start.id +
                ' ──ε──▶ q' +
                fq.start.id +
                ' OR q' +
                frag.accept.id +
                ' (skip)';

        }
        else {

            frag = fSym(tok);

            rule = 'Symbol "' + tok + '"';

            why =
                'Base case: two new states q' +
                frag.start.id +
                ' and q' +
                frag.accept.id +
                ', connected by a single transition on "' +
                tok +
                '". This is the atomic Thompson fragment.';

            res =
                'q' +
                frag.start.id +
                ' ──"' +
                tok +
                '"──▶ q' +
                frag.accept.id;
        }

        stack.push(frag);

        frag.ls.forEach(function (s) {
            if (!allStates.find(function (x) {
                return x.id === s.id;
            })) {
                allStates.push({ id: s.id });
            }
        });

        frag.ft.forEach(function (t) {
            if (!allTrans.find(function (x) {
                return x.from === t.from &&
                    x.sym === t.sym &&
                    x.to === t.to;
            })) {
                allTrans.push({
                    from: t.from,
                    sym: t.sym,
                    to: t.to
                });
            }
        });

        steps.push({
            rule: rule,
            why: why,
            res: res,
            snap: {
                states: allStates.slice(),
                trans: allTrans.slice(),
                startId: frag.start.id,
                acceptId: frag.accept.id,
                fragStartId: frag.start.id,
                fragAcceptId: frag.accept.id,
                fragStateIds: frag.ls.map(function (s) {
                    return s.id;
                })
            }
        });

    }

    var final = stack.pop();

    var finalSnap = final ? snapFrag(final) : null;

    if (finalSnap) {
        finalSnap.states = allStates.slice();
        finalSnap.trans = allTrans.slice();
        finalSnap.fragStartId = final.start.id;
        finalSnap.fragAcceptId = final.accept.id;
        finalSnap.fragStateIds = final.ls.map(function (s) {
            return s.id;
        });
    }

    return {
        steps: steps,
        final: finalSnap
    };
}

// Reset state counter before building a new NFA
function resetStateCounter() {
    SC = 0;
}

// Export
window.ns = ns;
window.addT = addT;
window.resetStateCounter = resetStateCounter;

window.snapFrag = snapFrag;
window.mkF = mkF;

window.fSym = fSym;
window.fConcat = fConcat;
window.fUnion = fUnion;
window.fKleene = fKleene;
window.fPlus = fPlus;
window.fQuestion = fQuestion;

window.buildNFA = buildNFA;