function TabBar(props) {
    return React.createElement(
        'div',
        { className: "tabbar" },

        React.createElement(
            'button',
            {
                className: 'tabbtn' + (props.isNfaTab ? ' on' : ''),
                onClick: function () {
                    props.setViewTab('nfa');
                    props.setSimTrace(null);
                    props.setSimStep(-1);
                    props.setSimRes(null);
                }
            },

            React.createElement('span', null, "◎"),
            " ε-NFA",

            props.nfaSteps.length > 0 &&
                React.createElement(
                    'span',
                    {
                        className: "bd bm",
                        style: { marginLeft: '.3rem' }
                    },
                    props.nfaSteps.length,
                    " steps"
                )
        ),

        React.createElement(
            'button',
            {
                className: 'tabbtn' + (props.isDfaTab ? ' dfa-on' : ''),
                onClick: function () {
                    props.setViewTab('dfa');
                    props.setSimTrace(null);
                    props.setSimStep(-1);
                    props.setSimRes(null);
                }
            },

            React.createElement('span', null, "⬡"),
            " DFA",

            props.dfaData &&
                React.createElement(
                    'span',
                    {
                        className: "bd bp2",
                        style: { marginLeft: '.3rem' }
                    },
                    props.dfaData.dfaSnap.states.length,
                    " states"
                )
        ),

        React.createElement(
            'button',
            {
                className: 'tabbtn' + (props.isMinTab ? ' min-on' : ''),
                onClick: function () {
                    props.setViewTab('min');
                    props.setSimTrace(null);
                    props.setSimStep(-1);
                    props.setSimRes(null);
                }
            },

            React.createElement('span', null, "◈"),
            " Min-DFA",

            props.minDfaData &&
                React.createElement(
                    'span',
                    {
                        className: "bd be",
                        style: { marginLeft: '.3rem' }
                    },
                    props.minDfaData.minCount,
                    " states"
                )
        )
    );
}

window.TabBar = TabBar;