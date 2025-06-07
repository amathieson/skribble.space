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
    
    const temp = () => {
        console.log("We will do things soon!")
    }

    return (
        <div className={`fab_wrapper ${fabState}`}>
            <button className="floating_button" onClick={toggleMenu}>
                <Paintbrush className="fab_main_icon" />
            </button>

            <button className="smaller_circle" onClick={temp}><Text /></button>
            <button className="smaller_circle" onClick={temp}><Image /></button>
            <button className="smaller_circle" onClick={temp}><Square /></button>
            <button className="smaller_circle" onClick={temp}><Pen /></button>
        </div>
      
     
    );
};

export default ToolFAB;
