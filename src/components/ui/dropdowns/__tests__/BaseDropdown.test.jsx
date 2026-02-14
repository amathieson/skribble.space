import React from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BaseDropdown } from '@ui/dropdowns/BaseDropdown.jsx';

const renderDropdown = (props = {}) => {
    const defaultProps = {
        isOpen: true,
        unfurlDirection: 'down',
        closeDropdown: vi.fn(),
        content: <div data-testid="dropdown-content">Hello dropdown</div>,
        ...props,
    };

    return {
        ...render(<BaseDropdown {...defaultProps} />),
        props: defaultProps,
    };
};

describe('BaseDropdown', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('does not render anything when isOpen is false', () => {
        renderDropdown({ isOpen: false });

        expect(screen.queryByTestId('dropdown-content')).not.toBeInTheDocument();
        expect(document.querySelector('.base_dropdown')).not.toBeInTheDocument();
    });

    test('renders content and sets open + unfurlDirection classes when open', () => {
        renderDropdown({ isOpen: true, unfurlDirection: 'left' });

        const container = document.querySelector('.base_dropdown');
        expect(container).toBeInTheDocument();
        expect(container).toHaveClass('open');
        expect(container).toHaveClass('unfurl-left');

        expect(screen.getByTestId('dropdown-content')).toBeInTheDocument();
    });

    test('calls closeDropdown when Escape is pressed while open', () => {
        const closeDropdown = vi.fn();
        renderDropdown({ isOpen: true, closeDropdown });

        fireEvent.keyDown(document, { key: 'Escape' });

        expect(closeDropdown).toHaveBeenCalledTimes(1);
    });

    test('does not call closeDropdown for non-Escape keys', () => {
        const closeDropdown = vi.fn();
        renderDropdown({ isOpen: true, closeDropdown });

        fireEvent.keyDown(document, { key: 'Enter' });

        expect(closeDropdown).not.toHaveBeenCalled();
    });

    test('calls closeDropdown when clicking outside the dropdown', () => {
        const closeDropdown = vi.fn();
        const { container } = renderDropdown({ isOpen: true, closeDropdown });

        // Add an outside element to click
        const outside = document.createElement('div');
        outside.setAttribute('data-testid', 'outside');
        document.body.appendChild(outside);

        fireEvent.mouseDown(outside);

        expect(closeDropdown).toHaveBeenCalledTimes(1);

        outside.remove();
    });

    test('does not call closeDropdown when clicking inside the dropdown', () => {
        const closeDropdown = vi.fn();
        renderDropdown({ isOpen: true, closeDropdown });

        const containerEl = document.querySelector('.base_dropdown');
        expect(containerEl).toBeInTheDocument();

        fireEvent.mouseDown(containerEl);

        expect(closeDropdown).not.toHaveBeenCalled();
    });

    test('does not register listeners / does not close when closed', () => {
        const closeDropdown = vi.fn();
        renderDropdown({ isOpen: false, closeDropdown });

        fireEvent.keyDown(document, { key: 'Escape' });
        fireEvent.mouseDown(document.body);

        expect(closeDropdown).not.toHaveBeenCalled();
    });

    test('removes event listeners on unmount', () => {
        const addSpy = vi.spyOn(document, 'addEventListener');
        const removeSpy = vi.spyOn(document, 'removeEventListener');

        const { unmount } = renderDropdown({ isOpen: true });

        // should have registered both listeners when open
        expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

        unmount();

        // should remove both on cleanup
        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });

    test('removes event listeners when closing (isOpen true -> false)', () => {
        const removeSpy = vi.spyOn(document, 'removeEventListener');

        const { rerender } = render(
            <BaseDropdown
                isOpen={true}
                unfurlDirection="down"
                closeDropdown={vi.fn()}
                content={<div data-testid="dropdown-content">Hello</div>}
            />
        );

        // close it
        rerender(
            <BaseDropdown
                isOpen={false}
                unfurlDirection="down"
                closeDropdown={vi.fn()}
                content={<div data-testid="dropdown-content">Hello</div>}
            />
        );

        expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });
});