import React, { useEffect, useRef, useState } from 'react';
import '@scss/_style.scss';
import GridOverlay, {useGridOverlay} from "@ctx/GridOverlay.jsx";

const WebMindMap = ({ penColor, backgroundColour = '#fff', actionDone, onViewPortChange }) => {
    const canvasRef = useRef(null);
    const svgRef = useRef(null);
    const svgBackRef = useRef(null);
    const gridRef = useRef(null);
    const viewPortRef = useRef([0,0,0,0]);
    const [viewPort, setViewPort] = useState([0,0,0,0]);
    const { gridEnabled } = useGridOverlay(); 

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
        const grid = gridRef.current;
        const svgBack = svgBackRef.current;
        const ctx = canvas.getContext('2d');
        const dpr    = window.devicePixelRatio || 1;
        
        let rect = canvas.getBoundingClientRect();
        document.onresize = () => {
            rect = canvas.getBoundingClientRect();
            canvas.width  = rect.width  * dpr;
            canvas.height = rect.height * dpr;

            canvas.style.width  = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

        }

        canvas.width  = rect.width  * dpr;
        canvas.height = rect.height * dpr;

        canvas.style.width  = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        ctx.scale(dpr, dpr);

        svg.setAttribute('width', rect.width * 5);
        svg.setAttribute('height', rect.height * 5);
        grid.setAttribute('width', rect.width * 5);
        grid.setAttribute('height', rect.height * 5);
        svgBack.setAttribute('width', rect.width * 5);
        svgBack.setAttribute('height', rect.height * 5);
        
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
       
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
            viewPortRef.current = vp;
            setViewPort(vp);
            if (onViewPortChange) {
                onViewPortChange(vp); 
            }
            svg.setAttribute('viewBox', vp.join(' '));
            grid.setAttribute('viewBox', vp.join(' '));
        }
        computeViewport(center, zoom);
        function projectViewPort(point) {
            const vp = viewPortRef.current;
            return [
                (point[0] / rect.width) * vp[2] + vp[0],
                (point[1] / rect.height) * vp[3] + vp[1],
            ];
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

            if (lastButton !== 0) return;

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
                ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
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
                if (el?.tagName?.toUpperCase() === 'PATH' && el.parentElement && el.parentElement.isConnected) {
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
                let cur_segment =  GeneratePathPointsPen(points)
                segments += `<path fill="${ctx.strokeStyle}" stroke-linecap="round" stroke="" stroke-width="1" d="`;
                segments += catmullRomToBezier(cur_segment[0]) + catmullRomToBezier(cur_segment[1]) + '"/>';

                svg.innerHTML += `<g>${segments}</g>`;
                points = [];
                ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);


                penID = '';
                penDown = false;
            }

            if (tool === 'ERASE') {
                penID = '';
                penDown = false;
            }

            updateDebug(e);
            actionDone(tool, svg.innerHTML);
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
        <div className="canvas">
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
            ></canvas>

            <svg id="vector" ref={svgRef} fill={backgroundColour}>
                <rect x={0} y={0} ref={svgBackRef}/>
            </svg>

            <svg id="canvas_grid_overlay" ref={gridRef} style={{
                    visibility: gridEnabled ? 'visible' : 'hidden',}}>
                <GridOverlay svgRef={svgBackRef}/>
            </svg>
        </div>
    );
};

function GeneratePathPointsPen(pnts) {

    const W = 1;

    let shapeA = [];
    let shapeB = [];
    shapeA.push(pnts[0]);
    shapeB.unshift(pnts[0]);
    for (let i = 1; i < pnts.length-1; i++) {
        const A = pnts[i];
        const B = pnts[i + 1];
        const dx = B.x - A.x;
        const dy = B.y - A.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        if (length === 0) continue;

        const ux = dx / length;
        const uy = dy / length;

        shapeA.push({
            x: A.x + pnts[i].w * -uy,
            y: A.y + pnts[i].w * ux
        });
        shapeB.unshift({
            x: A.x + W * pnts[i].w * uy,
            y: A.y + W * pnts[i].w * -ux
        });
    }
    shapeA.push(pnts[pnts.length-1]);
    shapeB.unshift(pnts[pnts.length-1]);

    return [shapeA, shapeB];
}

export default WebMindMap;
