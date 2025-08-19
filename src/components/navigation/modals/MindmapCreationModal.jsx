import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import '@scss/navigation/modals/_mindmapCreationModal.scss';
import {useColourSettings} from "@ctx/MindmapDrawingContext.jsx";
import ColourPicker from "../../utilities/ColourPicker.jsx";
import {useNavigate} from "react-router-dom";
import { useMindmapCreation } from "@ctx/MindmapCreation.jsx"; // Add/import this
import { useModal } from '@ctx/Modal.jsx';


const MindmapCreationModal = () => {
    const { t } = useTranslation("common");
    const {backgroundColour } = useColourSettings();
    const navigate = useNavigate();
    const { createMindmap } = useMindmapCreation();
    const { closeModal } = useModal();

    const [mindmap, setMindmap] = useState({
        name: "",
        description: "",
        background_colour: backgroundColour || "#ffffff",
        date_created: new Date().toISOString(),
    });


    /**
     * Sends a request to create a new mindmap.
     * mindmap contains the following fields:
     * name, description, colour, date_created
     * @param e
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        closeModal();
        const mindmapCreated = createMindmap(mindmap);
        //todo: fix mindmap creation background colour
        navigate(`/mindmap/${mindmapCreated.id}`);   
    };




    return (
        <form className="mindmap_create_modal" onSubmit={handleSubmit}>
            <p className="modal_description">
                {t("create_modal.description")}
            </p>

            <div className="modal_options">
                <label className="modal_option">
                    <span>{t("create_modal.mindmap_name.name")}</span>
                    <input
                        type="text"
                        id="name"
                        placeholder={t("create_modal.mindmap_name.placeholder")}
                        value={mindmap.name}
                        onChange={e => setMindmap({ ...mindmap, name: e.target.value })}
                        required
                    />
                </label>

                <label className="modal_option">
                    {t("create_modal.mindmap_description.name")}
                    <textarea
                        id="description"
                        placeholder={t("create_modal.mindmap_description.placeholder")}
                        rows={4}
                        maxLength={250}
                        value={mindmap.description}
                        onChange={e => setMindmap({ ...mindmap, description: e.target.value })}
                    />
                </label>
            </div>

            <div className="modal_options">
                <label className="modal_option">
                    <ColourPicker
                        label={t("settings_dropdown.page_settings.background_colour")}
                        value={mindmap.background_colour
                        }
                        onChange={c => setMindmap({ ...mindmap, background_colour: c })}
                    />
                    <span>{t("settings_dropdown.page_settings.background_colour")}</span>
                </label>
            </div>

            <div className="modal_options">
                <label htmlFor="" className="model_option">
                    <button type="submit" className="submit_button" value="Create Mindmap">
                        {t("create_modal.submit")}
                    </button>
                </label>
            </div>
        </form>
    );
};

export default MindmapCreationModal;
