import React from "react";
import { useDropdown } from "@ctx/Dropdown.jsx";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_settingsDropdown.scss';

const SettingsDropdown = () => {
    const { isDropdownOpen } = useDropdown();
    const { t } = useTranslation("common");

    if (!isDropdownOpen("settingsMenu")) return null;

    return (
        <div className="settings_dropdown" role="menu" aria-label={t("Settings")}>
            <h3 className="dropdown_title">{t("settings_dropdown.title")}</h3>

            <div className="settings_section" role="group" aria-labelledby="page-settings">
                <h4 id="page-settings">{t("settings_dropdown.page_settings.title")}</h4>
                <ul>
                    <li tabIndex={0}>{t("settings_dropdown.page_settings.background_colour")}</li>
                    <li tabIndex={0}>{t("settings_dropdown.page_settings.grid_display")}</li>
                    <li tabIndex={0}>{t("settings_dropdown.page_settings.snap_to_grid")}</li>
                </ul>
            </div>

            {/*for future expansion, rough skeleton*/}
            {/*<div className="settings_section" role="group" aria-labelledby="page-settings">*/}
            {/*    <h4 id="page-settings">{t("settings_dropdown.page_settings.title")}</h4>*/}
            {/*    <ul>*/}
            {/*        <li tabIndex={0}>{t("settings_dropdown.page_settings.background_colour")}</li>*/}
            {/*        <li tabIndex={0}>{t("settings_dropdown.page_settings.grid_display")}</li>*/}
            {/*        <li tabIndex={0}>{t("settings_dropdown.page_settings.snap_to_grid")}</li>*/}
            {/*    </ul>*/}
            {/*</div>*/}
        </div>
    );
};

export default SettingsDropdown;
