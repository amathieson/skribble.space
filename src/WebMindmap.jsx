import React, { useEffect, useRef, useState } from 'react';
import '@scss/_style.scss';

const WebMindMap = ({ penColor }) => {
    const canvasRef = useRef(null);
    const svgRef = useRef(null);
    const [debug, setDebug] = useState({
        penSupport: false,
        penDown: false,
        pressure: 0,
        coordinates: [0, 0],
        tool: 'PEN',
        pointerType: 'mouse',
        isPrimary: true,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const svg = svgRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas and SVG dimensions
        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width * 2;
        canvas.height = height * 2;
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', width * 5);
        svg.setAttribute('height', height * 5);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set strokeStyle to penColor whenever it changes
        ctx.strokeStyle = penColor;

        // Drawing State
        let penDown = false;
        let size = 10;
        let points = [];
        let penID = '';
        let penSupported = false;
        let tool = "PEN";

        // Helper for path conversion
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

        const updateDebug = (e) => {
            setDebug({
                penSupport: penSupported,
                penDown,
                pressure: e.pressure,
                coordinates: [e.offsetX, e.offsetY],
                tool,
                pointerType: e.pointerType,
                isPrimary: e.isPrimary,
            });
        };

        // Event handlers
        const handlePointerEnter = (e) => {
            penSupported ||= e.pointerType === 'pen';
        };

        const handlePointerDown = (e) => {
            penSupported ||= e.pointerType === 'pen';

            if (penID !== e.pointerId && penID !== '') return;
            if (e.pointerType === 'pen') tool = 'PEN';
            if (e.pointerType === 'touch' && penSupported) {
                tool = 'ERASE';
                penID = e.pointerId;
                return;
            }

            penDown = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX * 2, e.offsetY * 2);
            ctx.lineWidth = size;

            penID = e.pointerId;
            size = 5 * 2 ** (3 * e.pressure);
            points = [{
                x: e.offsetX,
                y: e.offsetY,
                w: size / 2,
            }];
        };

        const handlePointerMove = (e) => {
            if (penID !== e.pointerId) return;

            if (penDown && e.isPrimary && tool === 'PEN') {
                size = 5 * 2 ** (3 * e.pressure);
                ctx.lineWidth = size;
                ctx.lineTo(e.offsetX * 2, e.offsetY * 2);
                ctx.stroke();

                points.push({
                    x: e.offsetX,
                    y: e.offsetY,
                    w: size / 2,
                });
            }

            if (tool === 'ERASE' && e.isPrimary) {
                canvas.style.pointerEvents = 'none';
                const el = document.elementFromPoint(e.clientX, e.clientY);
                if (el?.tagName?.toUpperCase() === 'PATH') {
                    el.parentElement.remove();
                }
                canvas.style.pointerEvents = 'auto';
            }

            updateDebug(e);
        };

        const handlePointerUp = (e) => {
            if (penID !== e.pointerId) return;

            penID = '';
            penDown = false;

            if (tool === 'PEN') {
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

            updateDebug(e);
        };

        // Attach event listeners
        canvas.addEventListener('pointerenter', handlePointerEnter);
        canvas.addEventListener('pointerdown', handlePointerDown);
        canvas.addEventListener('pointermove', handlePointerMove);
        canvas.addEventListener('pointerup', handlePointerUp);

        // Cleanup
        return () => {
            canvas.removeEventListener('pointerenter', handlePointerEnter);
            canvas.removeEventListener('pointerdown', handlePointerDown);
            canvas.removeEventListener('pointermove', handlePointerMove);
            canvas.removeEventListener('pointerup', handlePointerUp);
        };
    }, [penColor]); // Re-run the effect whenever `penColor` changes

    return (
        <div>
            <div id="debug">
                <label>Pen Support: <code>{String(debug.penSupport)}</code></label>
                <label>Pen Down: <code>{String(debug.penDown)}</code></label>
                <label>Pressure: <code>{debug.pressure}</code></label>
                <label>Coordinates: <code>{debug.coordinates.join(',')}</code></label>
                <label>Tool: <code>{debug.tool}</code></label>
                <label>Viewport: <code>0,0,1920,1080</code></label>
                <label>Viewport Rotation: <code>0&deg;</code></label>
                <label>Pointer Type: <code>{debug.pointerType}</code></label>
                <label>Primary Pointer: <code>{String(debug.isPrimary)}</code></label>
            </div>
            <canvas id="canvas" ref={canvasRef}></canvas>
            <svg id="vector" ref={svgRef}></svg>
        </div>
    );
};

export default WebMindMap;
