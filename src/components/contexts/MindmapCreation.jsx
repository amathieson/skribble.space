import React, {createContext, useContext, useEffect, useState} from 'react';
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

    /**
     * Uses crypto for a UUID
     * Falls back to maths function if fails
     * @returns {`${string}-${string}-${string}-${string}-${string}`|string}
     */
    function generateUUID() {
        // Use the modern, secure method if it's available
        if (crypto?.randomUUID) {
            return crypto.randomUUID();
        }

        // Fallback for insecure contexts (like HTTP on mobile) or older browsers
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    async function createMindmap(mindmap) {
        const id = generateUUID();
        const now = new Date().toISOString();

        const mindmapData = {
            id,
            name: mindmap.name,
            paths: [],
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

        setMindmaps(prev => [
            ...prev,
            { id, name: mindmap.name, description: mindmap.description, background_colour: mindmap.background_colour, tags: mindmap.tags}
        ]);

        return id;
    }

    async function updateMindmap(id, updates) {
        const existing = await idb.GetMindmapData(id);
        if (!existing) return;

        const updated = { ...existing, ...updates, date_modified: new Date().toISOString() };

        await idb.SaveMindmapData(updated);
        await idb.SaveMindmapMetadata({
            id,
            name: updated.name,
            description: updated.description,
            date_modified: updated.date_modified,
            tags: updated.tags || [],
            favourited: false,
        });

        setMindmaps(prev =>
            prev.map(m =>
                m.id === id
                    ? { id, name: updated.name, description: updated.description, date_modified: updated.date_modified, tags: updated.tags || [] }
                    : m
            )
        );
    }

    /**
     * Deletes a mindmap from IndexedDB
     * @param id
     * @returns {Promise<void>}
     */
    async function deleteMindmap(id) {
        if (!id) return; 

        try {
            await idb.DeleteMindmap(id);
            setMindmaps(prev => prev.filter(mindmap => mindmap.id !== id));

        } catch (err) {
            console.error(`Failed to delete mindmap with id: ${id}`, err);
        }
    }

    return (
        <MindmapCreationContext.Provider value={{ mindmaps, setMindmaps, createMindmap, updateMindmap, deleteMindmap }}>
            {children}
        </MindmapCreationContext.Provider>
    );
}



//This is the component part of the overlay
export function useMindmapCreation() {
    return useContext(MindmapCreationContext);
}