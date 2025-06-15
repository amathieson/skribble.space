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
    const [strokeColour, setStrokeColour] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState("1");
    const [gridShape, setGridShape] = useState("square");
    const [lineStyle, setLineStyle] = useState("solid");

    return (
        <GridOverlayContext.Provider value={{
            gridEnabled,
            setGridEnabled,
            gridSize,
            setGridSize,
            strokeColour,
            setStrokeColour,
            strokeWidth,
            setStrokeWidth,
            gridShape,
            setGridShape,
            lineStyle,
            setLineStyle
        }}>
            {children}
        </GridOverlayContext.Provider>
    );
};


//This is the component part of the overlay
const GridOverlay = memo(({ viewPort }) => {
    const { gridSize, gridEnabled, strokeColour, strokeWidth, gridShape, lineStyle } = useGridOverlay();

    if (!gridEnabled) return <></>;
    const [x, y, width, height] = viewPort;


    /**
     *  Gets the line style, dotted, dashed, etc
     *  TODO: make more of a distinction between dotted and dashed
     */
    const getLineStyle = (lineStyle) => {
        switch (lineStyle) {
            case 'dashed':
                return '4, 4';
            case 'dotted':
                return '1, 3';
            case 'solid':
            default:
                return null; 
        }
    };
    
    /**
     * Controls the pattern for the grid
     * @returns pattern for the selected shape
     */
    const getPatternPath = (gridSize, gridShape) => {
        let patternWidth, patternHeight;

        /**
         * Controls the pattern size for the different shapes
         */
        switch (gridShape) {
            case 'hexagon':
                patternWidth = gridSize * 3;
                patternHeight = Math.sqrt(3) * gridSize;
                break;
            case 'circle':
                patternWidth = gridSize;
                patternHeight = gridSize;
                break;
            case 'triangle':
                patternWidth = gridSize;
                patternHeight = gridSize * Math.sqrt(3)/2;
                break;
            case 'square':
            default:
                patternWidth = gridSize;
                patternHeight = gridSize;
                break;
        }

        let path = '';

        /**
         * Controls the path for the different shapes
         * TODO: fix the hexagon and triangle pathing
         */
        switch (gridShape) {
            case 'circle':
                path = `
                    M ${gridSize / 2},0
                    A ${gridSize / 2},${gridSize / 2} 0 1,0 ${gridSize / 2},${gridSize}
                    A ${gridSize / 2},${gridSize / 2} 0 1,0 ${gridSize / 2},0
                  `;
                break;

            case 'triangle':
                path = `
                    M 0 0
                    L ${gridSize} 0
                    L ${gridSize / 2} ${Math.sqrt(3) / 2 * gridSize}
                    Z
                  `;
                break;

            case 'hexagon':
                path = `
                    M ${gridSize * 0.5} 0
                    L ${gridSize * 1.5} 0
                    L ${gridSize * 2} ${Math.sqrt(3)/2 * gridSize}
                    L ${gridSize * 1.5} ${Math.sqrt(3) * gridSize}
                    L ${gridSize * 0.5} ${Math.sqrt(3) * gridSize}
                    L 0 ${Math.sqrt(3)/2 * gridSize}
                    Z
                  `;
                break;

            case 'square':
            default:
                path = `
                    M 0 0
                    L ${gridSize} 0
                    L ${gridSize} ${gridSize}
                    L 0 ${gridSize}
                    Z
                  `;
                break;
        }

        return { path, patternWidth, patternHeight };
    };

    const { path, patternWidth, patternHeight } = getPatternPath(gridSize, gridShape);

    return (
        <>
            <svg>
                <defs>
                    <pattern
                        id="gridPattern"
                        x="0"
                        y="0"
                        width={patternWidth}
                        height={patternHeight}
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d={path}
                            fill="none"
                            stroke={strokeColour}
                            strokeWidth={strokeWidth}
                            strokeDasharray={getLineStyle(lineStyle)}
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
            </svg>
        </>
    );
});


export default GridOverlay;