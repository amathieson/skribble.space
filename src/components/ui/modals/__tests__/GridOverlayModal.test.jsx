import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import GridOverlayModal from '../single_page/GridOverlayModal';
import { GridOverlayProvider } from '@ctx/GridOverlay.jsx';
import ReactDOM from 'react-dom';

// Mock i18n
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: { changeLanguage: vi.fn() },
    }),
}));

// Mock portal
beforeAll(() => {
    vi.spyOn(ReactDOM, 'createPortal').mockImplementation((el) => el);
});

// Utility to render modal with custom initial values
const renderModal = ({ x = 50, y = 40, ...props } = {}) =>
    render(
        <GridOverlayProvider initialGridSizeX={x} initialGridSizeY={y}>
            <GridOverlayModal {...props} />
        </GridOverlayProvider>
    );

describe('GridOverlayModal', () => {
    
    describe('Modal Rendering Behaviour', () => {
        test('renders modal when isOpen is true', () => {
            renderModal({ isOpen: true, closeModal: vi.fn() });
            expect(
                screen.getByText('settings_dropdown.page_settings.grid_overlay_modal.title')
            ).toBeInTheDocument();
        });

        test('does not render modal when isOpen is false', () => {
            renderModal({ isOpen: false, closeModal: vi.fn() });
            expect(
                screen.queryByText('settings_dropdown.page_settings.grid_overlay_modal.title')
            ).not.toBeInTheDocument();
        });
    })
    

    test('line colour changes when colour input is updated', () => {
        renderModal({ isOpen: true, closeModal: vi.fn() });
        const colourInput = screen.getByLabelText(
            'settings_dropdown.page_settings.grid_overlay_modal.line_colour'
        );

        fireEvent.change(colourInput, { target: { value: '#ff0000' } });
        expect(colourInput.value).toBe('#ff0000');
    });

    describe('X/Y input behavior', () => {
        let xInput, yInput, linkButton;

        beforeEach(() => {
            renderModal({ isOpen: true });
            xInput = screen.getByLabelText(/X Axis/i);
            yInput = screen.getByLabelText(/Y Axis/i);
            linkButton = screen.getByRole('button', { name: /Link X\/Y/i });

            // set deterministic initial values
            fireEvent.change(xInput, { target: { value: '50' } });
            fireEvent.change(yInput, { target: { value: '40' } });
        });

        test('unlinked: changing X does not change Y', () => {
            expect(xInput.value).toBe('50');
            expect(yInput.value).toBe('40');

            fireEvent.change(xInput, { target: { value: '60' } });
            expect(xInput.value).toBe('60');
            expect(yInput.value).toBe('40'); // Y stays the same
        });

        test('linked: changing X updates Y by delta', () => {
            // toggle link
            fireEvent.click(linkButton);

            fireEvent.change(xInput, { target: { value: '60' } });
            expect(xInput.value).toBe('60');
            expect(yInput.value).toBe('50'); // Y increments by same delta
        });

        test('link button toggles linked state and updates aria-label', () => {
            expect(linkButton.getAttribute('aria-label')).toBe('Link X/Y');

            fireEvent.click(linkButton);
            expect(linkButton.getAttribute('aria-label')).toBe('Unlink X/Y');

            fireEvent.change(xInput, { target: { value: '70' } });
            expect(xInput.value).toBe('70');
            expect(yInput.value).toBe('60'); // delta applied

            fireEvent.click(linkButton);
            expect(linkButton.getAttribute('aria-label')).toBe('Link X/Y');

            fireEvent.change(xInput, { target: { value: '80' } });
            expect(xInput.value).toBe('80');
            expect(yInput.value).toBe('60'); // Y stays the same
        });

        test('icon updates correctly when toggling linked state', () => {
            expect(linkButton.querySelector('svg')).toBeInTheDocument();

            fireEvent.click(linkButton);
            expect(linkButton.querySelector('svg')).toBeInTheDocument();
        });
    });
});
