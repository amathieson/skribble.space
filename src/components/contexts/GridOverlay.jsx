import React, {createContext, useContext, useState, memo, useEffect} from 'react';

// --- Context Definition ---
const GridOverlayContext = createContext(undefined);

// eslint-disable-next-line react-refresh/only-export-components
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
const GridOverlay = memo(({ svgRef  }) => {
    const { gridSizeX, gridSizeY, strokeColour, strokeWidth, gridShape, lineStyle } = useGridOverlay();
    const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });


    useEffect(() => {
        const el = svgRef?.current;
        if (!el) return;

        const observer = new ResizeObserver(() => {
            const bbox = el.getBBox();
            if (bbox.width > 0 && bbox.height > 0) {
                setBounds({
                    x: bbox.x,
                    y: bbox.y,
                    width: bbox.width,
                    height: bbox.height
                });
            }
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [svgRef, gridSizeX, gridSizeY, gridShape]);
    

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
        let patternWidth, patternHeight,path;

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
                const stepX = gridSizeX * 0.74;  // horizontal distance between hex centres
                const stepY = gridSizeY * 0.51;  // vertical offset between rows

                patternWidth = stepX * 2;      // enough to fit 2 hex centres horizontally
                patternHeight = gridSizeY * 1.;       // enough for 2 staggered hex rows vertically

                const points = [
                    [gridSizeX * 0.25, 0],          // top-left
                    [gridSizeX * 0.75, 0],          // top-right
                    [gridSizeX, gridSizeY * 0.5],           // right-middle
                    [gridSizeX * 0.75, gridSizeY],          // bottom-right
                    [gridSizeX * 0.25, gridSizeY],          // bottom-left
                    [0, gridSizeY * 0.5]            // left-middle
                ];

                function hexPath(offsetX = 0, offsetY = 0) {
                    return points
                        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0] + offsetX} ${p[1] + offsetY}`)
                        .join(' ') + ' Z';
                }

                path = `
                    ${hexPath(0, 0)}
                    ${hexPath(stepX, stepY)}
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
            <>
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
                    x={bounds.x}
                    y={bounds.y}
                    width={bounds.width}
                    height={bounds.height}
                    fill="url(#gridPattern)"
                    pointerEvents="none"
                />
            </>
    );
});


export default GridOverlay;