import React from "react";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_settingsDropdown.scss';
import { useModal } from "@ctx/Modal";
import GridOverlayModal from "../modals/GridOverlayModal.jsx";

/**
 * This is the dropdown menu shown by clicking on the three dots in the nav
 * @param backgroundColour
 * @param setBackgroundColour
 * @returns {Element}
 * @constructor
 */
const SettingsDropdown = ({ backgroundColour, setBackgroundColour }) => {
    const { t } = useTranslation("common");
    const { openModal } = useModal();

    return (
        <div className="settings_dropdown" role="menu" aria-label="Settings">
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
                        <label htmlFor="background-color-picker">{t('settings_dropdown.page_settings.background_colour')}</label>
                        <input
                            id="background-color-picker"
                            type="color"
                            value={backgroundColour}
                            onChange={(e) => setBackgroundColour(e.target.value)}
                            aria-label="Background Colour Picker"
                        />
                    </li>
                    <li tabIndex={0} onClick={() => openModal(<GridOverlayModal />, t("settings_dropdown.page_settings.grid_overlay_modal.title"))}>{t("settings_dropdown.page_settings.grid_display")}</li>
                    <li tabIndex={0}>{t("settings_dropdown.page_settings.snap_to_grid")}</li>
                </ul>
            </div>
        </div>
    );
};

export default SettingsDropdown;
