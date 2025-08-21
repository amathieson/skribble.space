import React, { createContext, useContext, useState } from "react";
import { useAppContext } from "@ctx/AppContext.jsx";
import { useMindmapCreation } from "@ctx/MindmapCreation.jsx";

const MindmapDrawingContext = createContext(undefined);
export const useColourSettings = () => useContext(MindmapDrawingContext);

// Provider component
export const MindmapDrawingProvider = ({ children }) => {
  const { currentMindmap } = useAppContext();
  const { updateMindmap } = useMindmapCreation();

  // The pen colour of the mindmap
  const [penColor, setPenColor] = useState("#000000");

  // The background colour of the mindmap
  const [backgroundColour, _setBackgroundColour] = useState("#ffffff");

  // New setter for background and mindmap persistence
  const setBackgroundColour = (newColour) => {
    _setBackgroundColour(newColour);
    if (currentMindmap && currentMindmap.id) {
      updateMindmap(currentMindmap.id, { background_colour: newColour });
    }
  };

  const value = { penColor, setPenColor, backgroundColour, setBackgroundColour };

  return (
      <MindmapDrawingContext.Provider value={value}>
        {children}
      </MindmapDrawingContext.Provider>
  );
};