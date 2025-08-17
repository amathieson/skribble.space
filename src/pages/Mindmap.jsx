import React, { useState } from "react";
import WebMindMap from "/src/WebMindmap.jsx";
import NavbarMindmap from "/src/components/navigation/navbars/NavbarMindmap.jsx";
import ToolFAB from "/src/components/navigation/ToolFAB.jsx";
import Storage_manager from "../storage_manager.js";
import LZString from 'lz-string';
import AppProviders from '@ctx/AppContext.jsx';

function minifyXML(xmlString) {
    return xmlString
        .replace(/>\s+</g, '><')          // Remove whitespace between tags
        .replace(/\s{2,}/g, ' ')          // Collapse multiple spaces
        .replace(/<!--[\s\S]*?-->/g, '')  // Remove comments
        .replace(/^\s+|\s+$/g, '');       // Trim leading/trailing whitespace
}
function Mindmap() {
    const [penColor, setPenColor] = useState('#000000');
    const [backgroundColour, setBackgroundColour] = useState('#ffffff');
    function handleMinMapAction(e, document_content) {
        // Handle Saving and action history
        console.log("MindMap Action:", e, document_content.length);
        Storage_manager.SaveDocument(1, LZString.compressToBase64(minifyXML(document_content))).catch(err => {console.error(err)});
    }
  
    return (
        <>
           <AppProviders>
               <NavbarMindmap
                   penColor={penColor}
                   setPenColor={setPenColor}
                   backgroundColour={backgroundColour}
                   setBackgroundColour={setBackgroundColour}
               />
               <WebMindMap penColor={penColor} backgroundColour={backgroundColour} actionDone={handleMinMapAction}/>
               <ToolFAB />
           </AppProviders>
                  
            
        </>
    );
}

export default Mindmap;
