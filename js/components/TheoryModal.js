// Render text with * shown as superscript power
function starify(text) {
  if (!text || String(text).indexOf('*') === -1) return text;

  var parts = String(text).split('*');
  var children = [];

  for (var i = 0; i < parts.length; i++) {
    if (parts[i]) children.push(parts[i]);

    if (i < parts.length - 1) {
      children.push(
        React.createElement('span', {
          key: 'sup' + i,
          style: {
            display: 'inline-block',
            fontSize: '0.65em',
            fontWeight: 800,
            transform: 'translateY(-0.45em)',
            lineHeight: 1,
            letterSpacing: 0
          }
        }, '*')
      );
    }
  }

  return React.createElement('span', null, children);
}

function TheoryModal(props) {
  return (
    React.createElement('div', { className: "ov", onClick: props.onClose, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1091 } }
      , React.createElement('div', { className: "modal", onClick: function (e) { e.stopPropagation(); }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1092 } }
        , React.createElement('h2', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1093 } }, "📖 Theory Reference")
        , React.createElement('div', { className: "ts", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1094 } }
          , React.createElement('h3', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1095 } }, "Regular Expressions → NFA → DFA")
          , React.createElement('p', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1096 } }, "The pipeline: ", React.createElement('strong', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1096 } }, "Regex → ε-NFA"), " (Thompson, 1968) → ", React.createElement('strong', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1096 } }, "DFA"), " (Subset Construction) proves that all three formalisms describe exactly the same class of languages — the ", React.createElement('em', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1096 } }, "Regular Languages"), ".")
        )
        , React.createElement('div', { className: "ts", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1098 } }
          , React.createElement('h3', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1099 } }, "Thompson's Construction Rules")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1100 } }, "🔤 ", React.createElement('strong', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1100 } }, "Symbol \"a\":"), " q0 ──[a]──▶ q1 (accept)")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1101 } }, "⊕ ", React.createElement('strong', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1101 } }, "Concat AB:"), " A.accept ──ε──▶ B.start")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1102 } }, "✦ ", React.createElement('strong', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1102 } }, "Union A+B:"), " new-start ──ε──▶ A.start & B.start · A.accept, B.accept ──ε──▶ new-accept")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1103 } }, "★ ", React.createElement('strong', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1103 } }, starify("Kleene A*:")), " skip ε + loop-back ε + entry ε + exit ε")
        )
        , React.createElement('div', { className: "ts", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1105 } }
          , React.createElement('h3', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1106 } }, "Subset Construction (Rabin-Scott, 1959)")
          , React.createElement('p', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1107 } }, "Converts an ε-NFA to a DFA by treating ", React.createElement('strong', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1107 } }, "sets of NFA states"), " as single DFA states.")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1108 } }, "1. Start: DFA start = ε-closure(NFA start)")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1109 } }, "2. For each unmarked DFA state S and each input symbol a:", React.createElement('br', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1109 } }), "  move(S,a) = all NFA states reachable from S on a", React.createElement('br', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1109 } }), "  next = ε-closure(move(S,a)) → new DFA state")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1110 } }, "3. A DFA state is an ", React.createElement('strong', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1110 } }, "accept state"), " if it contains any NFA accept state")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1111 } }, "4. Repeat until no new DFA states are created")
          , React.createElement('p', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1112 } }, "Result: a DFA with at most 2ⁿ states (n = NFA states), but usually far fewer.")
        )
        , React.createElement('div', { className: "ts", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1114 } }
          , React.createElement('h3', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1115 } }, "ε-closure")
          , React.createElement('p', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1116 } }, "The ε-closure of a state q is all states reachable from q via ε-transitions only (computed by BFS/DFS). It captures \"where can the NFA be without reading any input?\"")
        )
        , React.createElement('div', { className: "ts", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1118 } }
          , React.createElement('h3', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1119 } }, "DFA Minimization (Hopcroft, 1971)")
          , React.createElement('p', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1120 } }, "Finds the smallest equivalent DFA by merging states that are ", React.createElement('em', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1120 } }, "indistinguishable"), " — meaning they behave identically on every possible input suffix.")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1121 } }, "1. Start: two groups — ", '{', "accept states", '}', " and ", '{', "non-accept states", '}')
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1122 } }, "2. Refine: if two states in a group go to different groups on some symbol, split the group")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1123 } }, "3. Repeat until no more splits are possible")
          , React.createElement('div', { className: "tr", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1124 } }, "4. Each final group becomes one state in the minimized DFA")
          , React.createElement('p', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1125 } }, "Result: the unique minimal DFA for the language (up to isomorphism).")
        )
        , React.createElement('button', { className: "cbtn", onClick: props.onClose, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1127 } }, "Close")
      )
    )
  );
}

window.TheoryModal = TheoryModal;