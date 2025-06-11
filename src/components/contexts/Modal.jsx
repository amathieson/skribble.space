import React, { createContext, useContext, useState, useCallback } from 'react';
import ModalBase from '@nav/modals/ModalBase';

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
