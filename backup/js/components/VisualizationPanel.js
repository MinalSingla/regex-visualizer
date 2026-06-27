function VisualizationPanel(props) {

    const {
        isNfaTab,
        isDfaTab,
        isMinTab,

        nfaDisplay,
        dfaDisplay,
        minDisplay,

        simActiveNfaIds,
        simActiveDfaLabel,
        simActiveMinLabel,

        simFinalResult
    } = props;

    return React.createElement(

        'div',

        { className: "viz" },

        // ==========================
        // NFA Visualization
        // ==========================

        isNfaTab &&
        React.createElement(
            NFAViz,
            {
                snap: nfaDisplay,
                activeIds: simActiveNfaIds,
                simResult: simFinalResult
            }
        ),

        // ==========================
        // DFA Visualization
        // ==========================

        isDfaTab &&
        React.createElement(
            DFAViz,
            {
                dfaSnap: dfaDisplay,
                activeLabel: simActiveDfaLabel,
                simResult: simFinalResult
            }
        ),

        // ==========================
        // Min DFA Visualization
        // ==========================

        isMinTab &&
        React.createElement(
            MinDFAViz,
            {
                dfaSnap: minDisplay,
                activeLabel: simActiveMinLabel,
                simResult: simFinalResult
            }
        ),

        // ==========================
        // NFA Legend
        // ==========================

        isNfaTab &&
        nfaDisplay &&
        React.createElement(

            'div',

            { className: "leg" },

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#9b59b6",
                            background: "#1a1030"
                        }
                    }
                ),
                " Start"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#43e97b",
                            background: "#0d2318"
                        }
                    }
                ),
                " Accept"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#5b8cff",
                            background: "#1e2740"
                        }
                    }
                ),
                " State"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'span',
                    {
                        style: {
                            color: "#f7971e",
                            fontSize: ".82rem"
                        }
                    },
                    "ε"
                ),
                " epsilon"
            ),

            React.createElement(
                'div',
                {
                    className: "li",
                    style: {
                        fontSize: ".6rem",
                        color: "var(--muted)"
                    }
                },
                "Dimmed = prior steps"
            )

        ),

        // ==========================
        // DFA Legend
        // ==========================

        isDfaTab &&
        dfaDisplay &&
        dfaDisplay.states &&
        dfaDisplay.states.length > 0 &&
        React.createElement(

            'div',

            { className: "leg" },

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#c77dff",
                            background: "#1c1535"
                        }
                    }
                ),
                " Start"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#43e97b",
                            background: "#0d2318"
                        }
                    }
                ),
                " Accept"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#c77dff",
                            background: "#1c1535"
                        }
                    }
                ),
                " DFA state"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#ff6b6b",
                            background: "#1a0808",
                            borderStyle: "dashed"
                        }
                    }
                ),
                " Dead (∅)"
            ),

            React.createElement(
                'div',
                {
                    className: "li",
                    style: {
                        fontSize: ".6rem",
                        color: "var(--muted)"
                    }
                },
                "Labels show NFA set"
            )

        ),

        // ==========================
        // Min DFA Legend
        // ==========================

        isMinTab &&
        minDisplay &&
        minDisplay.states &&
        minDisplay.states.length > 0 &&
        React.createElement(

            'div',

            { className: "leg" },

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#f7971e",
                            background: "#1c1a10"
                        }
                    }
                ),
                " Start"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#43e97b",
                            background: "#0d2318"
                        }
                    }
                ),
                " Accept"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#f7971e",
                            background: "#1c1a10"
                        }
                    }
                ),
                " Min state"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#ff6b6b",
                            background: "#1a0808",
                            borderStyle: "dashed"
                        }
                    }
                ),
                " Dead (∅)"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#ff6b6b",
                            background: "#2a0a0a"
                        }
                    }
                ),
                " Reject (sim)"
            ),

            React.createElement(
                'div',
                { className: "li" },
                React.createElement(
                    'div',
                    {
                        className: "ld",
                        style: {
                            borderColor: "#43e97b",
                            background: "#0a2218"
                        }
                    }
                ),
                " Accept (sim)"
            )

        )

    );

}

window.VisualizationPanel = VisualizationPanel;