function RegexPanel(props) {

    const {
        regex,
        setRegex,
        rxiRef,
        err,

        handleBuild,
        handleDFA,
        handleMinimize,
        handleClear,

        finalNfa,
        dfaData,

        buildOverlayNodes,
        insertAtCursor,

        SAMPLES,
        starify
    } = props;

    const PLACEHOLDER = "e.g. a(b|c)*  — use \\* for literal *";

    return React.createElement(
        'div',
        { className: "tbar" },

        React.createElement(
            'div',
            { className: "slbl" },
            "Regular Expression"
        ),

        React.createElement(
            'div',
            { className: "rxi-wrap" },

            React.createElement(
                'div',
                {
                    className: "rxi-overlay",
                    'aria-hidden': "true"
                },

                regex.length === 0
                    ? React.createElement(
                        'span',
                        { className: "rxi-placeholder" },
                        PLACEHOLDER
                    )
                    : buildOverlayNodes(regex)
            ),

            React.createElement(
                'input',
                {
                    className: "rxi",
                    value: regex,
                    ref: rxiRef,
                    onChange: (e) => setRegex(e.target.value),
                    onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                            handleBuild();
                        }
                    },
                    placeholder: PLACEHOLDER,
                    spellCheck: false
                }
            )
        ),

        React.createElement(
            'div',
            { className: "rxi-foot" },

            React.createElement(
                'button',
                {
                    className: "eps-btn",
                    title: "Insert epsilon (ε)",
                    onClick: () => insertAtCursor(rxiRef, 'ε', setRegex)
                },
                "ε"
            ),

            React.createElement(
                'span',
                { className: "eps-hint" },
                "Click or press Alt+E to insert ε"
            )
        ),

        err &&
            React.createElement(
                'div',
                { className: "emsg" },
                err
            ),

        React.createElement(
            'div',
            { className: "brow" },

            React.createElement(
                'button',
                {
                    className: "btn bp",
                    onClick: handleBuild
                },
                "⚡ Build NFA"
            ),

            React.createElement(
                'button',
                {
                    className: "btn bdfa",
                    onClick: handleDFA,
                    disabled: !finalNfa,
                    style: {
                        opacity: finalNfa ? 1 : 0.5
                    }
                },
                "⬡ → DFA"
            ),

            React.createElement(
                'button',
                {
                    className: "btn",
                    onClick: handleMinimize,
                    disabled: !dfaData,
                    style: {
                        background: "var(--a4)",
                        color: "#fff",
                        opacity: dfaData ? 1 : 0.5,
                        flex: 1
                    }
                },
                "◈ Min"
            ),

            React.createElement(
                'button',
                {
                    className: "btn bs",
                    onClick: handleClear,
                    style: {
                        flex: "0 0 auto",
                        padding: ".48rem .55rem"
                    }
                },
                "✕"
            )
        ),

        React.createElement(
            'div',
            {
                style: {
                    marginTop: ".55rem"
                }
            },

            React.createElement(
                'div',
                { className: "slbl" },
                "Examples"
            ),

            React.createElement(
                'div',
                { className: "chips" },

                SAMPLES.map((sample) =>
                    React.createElement(
                        'button',
                        {
                            key: sample,
                            className: "chip",
                            onClick: () => setRegex(sample)
                        },
                        starify(sample)
                    )
                )
            )
        )
    );
}

window.RegexPanel = RegexPanel;