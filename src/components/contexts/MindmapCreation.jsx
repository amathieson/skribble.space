import React, {createContext, useContext, useEffect, useState} from 'react';
import { useAppContext } from "@ctx/AppContext.jsx";
// import {GetAllMindmapsMetadata, SaveMindmapData, SaveMindmapMetadata,GetMindmapData} from "@util/indexed_db.js";
import idb from "@util/indexed_db.js";

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

    // Load metadata on mount
    useEffect(() => {
        (async () => {
            try {
                const metaList = await idb.GetAllMindmapsMetadata();
                setMindmaps(metaList.map(m => ({ ...m, tags: m.tags || [] })));
            } catch (err) {
                console.error("Failed to load mindmap metadata:", err);
            }
        })();
    }, []);

    async function createMindmap(mindmap) {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        const newMindmap = {
            ...mindmap,
            id,
            date_created: now,
            date_modified: now,
            nodes: [],
            connections: [],
            tags: [],
            version: 1
        };

        // Persist
        await idb.SaveMindmapMetadata({
            id,
            name: newMindmap.name,
            description: newMindmap.description,
            date_modified: now,
            tags: newMindmap.tags
        });
        await idb.SaveMindmapData(newMindmap);

        // Update in-memory state
        setMindmaps(prev => [
            ...prev,
            { id, name: newMindmap.name, description: newMindmap.description, date_modified: now, tags: newMindmap.tags }
        ]);

        setCurrentMindmap(id);
        return newMindmap;
    }

    async function updateMindmap(id, updates) {
        // Update full data
        const existing = await idb.GetMindmapData(id);
        if (!existing) return;

        const updated = { ...existing, ...updates, date_modified: new Date().toISOString() };

        await idb.SaveMindmapData(updated);
        await idb.SaveMindmapMetadata({
            id,
            name: updated.name,
            description: updated.description,
            date_modified: updated.date_modified,
            tags: updated.tags || []
        });

        setMindmaps(prev =>
            prev.map(m =>
                m.id === id
                    ? { id, name: updated.name, description: updated.description, date_modified: updated.date_modified, tags: updated.tags || [] }
                    : m
            )
        );
    }

    return (
        <MindmapCreationContext.Provider value={{ mindmaps, createMindmap, updateMindmap }}>
            {children}
        </MindmapCreationContext.Provider>
    );
}



//This is the component part of the overlay
export function useMindmapCreation() {
    return useContext(MindmapCreationContext);
}