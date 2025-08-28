import React, {useEffect, useState} from "react";
import WebMindMap from "/src/WebMindmap.jsx";
import ToolFAB from "/src/components/navigation/ToolFAB.jsx";
import idb from "@util/indexed_db.js";
import LZString from 'lz-string';
import {useParams} from "react-router-dom";

function minifyXML(xmlString) {
    return xmlString
        .replace(/>\s+</g, '><')          // Remove whitespace between tags
        .replace(/\s{2,}/g, ' ')          // Collapse multiple spaces
        .replace(/<!--[\s\S]*?-->/g, '')  // Remove comments
        .replace(/^\s+|\s+$/g, '');       // Trim leading/trailing whitespace
}
function Mindmap() {
    const { id } = useParams();
    const [mindmapData, setMindmapData] = useState(null);
    
    // fallback or initial values
    const [penColor] = useState('#000000');
    const [backgroundColour, setBackgroundColour] = useState(mindmapData?.background_colour || "#ffffff");

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const data = await idb.GetMindmapData(id);
                if (data) {
                    setMindmapData(data);
                    setBackgroundColour(data.background_colour || "#ffffff");
                }
            } catch (err) {
                console.error("Failed to load mindmap data:", err);
            }
        })();
    }, [id]);
    
    function handleMinMapAction(e, document_content) {
        // Save logic as before
        idb.SaveDocument(
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

