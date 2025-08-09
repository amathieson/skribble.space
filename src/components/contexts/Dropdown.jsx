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

    const closeDropdown = React.useCallback((key) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [key]: false,
        }));
    }, []);

    const closeAllDropdowns = () => setOpenDropdowns({});
    
    //TODO fix!!!
    useEffect(() => {
        const handleOutsideClick = (event) => {
            Object.keys(dropdownRefs.current).forEach((key) => {
                if (
                    dropdownRefs.current[key].current &&
                    !dropdownRefs.current[key].current.contains(event.target)
                ) {
                    closeDropdown(key);
                }
            });
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [closeDropdown]);

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
