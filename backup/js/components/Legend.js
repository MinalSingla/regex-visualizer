function Legend(props) {

    const {
        isNfaTab,
        isDfaTab,
        isMinTab,
        nfaDisplay,
        dfaDisplay,
        minDisplay
    } = props;

    if (isNfaTab && nfaDisplay) {
        return React.createElement(
            'div',
            { className: "leg" },

            // Start
            // Accept
            // State
            // ε transition
            // Dimmed
        );
    }

    if (isDfaTab && dfaDisplay && dfaDisplay.states.length > 0) {
        return React.createElement(
            'div',
            { className: "leg" },

            // Start
            // Accept
            // DFA state
            // Dead state
            // Labels show NFA set
        );
    }

    if (isMinTab && minDisplay && minDisplay.states.length > 0) {
        return React.createElement(
            'div',
            { className: "leg" },

            // Start
            // Accept
            // Min state
            // Dead state
            // Reject
            // Accept
        );
    }

    return null;
}

window.Legend = Legend;