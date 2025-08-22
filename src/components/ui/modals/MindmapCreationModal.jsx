import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import '@scss/ui/modals/_mindmapCreationModal.scss';
import ColourPicker from '@util/ColourPicker.jsx';
import {useNavigate} from 'react-router-dom';
import { useMindmapCreation } from '@ctx/MindmapCreation.jsx';
import {BaseModal} from '@ui/modals/BaseModal.jsx';

/**
 * This is the modal that is shown when the user clicks on the "Create Mindmap" button
 * It is used to create a new mindmap, store the data, and then redirect the user to the new mindmap page.
 * @param isOpen
 * @param closeModal
 * @returns {Element}
 * @constructor
 */
const MindmapCreationModal  = ({ isOpen, closeModal }) => {
    const { t } = useTranslation("common");
    const navigate = useNavigate();
    const { createMindmap } = useMindmapCreation();

    const [mindmap, setMindmap] = useState({
        name: "",
        description: "",
        background_colour: "#ffffff",
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
        navigate(`/mindmap/${mindmapCreated.id}`);   
    };
    
    // HTML Content for Modal
    const modalContent = (
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
                        value={mindmap.background_colour}
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
        )
    
    return (
        <BaseModal
            isOpen={isOpen}
            title={t("create_modal.title")}
            content={modalContent}
            closeModal={closeModal}
        />
    );
};

export default MindmapCreationModal;
