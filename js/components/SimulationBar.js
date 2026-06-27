function SimulationBar(props) {

    const {
        isNfaTab,
        isMinTab,

        finalNfa,
        dfaData,
        minDfaData,

        simIn,
        setSimIn,

        simRes,
        setSimRes,

        simTrace,
        setSimTrace,

        setSimStep,
        setSimPlaying,

        handleSim
    } = props;

    const disabled =
        isNfaTab
            ? !finalNfa
            : isMinTab
            ? !minDfaData
            : !dfaData;

    return React.createElement(

        'div',

        { className: "simbar" },

        React.createElement(
            'span',
            { className: "simlbl" },
            isNfaTab
                ? "NFA"
                : isMinTab
                ? "Min-DFA"
                : "DFA",
            " Test"
        ),

        React.createElement(
            'input',
            {
                className: "siminp",

                placeholder: "Type a string to test...",

                value: simIn,

                onChange: (e) => {
                    setSimIn(e.target.value);
                    setSimRes(null);
                    setSimTrace(null);
                    setSimStep(-1);
                    setSimPlaying(false);
                },

                onKeyDown: (e) => {
                    if (e.key === "Enter") {
                        handleSim();
                    }
                },

                disabled
            }
        ),

        React.createElement(
            'button',
            {
                className: "simbtn",
                onClick: handleSim,
                disabled
            },
            "Simulate ▶"
        ),

        simRes === null &&
        !simTrace &&
        React.createElement(
            'span',
            { className: "sr si" },
            "—"
        ),

        simRes === true &&
        React.createElement(
            'span',
            { className: "sr so" },
            "✓ ACCEPT"
        ),

        simRes === false &&
        React.createElement(
            'span',
            { className: "sr sx" },
            "✗ REJECT"
        )

    );

}

window.SimulationBar = SimulationBar;