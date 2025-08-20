import React, {createContext, useContext, useState} from 'react';
import { useAppContext } from "@ctx/AppContext.jsx";

// --- Context Definition ---
const MindmapCreationContext = createContext(undefined);

/**
 * This controls all the mindmap create behaviour
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
    function updateMindmap(id, updates) {
        setMindmaps((mindmaps) =>
            mindmaps.map(m =>
                m.id === id ? { ...m, ...updates } : m
            )
        );
    }




    return (
        <MindmapCreationContext.Provider value={{ mindmaps, createMindmap,updateMindmap
        }}>
            {children}
        </MindmapCreationContext.Provider>
    );
}



//This is the component part of the overlay
export function useMindmapCreation() {
    return useContext(MindmapCreationContext);
}