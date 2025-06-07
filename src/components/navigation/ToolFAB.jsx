import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_toolFAB.scss';
import Paintbrush from '~icons/ph/paint-brush-bold';
import Pen from '~icons/ph/pen-bold';
import Square from '~icons/ph/square-bold';
import Image from '~icons/ph/image-square-bold';
import Text from '~icons/ph/text-a-underline-bold';

const ToolFAB = () => {
    const [fabState, setFabState] = useState(''); // '', 'open', 'closing'

    const toggleMenu = () => {
        if (fabState === 'open') {
            setFabState('closing');
            setTimeout(() => setFabState(''), 300); // wait for reverse animation
        } else {
            setFabState('open');
        }
    };

    return (
        <button className={`floating_button ${fabState}`} onClick={toggleMenu}>
            <Paintbrush className="fab_main_icon" />
            <div className="smaller_circle"><Text /></div>
            <div className="smaller_circle"><Image /></div>
            <div className="smaller_circle"><Square /></div>
            <div className="smaller_circle"><Pen /></div>
        </button>
    );
};

export default ToolFAB;
