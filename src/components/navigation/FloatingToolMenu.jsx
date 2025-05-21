import React from "react";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_floatingToolMenu.scss';
import Paintbrush from '~icons/ph/paint-brush-bold';

const FloatingToolMenu = () => {
    const { t } = useTranslation("common");

    const handleClick = () => {
        alert(t('buttonClicked'));
    };

    return (
        <div className="main">
            <button className="floating-button" onClick={handleClick}>
                <Paintbrush />
                <div className="smaller-circle"></div>
                <div className="smaller-circle"></div>
                <div className="smaller-circle"></div>
                <div className="smaller-circle"></div>
            </button>
        </div>
    );
};

export default FloatingToolMenu;
