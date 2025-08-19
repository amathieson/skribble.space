import React, {createContext, useContext, memo, useEffect, useState} from 'react';
import { useAppContext } from "@ctx/AppContext.jsx";

// --- Context Definition ---
const MindmapCreationContext = createContext(undefined);

/**
 * This controls all the grid behaviour
 * @param children
 * @returns {Element}
 * @constructor
 */
export function MindmapCreationProvider({ children }) {
    const [mindmaps, setMindmaps] = useState([]);
    const { setCurrentMindmap } = useAppContext();

    function createMindmap(mindmap) {
        const id = crypto.randomUUID();
        const newMindmap = { ...mindmap, id };
        setMindmaps([...mindmaps, newMindmap]);
        setCurrentMindmap(newMindmap);
        return newMindmap;

    }


    return (
        <MindmapCreationContext.Provider value={{ mindmaps, createMindmap }}>
            {children}
        </MindmapCreationContext.Provider>
    );
}



//This is the component part of the overlay
export function useMindmapCreation() {
    return useContext(MindmapCreationContext);
}