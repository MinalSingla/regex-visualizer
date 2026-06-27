// Simulation Trace Component

function SimTrace(props) {

    var trace = props.trace;
    var isNfa = props.isNfa;

    if (!trace) return null;

    return React.createElement(
        'div',
        { className: "simtrace" },

        React.createElement(
            'div',
            { className: "simtrace-hd" },
            isNfa ? 'NFA' : 'DFA',
            ' Simulation Trace — "',
            props.input,
            '"'
        ),

        trace.steps.map(function (step, i) {

            return React.createElement(

                'div',
                {
                    key: i,
                    className: "simtrace-row"
                },

                React.createElement(
                    'span',
                    { className: "simtrace-idx" },
                    i === 0 ? '▶' : (i + '.')
                ),

                step.input !== null &&
                React.createElement(
                    'span',
                    { className: "simtrace-ch" },
                    '"',
                    step.input,
                    '"'
                ),

                step.input === null &&
                React.createElement(
                    'span',
                    {
                        className: "simtrace-ch",
                        style: {
                            background: 'rgba(91,140,255,.1)',
                            color: 'var(--muted)'
                        }
                    },
                    'init'
                ),

                React.createElement(
                    'span',
                    { className: "simtrace-desc" },

                    step.desc,

                    isNfa &&
                    step.stateIds &&
                    step.stateIds.length > 0 &&
                    React.createElement(
                        'span',
                        { className: "simtrace-states" },
                        ' → active: ',
                        '{q' + step.stateIds.join(',q') + '}'
                    )
                )
            );

        }),

        React.createElement(
            'div',
            { className: "simtrace-verdict" },

            trace.accepted ?

                React.createElement(
                    React.Fragment,
                    null,

                    React.createElement(
                        'span',
                        { style: { color: 'var(--a3)' } },
                        '✓'
                    ),

                    React.createElement(
                        'span',
                        { style: { color: 'var(--a3)' } },
                        'ACCEPTED — final state ',
                        isNfa
                            ? 'contains NFA accept state'
                            : 'is an accept state'
                    )
                )

                :

                React.createElement(
                    React.Fragment,
                    null,

                    React.createElement(
                        'span',
                        { style: { color: 'var(--a2)' } },
                        '✗'
                    ),

                    React.createElement(
                        'span',
                        { style: { color: 'var(--a2)' } },
                        'REJECTED — ',
                        isNfa
                            ? 'no accept state in active set'
                            : 'not in an accept state'
                    )
                )
        )
    );
}

window.SimTrace = SimTrace;