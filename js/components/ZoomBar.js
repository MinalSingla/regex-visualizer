// Shared Zoom Control Bar

function ZoomBar(props) {

    var zoom = props.zoom;
    var zoomIn = props.zoomIn;
    var zoomOut = props.zoomOut;
    var fit = props.fit;

    var btnStyle = {
        background: 'var(--hl)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        borderRadius: 5,
        cursor: 'pointer',
        fontFamily: 'Syne,sans-serif',
        fontWeight: 700,
        fontSize: '.75rem',
        padding: '.2rem .5rem',
        lineHeight: 1,
        transition: 'all .13s'
    };

    return React.createElement(
        'div',
        {
            style: {
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(10,12,16,.88)',
                border: '1px solid var(--border)',
                borderRadius: 7,
                padding: '4px 7px',
                backdropFilter: 'blur(6px)',
                userSelect: 'none'
            }
        },

        React.createElement(
            'button',
            {
                style: btnStyle,
                onClick: zoomOut
            },
            '−'
        ),

        React.createElement(
            'span',
            {
                style: {
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '.62rem',
                    color: 'var(--muted)',
                    minWidth: 34,
                    textAlign: 'center'
                }
            },
            Math.round(zoom * 100) + '%'
        ),

        React.createElement(
            'button',
            {
                style: btnStyle,
                onClick: zoomIn
            },
            '+'
        ),

        React.createElement(
            'button',
            {
                style: Object.assign({}, btnStyle, {
                    fontSize: '.58rem',
                    color: 'var(--muted)',
                    marginLeft: 2
                }),
                onClick: fit
            },
            'Fit'
        )
    );
}

window.ZoomBar = ZoomBar;