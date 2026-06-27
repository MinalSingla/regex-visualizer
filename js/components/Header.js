function Header(props) {
    return React.createElement(
        'header',
        { className: "hdr" },

        React.createElement(
            'div',
            { className: "logo" },

            React.createElement(
                'div',
                { className: "lico" },
                "λ"
            ),

            React.createElement(
                'div',
                null,

                React.createElement(
                    'div',
                    { className: "ltxt" },
                    "RegexAuto"
                ),

                React.createElement(
                    'div',
                    { className: "lsub" },
                    "Thompson ε-NFA + Subset DFA + Minimization"
                )
            )
        ),

        React.createElement(
            'div',
            { className: "hbtns" },

            React.createElement(
                'button',
                {
                    className: "thmbtn",
                    onClick: function () {
                        props.setDarkMode(function (d) {
                            return !d;
                        });
                    }
                },
                props.darkMode ? "☀" : "🌙"
            ),

            React.createElement(
                'button',
                {
                    className: "hbtn on"
                },
                "Builder"
            ),

            React.createElement(
                'button',
                {
                    className: "hbtn",
                    onClick: function () {
                        props.setShowTh(true);
                    }
                },
                "Theory"
            )
        )
    );
}