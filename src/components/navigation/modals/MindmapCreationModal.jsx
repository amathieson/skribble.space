import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import '@scss/navigation/modals/_mindmapCreationModal.scss';
import {useColourSettings} from "@ctx/MindmapDrawingContext.jsx";
import ColourPicker from "../../utilities/ColourPicker.jsx";


const MindmapCreationModal = () => {
    const { t } = useTranslation("common");

    const {setBackgroundColour} = useColourSettings();
    
    return (
        <div className="mindmap_create_modal">
            <p className="modal_description">
                {t("create_modal.description")}
            </p>


            <div className="modal_options">
                <label className="modal_option">
                    <span>{t("create_modal.mindmap_name.name")}</span>
                    <input type="text" id="name" placeholder={t("create_modal.mindmap_name.placeholder")}/>
                </label>

                <label className="modal_option">
                    {t("create_modal.mindmap_description.name")}
                    <textarea
                        id="description"
                        placeholder={t("create_modal.mindmap_description.placeholder")}
                        rows={4}
                        maxLength={250}
                    />
                </label>
            </div>

            <div className="modal_options">
                <label className="modal_option">
                    <ColourPicker
                        label={t("settings_dropdown.page_settings.background_colour")}
                        value={setBackgroundColour}
                        onChange={setBackgroundColour}
                    />
                    <span>{t("settings_dropdown.page_settings.background_colour")}</span>
                </label>
            </div>
            
            <div className="modal_options">
                <label htmlFor="" className="model_option">
                    <button type="submit" className="submit_button" value="Create Mindmap">{t("create_modal.submit")}</button>
                </label>
            </div>
       
            
        </div>
    );
};

export default MindmapCreationModal;
