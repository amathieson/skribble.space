import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect, beforeAll, afterEach } from 'vitest';
import ReactDOM from 'react-dom';
import { BaseTabbedModal } from '@ui/modals/tabbed/BaseTabbedModal.jsx';
import '@testing-library/jest-dom';

vi.mock('~icons/ph/x-bold', () => ({
    default: () => <span data-testid="cross-icon">×</span>
}));

beforeAll(() => {
    vi.spyOn(ReactDOM, 'createPortal').mockImplementation((el) => el);
});

describe('BaseTabbedModal', () => {
    const mockCloseModal = vi.fn();
    const mockOnSubmit = vi.fn();

    const defaultTabs = [
        {
            id: 'tab1',
            label: 'First Tab',
            content: <div>Content of first tab</div>
        },
        {
            id: 'tab2',
            label: 'Second Tab',
            content: <div>Content of second tab</div>
        },
        {
            id: 'tab3',
            label: 'Third Tab',
            content: <div>Content of third tab</div>
        }
    ];

    afterEach(() => {
        vi.clearAllMocks();
    });

    const renderModal = (props = {}) => {
        const defaultProps = {
            isOpen: true,
            title: 'Test Modal',
            tabs: defaultTabs,
            closeModal: mockCloseModal,
            ...props
        };
        return render(<BaseTabbedModal {...defaultProps} />);
    };

    describe('Rendering Behavior', () => {
        test('does not render when isOpen is false', () => {
            renderModal({ isOpen: false });
            expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
        });

        test('renders when isOpen is true', () => {
            renderModal();
            expect(screen.getByText('Test Modal')).toBeInTheDocument();
        });

        test('renders modal title correctly', () => {
            renderModal({ title: 'test title' });
            expect(screen.getByText('test title')).toBeInTheDocument();
        });

        test('renders all tab buttons', () => {
            renderModal();
            expect(screen.getByText('First Tab')).toBeInTheDocument();
            expect(screen.getByText('Second Tab')).toBeInTheDocument();
            expect(screen.getByText('Third Tab')).toBeInTheDocument();
        });

        test('applies custom className to modal content', () => {
            renderModal({ className: 'custom-modal-class' });
            const modalContent = document.querySelector('.modal_content');
            expect(modalContent).toHaveClass('custom-modal-class');
        });

        test('renders close button with icon', () => {
            renderModal();
            expect(screen.getByTestId('cross-icon')).toBeInTheDocument();
        });
    });

    describe('Tab Navigation', () => {
        test('displays first tab content by default', () => {
            renderModal();
            expect(screen.getByText('Content of first tab')).toBeInTheDocument();
            expect(screen.queryByText('Content of second tab')).not.toBeInTheDocument();
        });

        test('first tab button has active class by default', () => {
            renderModal();
            const firstTabButton = screen.getByText('First Tab');
            expect(firstTabButton).toHaveClass('active');
        });

        test('switches tab content when clicking different tab button', () => {
            renderModal();

            const secondTabButton = screen.getByText('Second Tab');
            fireEvent.click(secondTabButton);

            expect(screen.queryByText('Content of first tab')).not.toBeInTheDocument();
            expect(screen.getByText('Content of second tab')).toBeInTheDocument();
        });

        test('updates active class when switching tabs', () => {
            renderModal();

            const firstTabButton = screen.getByText('First Tab');
            const secondTabButton = screen.getByText('Second Tab');

            expect(firstTabButton).toHaveClass('active');
            expect(secondTabButton).not.toHaveClass('active');

            fireEvent.click(secondTabButton);

            expect(firstTabButton).not.toHaveClass('active');
            expect(secondTabButton).toHaveClass('active');
        });

        test('respects defaultTab prop', () => {
            renderModal({ defaultTab: 'tab2' });

            expect(screen.getByText('Content of second tab')).toBeInTheDocument();
            expect(screen.queryByText('Content of first tab')).not.toBeInTheDocument();
            expect(screen.getByText('Second Tab')).toHaveClass('active');
        });

        test('switches to all tabs correctly', () => {
            renderModal();

            const tab2Button = screen.getByText('Second Tab');
            const tab3Button = screen.getByText('Third Tab');
            const tab1Button = screen.getByText('First Tab');

            // Click through all tabs
            fireEvent.click(tab2Button);
            expect(screen.getByText('Content of second tab')).toBeInTheDocument();

            fireEvent.click(tab3Button);
            expect(screen.getByText('Content of third tab')).toBeInTheDocument();

            fireEvent.click(tab1Button);
            expect(screen.getByText('Content of first tab')).toBeInTheDocument();
        });

        test('resets to default tab when modal reopens', () => {
            const { rerender } = renderModal({ isOpen: true, defaultTab: 'tab1' });

            // Switch to second tab
            fireEvent.click(screen.getByText('Second Tab'));
            expect(screen.getByText('Content of second tab')).toBeInTheDocument();

            // Close and reopen modal
            rerender(<BaseTabbedModal isOpen={false} title="Test Modal" tabs={defaultTabs} closeModal={mockCloseModal} />);
            rerender(<BaseTabbedModal isOpen={true} title="Test Modal" tabs={defaultTabs} closeModal={mockCloseModal} defaultTab="tab1" />);

            // Should be back to first tab
            expect(screen.getByText('Content of first tab')).toBeInTheDocument();
            expect(screen.getByText('First Tab')).toHaveClass('active');
        });
    });

    describe('Modal Closing', () => {
        test('calls closeModal when backdrop is clicked', () => {
            renderModal();
            const backdrop = document.querySelector('.modal_backdrop');
            fireEvent.click(backdrop);
            expect(mockCloseModal).toHaveBeenCalledTimes(1);
        });

        test('does not close when modal content is clicked', () => {
            renderModal();
            const modalContent = document.querySelector('.modal_content');
            fireEvent.click(modalContent);
            expect(mockCloseModal).not.toHaveBeenCalled();
        });

        test('calls closeModal when close button is clicked', () => {
            renderModal();
            const closeButton = document.querySelector('.modal_close_btn');
            fireEvent.click(closeButton);
            expect(mockCloseModal).toHaveBeenCalledTimes(1);
        });

        test('calls closeModal when Escape key is pressed', () => {
            renderModal();
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(mockCloseModal).toHaveBeenCalledTimes(1);
        });

        test('does not call closeModal when other keys are pressed', () => {
            renderModal();
            fireEvent.keyDown(document, { key: 'Enter' });
            fireEvent.keyDown(document, { key: 'a' });
            expect(mockCloseModal).not.toHaveBeenCalled();
        });

        test('does not call closeModal on Escape when modal is closed', () => {
            renderModal({ isOpen: false });
            fireEvent.keyDown(document, { key: 'Escape' });
            expect(mockCloseModal).not.toHaveBeenCalled();
        });
    });

    describe('Submit Functionality', () => {
        test('does not render submit button when onSubmit is not provided', () => {
            renderModal();
            expect(screen.queryByText('Submit')).not.toBeInTheDocument();
        });

        test('renders submit button when onSubmit is provided', () => {
            renderModal({ onSubmit: mockOnSubmit });
            expect(screen.getByText('Submit')).toBeInTheDocument();
        });

        test('uses default submit label when submitLabel is not provided', () => {
            renderModal({ onSubmit: mockOnSubmit });
            expect(screen.getByText('Submit')).toBeInTheDocument();
        });

        test('uses custom submitLabel when provided', () => {
            renderModal({ onSubmit: mockOnSubmit, submitLabel: 'Save Changes' });
            expect(screen.getByText('Save Changes')).toBeInTheDocument();
            expect(screen.queryByText('Submit')).not.toBeInTheDocument();
        });

        test('calls onSubmit when submit button is clicked', () => {
            renderModal({ onSubmit: mockOnSubmit });
            const submitButton = screen.getByText('Submit');
            fireEvent.click(submitButton);
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
        });

        test('submit button is type button to prevent form submission', () => {
            renderModal({ onSubmit: mockOnSubmit });
            const submitButton = screen.getByText('Submit');
            expect(submitButton).toHaveAttribute('type', 'button');
        });
    });

    describe('Edge Cases', () => {
        test('handles empty tabs array gracefully', () => {
            renderModal({ tabs: [] });
            expect(screen.getByText('Test Modal')).toBeInTheDocument();
            expect(document.querySelector('.modal_body')).toBeInTheDocument();
        });

        test('handles single tab', () => {
            const singleTab = [{ id: 'only', label: 'Only Tab', content: <div>Only content</div> }];
            renderModal({ tabs: singleTab });

            expect(screen.getByText('Only Tab')).toBeInTheDocument();
            expect(screen.getByText('Only content')).toBeInTheDocument();
            expect(screen.getByText('Only Tab')).toHaveClass('active');
        });

        test('handles missing closeModal gracefully', () => {
            renderModal({ closeModal: undefined });

            // Should not crash when trying to close
            const backdrop = document.querySelector('.modal_backdrop');
            expect(() => fireEvent.click(backdrop)).not.toThrow();
        });
    });

    describe('Structure and Classes', () => {
        test('renders with correct modal structure', () => {
            renderModal();

            expect(document.querySelector('.modal_backdrop')).toBeInTheDocument();
            expect(document.querySelector('.modal_content')).toBeInTheDocument();
            expect(document.querySelector('.modal_header')).toBeInTheDocument();
            expect(document.querySelector('.modal_tabs')).toBeInTheDocument();
            expect(document.querySelector('.modal_body')).toBeInTheDocument();
        });

        test('renders footer only when onSubmit is provided', () => {
            const { rerender } = renderModal();
            expect(document.querySelector('.modal_footer')).not.toBeInTheDocument();

            rerender(
                <BaseTabbedModal
                    isOpen={true}
                    title="Test Modal"
                    tabs={defaultTabs}
                    closeModal={mockCloseModal}
                    onSubmit={mockOnSubmit}
                />
            );
            expect(document.querySelector('.modal_footer')).toBeInTheDocument();
        });

        test('tab buttons have correct CSS classes', () => {
            renderModal();
            const tabButtons = document.querySelectorAll('.tab_button');
            expect(tabButtons.length).toBe(3);
        });
    });
});


