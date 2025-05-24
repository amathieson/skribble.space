import React from "react";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_navbar.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import LeftArrow from '~icons/ph/arrow-left-bold';
import RightArrow from '~icons/ph/arrow-right-bold';
import { useDropdown } from "@ctx/Dropdown";
import SettingsMenu from "./SettingsMenu.jsx";

const Navbar = ({ penColor, setPenColor }) => {
    const { t } = useTranslation("common");
    const { toggleDropdown, isDropdownOpen } = useDropdown();

    const isOpen = isDropdownOpen("settingsMenu");

    return (
        <header>
            <div className="toolbar">
                <LeftArrow className="nav_icons"/>
                <h1>{t('title')}</h1>

                <div className="nav_icons_bar">
                    <div className="nav_icon_with_dropdown">
                        <SettingsDots
                            className="nav_icons"
                            onClick={() => toggleDropdown("settingsMenu")}
                        />
                        {isOpen && (
                            <div className="dropdown-container">
                                <SettingsMenu />
                            </div>
                        )}
                    </div>

                    <div className="nav_icons">
                        <input
                            type="color"
                            id="pencolor"
                            value={penColor}
                            onChange={e => setPenColor(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="toolbar_sub">
                <LeftArrow />
                <h3>PAGE 1</h3>
                <RightArrow />
            </div>
        </header>
    );
};

export default Navbar;
