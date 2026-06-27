// parser.js

// Operator precedence
const PRECEDENCE = {
    '|': 1,
    '.': 2,
    '*': 3,
    '+': 3,
    '?': 3
};

// Convert binary '+' into '|' while keeping unary '+' (Kleene plus)
function normalizeUnion(re) {
    var out = '';

    for (var i = 0; i < re.length; i++) {
        var c = re[i];

        if (c === '\\') {
            out += c + (re[i + 1] || '');
            i++;
        }
        else if (c === '+') {
            var nx = re[i + 1];

            var isKleene =
                !nx ||
                nx === ')' ||
                nx === '*' ||
                nx === '+' ||
                nx === '?' ||
                nx === '|';

            out += isKleene ? '+' : '|';
        }
        else {
            out += c;
        }
    }

    return out;
}

// Insert explicit concatenation operators
function insertConcat(re) {
    var out = '';
    var i = 0;

    while (i < re.length) {
        var c = re[i];

        if (c === '\\') {
            var pair = c + (re[i + 1] || '');

            out += pair;
            i += 2;

            var nx = re[i];

            if (
                nx &&
                nx !== '|' &&
                nx !== ')' &&
                nx !== '*' &&
                nx !== '+' &&
                nx !== '?'
            ) {
                out += '.';
            }
        }
        else {

            out += c;
            i++;

            var nx = re[i];

            if (!nx) continue;

            var leftOk =
                c !== '|' &&
                c !== '(';

            var rightOk =
                nx !== '|' &&
                nx !== ')' &&
                nx !== '*' &&
                nx !== '+' &&
                nx !== '?';

            if (leftOk && rightOk) {
                out += '.';
            }
        }
    }

    return out;
}

// Convert infix regex into postfix notation
function toPostfix(re) {

    var out = [];
    var ops = [];

    for (var i = 0; i < re.length; i++) {

        var ch = re[i];

        if (ch === '\\') {

            out.push(re[i + 1] || '\\');
            i++;

        }
        else if (ch === '(') {

            ops.push(ch);

        }
        else if (ch === ')') {

            while (
                ops.length &&
                ops[ops.length - 1] !== '('
            ) {
                out.push(ops.pop());
            }

            if (!ops.length) {
                throw new Error('Mismatched )');
            }

            ops.pop();

        }
        else if (PRECEDENCE[ch] !== undefined) {

            var unary =
                ch === '*' ||
                ch === '+' ||
                ch === '?';

            while (
                ops.length &&
                PRECEDENCE[ops[ops.length - 1]] !== undefined &&
                (
                    PRECEDENCE[ops[ops.length - 1]] > PRECEDENCE[ch] ||
                    (
                        PRECEDENCE[ops[ops.length - 1]] === PRECEDENCE[ch] &&
                        !unary
                    )
                )
            ) {
                out.push(ops.pop());
            }

            ops.push(ch);

        }
        else {

            out.push(ch);

        }
    }

    while (ops.length) {

        var op = ops.pop();

        if (op === '(') {
            throw new Error('Mismatched (');
        }

        out.push(op);
    }

    return out;
}

// Export to global scope
window.normalizeUnion = normalizeUnion;
window.insertConcat = insertConcat;
window.toPostfix = toPostfix;