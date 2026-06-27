// Render text with * shown as superscript power
function starify(text) {
  if (!text || String(text).indexOf('*') === -1) return text;

  var parts = String(text).split('*');
  var children = [];

  for (var i = 0; i < parts.length; i++) {
    if (parts[i]) children.push(parts[i]);

    if (i < parts.length - 1) {
      children.push(
        React.createElement(
          'span',
          {
            key: 'sup' + i,
            style: {
              display: 'inline-block',
              fontSize: '0.65em',
              fontWeight: 800,
              transform: 'translateY(-0.45em)',
              lineHeight: 1,
              letterSpacing: 0
            }
          },
          '*'
        )
      );
    }
  }

  return React.createElement('span', null, children);
}

const SAMPLES = [
  'ab',
  'a+b',
  'a*',
  'a(b+c)*',
  '(a+b)*c',
  '(a+ε)*b'
];

function buildOverlayNodes(text) {
  var parts = text.split('*');
  var nodes = [];

  for (var i = 0; i < parts.length; i++) {
    if (parts[i]) {
      nodes.push(
        React.createElement(
          'span',
          {
            key: 'p' + i,
            className: "rxi-visible"
          },
          parts[i]
        )
      );
    }

    if (i < parts.length - 1) {
      nodes.push(
        React.createElement(
          'span',
          {
            key: 's' + i,
            'data-star': '1'
          },
          '*'
        )
      );
    }
  }

  return React.createElement('span', null, nodes);
}

function insertAtCursor(ref, char, setter) {
  var el = ref.current;

  if (!el) return;

  var start = el.selectionStart;
  var end = el.selectionEnd;
  var val = el.value;

  setter(
    val.slice(0, start) +
    char +
    val.slice(end)
  );

  setTimeout(function () {
    el.focus();
    el.setSelectionRange(
      start + char.length,
      start + char.length
    );
  }, 0);
}

window.starify = starify;
window.SAMPLES = SAMPLES;
window.buildOverlayNodes = buildOverlayNodes;
window.insertAtCursor = insertAtCursor;