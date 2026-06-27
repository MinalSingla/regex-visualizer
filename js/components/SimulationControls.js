function SimulationControls(props) {

    const {
        simTrace,
        simStep,
        setSimStep,
        setSimPlaying,

        simRes,
        isLastSimStep,
        isNfaTab
    } = props;

    const currentStep = simTrace.steps[simStep];

    return React.createElement(

        'div',

        { className: "simstep" },

        React.createElement(
            'span',
            { className: "simstep-label" },
            "Step"
        ),

        React.createElement(
            'button',
            {
                className: "simnb",
                disabled: simStep <= 0,
                onClick: () => {
                    setSimPlaying(false);
                    setSimStep(s => s - 1);
                }
            },
            "← Prev"
        ),

        React.createElement(

            'span',

            { className: "simstep-counter" },

            React.createElement(
                'em',
                null,
                simStep + 1
            ),

            " / ",
            simTrace.steps.length,

            currentStep &&
            currentStep.input !== null &&
            React.createElement(
                'span',
                null,
                " — reading ",
                React.createElement(
                    'span',
                    { className: "simstep-char" },
                    '"',
                    currentStep.input,
                    '"'
                )
            ),

            currentStep &&
            currentStep.input === null &&
            React.createElement(
                'span',
                {
                    className: "simstep-char",
                    style: {
                        marginLeft: ".4rem",
                        background: "rgba(91,140,255,.1)",
                        color: "var(--muted)"
                    }
                },
                "init"
            )

        ),

        React.createElement(
            'button',
            {
                className: "simnb",
                disabled: simStep >= simTrace.steps.length - 1,
                onClick: () => {
                    setSimPlaying(false);
                    setSimStep(s => s + 1);
                }
            },
            "Next →"
        ),

        isLastSimStep &&
        React.createElement(
            'span',
            {
                className: "sr",
                style: {
                    background: simRes
                        ? "rgba(67,233,123,.15)"
                        : "rgba(255,107,107,.15)",

                    color: simRes
                        ? "#43e97b"
                        : "#ff6b6b",

                    border:
                        "1px solid " +
                        (simRes ? "#43e97b" : "#ff6b6b"),

                    fontWeight: 800,

                    animation:
                        simRes
                            ? "pulseAccept .9s ease-in-out infinite"
                            : "pulseReject .7s ease-in-out infinite"
                }
            },

            simRes
                ? "● ACCEPT"
                : "● REJECT"

        ),

        React.createElement(

            'div',

            { className: "simstep-desc" },

            currentStep &&
            currentStep.desc,

            isNfaTab &&
            currentStep &&
            currentStep.stateIds &&
            currentStep.stateIds.length > 0 &&
            React.createElement(
                'span',
                { className: "simstep-states" },
                " → active: {q",
                currentStep.stateIds.join(",q"),
                "}"
            ),

            !isNfaTab &&
            currentStep &&
            currentStep.state &&
            React.createElement(
                'span',
                { className: "simstep-states" },
                " → in state: ",
                currentStep.state
            )

        )

    );

}

window.SimulationControls = SimulationControls;