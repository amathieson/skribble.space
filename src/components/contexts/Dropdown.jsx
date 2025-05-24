import React, { createContext, useContext, useState } from "react";

const Dropdown = createContext();

export const useDropdown = () => useContext(Dropdown);

export const DropdownProvider = ({ children }) => {
    const [openDropdowns, setOpenDropdowns] = useState({});

    const toggleDropdown = (key) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const isDropdownOpen = (key) => !!openDropdowns[key];

    const closeDropdown = (key) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [key]: false,
        }));
    };

    const closeAllDropdowns = () => setOpenDropdowns({});

    return (
        <Dropdown.Provider
            value={{ isDropdownOpen, toggleDropdown, closeDropdown, closeAllDropdowns }}
        >
            {children}
        </Dropdown.Provider>
    );
};
