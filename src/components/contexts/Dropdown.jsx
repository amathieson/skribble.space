import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const Dropdown = createContext();

export const useDropdown = () => useContext(Dropdown);

/**
 * This provides the basic behaviour for dropdown menus
 * @param children
 * @returns {Element}
 * @constructor
 */
export const DropdownProvider = ({ children }) => {
    const [openDropdowns, setOpenDropdowns] = useState({});
    const dropdownRefs = useRef({});

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

    const handleOutsideClick = (event) => {
        Object.keys(dropdownRefs.current).forEach((key) => {
            if (dropdownRefs.current[key].current && !dropdownRefs.current[key].current.contains(event.target)) {
                closeDropdown(key);
            }
        });
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const registerDropdownRef = (key, ref) => {
        dropdownRefs.current[key] = ref;
    };

    const unregisterDropdownRef = (key) => {
        delete dropdownRefs.current[key];
    };

    return (
        <Dropdown.Provider
            value={{
                isDropdownOpen,
                toggleDropdown,
                closeDropdown,
                closeAllDropdowns,
                registerDropdownRef,
                unregisterDropdownRef,
            }}
        >
            {children}
        </Dropdown.Provider>
    );
};
