import WebMindMap from "./WebMindmap.jsx";
import Header from "./components/navigation/Navbar.jsx";
import '@scss/themes/_dark.scss'
import '@scss/themes/_light.scss'
import {useState} from "react";
import ToolFAB from "./components/navigation/toolFAB.jsx";
function App() {
    const [penColor, setPenColor] = useState('#ffffff');

    return (
    <>
        <Header penColor={penColor} setPenColor={setPenColor} />
        <WebMindMap penColor={penColor}/>
        <ToolFAB></ToolFAB>
        <p>lala the quick brown fox something lazy dog, lorem ipsum bla bla bla un deux trois quatre cinq six</p>
    </>
  )
}

export default App
