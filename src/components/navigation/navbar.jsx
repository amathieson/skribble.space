import React from "react";
import {useTranslation} from "react-i18next";
import '@scss/navigation/_navbar.scss';
import PhPencilSimpleBold from '~icons/ph/pencil-simple-bold'

const Header = ({ penColor, setPenColor }) => {
    const {t} = useTranslation("common");
    
    return (
        <header>
            <h1>{t('nav.title')}</h1>
            <div className="toolbar">
                <PhPencilSimpleBold className="nav_icons"/>
                <PhPencilSimpleBold className="nav_icons"/>
                <PhPencilSimpleBold className="nav_icons"/>
                <PhPencilSimpleBold className="nav_icons"/>
                <div className="nav_icons">
                    <input type="color" id="pencolor" value={penColor}
                           onChange={(e) => setPenColor(e.target.value)}/>
                </div>
            </div>
            
        </header>
    );
};

export default Header;
