import React from "react";
import {useTranslation} from "react-i18next";
import '@scss/navigation/_navbar.scss'; 

const Header = ({ penColor, setPenColor }) => {
    const {t} = useTranslation("common");
    
    return (
        <header>
            <h1>{t('nav.title')}</h1>
            <input type="color" id="pencolor" value={penColor}
                   onChange={(e) => setPenColor(e.target.value)}/>
        </header>
    );
};

export default Header;
