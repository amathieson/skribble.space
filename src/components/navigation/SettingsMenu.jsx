import React from "react";
import { useDropdown } from "@ctx/Dropdown.jsx";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_settingsMenu.scss';


const SettingsMenu = () => {
    const { isDropdownOpen } = useDropdown();
    const { t } = useTranslation("common");

    if (!isDropdownOpen("settingsMenu")) return null;

    return (
        <div className="dropdown_menu">
            <p>{t("page.lol")}</p>
        </div>
    );
};

export default SettingsMenu;
