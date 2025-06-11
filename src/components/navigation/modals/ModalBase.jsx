import React from 'react';
import { useModal } from '@ctx/Modal';
import '@scss/navigation/modals/_modalBase.scss';
import Cross from '~icons/ph/x-bold';

const ModalBase = () => {
    const { isOpen, title, content, closeModal } = useModal();

    if (!isOpen) return null;

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

export default ModalBase;
