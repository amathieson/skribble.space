import React, {createContext, useContext, memo, useEffect} from 'react';

// --- Context Definition ---
const MindmapCreationContext = createContext(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useMindmapCreation = () => useContext(MindmapCreationContext);

/**
 * This controls all the grid behaviour
 * @param children
 * @returns {Element}
 * @constructor
 */
export const MindmapCreationProvider = ({ children }) => {
    return (
        <MindmapCreationContext.Provider value={{
        }}>
            {children}
        </MindmapCreationContext.Provider>
    );
};


//This is the component part of the overlay
const MindmapCreation = memo(() => {
    // const {} = useMindmapCreation();


    useEffect(() => {
    }, );
    
    return (
            <>
            </>
    );
});


export default MindmapCreation;