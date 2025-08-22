import React, {useState} from 'react';
import '@scss/navigation/navbars/_navbarMindmap.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import LeftArrow from '~icons/ph/arrow-left-bold';
import RightArrow from '~icons/ph/arrow-right-bold';
import SettingsDropdown from '@ui/dropdowns/SettingsDropdown.jsx';
import {Link} from 'react-router-dom';
import ColourPicker from '@util/ColourPicker.jsx';
import { useColourSettings } from '@ctx/MindmapDrawingContext.jsx';
import { useAppContext } from '@ctx/AppContext.jsx';
import {useTranslation} from 'react-i18next';


const NavbarMindmap = () => {
    const { penColor, setPenColor, backgroundColour, setBackgroundColour } = useColourSettings();
    const { currentMindmap } = useAppContext();
    const { t } = useTranslation("common");

    // Dropdown States. Etc
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const closeDropdown = () => setDropdownOpen(false);
    const toggleDropdown = () => setDropdownOpen(prev => !prev);

    return (
        <header>
            <div className="toolbar">
                <Link to="/" className="nav_icons"><LeftArrow className="nav_icons" /></Link>
                <h1>{currentMindmap?.name || t("title")}</h1>
                <div className="nav_icons_bar">
                    <div className="nav_icons">
                        <ColourPicker
                            value={penColor}
                            onChange={setPenColor}
                            id={"pencolor"}
                        />
                    </div>
                    <div className="nav_icon_with_dropdown">
                        <SettingsDots
                            className="nav_icons"
                            onClick={toggleDropdown}
                        />
                            <div className="dropdown_container">
                                <SettingsDropdown
                                    backgroundColour={backgroundColour}
                                    setBackgroundColour={setBackgroundColour}
                                    isOpen={dropdownOpen}
                                    closeDropdown={closeDropdown}
                                />
                            </div>
                    </div>
                </div>
            </div>

            <div className="toolbar_sub">
                <LeftArrow id={"leftarrow"} />
                <h3>PAGE 1</h3>
                <RightArrow id={"rightarrow"} />
            </div>
        </header>
    );
};

export default NavbarMindmap;
