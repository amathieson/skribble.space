import React from 'react';
import { useTranslation } from 'react-i18next';
import '@scss/navigation/modals/_gridOverlayModal.scss';
import BrokeChain from '~icons/ph/link-simple-break-bold';
import LinkChain from '~icons/ph/link-simple-bold';

const GridOverlayModal = () => {
    const { t } = useTranslation("common");

    // Mapped the translations for the style of line
    const styleOptions = [
        { value: "solid", label: t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.solid") },
        { value: "dashed", label: t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.dashed") },
        { value: "dotted", label: t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.dotted") },
    ];

    // Mapped the translations for the shape of line
    const shapeOptions = [
        { value: "solid", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.circle") },
        { value: "dashed", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.square") },
        { value: "dotted", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.triangle") },
    ];
    
    return (
        <div className="grid_overlay_modal">
            <p className="modal_description">
                {t("settings_dropdown.page_settings.grid_overlay_modal.description")}
            </p>
            
            <div className="modal_options">
                <label className="modal_option">
                    <input type="checkbox"/>
                    <span>{t("settings_dropdown.page_settings.grid_overlay_modal.enable_grid")}</span>
                </label>
                <label className="modal_option">
                    <input type="checkbox" />
                    <span>{t("settings_dropdown.page_settings.grid_overlay_modal.snap_grid")}</span>
                </label>
               
                <label className="modal_option color_picker">
                    <input type="color" />
                    <span>{t("settings_dropdown.page_settings.grid_overlay_modal.line_colour")}</span>
                </label>
            </div>

            <div className="modal_options">
                <label className="modal_option" htmlFor="styleOfLine">
                    {t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.title")}
                <select id="styleOfLine" name="styleOfLine">
                    {styleOptions.map(({ value, label }) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
                </label>

                <label className="modal_option" htmlFor="gridShape">
                    {t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.title")}
                <select id="gridShape" name="gridShape">
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
                    <label htmlFor="xSize">X Size</label>
                    <input type="number" id="xSize" name="xbox" />
                </div>

                <div className="icon-wrapper">
                    <LinkChain />
                </div>

                <div className="input-group">
                    <label htmlFor="ySize">Y Size</label>
                    <input type="number" id="ySize" name="ySize" />
                </div>
            </div>
        </div>
    );
};

export default GridOverlayModal;
