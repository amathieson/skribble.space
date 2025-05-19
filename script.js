const canvas = document.querySelector('#canvas');
const svg = document.querySelector('#vector');
const press = document.querySelector('#debug');

svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`);
svg.setAttribute('width', window.innerWidth * 5);
svg.setAttribute('height', window.innerHeight * 5);

canvas.width = window.innerWidth * 2;
canvas.height = window.innerHeight * 2;

const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = 'white';

let penDown = false;
let size = 10;
let points = [];
let penID = '';
let penSupported = false;
let fingers = [];
let tool = "PEN";

// Event: Check if pen is supported
canvas.addEventListener('pointerenter', (e) => {
    penSupported ||= e.pointerType === 'pen';
});

// Event: Start drawing
canvas.addEventListener('pointerdown', (e) => {
    penSupported ||= e.pointerType === 'pen';

    if (penID !== e.pointerId && penID !== '') return false;
    if (e.pointerType === 'pen')
        tool = "PEN"
    if (e.pointerType === 'touch' && penSupported) {
        tool = "ERASE"

        penID = e.pointerId;
        return;
    }

    penDown = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX * 2, e.offsetY * 2);
    ctx.lineWidth = size;

    penID = e.pointerId;

    size = 5 * (2 ** (3 * e.pressure));
    points = [{
        x: e.offsetX,
        y: e.offsetY,
        w: size / 2
    }];
});

// Event: Drawing in progress
canvas.addEventListener('pointermove', (e) => {
    if (penID !== e.pointerId) return false;

    if (penDown && e.isPrimary && tool === "PEN") {
        size = 5 * (2 ** (3 * e.pressure));
        ctx.lineWidth = size;
        ctx.lineTo(e.offsetX * 2, e.offsetY * 2);
        ctx.stroke();

        points.push({
            x: e.offsetX,
            y: e.offsetY,
            w: size / 2
        });
    }
    if (tool === "ERASE" && e.isPrimary) {
        canvas.style.pointerEvents = 'none';

        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (el.tagName.toUpperCase() === 'PATH') {
            el.parentElement.remove();
        }
        canvas.style.pointerEvents = 'auto';
    }

    press.innerHTML = `
        <label>Pen Support: <code>${penSupported}</code></label>
        <label>Pen Down: <code>${penDown}</code></label>
        <label>Pressure: <code>${e.pressure}</code></label>
        <label>Coordinates: <code>${e.offsetX}, ${e.offsetY}</code></label>
        <label>Tool: <code>${tool}</code></label>
        <label>Viewport: <code>0,0,1920,1080</code></label>
        <label>Viewport Rotation: <code>0&deg;</code></label>
        <label>Pointer Type: <code>${e.pointerType}</code></label>
        <label>Primary Pointer: <code>${e.isPrimary}</code></label>
    `;
});

// Event: Finish drawing
canvas.addEventListener('pointerup', (e) => {
    if (penID !== e.pointerId) return false;

    penID = '';
    penDown = false;
    if (tool === "PEN") {
        ctx.stroke();

        let segments = '';
        let cur_segment = [];
        let lastW = Number.NaN;

        for (let i = 0; i < points.length; i++) {
            if (points[i].w !== lastW) {
                if (cur_segment.length > 0) {
                    segments += catmullRomToBezier(cur_segment) + '"/>';
                }
                segments += `<path fill="none" stroke-linecap="round" stroke="${ctx.strokeStyle}" stroke-width="${points[i].w}" d="`;
                lastW = points[i].w;
                cur_segment = [points[i - 1] ?? null, points[i]];
            } else {
                cur_segment.push(points[i]);
            }
        }

        if (cur_segment.length > 0) {
            segments += catmullRomToBezier(cur_segment) + '"/>';
        }

        svg.innerHTML += `<g>${segments}</g>`;

        points = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    press.innerHTML = `
        <label>Pen Support: <code>${penSupported}</code></label>
        <label>Pen Down: <code>${penDown}</code></label>
        <label>Pressure: <code>${e.pressure}</code></label>
        <label>Coordinates: <code>${e.offsetX}, ${e.offsetY}</code></label>
        <label>Tool: <code>${tool}</code></label>
        <label>Viewport: <code>0,0,1920,1080</code></label>
        <label>Viewport Rotation: <code>0&deg;</code></label>
        <label>Pointer Type: <code>${e.pointerType}</code></label>
    `;
});

// Convert points to SVG path using Catmull-Rom splines
function catmullRomToBezier(points) {
    if (points.length < 2) return '';
    if (points[0] == null) points = points.slice(1);

    const padded = [points[0], ...points, points[points.length - 1]];
    let d = `M${padded[1].x} ${padded[1].y}`;

    for (let i = 1; i < padded.length - 2; i++) {
        const p0 = padded[i - 1];
        const p1 = padded[i];
        const p2 = padded[i + 1];
        const p3 = padded[i + 2];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += ` C${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
}
