import React from "react";
import '@scss/navigation/_navbar.scss'; 

const Header = ({ penColor, setPenColor }) => {

    return (
        <header>
            <input type="color" id="pencolor" value={penColor}
                   onChange={(e) => setPenColor(e.target.value)}/>
        </header>
    );
};

export default Header;
