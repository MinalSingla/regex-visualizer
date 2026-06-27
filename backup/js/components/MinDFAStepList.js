function MinDFAStepList(props) {

    const {
        minDfaData,
        minDfaIdx,
        setMinDfaIdx,
        setIsPlaying,
        activeCardRef,
        dfaData,
        MinDFATable
    } = props;

    return React.createElement(

        'div',

        !minDfaData &&
        React.createElement(
            'div',
            { className: "ehint" },

            "Build the DFA first, then press",

            React.createElement('br'),

            React.createElement(
                'strong',
                { style: { color: "var(--a4)" } },
                "◈ Min"
            ),

            React.createElement('br'),

            "to run Hopcroft's minimization step-by-step."
        ),

        minDfaData &&
        React.createElement(

            'div',

            React.createElement(

                'div',

                {
                    className: "scard act",
                    style: {
                        opacity: 1,
                        borderColor: "var(--a4)",
                        marginBottom: ".5rem"
                    }
                },

                React.createElement(

                    'div',

                    { className: "shd" },

                    React.createElement(
                        'div',
                        {
                            className: "sn",
                            style: {
                                background: "var(--a4)"
                            }
                        },
                        "★"
                    ),

                    React.createElement(
                        'div',
                        {
                            className: "srl",
                            style: {
                                color: "var(--a4)"
                            }
                        },
                        "Hopcroft Minimization Result"
                    )

                ),

                React.createElement(

                    'div',

                    { className: "swy" },

                    "DFA: ",

                    React.createElement(
                        'span',
                        { className: "bd be" },
                        minDfaData.origCount,
                        " states"
                    ),

                    " → Min-DFA: ",

                    React.createElement(
                        'span',
                        { className: "bd bg" },
                        minDfaData.minCount,
                        " states"
                    ),

                    minDfaData.origCount === minDfaData.minCount &&
                    React.createElement(
                        'span',
                        {
                            className: "bd be",
                            style: { marginLeft: ".4rem" }
                        },
                        "already minimal"
                    ),

                    minDfaData.origCount > minDfaData.minCount &&
                    React.createElement(
                        'span',
                        {
                            className: "bd bg",
                            style: { marginLeft: ".4rem" }
                        },
                        "reduced by ",
                        minDfaData.origCount - minDfaData.minCount
                    )

                ),

                React.createElement(
                    MinDFATable,
                    {
                        minSnap: minDfaData.minSnap,
                        alpha: dfaData.alphabet
                    }
                )

            ),

            minDfaData.steps.map((step, index) => {

                const isActive = minDfaIdx === index;
                const isFinal = index === minDfaData.steps.length - 1;

                return React.createElement(

                    'div',

                    {
                        key: index,
                        ref: isActive ? activeCardRef : null,

                        className:
                            "scard" +
                            (isActive ? " act" : ""),

                        style: {
                            opacity: isActive ? 1 : 0.48,
                            borderColor: isActive
                                ? (isFinal ? "var(--a3)" : "var(--a4)")
                                : "var(--border)"
                        },

                        onClick: () => {
                            setIsPlaying(false);
                            setMinDfaIdx(index);
                        }
                    },

                    React.createElement(

                        'div',

                        { className: "shd" },

                        React.createElement(
                            'div',
                            {
                                className: "sn",
                                style: {
                                    background: isFinal
                                        ? "var(--a3)"
                                        : "var(--a4)"
                                }
                            },
                            isFinal ? "✓" : index + 1
                        ),

                        React.createElement(
                            'div',
                            {
                                className: "srl",
                                style: {
                                    color: isFinal
                                        ? "var(--a3)"
                                        : "var(--a4)"
                                }
                            },
                            isFinal
                                ? "Minimization Complete"
                                : "Partition step " + (index + 1)
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
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word"
                                }
                            },
                            step.desc
                        ),

                        step.partition &&
                        React.createElement(

                            'div',

                            {
                                style: {
                                    marginTop: ".4rem"
                                }
                            },

                            React.createElement(
                                'div',
                                {
                                    className: "slbl",
                                    style: {
                                        marginBottom: ".3rem"
                                    }
                                },
                                "Current partition:"
                            ),

                            React.createElement(
                                'div',
                                {
                                    style: {
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: ".28rem",
                                        marginBottom: ".4rem"
                                    }
                                },

                                step.partition.map((group, groupIndex) =>
                                    React.createElement(
                                        'span',
                                        {
                                            key: groupIndex,
                                            className: "bd be"
                                        },
                                        "{" + group.join(",") + "}"
                                    )
                                )

                            )

                        ),

                        isFinal &&
                        React.createElement(
                            MinDFATable,
                            {
                                minSnap: minDfaData.minSnap,
                                alpha: dfaData.alphabet
                            }
                        )

                    )

                );

            })

        )

    );

}

window.MinDFAStepList = MinDFAStepList;