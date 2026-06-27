function DFATable(props) {
  var rows = props.rows, alpha = props.alpha, hiLabel = props.hiLabel;
  if (!rows || !rows.length || !alpha || !alpha.length) return null;
  return (
    React.createElement('div', { style: { overflowX: 'auto', marginTop: '.5rem' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1010 } }
      , React.createElement('table', { className: "ttbl", __self: this, __source: { fileName: _jsxFileName, lineNumber: 1011 } }
        , React.createElement('thead', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1012 } }
          , React.createElement('tr', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1013 } }
            , React.createElement('th', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1014 } }, "State")
            , React.createElement('th', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1015 } }, "NFA set")
            , React.createElement('th', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1016 } }, "Acc?")
            , alpha.map(function (s) { return React.createElement('th', { key: s, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1017 } }, "\"", s, "\""); })
          )
        )
        , React.createElement('tbody', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1020 } }
          , rows.map(function (r) {
            var hi = r.label === hiLabel;
            return (
              React.createElement('tr', { key: r.label, className: hi ? 'hi' : '', __self: this, __source: { fileName: _jsxFileName, lineNumber: 1024 } }
                , React.createElement('td', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1025 } }, React.createElement('strong', { style: { color: hi ? 'var(--a5)' : 'var(--text)' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1025 } }, r.label))
                , React.createElement('td', { __self: this, __source: { fileName: _jsxFileName, lineNumber: 1026 } }, '{' + (r.nfaIds || []).map(function (id) { return 'q' + id; }).join(',') + '}')
                , React.createElement('td', { style: { color: r.isAccept ? 'var(--a3)' : 'var(--muted)' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1027 } }, r.isAccept ? '✓' : '—')
                , alpha.map(function (s) {
                  var v = r.bySymbol && r.bySymbol[s];
                  return React.createElement('td', { key: s, style: { color: v === '?' ? 'var(--muted)' : v === '∅' ? 'var(--a2)' : 'var(--a5)' }, __self: this, __source: { fileName: _jsxFileName, lineNumber: 1030 } }, v || '—');
                })
              )
            );
          })
        )
      )
    )
  );
}

window.DFATable = DFATable;