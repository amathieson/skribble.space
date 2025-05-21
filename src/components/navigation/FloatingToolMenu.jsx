import React from "react";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_floatingToolMenu.scss';
import Paintbrush from '~icons/ph/paint-brush-bold'

const FloatingToolMenu = () => {
    const { t } = useTranslation("common");

    const handleClick = () => {
        alert(t('buttonClicked'));
    };

    return (
        <>
            <div className="main">
                <button className="floating-button">
                    <Paintbrush/>
                </button>
                <div className="smaller-circle"></div>
                <div className="smaller-circle"></div>
                <div className="smaller-circle"></div>
                <div className="smaller-circle"></div>
            </div>
        </>
    );
};

export default FloatingToolMenu;
