function NFAStepList(props) {

    const {
        nfaSteps,
        nfaIdx,
        setNfaIdx,
        setIsPlaying,
        activeCardRef,
        finalNfa,
        regex,
        starify
    } = props;

    return React.createElement(
        'div',

        nfaSteps.length === 0 &&
            React.createElement(
                'div',
                { className: "ehint" },
                "Enter a regex and press",
                React.createElement('br'),
                React.createElement(
                    'strong',
                    { style: { color: "var(--accent)" } },
                    "Build NFA"
                ),
                React.createElement('br'),
                "to see Thompson's Construction step-by-step."
            ),

        nfaSteps.map((step, index) => {

            const isActive = nfaIdx === index;

            return React.createElement(
                'div',
                {
                    key: index,
                    ref: isActive ? activeCardRef : null,
                    className: "scard" + (isActive ? " act" : ""),
                    onClick: () => {
                        setIsPlaying(false);
                        setNfaIdx(index);
                    }
                },

                React.createElement(
                    'div',
                    { className: "shd" },

                    React.createElement(
                        'div',
                        { className: "sn" },
                        index + 1
                    ),

                    React.createElement(
                        'div',
                        { className: "srl" },
                        starify(step.rule)
                    )
                ),

                isActive &&
                    React.createElement(
                        'div',
                        null,

                        React.createElement(
                            'div',
                            { className: "swy" },
                            starify(step.why)
                        ),

                        React.createElement(
                            'div',
                            { className: "srs" },

                            React.createElement(
                                'span',
                                { className: "bd bg" },
                                "→"
                            ),

                            " ",
                            starify(step.res)
                        )
                    )
            );

        }),

        nfaSteps.length > 0 &&
            React.createElement(
                'div',
                {
                    ref:
                        nfaIdx === nfaSteps.length
                            ? activeCardRef
                            : null,

                    className:
                        "scard fin" +
                        (nfaIdx === nfaSteps.length
                            ? " act"
                            : ""),

                    onClick: () => {
                        setIsPlaying(false);
                        setNfaIdx(nfaSteps.length);
                    }
                },

                React.createElement(
                    'div',
                    { className: "shd" },

                    React.createElement(
                        'div',
                        { className: "sn" },
                        "✓"
                    ),

                    React.createElement(
                        'div',
                        { className: "srl" },
                        "Final ε-NFA"
                    )
                ),

                nfaIdx === nfaSteps.length &&
                    finalNfa &&
                    React.createElement(
                        'div',
                        { className: "swy" },

                        "Complete ε-NFA for ",

                        React.createElement(
                            'strong',
                            {
                                style: {
                                    color: "var(--text)"
                                }
                            },
                            regex
                        ),

                        ". Start: ",

                        React.createElement(
                            'span',
                            { className: "bd bm" },
                            "q",
                            finalNfa.startId
                        ),

                        " Accept: ",

                        React.createElement(
                            'span',
                            { className: "bd bg" },
                            "q",
                            finalNfa.acceptId
                        ),

                        ".",

                        React.createElement('br'),

                        "Now press ",

                        React.createElement(
                            'strong',
                            {
                                style: {
                                    color: "var(--a5)"
                                }
                            },
                            "⬡ → DFA"
                        ),

                        " to convert."
                    )
            )
    );
}

window.NFAStepList = NFAStepList;