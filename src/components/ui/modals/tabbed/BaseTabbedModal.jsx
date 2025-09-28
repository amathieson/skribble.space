import React, { useEffect, useState } from "react";
import Cross from "~icons/ph/x-bold";
import "@scss/ui/modals/_baseModal.scss";

/**
 * A reusable modal with tabbed navigation.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {string} props.title - Modal title.
 * @param {Array<{id: string, label: string, content: React.ReactNode}>} props.tabs - Tabs with id, label, and content.
 * @param {string} [props.defaultTab] - Which tab is active initially (defaults to first).
 * @param {function} props.closeModal - Function to close modal.
 * @param {function} [props.onSubmit] - Optional submit handler (if modal has a form).
 * @param {string} [props.submitLabel] - Text for submit button (optional).
 */
export const BaseTabbedModal = ({
                                    isOpen,
                                    title,
                                    tabs,
                                    defaultTab,
                                    closeModal,
                                    onSubmit,
                                    submitLabel
                                }) => {
    const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.id ?? ""));

    // Reset active tab when modal reopens
    useEffect(() => {
        if (isOpen) setActiveTab(defaultTab || (tabs[0]?.id ?? ""));
    }, [isOpen, defaultTab, tabs]);

    // Escape key support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                closeModal?.();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    return (
        <div className="modal_backdrop" onClick={closeModal}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal_header">
                    <h2 className="modal_title">{title}</h2>
                    <button onClick={closeModal} className="modal_close_btn">
                        <Cross />
                    </button>
                </div>

                {/* Tab navigation */}
                <div className="modal_tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`tab_button ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="modal_body">
                    {tabs.find((tab) => tab.id === activeTab)?.content}
                </div>

                {/* Footer (optional submit) */}
                {onSubmit && (
                    <div className="modal_footer">
                        <button
                            type="button"
                            className="submit_button"
                            onClick={onSubmit}
                        >
                            {submitLabel || "Submit"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
