import React from "react";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_toolFAB.scss';
import Paintbrush from '~icons/ph/paint-brush-bold';
import Pen from '~icons/ph/pen-bold';
import Square from '~icons/ph/square-bold';
import Image from '~icons/ph/image-square-bold';
import Text from '~icons/ph/text-a-underline-bold';

const ToolFAB = () => {
    const { t } = useTranslation("common");

    const handleClick = () => {
        alert(t('buttonClicked'));
    };

    return (
        <div className="main">
            <button className="floating_button" onClick={handleClick}>
                <Paintbrush className="fab_main_icon"/>
                <div className="smaller_circle"><Text/></div>
                <div className="smaller_circle"><Image/></div>
                <div className="smaller_circle"><Square/></div>
                <div className="smaller_circle"><Pen/></div>
            </button>
        </div>
    );
};

export default ToolFAB;
