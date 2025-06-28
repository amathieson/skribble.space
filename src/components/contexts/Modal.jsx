
import React, { createContext, useContext, useState, useCallback } from 'react';
import '@scss/navigation/modals/_modalBase.scss';
import Cross from '~icons/ph/x-bold';

const Modal = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        content: null,
        title: ''
    });

    const openModal = useCallback((content, title = '') => {
        setModalState({ isOpen: true, content, title });
    }, []);

    const closeModal = useCallback(() => {
        setModalState({ isOpen: false, content: null });
    }, []);

    return (
        <Modal.Provider value={{ ...modalState, openModal, closeModal }}>
            {children}
            <ModalBase />
        </Modal.Provider>
    );
};

export const useModal = () => useContext(Modal);
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