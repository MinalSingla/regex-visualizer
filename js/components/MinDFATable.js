// ════════════════════════════════════════════════════════════
// §7b  MIN-DFA TRANSITION TABLE
// ════════════════════════════════════════════════════════════
function MinDFATable(props) {
  var minSnap = props.minSnap, alpha = props.alpha, hiLabel = props.hiLabel;
  if (!minSnap || !minSnap.states || !minSnap.states.length || !alpha || !alpha.length) return null;
  // Build transition map
  var tm = {};
  minSnap.trans.forEach(function (t) {
    if (!tm[t.from]) tm[t.from] = {};
    tm[t.from][t.sym] = t.to;
  });
  return (
    React.createElement('div', { style: { overflowX: 'auto', marginTop: '.5rem' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1054 } }
      , React.createElement('div', { className: "slbl", style: { marginBottom: '.28rem', color: 'var(--a4)' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1055 } }, "Min-DFA Transition Table")
      , React.createElement('table', { className: "min-table", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1056 } }
        , React.createElement('thead', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1057 } }
          , React.createElement('tr', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1058 } }
            , React.createElement('th', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1059 } }, "State")
            , React.createElement('th', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1060 } }, "Merged from")
            , React.createElement('th', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1061 } }, "Acc?")
            , alpha.map(function (s) { return React.createElement('th', { key: s, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1062 } }, "\"", s, "\""); })
          )
        )
        , React.createElement('tbody', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1065 } }
          , minSnap.states.map(function (s) {
            var hi = s.label === hiLabel;
            var isStart = s.label === minSnap.startLabel;
            return (
              React.createElement('tr', { key: s.label, className: hi ? 'hi-row' : '', __self: this, __source: { fileName: _jsxFileName, lineNumber: 1070 } }
                , React.createElement('td', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1071 } }
                  , React.createElement('strong', { style: { color: hi ? 'var(--a4)' : 'var(--text)' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1072 } }, s.label)
                  , isStart && React.createElement('span', { style: { color: 'var(--a4)', fontSize: '.58rem', marginLeft: '.3rem' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1073 } }, "▶START")
                )
                , React.createElement('td', { style: { color: 'var(--muted)', fontSize: '.6rem' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1075 } }, s.group ? '{' + s.group.join(',') + '}' : (s.label))
                , React.createElement('td', { style: { color: s.isAccept ? 'var(--a3)' : 'var(--muted)' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1076 } }, s.isAccept ? '✓' : '—')
                , alpha.map(function (sym) {
                  var v = tm[s.label] && tm[s.label][sym];
                  return React.createElement('td', { key: sym, style: { color: v ? 'var(--a4)' : 'var(--muted)' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1079 } }, v || '∅');
                })
              )
            );
          })
        )
      )
    )
  );
}

window.MinDFATable = MinDFATable;