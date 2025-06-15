import React, {useEffect, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import '@scss/navigation/modals/_gridOverlayModal.scss';
import BrokeChain from '~icons/ph/link-simple-break-bold';
import LinkChain from '~icons/ph/link-simple-bold';
import { useGridOverlay } from '@ctx/GridOverlay.jsx';

const GridOverlayModal = () => {
    const { t } = useTranslation("common");
    
    //Props
    const { gridEnabled, setGridEnabled, setStrokeColour, setStrokeWidth, gridShape,setGridShape,lineStyle,setLineStyle} = useGridOverlay();

    // Mapped the translations for the style of line
    const styleOptions = [
        { value: "solid", label: t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.solid") },
        { value: "dashed", label: t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.dashed") },
        { value: "dotted", label: t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.dotted") },
    ];

    // Mapped the translations for the shape of line
    const shapeOptions = [
        { value: "circle", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.circle") },
        { value: "square", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.square") },
        { value: "triangle", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.triangle") },
        { value: "hexagon", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.hexagon") },
    ];

    
    function useDebouncedCallback(callback, delay) {
        const timeoutRef = useRef(null);

        /**
         * To stop the colour wheel from firing tons of changes and lagging
         * everything out, the below staggers it a bit so there's less lag
         * 
         * TODO: maybe there is a better way to do this
         * TODO: should be implemented for the other wheels too
         * @param args
         */
        const debouncedCallback = (...args) => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                callback(...args);
            }, delay);
        };

        useEffect(() => {
            return () => clearTimeout(timeoutRef.current);
        }, []);

        return debouncedCallback;
    }
    const debouncedSetStrokeColour = useDebouncedCallback((color) => {
        setStrokeColour(color);
    }, 100);
    
    return (
        <div className="grid_overlay_modal">
            <p className="modal_description">
                {t("settings_dropdown.page_settings.grid_overlay_modal.description")}
            </p>
            
            <div className="modal_options">
                <label className="modal_option">
                    <input type="checkbox" checked={gridEnabled} onChange={(e) => setGridEnabled(e.target.checked)}/>
                    <span>{t("settings_dropdown.page_settings.grid_overlay_modal.enable_grid")}</span>
                </label>
                <label className="modal_option">
                    <input type="checkbox" />
                    <span>{t("settings_dropdown.page_settings.grid_overlay_modal.snap_grid")}</span>
                </label>
               
                <label className="modal_option color_picker">
                    <input type="color" onChange={(e) => debouncedSetStrokeColour(e.target.value)}/>
                    <span>{t("settings_dropdown.page_settings.grid_overlay_modal.line_colour")}</span>
                </label>
            </div>

            <div className="modal_options">

                <label className="modal_option">
                    <span>{t("settings_dropdown.page_settings.grid_overlay_modal.line_width")}</span>
                    <input type="number" id="lineWidth" min={0} defaultValue="1" onChange={(e) => setStrokeWidth(e.target.value)}/>
                </label>
                
                <label className="modal_option" htmlFor="styleOfLine">
                    {t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.title")}
                <select id="styleOfLine" name="styleOfLine" value={lineStyle} onChange={(e) => setLineStyle(e.target.value)}>
                    {styleOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                </label>

                <label className="modal_option" htmlFor="gridShape">
                    {t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.title")}
                <select id="gridShape" name="gridShape" value={gridShape}
                        onChange={(e) => setGridShape(e.target.value)}>
                    {shapeOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                </label>
            </div>

            <div className="size_of_grid">
                <div className="input-group">
                    <label htmlFor="xSize">{t("settings_dropdown.page_settings.grid_overlay_modal.size_of_grid.x")}</label>
                    <input type="number" id="xSize" name="xbox" />
                </div>

                <div className="icon-wrapper">
                    <LinkChain />
                </div>

                <div className="input-group">
                    <label htmlFor="ySize">{t("settings_dropdown.page_settings.grid_overlay_modal.size_of_grid.y")}</label>
                    <input type="number" id="ySize" name="ySize" />
                </div>
            </div>
        </div>
    );
};

export default GridOverlayModal;
