import React from "react";
import '@scss/navigation/navbars/_navbar.scss';
import '@scss/navigation/navbars/_navbarHome.scss';
import {useTranslation} from "react-i18next";

const NavbarHome = () => {
    const { t } = useTranslation("common");

    return (
        <header>
            <div className="toolbar">
                <img className={"nav_logo"} src="public/SVG/Small.svg" alt="Skribble.Space Logo" />
                <h1>{t('title')}</h1>
            </div>

            <div className="toolbar_sub">
            </div>
        </header>
    );
};

export default NavbarHome;
