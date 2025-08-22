import React, { createContext, useContext, useState } from 'react';
import { GridOverlayProvider } from '@ctx/GridOverlay.jsx';
import { MindmapCreationProvider } from '@ctx/MindmapCreation.jsx';

export const AppContext = createContext();

export function useAppContext() {
    return useContext(AppContext);
}

function CurrentMindmapProvider({ children }) {
    const [currentMindmap, setCurrentMindmap] = useState(null);

    return (
        <AppContext.Provider value={{ currentMindmap, setCurrentMindmap }}>
            {children}
        </AppContext.Provider>
    );
}

const providers = [
    CurrentMindmapProvider,
    MindmapCreationProvider,
    GridOverlayProvider,
];

const AppProviders = ({ children }) =>
    providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);

export default AppProviders;