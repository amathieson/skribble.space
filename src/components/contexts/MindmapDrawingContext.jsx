import React, {createContext, useContext, useEffect, useState} from "react";
import { useAppContext } from "@ctx/AppContext.jsx";
import { useMindmapCreation } from "@ctx/MindmapCreation.jsx";
import idb from "@util/indexed_db.js";

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

  // Load saved background color when currentMindmap changes
  useEffect(() => {
    if (currentMindmap?.id) {
      (async () => {
        const data = await idb.GetMindmapData(currentMindmap.id);
        if (data?.background_colour) {
          _setBackgroundColour(data.background_colour);
        }
      })();
    }
  }, [currentMindmap?.id]);

  const setBackgroundColour = (newColour) => {
    _setBackgroundColour(newColour);
    if (currentMindmap?.id) {
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