import {vi} from "vitest";
import {fireEvent, render} from "@testing-library/react";
import {BaseModal} from "@ui/modals/single_page/BaseModal.jsx";
import ReactDOM from "react-dom";
import '@testing-library/jest-dom';

/**
 * Mocks react-i18next to return a function that always returns the key passed in
 */
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: { changeLanguage: vi.fn() },
    }),
}));

/**
 * Mocks ReactDOM.createPortal to return the element passed in.
 */
beforeAll(() => {
    vi.spyOn(ReactDOM, 'createPortal').mockImplementation((el) => el);
});

/**
 * Renders the BaseModal component with the given props.
 */
const renderModal = (props = {}) => {
    const defaultProps = {
        isOpen: false,
        title: 'Test Modal',
        closeModal: vi.fn(),
        children: <div>Test modal content</div>,
        ...props
    };

    return render(<BaseModal {...defaultProps} />);
};

describe('BaseModal', () => {
    describe('Modal Rendering Behaviour', () => {
        test('renders modal when isOpen is true', () => {
            renderModal({ isOpen: true, closeModal: vi.fn() });
            const modal_backdrop = document.querySelector('.modal_backdrop');
            const modal_container = modal_backdrop.querySelector('.modal_content');

            expect(modal_backdrop).toBeInTheDocument();
            expect(modal_container).toBeInTheDocument();
        });

        test('does not render modal when isOpen is false', () => {
            renderModal({ isOpen: false});
            const modal_backdrop = document.querySelector('.modal_backdrop');
            expect(modal_backdrop).not.toBeInTheDocument();
        });

        test('calls closeModal when backdrop is clicked', () => {
            const closeModal = vi.fn();
            renderModal({ isOpen: true, closeModal });
            const modal_backdrop = document.querySelector('.modal_backdrop');
            fireEvent.click(modal_backdrop);
            expect(closeModal).toHaveBeenCalled();
        })

        test('calls closeModal when escape key is pressed', () => {
            const closeModal = vi.fn();
            renderModal({ isOpen: true, closeModal });
            fireEvent.keyDown(document.body, { key: 'Escape' });
            expect(closeModal).toHaveBeenCalled();
        })

        test('expects modal to close when x icon is clicked', () => {
            const closeModal = vi.fn();
            renderModal({ isOpen: true, closeModal });
            const close_btn = document.querySelector('.modal_close_btn');
            fireEvent.click(close_btn);
            expect(closeModal).toHaveBeenCalled();
        })
    })
});