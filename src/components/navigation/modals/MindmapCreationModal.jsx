import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
// import '@scss/navigation/modals/_gridOverlayModal.scss';


const MindmapCreationModal = () => {
    const { t } = useTranslation("common");
    
    return (
        <div className="mindmap_create_modal">
            <p className="modal_description">
                {t("settings_dropdown.page_settings.grid_overlay_modal.description")}
            </p>

            {/*<div className="modal_options">*/}
            {/*    <label className="modal_option">*/}
            {/*        <input type="checkbox" checked={gridEnabled} onChange={(e) => setGridEnabled(e.target.checked)}/>*/}
            {/*        <span>{t("settings_dropdown.page_settings.grid_overlay_modal.enable_grid")}</span>*/}
            {/*    </label>*/}
            {/*    <label className="modal_option">*/}
            {/*        <input type="checkbox" />*/}
            {/*        <span>{t("settings_dropdown.page_settings.grid_overlay_modal.snap_grid")}</span>*/}
            {/*    </label>*/}
            {/*    <label className="modal_option">*/}
            {/*        <ColourPicker*/}
            {/*            label={t("settings_dropdown.page_settings.grid_overlay_modal.line_colour")}*/}
            {/*            value={strokeColour}*/}
            {/*            onChange={setStrokeColour}*/}
            {/*        />*/}
            {/*        <span>{t("settings_dropdown.page_settings.grid_overlay_modal.line_colour")}</span>*/}
            {/*    </label>*/}
            {/*</div>*/}
            
            {/*<div className="modal_options">*/}
            
            {/*    <label className="modal_option">*/}
            {/*        <span>{t("settings_dropdown.page_settings.grid_overlay_modal.line_width")}</span>*/}
            {/*        <input type="number" id="line_width" min={0} defaultValue="1" onChange={(e) => setStrokeWidth(e.target.value)}/>*/}
            {/*    </label>*/}
            
            {/*    <label className="modal_option" htmlFor="styleOfLine">*/}
            {/*        {t("settings_dropdown.page_settings.grid_overlay_modal.style_of_line.title")}*/}
            {/*        <select id="styleOfLine" name="styleOfLine" value={lineStyle} onChange={(e) => setLineStyle(e.target.value)}>*/}
            {/*            {styleOptions.map(({ value, label }) => (*/}
            {/*                <option key={value} value={value}>*/}
            {/*                    {label}*/}
            {/*                </option>*/}
            {/*            ))}*/}
            {/*        </select>*/}
            {/*    </label>*/}
            
            {/*    <label className="modal_option" htmlFor="gridShape">*/}
            {/*        {t("settings_dropdown.page_settings.grid_overlay_modal.grid_shape.title")}*/}
            {/*        <select id="gridShape" name="gridShape" value={gridShape}*/}
            {/*                onChange={(e) => setGridShape(e.target.value)}>*/}
            {/*            {shapeOptions.map(({ value, label }) => (*/}
            {/*                <option key={value} value={value}>*/}
            {/*                    {label}*/}
            {/*                </option>*/}
            {/*            ))}*/}
            {/*        </select>*/}
            {/*    </label>*/}
            {/*</div>*/}
            
        </div>
    );
};

export default MindmapCreationModal;
