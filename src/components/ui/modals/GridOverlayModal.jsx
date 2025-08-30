import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
        <div className="grid_overlay_modal">
            <p className="modal_description">
                {t("settings_dropdown.page_settings.grid_overlay_modal.description")}
            </p>

            <section className="modal_section">
                <h3>{t("settings_dropdown.page_settings.grid_overlay_modal.basic_settings")}</h3>
                <div className="basic_controls">
                    <label className="modal_option">
                        <input
                            type="checkbox"
                            checked={gridEnabled}
                            onChange={(e) => setGridEnabled(e.target.checked)}
                        />
                        <span>{t("settings_dropdown.page_settings.grid_overlay_modal.enable_grid")}</span>
                    </label>
                    <label className="modal_option">
                        <input type="checkbox" />
                        <span>{t("settings_dropdown.page_settings.grid_overlay_modal.snap_grid")}</span>
                    </label>
                    <div className="modal_option">
                        <ColourPicker
                            label={t("settings_dropdown.page_settings.grid_overlay_modal.line_colour")}
                            value={strokeColour}
                            onChange={setStrokeColour}
                        />
                    </div>
                </div>
            </section>

            <section className="modal_section">
                <h3>{t("settings_dropdown.page_settings.grid_overlay_modal.appearance")}</h3>
                <div className="appearance_controls">
                    <div className="control_group">
                        <label>
                            <span>{t("settings_dropdown.page_settings.grid_overlay_modal.line_width")}</span>
                            <input
                                type="number"
                                min={0}
                                value={strokeWidth || 1}
                                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                            />
                        </label>
                    </div>

                    <div className="control_group">
                        <label htmlFor="styleOfLine">
                            {t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.title")}
                            <select
                                id="styleOfLine"
                                value={lineStyle}
                                onChange={(e) => setLineStyle(e.target.value)}
                            >
                                {styleOptions.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="control_group">
                        <label htmlFor="gridShape">
                            {t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.title")}
                            <select
                                id="gridShape"
                                value={gridShape}
                                onChange={(e) => setGridShape(e.target.value)}
                            >
                                {shapeOptions.map(({ value, label }) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </section>

            <section className="modal_section">
                <h3>{t("settings_dropdown.page_settings.grid_overlay_modal.size_of_grid.title")}</h3>
                <div className="size_of_grid">
                    <div className="input_group">
                        <label htmlFor="xSize">
                            {t("settings_dropdown.page_settings.grid_overlay_modal.size_of_grid.x")}
                        </label>
                        <input
                            type="number"
                            id="xSize"
                            value={gridSizeX}
                            onChange={handleXChange}
                        />
                    </div>

                    <button
                        className="link_button"
                        onClick={() => setLinked(!linked)}
                        type="button"
                    >
                        {linked ? <LinkChain /> : <BrokeChain />}
                    </button>

                    <div className="input_group">
                        <label htmlFor="ySize">
                            {t("settings_dropdown.page_settings.grid_overlay_modal.size_of_grid.y")}
                        </label>
                        <input
                            type="number"
                            id="ySize"
                            value={gridSizeY}
                            onChange={handleYChange}
                        />
                    </div>
                </div>
            </section>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            title={t("settings_dropdown.page_settings.grid_overlay_modal.title")}
            content={modalContent}
            closeModal={closeModal}
        />
    );
};

export default GridOverlayModal;