import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDOM from 'react-dom';
import '@scss/ui/modals/_gridOverlayModal.scss';
import BrokeChain from '~icons/ph/link-simple-break-bold';
import LinkChain from '~icons/ph/link-simple-bold';
import { useGridOverlay } from '@ctx/GridOverlay.jsx';
import ColourPicker from '@util/ColourPicker.jsx';
import { BaseModal } from './BaseModal.jsx';

const GridOverlayModal = ({ isOpen, closeModal }) => {
    const { t } = useTranslation("common");
    const {
        gridEnabled, setGridEnabled,
        strokeColour, setStrokeColour,
        strokeWidth, setStrokeWidth,
        gridShape, setGridShape,
        lineStyle, setLineStyle,
        gridSizeX, setGridSizeX,
        gridSizeY, setGridSizeY
    } = useGridOverlay();

    const [linked, setLinked] = useState(false);

    const styleOptions = [
        { value: "solid", label: t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.solid") },
        { value: "dashed", label: t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.dashed") },
        { value: "dotted", label: t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.dotted") },
    ];

    const shapeOptions = [
        { value: "square", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.square") },
        { value: "circle", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.circle") },
        { value: "triangle", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.triangle") },
        { value: "hexagon", label: t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.hexagon") },
    ];

    const handleXChange = (e) => {
        const newX = Number(e.target.value);
        if (linked) {
            const delta = newX - gridSizeX;
            setGridSizeX(newX);
            setGridSizeY(gridSizeY + delta);
        } else {
            setGridSizeX(newX);
        }
    };

    const handleYChange = (e) => {
        const newY = Number(e.target.value);
        if (linked) {
            const delta = newY - gridSizeY;
            setGridSizeY(newY);
            setGridSizeX(gridSizeX + delta);
        } else {
            setGridSizeY(newY);
        }
    };

    const modalContent = (
        <BaseModal
            isOpen={isOpen}
            title={t("settings_dropdown.page_settings.grid_overlay_modal.title")}
            content={
            <div className="grid_overlay_modal">
                <p className="modal_description">
                    {t("settings_dropdown.page_settings.grid_overlay_modal.description")}
                </p>

                <section className="modal_section">
                    <h3>{t("settings_dropdown.page_settings.grid_overlay_modal.basic_settings")}</h3>
                    <div className="basic_controls">
                        <label htmlFor="enable-grid">
                            <input
                                id="enable-grid"
                                type="checkbox"
                                checked={gridEnabled}
                                onChange={(e) => setGridEnabled(e.target.checked)}
                            />
                            <span>{t("settings_dropdown.page_settings.grid_overlay_modal.enable_grid")}</span>
                        </label>

                        <label htmlFor="snap-grid">
                            <input id="snap-grid" type="checkbox" />
                            <span>{t("settings_dropdown.page_settings.grid_overlay_modal.snap_grid")}</span>
                        </label>

                        <ColourPicker
                            label={t("settings_dropdown.page_settings.grid_overlay_modal.line_colour")}
                            value={strokeColour}
                            onChange={setStrokeColour}
                            id="line-colour"
                        />
                    </div>
                </section>

                <section className="modal_section">
                    <h3>{t("settings_dropdown.page_settings.grid_overlay_modal.appearance")}</h3>
                    <div className="appearance_controls">
                        <label htmlFor="line-width" className="control_group">
                            <span>{t("settings_dropdown.page_settings.grid_overlay_modal.line_width")}</span>
                            <input
                                id="line-width"
                                type="number"
                                min={0}
                                value={strokeWidth || 1}
                                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                            />
                        </label>

                        <label htmlFor="line-style" className="control_group">
                            <span>{t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.title")}</span>
                            <select
                                id="line-style"
                                value={lineStyle}
                                onChange={(e) => setLineStyle(e.target.value)}
                            >
                                {styleOptions.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </label>

                        <label htmlFor="grid-shape" className="control_group">
                            <span>{t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.title")}</span>
                            <select
                                id="grid-shape"
                                value={gridShape}
                                onChange={(e) => setGridShape(e.target.value)}
                            >
                                {shapeOptions.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </section>

                <section className="modal_section">
                    <h3>{t("settings_dropdown.page_settings.grid_overlay_modal.size_of_grid.title")}</h3>
                    <div className="size_of_grid">
                        <div className="input_wrapper">
                            <label htmlFor="grid-size-x">X Axis:</label>
                            <input
                                id="grid-size-x"
                                type="number"
                                value={gridSizeX}
                                onChange={handleXChange}
                            />
                        </div>

                        <button
                            className="link_button"
                            aria-label={linked ? "Unlink X/Y" : "Link X/Y"}
                            onClick={() => setLinked(!linked)}
                        >
                            {linked ? <LinkChain /> : <BrokeChain />}
                        </button>

                        <div className="input_wrapper">
                            <label htmlFor="grid-size-y">Y Axis:</label>
                            <input
                                id="grid-size-y"
                                type="number"
                                value={gridSizeY}
                                onChange={handleYChange}
                            />
                        </div>
                    </div>
                </section>
            </div>
        }
            closeModal={closeModal}
        />
    );


    return ReactDOM.createPortal(
        modalContent,
        document.getElementById('root')
    );
};

export default GridOverlayModal;