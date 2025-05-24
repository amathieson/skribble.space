import React, { useEffect, useRef, useState } from 'react';
import '@scss/_style.scss';

const WebMindMap = ({ penColor, backgroundColour = '#fff' }) => {
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
        touchPoints: 0,
        viewPort: "0 0 0 0",
        zoom: 100,
        actionButton: ""
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const svg = svgRef.current;
        const ctx = canvas.getContext('2d');
        const dpr    = window.devicePixelRatio || 1;
        
        const rect = canvas.getBoundingClientRect();

        canvas.width  = rect.width  * dpr;
        canvas.height = rect.height * dpr;

        canvas.style.width  = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);
        svg.setAttribute('width', rect.width * 5);
        svg.setAttribute('height', rect.height * 5);
       
        ctx.fillStyle = backgroundColour;
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
       
        // Set strokeStyle to penColor whenever it changes
        ctx.strokeStyle = penColor;

        // Drawing State
        let penDown = false;
        let size = 10;
        let points = [];
        let penID = '';
        let penSupported = false;
        let tool = "PEN";
        let touchPoints = [];
        let lastVector = null;
        let zoom = 1;
        let center = [rect.width / 2, rect.height / 2];
        let rotation = 0;
        let viewPort = [];

        // Helper for path conversion
        function catmullRomToBezier(points) {
            if (points.length < 2) return '';
            if (points.some(p => p == null || typeof p.x !== 'number' || typeof p.y !== 'number')) return '';

            let d = `M${points[0].x},${points[0].y}`;
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i - 1] || points[i];
                const p1 = points[i];
                const p2 = points[i + 1] || p1;
                const p3 = points[i + 2] || p2;

                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;

                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;

                d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
            }
            return d;
        }

        function coordinatesVector(point1, point2) {
            return {
                length: Math.sqrt((point1.offsetX - point2.offsetX)**2 + (point1.offsetY - point2.offsetY)**2),
                angle: Math.atan2(point2.offsetX - point1.offsetX, point2.offsetY - point1.offsetY) * 180 / Math.PI,
                center: [(point1.offsetX + point2.offsetX)/2, (point1.offsetY + point2.offsetY)/2],
            };
        }

        function computeViewport(c, z) {
            let vW = rect.width * 0.5 / z;
            let vH = rect.height * 0.5 / z;
            let vp = [c[0] - vW, c[1] - vH, vW * 2, vH * 2];
            viewPort = vp;
            svg.setAttribute('viewBox', vp.join(' '));
        }
        computeViewport(center, zoom);
        function projectViewPort(point) {
            return [
                point[0]/rect.width*viewPort[2] + (center[0]-viewPort[2]/2),
                point[1]/rect.height*viewPort[3] + (center[1]-viewPort[3]/2),
            ]
        }

        const updateDebug = (e) => {
            requestAnimationFrame(()=>{
                setDebug({
                    penSupport: penSupported,
                    penDown,
                    pressure: e.pressure,
                    coordinates: [e.offsetX, e.offsetY],
                    tool,
                    pointerType: e.pointerType,
                    isPrimary: e.isPrimary,
                    touchPoints: touchPoints.length,
                    viewPort: viewPort.join(' '),
                    zoom: zoom*100,
                    center: center,
                    rotation: rotation,
                    actionButton: lastButton
                });
            })
        };

        // Event handlers
        const handlePointerEnter = (e) => {
            penSupported ||= e.pointerType === 'pen';
        };
        let lastButton = "";
        const handlePointerDown = (e) => {
            penSupported ||= e.pointerType === 'pen';
            lastButton = (e.button);
            if (e.pointerType === 'touch')
                touchPoints.push(e);

            if (penID !== e.pointerId && penID !== '') return;
            if (e.pointerType === 'pen') tool = 'PEN';
            if (e.pointerType === 'touch' && penSupported) {
                tool = 'ERASE';
                penID = e.pointerId;
                return;
            }

            penDown = true;
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
            ctx.lineWidth = size*zoom;

            penID = e.pointerId;
            size = 5 * 2 ** (3 * e.pressure);
            const pnt = projectViewPort([e.offsetX, e.offsetY]);

            points = [{
                x: pnt[0],
                y: pnt[1],
                w: size / 2,
            }];
        };

        const handlePointerMove = (e) => {
            penSupported ||= e.pointerType === 'pen';
            if (e.pointerType === 'touch') {
                const ind = touchPoints.findIndex(e1 => e1.pointerId === e.pointerId);
                touchPoints[ind] = e;
                updateDebug(e);
            }

            if (touchPoints.length >= 2) {
                let vec = coordinatesVector(touchPoints[0], touchPoints[1]);
                if (lastVector !== null) {
                    let zoomFactor = 1 - (vec.length / lastVector.length);
                    let nonlinearZoom = Math.exp(zoomFactor) - 1;
                    zoom = Math.max(0.2, Math.min(5, zoom - nonlinearZoom));
                    center = [center[0] - (vec.center[0]-lastVector.center[0])/zoom, center[1] - (vec.center[1]-lastVector.center[1])/zoom];
                    computeViewport(center, zoom);
                }
                lastVector = vec;

                penDown = false;
                penID = '';
                points = [];
                ctx.fillStyle = backgroundColour;
                ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
                updateDebug(e);
                return;
            }

            if (penID !== e.pointerId) return;

            if (penDown && e.isPrimary && tool === 'PEN') {
                size = 5 * 2 ** (3 * e.pressure);
                ctx.lineWidth = size*zoom;
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();

                const pnt = projectViewPort([e.offsetX, e.offsetY]);
                points.push({
                    x: pnt[0],
                    y: pnt[1],
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

            if (e.pointerType === 'touch') {
                const ind = touchPoints.findIndex(e1 => e1.pointerId === e.pointerId);
                touchPoints.splice(ind, 1);
                if (touchPoints.length < 2)
                    lastVector = null;
            }

            if (penID !== e.pointerId) return;

            if (tool === 'PEN' && penDown) {
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
                ctx.fillStyle = backgroundColour;
                ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);


                penID = '';
                penDown = false;
            }

            if (tool === 'ERASE') {
                penID = '';
                penDown = false;
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
    },  [penColor, backgroundColour]); 
    
    return (
        <div>
            <div id="debug">
                {Object.entries(debug).map(([key, value]) => (
                    <label key={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:{' '}
                        <code>
                            {Array.isArray(value)
                                ? value.join(', ')
                                : typeof value === 'boolean'
                                    ? String(value)
                                    : value}
                        </code>
                    </label>
                ))}
            </div>
            {/*todo: change to use user set colour upon mindmap creation*/}
            <canvas
                id="canvas"
                ref={canvasRef}
                style={{ backgroundColour }}
            ></canvas>            
            
            <svg id="vector" ref={svgRef}>
            </svg>
        </div>
    );
};

export default WebMindMap;
