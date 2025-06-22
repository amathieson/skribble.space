import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import '@scss/navigation/modals/_gridOverlayModal.scss';
import BrokeChain from '~icons/ph/link-simple-break-bold';
import LinkChain from '~icons/ph/link-simple-bold';
import { useGridOverlay } from '@ctx/GridOverlay.jsx';
import ColourPicker from '@util/ColourPicker.jsx';

const GridOverlayModal = () => {
    const { t } = useTranslation("common");
    
    //Props
    const {
        gridEnabled, setGridEnabled,
        strokeColour, setStrokeColour, 
        setStrokeWidth,
        gridShape, setGridShape,
        lineStyle, setLineStyle,
        gridSizeX, setGridSizeX,
        gridSizeY, setGridSizeY
    } = useGridOverlay();
    
    // Linked - True -> Values increment in a synchronised way, 
    // Linked - False -> Values increment independently of one another 
    const [linked, setLinked] = useState(false);

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
    
    
    const toggleLink = () => setLinked(prev => !prev);
    
    /**
     * Event handler function for handling changes to the X-axis grid size.
     *
     * This function processes an event, extracts the target value,
     * and adjusts the grid size for the X-axis. If the `linked` variable
     * is `true`, it synchronises the Y-axis grid size by applying the
     * difference (`delta`) between the new and previous X-axis grid sizes.
     *
     * @param {Event} e - The event object containing the new value for the X-axis grid size.
     */
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

    /**
     * Event handler function for handling changes to the Y-axis grid size.
     *
     * This function processes an event, extracts the target value,
     * and adjusts the grid size for the Y-axis. If the `linked` variable
     * is `true`, it synchronises the X-axis grid size by applying the
     * difference (`delta`) between the new and previous Y-axis grid sizes.
     *
     * @param {Event} e - The event object containing the new value for the Y-axis grid size.
     */
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
                <label className="modal_option">
                    <ColourPicker
                        label={t("settings_dropdown.page_settings.grid_overlay_modal.line_colour")}
                        value={strokeColour}
                        onChange={setStrokeColour}
                    />
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
                    <label htmlFor="xSize">
                        {t("settings_dropdown.page_settings.grid_overlay_modal.size_of_grid.x")}
                    </label>
                    <input
                        type="number"
                        id="xSize"
                        name="xbox"
                        value={gridSizeX}
                        onChange={handleXChange}
                    />
                </div>

                <div className="icon-wrapper" onClick={toggleLink}>
                    {linked ? <LinkChain /> : <BrokeChain />}
                </div>

                <div className="input-group">
                    <label htmlFor="ySize">
                        {t("settings_dropdown.page_settings.grid_overlay_modal.size_of_grid.y")}
                    </label>
                    <input
                        type="number"
                        id="ySize"
                        name="ySize"
                        value={gridSizeY}
                        onChange={handleYChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default GridOverlayModal;
