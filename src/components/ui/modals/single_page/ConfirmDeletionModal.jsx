import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactDOM from 'react-dom';
import { BaseModal } from './BaseModal.jsx'; 

/**
 * A simple modal to confirm a destructive action.
 * @param {boolean} isOpen
 * @param {function} closeModal - Function to call when closing without confirming.
 * @param {function} onConfirm - Function to call when the user confirms the action.
 * @param {string} mindmapName - The name of the item being deleted.
 * @returns {React.ReactPortal}
 */
const ConfirmDeletionModal = ({ isOpen, closeModal, onConfirm }) => {
    const { t } = useTranslation("common");

    const modalContent = (
        <BaseModal
            isOpen={isOpen}
            title={t("deletion_modal.title")}
            closeModal={closeModal}
            onSubmit={onConfirm}
            submitLabel={t("deletion_modal.confirm_button_label", "Delete")} 
            content={
                <div>
                    <p className="modal_description">
                        {t("deletion_modal.description")}
                    </p>
                </div>
            }
        />
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById('root')
    );
};

export default ConfirmDeletionModal;