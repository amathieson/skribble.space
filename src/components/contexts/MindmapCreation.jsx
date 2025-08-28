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

        const mindmapData = {
            id,
            name: mindmap.name,
            nodes: [],
            connections: [],
            version: 1,
            background_colour: mindmap.background_colour,
        };

        // Persist
        await idb.SaveMindmapMetadata({
            id,
            name: mindmap.name,
            description: mindmap.description,
            date_modified: now,
            date_created: now,
            tags: mindmap.tags
        });
        await idb.SaveMindmapData(mindmapData);

        // Update in-memory state
        setMindmaps(prev => [
            ...prev,
            { id, name: mindmap.name, description: mindmap.description, background_colour: mindmap.background_colour }
        ]);

        return id;
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