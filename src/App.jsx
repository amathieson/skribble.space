import WebMindMap from "./WebMindmap.jsx";
import Header from "./components/navigation/navbar.jsx";
import '@scss/themes/_dark.scss'
import '@scss/themes/_light.scss'
import {useState} from "react";
function App() {
    const [penColor, setPenColor] = useState('#ffffff');

    return (
    <>
        <Header penColor={penColor} setPenColor={setPenColor} />
        <WebMindMap penColor={penColor}/>
    </>
  )
}

export default App
