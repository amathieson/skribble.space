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
    const [gridSizeX, setGridSizeX] = useState(50);
    const [gridSizeY, setGridSizeY] = useState(50);
    const [strokeColour, setStrokeColour] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState("1");
    const [gridShape, setGridShape] = useState("square");
    const [lineStyle, setLineStyle] = useState("solid");

    return (
        <GridOverlayContext.Provider value={{
            gridEnabled,
            setGridEnabled,
            gridSizeX,
            setGridSizeX,
            gridSizeY,
            setGridSizeY,
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
    const { gridSizeX, gridSizeY, gridEnabled, strokeColour, strokeWidth, gridShape, lineStyle } = useGridOverlay();

    if (!gridEnabled) return <></>;
    const [x, y, width, height] = viewPort;


    /**
     *  Gets the line style, dotted, dashed, etc
     *  TODO: make more of a distinction between dotted and dashed
     */
    const strokeStyles = {
        dashed: '4, 4',
        dotted: '1, 3',
        solid: null
    };
    
    /**
     * Controls the pattern for the grid
     * @returns pattern for the selected shape
     */
    const getPatternPath = (gridSizeX, gridSizeY, gridShape) => {
        let patternWidth, patternHeight;

        switch (gridShape) {
            case 'hexagon':
                patternWidth = gridSizeX * 1.5;
                patternHeight = Math.sqrt(3) * gridSizeY;
                break;
            case 'circle':
                patternWidth = gridSizeX;
                patternHeight = gridSizeY;
                break;
            case 'triangle':
                patternWidth = gridSizeX;
                patternHeight = Math.sqrt(3) / 2 * gridSizeY;
                break;
            case 'square':
            default:
                patternWidth = gridSizeX;
                patternHeight = gridSizeY;
                break;
        }

        let path = '';

        /**
         * Controls the path for the different shapes
         * TODO: fix the hexagon pathing
         */
        switch (gridShape) {
            case 'circle':
                patternWidth = gridSizeX;
                patternHeight = gridSizeY;

                path = `
                    M ${gridSizeX / 2},0
                    A ${gridSizeX / 2},${gridSizeY / 2} 0 1,0 ${gridSizeX / 2},${gridSizeY}
                    A ${gridSizeX / 2},${gridSizeY / 2} 0 1,0 ${gridSizeX / 2},0
                `;
                break;

            case 'triangle': {
                const s = gridSizeX;
                const h = Math.sqrt(3) / 2 * gridSizeY;

                patternWidth = s;
                patternHeight = h * 2;

                path = `
                    M 0 ${h} L ${s / 2} 0 L ${s} ${h} Z
                    M 0 ${h} L ${s} ${h} L ${s / 2} ${2 * h} Z
                    M 0 0 L 0 ${2 * h}
                    M ${s / 2} 0 L ${s / 2} ${2 * h}
                    M 0 ${2 * h} L ${s} ${2 * h}
                `;
                break;
            }

            case 'hexagon': {
                const sX = gridSizeX;
                const sY = gridSizeY;
                const h = Math.sqrt(3) * sY / 2;

                patternWidth = sX * 1.5;
                patternHeight = h * 2;

                const p1 = [sX / 2, 0];
                const p2 = [sX * 1.5, 0];
                const p3 = [sX * 2, h];
                const p4 = [sX * 1.5, h * 2];
                const p5 = [sX / 2, h * 2];
                const p6 = [0, h];

                path = `
                    M ${p1[0]} ${p1[1]} 
                    L ${p2[0]} ${p2[1]} 
                    L ${p3[0]} ${p3[1]} 
                    L ${p4[0]} ${p4[1]} 
                    L ${p5[0]} ${p5[1]} 
                    L ${p6[0]} ${p6[1]} 
                    Z
                `;
                break;
            }


            case 'square':
            default:
                patternWidth = gridSizeX;
                patternHeight = gridSizeY;

                path = `
                    M 0 0
                    L ${gridSizeX} 0
                    L ${gridSizeX} ${gridSizeY}
                    L 0 ${gridSizeY}
                    Z
                `;
                break;
        }

        return { path, patternWidth, patternHeight };
    };

    const { path, patternWidth, patternHeight } = getPatternPath(gridSizeX, gridSizeY, gridShape);

    return (
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
                            strokeDasharray={strokeStyles[lineStyle]}
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
    );
});


export default GridOverlay;