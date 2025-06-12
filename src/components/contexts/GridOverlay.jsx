import React, { createContext, useContext, useState } from 'react';

// --- Context Definition ---
const GridOverlayContext = createContext();

export const useGridOverlay = () => useContext(GridOverlayContext);

/**
 * This controls all the grid behaviour
 * @param children
 * @returns {Element}
 * @constructor
 */
export const GridOverlayProvider = ({ children }) => {
    //For controlling the state of grid
    const [gridEnabled, setGridEnabled] = useState(false);
    // const [spacing, setSpacing] = useState(50);
    // const [color, setColor] = useState("#000");
    // const [lineWidth, setLineWidth] = useState(2);

    return (
        <GridOverlayContext.Provider value={{
            gridEnabled,
            setGridEnabled,
        }}>
            {children}
        </GridOverlayContext.Provider>
    );
};

//This is the component part of the overlay
const GridOverlay = ({ viewPort, color = '#000', lineWidth = 1 }) => {
    const { gridEnabled } = useGridOverlay();

    if (!gridEnabled || !viewPort || viewPort.length !== 4) return ( <g/>);

    const [x, y, width, height] = viewPort;
    let spacing = 50;

    const startX = Math.floor(x / spacing) * spacing;
    const endX = Math.ceil((x + width) / spacing) * spacing;
    const startY = Math.floor(y / spacing) * spacing;
    const endY = Math.ceil((y + height) / spacing) * spacing;

    const verticalLines = [];
    for (let gx = startX; gx <= endX; gx += spacing) {
        verticalLines.push(
            <line
                key={`v${gx}`}
                x1={gx}
                y1={y}
                x2={gx}
                y2={y + height}
                stroke={color}
                strokeWidth={lineWidth}
            />
        );
    }

    const horizontalLines = [];
    for (let gy = startY; gy <= endY; gy += spacing) {
        horizontalLines.push(
            <line
                key={`h${gy}`}
                x1={x}
                y1={gy}
                x2={x + width}
                y2={gy}
                stroke={color}
                strokeWidth={lineWidth}
            />
        );
    }

    return (
        <g className="grid-lines">
            {verticalLines}
            {horizontalLines}
        </g>
    );
};


export default GridOverlay;
