function DFAStepList(props) {

    const {
        dfaData,
        dfaIdx,
        setDfaIdx,
        setIsPlaying,
        activeCardRef,
        DFATable
    } = props;

    return React.createElement(

        'div',

        !dfaData &&
        React.createElement(
            'div',
            { className: "ehint" },
            "Build the NFA first, then press",
            React.createElement('br'),
            React.createElement(
                'strong',
                { style: { color: "var(--a5)" } },
                "⬡ → DFA"
            ),
            React.createElement('br'),
            "to run Subset Construction step-by-step."
        ),

        dfaData &&
        dfaData.steps.map((step, index) => {

            const isActive = dfaIdx === index;
            const isFinal = step.type === "final";

            return React.createElement(

                'div',

                {
                    key: index,
                    ref: isActive ? activeCardRef : null,

                    className:
                        "scard dfa-act" +
                        (isActive ? " act" : "") +
                        (isFinal ? " dfa-fin" : ""),

                    style: {
                        opacity: isActive ? 1 : 0.48
                    },

                    onClick: () => {
                        setIsPlaying(false);
                        setDfaIdx(index);
                    }
                },

                React.createElement(

                    'div',

                    { className: "shd" },

                    React.createElement(
                        'div',
                        { className: "sn" },
                        isFinal ? "✓" : index + 1
                    ),

                    React.createElement(
                        'div',
                        { className: "srl" },

                        step.type === "start" &&
                        ("Start State: DFA " + step.dfaLabel),

                        step.type === "transition" &&
                        ('δ(' + step.dfaLabel + ', "' + step.symbol + '") = ' + step.targetLabel),

                        step.type === "final" &&
                        "DFA Complete"
                    )

                ),

                isActive &&
                React.createElement(

                    'div',

                    null,

                    React.createElement(
                        'div',
                        {
                            className: "swy",
                            style: {
                                whiteSpace: "pre-line"
                            }
                        },
                        step.why
                    ),

                    step.isNew &&
                    step.type === "transition" &&
                    React.createElement(

                        'div',

                        { className: "srs" },

                        React.createElement(
                            'span',
                            { className: "bd bp2" },
                            "NEW"
                        ),

                        " DFA state ",
                        step.targetLabel,
                        " = NFA {q",
                        (step.targetNfaIds || []).join(",q"),
                        "}",

                        step.isAccept &&
                        React.createElement(
                            'span',
                            {
                                className: "bd bg",
                                style: {
                                    marginLeft: ".3rem"
                                }
                            },
                            "ACCEPT"
                        )

                    ),

                    React.createElement(
                        DFATable,
                        {
                            rows: step.tableRows,
                            alpha: dfaData.alphabet,
                            hiLabel: step.dfaLabel
                        }
                    )

                )

            );

        })

    );

}

window.DFAStepList = DFAStepList;