import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardDropdown from '@ui/dropdowns/CardDropdown.jsx';

vi.mock('~icons/ph/pencil-bold', () => ({
    default: () => <span data-testid="edit-icon" />,
}));
vi.mock('~icons/ph/trash-bold', () => ({
    default: () => <span data-testid="delete-icon" />,
}));

vi.mock('@ui/dropdowns/BaseDropdown.jsx', () => ({
    default: ({ isOpen, content, unfurlDirection }) => {
        if (!isOpen) return null;
        return (
            <div data-testid="base-dropdown-mock" data-unfurl={unfurlDirection}>
                {content}
            </div>
        );
    },
}));

const mockDeleteMindmap = vi.fn();
vi.mock('@util/indexed_db.js', () => ({
    default: {
        DeleteMindmap: (...args) => mockDeleteMindmap(...args),
    },
}));

describe('CardDropdown', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    const renderDropdown = (props = {}) => {
        const defaultProps = {
            mindmapId: 'mindmap-123',
            isOpen: true,
            closeDropdown: vi.fn(),
            ...props,
        };

        return {
            ...render(<CardDropdown {...defaultProps} />),
            props: defaultProps,
        };
    };

    test('adds the "open" class to wrapper when isOpen is true', () => {
        renderDropdown({ isOpen: true });

        const wrapper = document.querySelector('.card_dropdown');
        expect(wrapper).toBeInTheDocument();
        expect(wrapper).toHaveClass('open');
    });

    test('does not add the "open" class to wrapper when isOpen is false', () => {
        renderDropdown({ isOpen: false });

        const wrapper = document.querySelector('.card_dropdown');
        expect(wrapper).toBeInTheDocument();
        expect(wrapper).not.toHaveClass('open');

        // BaseDropdown is mocked to render null when closed
        expect(screen.queryByTestId('base-dropdown-mock')).not.toBeInTheDocument();
    });

    test('renders Edit and Delete buttons when open', () => {
        renderDropdown({ isOpen: true });

        expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    test('clicking Edit calls alert with mindmapId and closes dropdown', () => {
        const closeDropdown = vi.fn();
        renderDropdown({ mindmapId: 'abc', closeDropdown });

        fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

        expect(window.alert).toHaveBeenCalledTimes(1);
        expect(window.alert).toHaveBeenCalledWith('Editing mindmap with ID: abc');
        expect(closeDropdown).toHaveBeenCalledTimes(1);
    });

    test('clicking Delete calls idb.DeleteMindmap with mindmapId and closes dropdown', async () => {
        const closeDropdown = vi.fn();
        mockDeleteMindmap.mockResolvedValue(undefined);

        renderDropdown({ mindmapId: 'to-delete', closeDropdown });

        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        expect(mockDeleteMindmap).toHaveBeenCalledTimes(1);
        expect(mockDeleteMindmap).toHaveBeenCalledWith('to-delete');

        await Promise.resolve();

        expect(closeDropdown).toHaveBeenCalledTimes(1);
    });

    test('handleDelete stops propagation', async () => {
        const closeDropdown = vi.fn();
        mockDeleteMindmap.mockResolvedValue(undefined);

        const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation');

        renderDropdown({ mindmapId: 'x', closeDropdown });

        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

        expect(stopPropagationSpy).toHaveBeenCalledTimes(1);

        await Promise.resolve();

        expect(mockDeleteMindmap).toHaveBeenCalledWith('x');
        expect(closeDropdown).toHaveBeenCalledTimes(1);
    });

    test('passes unfurlDirection="left" to BaseDropdown', () => {
        renderDropdown({ isOpen: true });

        const base = screen.getByTestId('base-dropdown-mock');
        expect(base).toHaveAttribute('data-unfurl', 'left');
    });
});