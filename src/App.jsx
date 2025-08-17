import React from "react";
import '@scss/themes/_dark.scss';
import '@scss/themes/_light.scss';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Page404 from "@pages/404.jsx";
import Home from "@pages/Home.jsx";
import Mindmap from "@pages/Mindmap.jsx";

function App() {
    return (
        
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route path="*" element={<Page404 />} />
                        <Route index element={<Home />} />
                        <Route path="mindmap" element={<Mindmap />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
