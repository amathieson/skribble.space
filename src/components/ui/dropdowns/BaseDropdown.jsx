import React, {useEffect, useRef} from 'react';
import '@scss/ui/dropdowns/_baseDropdown.scss';

/**
 * This is the base dropdown used for all other modals.
 * It is used to create a dropdown that can be closed by clicking on the backdrop or pressing the escape key.
 * @param props
 * @param - unfurlDirection is used to control what directions animations will go in
 * @returns {React.JSX.Element}
 */
export const BaseDropdown = ({ isOpen, content, closeDropdown,unfurlDirection }) => {
    const dropdownRef = useRef(null);

    /**
     * If the dropdown is clicked outside of, or escape is pressed, close the dropdown
     */
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isOpen && e.key === 'Escape') {
                closeDropdown?.();
            }
        };

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                closeDropdown?.();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, closeDropdown]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className={`base_dropdown ${isOpen ? "open" : ""} unfurl-${unfurlDirection}`}>

        {content}
        </div>
    );
};

export default BaseDropdown;
