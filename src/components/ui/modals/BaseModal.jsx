import React, { useEffect } from 'react';
import Cross from '~icons/ph/x-bold';
import '@scss/ui/modals/_baseModal.scss';

/**
 * This is the base modal used for all other modals.
 * It is used to create a modal that can be closed by clicking on the backdrop or pressing the escape key.
 * @param props
 * @returns {React.JSX.Element}
 */
export const BaseModal = (props) => {
    const {isOpen, title, content, closeModal} = props;

    // Makes you able to escape out of the modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                if (closeModal) {
                    closeModal();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeModal]);
    


    if (!isOpen) return null;
    
    //Html Base Skeleton for BaseModal
    return (
        <div className="modal_backdrop" onClick={closeModal}>
            <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                <div className="modal_header">
                    <h2 className="modal_title">{title}</h2>
                    <button onClick={closeModal} className="modal_close_btn">
                        <Cross />
                    </button>
                </div>
                <div className="modal_body">
                    {content}
                </div>
            </div>
        </div>
    );
};
