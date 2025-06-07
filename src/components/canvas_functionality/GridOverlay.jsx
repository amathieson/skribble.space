// noinspection com.intellij.reactbuddy.ArrayToJSXMapInspection

import React from 'react';

const GridOverlay = ({
                         viewPort, // required: [x, y, width, height]
                     }) => {
    if (!viewPort || viewPort.length !== 4) return null;

    const [x, y, width, height] = viewPort;
    let gridSpacing = 50;
    let gridLineColor = "#000";
    let gridLineWidth = 2;
    
    // Calculate aligned grid lines based on spacing inside viewport
    const startX = Math.floor(x / gridSpacing) * gridSpacing;
    const endX = Math.ceil((x + width) / gridSpacing) * gridSpacing;
    const startY = Math.floor(y / gridSpacing) * gridSpacing;
    const endY = Math.ceil((y + height) / gridSpacing) * gridSpacing;

    const verticalLines = [];
    for (let gx = startX; gx <= endX; gx += gridSpacing) {
        verticalLines.push(
            <line
                key={`v${gx}`}
                x1={gx}
                y1={y}
                x2={gx}
                y2={y + height}
                stroke={gridLineColor}
                strokeWidth={gridLineWidth}
            />
        );
    }

    const horizontalLines = [];
    for (let gy = startY; gy <= endY; gy += gridSpacing) {
        horizontalLines.push(
            <line
                key={`h${gy}`}
                x1={x}
                y1={gy}
                x2={x + width}
                y2={gy}
                stroke={gridLineColor}
                strokeWidth={gridLineWidth}
            />
        );
    }

    return (
        <>
            <g className="grid-lines">
                {verticalLines}
                {horizontalLines}
            </g>
        </>
    );
};

export default GridOverlay;
