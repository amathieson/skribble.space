import React from "react";
import { useTranslation } from "react-i18next";
import '@scss/navigation/_navbar.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import LeftArrow from '~icons/ph/arrow-left-bold';
import RightArrow from '~icons/ph/arrow-right-bold';
import { useDropdown } from "@ctx/Dropdown";
import SettingsDropdown from "./dropdowns/SettingsDropdown.jsx";
import {Link} from "react-router-dom";
import ColourPicker from "@util/ColourPicker.jsx";


const Navbar = ({ penColor, setPenColor, backgroundColour, setBackgroundColour }) => {
    const { t } = useTranslation("common");
    const { toggleDropdown, isDropdownOpen } = useDropdown();

    const isOpen = isDropdownOpen("settingsMenu");

    return (
        <header>
            <div className="toolbar">
                <Link to="/home" className="nav_icons"><LeftArrow className="nav_icons"/></Link>
                <h1>{t('title')}</h1>

                <div className="nav_icons_bar">
                    <div className="nav_icon_with_dropdown">
                        <SettingsDots
                            className="nav_icons"
                            onClick={() => toggleDropdown("settingsMenu")}
                        />
                        {isOpen && (
                            <div className="dropdown-container">
                                <SettingsDropdown
                                    backgroundColour={backgroundColour}
                                    setBackgroundColour={setBackgroundColour}
                                />
                            </div>
                        )}
                    </div>

                    <div className="nav_icons">
                        <ColourPicker
                            value={penColor}
                            onChange={setPenColor}
                            id={"pencolor"}
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
