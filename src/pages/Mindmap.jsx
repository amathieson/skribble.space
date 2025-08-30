import React, {useEffect, useState} from "react";
import WebMindMap from "/src/WebMindmap.jsx";
import ToolFAB from "/src/components/navigation/ToolFAB.jsx";
import idb from "@util/indexed_db.js";
import LZString from 'lz-string';
import {useParams} from "react-router-dom";
import { useAppContext } from "@ctx/AppContext.jsx";

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
    const { setCurrentMindmap } = useAppContext();

    // fallback or initial values
    const [penColor] = useState('#000000');
    const [backgroundColour, setBackgroundColour] = useState(mindmapData?.background_colour || "#ffffff");

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const data = await idb.GetMindmapData(id);
                if (data) {
                    setMindmapData({
                        ...data,
                        paths: LZString.decompressFromBase64(data.paths)
                    });
                    setBackgroundColour(data.background_colour || "#ffffff");
                    setCurrentMindmap(data);
                }
            } catch (err) {
                console.error("Failed to load mindmap data:", err);
            }
        })();
    }, [id]);
    
    function handleMinMapAction(e, paths) {
        idb.SaveDocument(
            id,
            LZString.compressToBase64(minifyXML(paths))
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
                initialSVG={mindmapData?.paths || ""}
            />
            <ToolFAB />
        </>
    );
}

export default Mindmap;

