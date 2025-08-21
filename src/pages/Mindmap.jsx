import React, {useEffect, useState} from "react";
import WebMindMap from "/src/WebMindmap.jsx";
import ToolFAB from "/src/components/navigation/ToolFAB.jsx";
import Storage_manager from "../storage_manager.js";
import LZString from 'lz-string';
import {useParams} from "react-router-dom";
import {useMindmapCreation} from "@ctx/MindmapCreation.jsx";

function minifyXML(xmlString) {
    return xmlString
        .replace(/>\s+</g, '><')          // Remove whitespace between tags
        .replace(/\s{2,}/g, ' ')          // Collapse multiple spaces
        .replace(/<!--[\s\S]*?-->/g, '')  // Remove comments
        .replace(/^\s+|\s+$/g, '');       // Trim leading/trailing whitespace
}
function Mindmap() {
    const { id } = useParams();
    const { mindmaps} = useMindmapCreation();

    let mindmapData;
    if (id) {
        mindmapData = mindmaps.find(m => m.id === id);
    }

    // fallback or initial values
    const [penColor] = useState('#000000');
    const [backgroundColour, setBackgroundColour] = useState(mindmapData?.background_colour || "#ffffff");

    useEffect(() => {
        setBackgroundColour(mindmapData?.background_colour || "#ffffff");
    }, [mindmapData]);
    
    function handleMinMapAction(e, document_content) {
        // Save logic as before
        Storage_manager.SaveDocument(
            id || 1,
            LZString.compressToBase64(minifyXML(document_content))
        ).catch(err => {console.error(err)});
    }

    if (id && !mindmapData) {
        // Not found
        return <div>Mindmap not found.</div>;
    }
    
    return (
        <>
            <WebMindMap
                penColor={penColor}
                backgroundColour={backgroundColour}
                actionDone={handleMinMapAction}
            />
            <ToolFAB />
        </>
    );
}

export default Mindmap;

