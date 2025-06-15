import React, {createContext, useContext, useState, memo} from 'react';

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
    const [gridEnabled, setGridEnabled] = useState(false);
    const [gridSize, setGridSize] = useState(50);
    const [strokeColour, setStrokeColour] = useState("#fff");
    const [viewPort, setViewPort] = useState([0, 0, 1000, 1000]);

    return (
        <GridOverlayContext.Provider value={{
            gridEnabled,
            setGridEnabled,
            gridSize,
            setGridSize,
            viewPort,
            setViewPort,
            strokeColour,
            setStrokeColour
        }}>
            {children}
        </GridOverlayContext.Provider>
    );
};

//This is the component part of the overlay
const GridOverlay = memo(({ viewPort }) => {
    const { gridSize, gridEnabled,strokeColour} = useGridOverlay();

    if (!gridEnabled) return <></>;
    const [x, y, width, height] = viewPort;

    return (
        <>
            <defs>
                <pattern
                    id="gridPattern"
                    x="0"
                    y="0"
                    width={gridSize}
                    height={gridSize}
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                        fill="none"
                        stroke={strokeColour}
                        strokeWidth="0.5"
                    />
                </pattern>
            </defs>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="url(#gridPattern)"
                pointerEvents="none"
            />
        </>
    );
});

export default GridOverlay;
