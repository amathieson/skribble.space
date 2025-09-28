import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import GridOverlayModal from '@ui/modals/single_page/GridOverlayModal.jsx';
import ColourPicker from '@util/ColourPicker.jsx';
import { exportSvgToPdf } from '@util/export_mindmap.js';
import BaseDropdown from './BaseDropdown.jsx'; 
import '@scss/ui/dropdowns/_settingsDropdown.scss';

/**
 * This is the dropdown menu shown by clicking on the three dots in the nav
 * @param backgroundColour
 * @param setBackgroundColour
 * @returns {Element}
 * @constructor
 */
//TODO: fix the flickery dropdown when the settings button is pressed twice- once to close, once to open
const SettingsDropdown = ({ backgroundColour, setBackgroundColour, isOpen, closeDropdown }) => {
    const { t } = useTranslation("common");
    
    // Modal States. Etc
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);


    const dropdownContent = (
        <>
            <div className="settings_section" role="group" aria-labelledby="page-settings">
                <h4 id="page-settings">{t('settings_dropdown.skribble_settings.title')}</h4>
                <ul>
                    <li onClick={()=>{document.getElementById('debugoverlaycheck').click()}}>
                        <label htmlFor="background-color-picker">Debug Overlay</label>
                        <input
                            id="debugoverlaycheck"
                            type="checkbox"
                            value={backgroundColour}
                            onChange={(e) => setBackgroundColour(e.target.value)}
                            aria-label="Background Colour Picker"
                        />
                    </li>
                </ul>
            </div>
            <div className="settings_section" role="group" aria-labelledby="page-settings">
                <h4 id="page-settings">{t('settings_dropdown.page_settings.title')}</h4>
                <ul>
                    <li>
                        <ColourPicker
                            value={backgroundColour}
                            id={"background-color-picker"}
                            onChange={setBackgroundColour}
                            label={t('settings_dropdown.page_settings.background_colour')}
                        />
                    </li>
                    <li tabIndex={0} onClick={openModal}>{t("settings_dropdown.page_settings.grid_overlay_modal.title")}</li>
                </ul>
            </div>
            <div className="settings_section" role="group" aria-labelledby="page-settings">
                <h4 id="page-settings">{t('settings_dropdown.import_export_settings.title')}</h4>
                <ul>
                    <li tabIndex={0}>{t("settings_dropdown.import_export_settings.import")}</li>
                    <li tabIndex={0} onClick={() => exportSvgToPdf()}
                    >{t("settings_dropdown.import_export_settings.export")}</li>
                </ul>
            </div>

            <GridOverlayModal
                isOpen={modalOpen}
                closeModal={closeModal}
            />
        </>
    )
    
    return (
        <div className={"settings_dropdown"}>
            <BaseDropdown
                isOpen={isOpen}
                content={dropdownContent}
                closeDropdown={closeDropdown}
                unfurlDirection={"bottom"} 
            />
        </div>
     
    );
};

export default SettingsDropdown;
