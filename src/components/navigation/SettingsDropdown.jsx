import React from "react";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_settingsDropdown.scss';

const SettingsDropdown = ({ backgroundColour, setBackgroundColour }) => {
    const { t } = useTranslation("common");

    return (
        <div className="settings_dropdown" role="menu" aria-label="Settings">
            <h3>Settings</h3>

            <div className="settings_section" role="group" aria-labelledby="page-settings">
                <h4 id="page-settings">Page Settings</h4>
                <ul>
                    <li>
                        <label htmlFor="background-color-picker">Background Colour</label>
                        <input
                            id="background-color-picker"
                            type="color"
                            value={backgroundColour}
                            onChange={(e) => setBackgroundColour(e.target.value)}
                            aria-label="Background Colour Picker"
                        />
                    </li>
                    <li tabIndex={0}>{t("settings_dropdown.page_settings.grid_display")}</li>
                    <li tabIndex={0}>{t("settings_dropdown.page_settings.snap_to_grid")}</li>
                </ul>
            </div>
        </div>
    );
};

export default SettingsDropdown;
