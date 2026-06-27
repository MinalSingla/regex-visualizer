var useState = React.useState;
var useEffect = React.useEffect;
var useRef = React.useRef;

// Shared zoom & pan hook
function useViewZoom(dep) {

    var vbs = useState(null);
    var vb = vbs[0];
    var setVb = vbs[1];

    var dragging = useRef(null);
    var cref = useRef(null);

    var ds = useState({
        w: 700,
        h: 380
    });

    var dims = ds[0];
    var setDims = ds[1];

    useEffect(function () {

        function resize() {

            if (!cref.current) return;

            var rect = cref.current.getBoundingClientRect();

            if (rect.width > 20 && rect.height > 20) {
                setDims({
                    w: rect.width,
                    h: rect.height
                });
            }
        }

        resize();

        window.addEventListener('resize', resize);

        var timer = setTimeout(resize, 120);

        return function () {
            window.removeEventListener('resize', resize);
            clearTimeout(timer);
        };

    }, [dep]);

    useEffect(function () {
        setVb(null);
    }, [dep]);

    return {
        cref: cref,
        dims: dims,
        vb: vb,
        setVb: setVb,
        dragging: dragging
    };
}

window.useViewZoom = useViewZoom;