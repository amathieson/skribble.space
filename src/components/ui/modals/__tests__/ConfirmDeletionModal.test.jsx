import { describe, test, expect, vi, beforeAll, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactDOM from 'react-dom';
import ConfirmDeletionModal from '@ui/modals/single_page/ConfirmDeletionModal.jsx';

/**
 * Mock i18n: return the key, but allow fallback defaultValue when provided.
 */
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, defaultValue) => defaultValue ?? key,
        i18n: { changeLanguage: vi.fn() },
    }),
}));

beforeAll(() => {
    vi.spyOn(ReactDOM, 'createPortal').mockImplementation((el) => el);
});

beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
});

const renderModal = (props = {}) => {
    const defaultProps = {
        isOpen: true,
        closeModal: vi.fn(),
        onConfirm: vi.fn(),
        ...props,
    };

    return render(<ConfirmDeletionModal {...defaultProps} />);
};

describe('ConfirmDeletionModal', () => {
    test('does not render anything when isOpen is false', () => {
        renderModal({ isOpen: false });

        expect(screen.queryByText('deletion_modal.title')).not.toBeInTheDocument();
        expect(screen.queryByText('deletion_modal.description')).not.toBeInTheDocument();
    });

    test('renders title, description, and confirm button when open', () => {
        renderModal({ isOpen: true });

        expect(screen.getByText('deletion_modal.title')).toBeInTheDocument();
        expect(screen.getByText('deletion_modal.description')).toBeInTheDocument();

        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    test('calls closeModal when clicking the backdrop', () => {
        const closeModal = vi.fn();
        renderModal({ closeModal });

        const backdrop = document.querySelector('.modal_backdrop');
        expect(backdrop).toBeInTheDocument();

        fireEvent.click(backdrop);
        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    test('calls closeModal when clicking the X button', () => {
        const closeModal = vi.fn();
        renderModal({ closeModal });

        const closeBtn = document.querySelector('.modal_close_btn');
        expect(closeBtn).toBeInTheDocument();

        fireEvent.click(closeBtn);
        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    test('calls closeModal when Escape is pressed', () => {
        const closeModal = vi.fn();
        renderModal({ closeModal });

        fireEvent.keyDown(document.body, { key: 'Escape' });
        expect(closeModal).toHaveBeenCalledTimes(1);
    });

    test('calls onConfirm when clicking the Delete button', () => {
        const onConfirm = vi.fn();
        const closeModal = vi.fn();
        renderModal({ onConfirm, closeModal });

        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(closeModal).not.toHaveBeenCalled();
    });
});