import React, { useState } from "react";
import WebMindMap from "./WebMindmap.jsx";
import Navbar from "./components/navigation/Navbar.jsx";
import ToolFAB from "./components/navigation/ToolFAB.jsx";
import { DropdownProvider } from "@ctx/Dropdown";
import '@scss/themes/_dark.scss';
import '@scss/themes/_light.scss';

function App() {
    const [penColor, setPenColor] = useState('#000000');
    const [backgroundColour, setBackgroundColour] = useState('#ffffff');

    return (
        <>
            <DropdownProvider>
                    <Navbar
                        penColor={penColor}
                        setPenColor={setPenColor}
                        backgroundColour={backgroundColour}
                        setBackgroundColour={setBackgroundColour}
                    />
            </DropdownProvider>
                
            <WebMindMap penColor={penColor} backgroundColour={backgroundColour} />
            <ToolFAB />
            <p>
                lala the quick brown fox something lazy dog, lorem ipsum bla bla bla
                un deux trois quatre cinq six
            </p>
        </>
    );
}

export default App;
