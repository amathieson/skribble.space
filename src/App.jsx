import WebMindMap from "./WebMindmap.jsx";
import Header from "./components/navigation/Navbar.jsx";
import '@scss/themes/_dark.scss'
import '@scss/themes/_light.scss'
import {useState} from "react";
import FloatingToolMenu from "./components/navigation/FloatingToolMenu.jsx";
function App() {
    const [penColor, setPenColor] = useState('#ffffff');

    return (
    <>
        <Header penColor={penColor} setPenColor={setPenColor} />
        <WebMindMap penColor={penColor}/>
        <FloatingToolMenu></FloatingToolMenu>
    </>
  )
}

export default App
