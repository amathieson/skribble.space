import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import GridOverlayModal from '../single_page/GridOverlayModal';
import GridOverlay, { GridOverlayProvider, useGridOverlay } from '@ctx/GridOverlay.jsx';
import ReactDOM from 'react-dom';
import {pwaAssetsHead} from "virtual:pwa-assets/head";

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

    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

/**
 * Renders the GridOverlayModal component with the given props.
 * @param x
 * @param y
 * @param props
 */
const renderModal = ({ x = 50, y = 40, ...props } = {}) => {
    const svgRef = { current: document.createElement('div') };
    const TestWrapper = () => {
        const { gridEnabled } = useGridOverlay();
        return (
            <>
                <svg 
                    id="canvas_grid_overlay" 
                    style={{ visibility: gridEnabled ? 'visible' : 'hidden' }}
                >
                    <GridOverlay svgRef={svgRef} />
                </svg>
                <GridOverlayModal {...props} />
            </>
        );
    };

    return render(
        <GridOverlayProvider initialGridSizeX={x} initialGridSizeY={y}>
            <TestWrapper />
        </GridOverlayProvider>
    );
};

describe('GridOverlayModal', () => {
    
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
    
    describe('Basic Settings Behaviour', () => {
        beforeEach(
            () => renderModal({ isOpen: true, closeModal: vi.fn() })
        )
        
        describe('Grid Visibility Behaviour', () => {
            test('grid is hidden when checkbox is unchecked', () => {
                const checkbox = screen.getByLabelText(
                    'settings_dropdown.page_settings.grid_overlay_modal.enable_grid'
                );
                let grid_svg = document.querySelector('#canvas_grid_overlay');

                expect(checkbox).not.toBeChecked();
                expect(grid_svg).toHaveStyle('visibility: hidden;');
            })

            test('grid is visible when checkbox is checked', () => {
                const checkbox = screen.getByLabelText(
                    'settings_dropdown.page_settings.grid_overlay_modal.enable_grid'
                );
                let grid_svg = document.querySelector('#canvas_grid_overlay');

                fireEvent.click(checkbox);

                expect(checkbox).toBeChecked();
                expect(grid_svg).toHaveStyle('visibility: visible;');
            })

            test('grid updates when checkbox is toggled', () => {
                const checkbox = screen.getByLabelText(
                    'settings_dropdown.page_settings.grid_overlay_modal.enable_grid'
                );
                let grid_svg = document.querySelector('#canvas_grid_overlay');

                //On init, expect grid to be invisible and checkbox unchecked
                expect(checkbox).not.toBeChecked();
                expect(grid_svg).toHaveStyle('visibility: hidden;');

                //Clicks the checkbox to enable the grid
                fireEvent.click(checkbox);
                expect(checkbox).toBeChecked();
                expect(grid_svg).toHaveStyle('visibility: visible;');


                //Clicks it to make the grid disappear
                fireEvent.click(checkbox);
                expect(checkbox).not.toBeChecked();
                expect(grid_svg).toHaveStyle('visibility: hidden;');
            })
        })
      
        
        describe('Snap To Grid Behaviour', () => {
            test('snap to grid is disabled by default', () => {
                const checkbox = screen.getByLabelText(
                    'settings_dropdown.page_settings.grid_overlay_modal.snap_grid'
                );
                expect(checkbox).not.toBeChecked();
            })
        })
        describe('Line Colour Behaviour', () => {
            test('line colour input updates correctly', () => {
                const colourInput = screen.getByLabelText(
                    'settings_dropdown.page_settings.grid_overlay_modal.line_colour'
                );

                // Default color should be #000000
                expect(colourInput.value).toBe('#000000');

                // Change to red
                fireEvent.change(colourInput, { target: { value: '#ff0000' } });
                expect(colourInput.value).toBe('#ff0000');

                // Change to blue
                fireEvent.change(colourInput, { target: { value: '#0000ff' } });
                expect(colourInput.value).toBe('#0000ff');
            });
        })
       
    })

    describe('Grid Appearance Behaviour', () => {
        beforeEach(() => {
            renderModal({ isOpen: true });
            const checkbox = screen.getByLabelText(
                'settings_dropdown.page_settings.grid_overlay_modal.enable_grid'
            );
            fireEvent.click(checkbox);
        });


        test('line width changes when input is changed', () => {

            const lineWidthInput = screen.getByLabelText(
                'settings_dropdown.page_settings.grid_overlay_modal.line_width'
            );

            const gridPath = document.querySelector('#gridPattern path');

            //Width by default is 1px
            expect(gridPath).toHaveAttribute('stroke-width')
            expect(gridPath.getAttribute('stroke-width')).toBe('1')

            // Change input to 5
            fireEvent.input(lineWidthInput, { target: { value: 5 } });

            // Grab element again
            const updatedPath = document.querySelector('#gridPattern path');

            // Verify the attribute changed from initial and is present
            expect(gridPath).toHaveAttribute('stroke-width')
            expect(gridPath.getAttribute('stroke-width')).toBe('5')
        })
        
        test('line style changes when dropdown is updated', () => {

            const lineStyleDropdown = screen.getByLabelText(
                'settings_dropdown.page_settings.grid_overlay_modal.style_of_line.title'
            );

            const gridPath = document.querySelector('#gridPattern path');
            
            //If the line style is solid, the attribute should not be present
            expect(gridPath).not.toHaveAttribute('stroke-dasharray')

            // Change dropdown option to Dashed (index 1)
            const secondOptionValue = lineStyleDropdown.querySelectorAll('option')[1].value;
            fireEvent.change(lineStyleDropdown, { target: { value: secondOptionValue } });

            // Grab element again
            const updatedPath = document.querySelector('#gridPattern path');

            // Verify the attribute changed from initial and is present
            expect(updatedPath).toHaveAttribute('stroke-dasharray');
            expect(updatedPath.getAttribute('stroke-dasharray')).toBe('4, 4');
        })

        test('grid shape changes when dropdown is updated', () => {

            const appearanceDropdown = screen.getByLabelText(
                'settings_dropdown.page_settings.grid_overlay_modal.grid_shape.title'
            );

            const gridPath = document.querySelector('#gridPattern path');

            // Checks the grid is turned on and present
            expect(gridPath).toBeInTheDocument();

            // Gets the initial path (square grid) and checks it is matching the pattern for 
            const initialD = gridPath.getAttribute('d');
            const defaultPath = initialD.replace(/\s+/g, ' ').trim();
            expect(defaultPath).toBe('M 0 0 L 50 0 L 50 50 L 0 50 Z');

            // Change dropdown option to Circle (index 1)
            const secondOptionValue = appearanceDropdown.querySelectorAll('option')[1].value;
            fireEvent.change(appearanceDropdown, { target: { value: secondOptionValue } });

            // Grab element again
            const updatedPath = document.querySelector('#gridPattern path');

            // Verify the path changed from initial and is present
            expect(updatedPath).toBeInTheDocument();
            expect(updatedPath.getAttribute('d')).not.toBe(initialD);

            // Verify it's now the circle pattern
            const normalizedPath = updatedPath.getAttribute('d').replace(/\s+/g, ' ').trim();
            expect(normalizedPath).toBe('M 25,0 A 25,25 0 1,0 25,50 A 25,25 0 1,0 25,0');
        })
    })
    
    describe('Grid Size Behaviour', () => {
        let xInput, yInput, linkButton,pattern;

        beforeEach(() => {
            renderModal({ isOpen: true });

            // Enable the grid so #gridPattern exists
            const checkbox = screen.getByLabelText(
                'settings_dropdown.page_settings.grid_overlay_modal.enable_grid'
            );
            fireEvent.click(checkbox);

            xInput = screen.getByLabelText(/X Axis/i);
            yInput = screen.getByLabelText(/Y Axis/i);
            linkButton = screen.getByRole('button', { name: /Link X\/Y/i });

            // set deterministic initial values
            fireEvent.change(xInput, { target: { value: '50' } });
            fireEvent.change(yInput, { target: { value: '40' } });

            pattern = document.querySelector('#gridPattern');

        });

        test('unlinked: changing X does not change Y', () => {
            expect(xInput.value).toBe('50');
            expect(yInput.value).toBe('40');
            expect(pattern.getAttribute('width')).toBe('50');
            expect(pattern.getAttribute('height')).toBe('40');

            fireEvent.change(xInput, { target: { value: '60' } });
            pattern = document.querySelector('#gridPattern');

            expect(xInput.value).toBe('60');
            expect(yInput.value).toBe('40');
            expect(pattern.getAttribute('width')).toBe('60');
            expect(pattern.getAttribute('height')).toBe('40');
        });

        test('unlinked: changing Y does not change X', () => {
            expect(xInput.value).toBe('50');
            expect(yInput.value).toBe('40');
            expect(pattern.getAttribute('width')).toBe('50');
            expect(pattern.getAttribute('height')).toBe('40');

            fireEvent.change(yInput, { target: { value: '90' } });
            pattern = document.querySelector('#gridPattern');

            expect(xInput.value).toBe('50');
            expect(yInput.value).toBe('90');

            expect(pattern.getAttribute('width')).toBe('50');
            expect(pattern.getAttribute('height')).toBe('90');
        });

        test('linked: changing X updates Y by delta', () => {
            // toggle link
            fireEvent.click(linkButton);
            
            expect(xInput.value).toBe('50');
            expect(yInput.value).toBe('40');
            expect(pattern.getAttribute('width')).toBe('50');
            expect(pattern.getAttribute('height')).toBe('40');
            
            fireEvent.change(xInput, { target: { value: '60' } });
            pattern = document.querySelector('#gridPattern');

            expect(xInput.value).toBe('60');
            expect(yInput.value).toBe('50'); 
            expect(pattern.getAttribute('width')).toBe('60');
            expect(pattern.getAttribute('height')).toBe('50');
        });

        test('linked: changing y updates X by delta', () => {
            // toggle link
            fireEvent.click(linkButton);

            expect(xInput.value).toBe('50');
            expect(yInput.value).toBe('40');
            expect(pattern.getAttribute('width')).toBe('50');
            expect(pattern.getAttribute('height')).toBe('40');

            fireEvent.change(yInput, { target: { value: '70' } });
            pattern = document.querySelector('#gridPattern');

            expect(xInput.value).toBe('80');
            expect(yInput.value).toBe('70');
            expect(pattern.getAttribute('width')).toBe('80');
            expect(pattern.getAttribute('height')).toBe('70');
        });

        test('link button changes depending on state and updates aria-label', () => {
            // Initially unlinked
            expect(linkButton.getAttribute('aria-label')).toBe('Link X/Y');
            const initialIcon = linkButton.querySelector('path').getAttribute('d');
            expect(initialIcon).toBeTruthy();

            // Click to link
            fireEvent.click(linkButton);
            expect(linkButton.getAttribute('aria-label')).toBe('Unlink X/Y');
            const linkedIcon = linkButton.querySelector('path').getAttribute('d');
            expect(linkedIcon).toBeTruthy();
            expect(linkedIcon).not.toBe(initialIcon); // Icon should change

            // Click to unlink again
            fireEvent.click(linkButton);
            expect(linkButton.getAttribute('aria-label')).toBe('Link X/Y');
            const unlinkedIcon = linkButton.querySelector('path').getAttribute('d');
            expect(unlinkedIcon).toBe(initialIcon);
        });
    });
});
