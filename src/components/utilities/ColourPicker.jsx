import React, { useState, useEffect, useRef } from 'react';

/**
 * This is a colour picker
 * It staggers the input to prevent the app from being unperformant
 * @param label
 * @param value
 * @param onChange
 * @param debounceDelay
 * @param id
 * @returns {Element}
 * @constructor
 */
const ColourPicker = ({ label, value, onChange, debounceDelay = 20,id}) => {
    const [localValue, setLocalValue] = useState(value);
    const timeoutRef = useRef(null);

    // Keep local value in sync with parent
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const handleChange = (e) => {
        const newColor = e.target.value;
        setLocalValue(newColor);

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            onChange(newColor);
        }, debounceDelay);
    };

    return (
        <label className="modal_option colour_picker">
            <input
                type="color"
                value={localValue}
                onChange={handleChange}
                aria-label={label}
                id={id}
            />
        </label>
    );
};

export default ColourPicker;
