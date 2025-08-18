import React, { createContext, useContext, useState } from "react";

const MindmapDrawingContext = createContext(undefined);
export const useColourSettings = () => useContext(MindmapDrawingContext);

// Provider component
export const MindmapDrawingProvider = ({ children }) => {
  // The pen colour of the mindmap
  const [penColor, setPenColor] = useState("#000");
  
  // The background colour of the mindmap
  const [backgroundColour, setBackgroundColour] = useState("#fff");

  const value = { penColor, setPenColor, backgroundColour, setBackgroundColour };

  return (
    <MindmapDrawingContext.Provider value={value}>
      {children}
    </MindmapDrawingContext.Provider>
  );
};