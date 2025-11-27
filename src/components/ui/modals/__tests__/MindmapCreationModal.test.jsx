import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MindmapCreationModal from "@ui/modals/tabbed/MindmapCreationModal";
import '@testing-library/jest-dom';


/**
 * Mocks react-i18next to return a function that always returns the key passed in
 */
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

/**
 * Mocks the router to return the given path when navigate is called.
 */
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

/**
 * Mocks the context
 * @type {Mock<Procedure>}
 */
const mockCreateMindmap = vi.fn();
vi.mock('@ctx/MindmapCreation.jsx', () => ({
    useMindmapCreation: () => ({
        createMindmap: mockCreateMindmap,
    }),
}));

/**
 * Mock the colourpicker component
 */
vi.mock('@util/ColourPicker.jsx', () => ({
    default: ({ value, onChange }) => (
        <input
            data-testid="colour-picker-mock"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    ),
}));

/**
 * Mocks the BaseTabbedModal component to return a mock div
 */
vi.mock('@ui/modals/tabbed/BaseTabbedModal.jsx', () => ({
    BaseTabbedModal: ({ isOpen, tabs, onSubmit, submitLabel }) => {
        if (!isOpen) return null;
        return (
            <div className="base-tabbed-modal-mock">
                {tabs.map(tab => (
                    <div key={tab.id} className={`tab-content-${tab.id}`}>
                        {tab.content}
                    </div>
                ))}
                <button className="submit-btn" onClick={onSubmit}>{submitLabel}</button>
            </div>
        );
    },
}));

describe('MindmapCreationModal', () => {

    // Reset mocks before every test to ensure clean state
    beforeEach(() => {
        mockCreateMindmap.mockResolvedValue('12345');
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });
    
    afterEach(() => {
        vi.clearAllMocks();
    });

    /**
     * Helper to render the component
     */
    const renderModal = (props = {}) => {
        const defaultProps = {
            isOpen: true,
            closeModal: vi.fn(),
            ...props
        };
        return render(<MindmapCreationModal {...defaultProps} />);
    };

    describe('Rendering', () => {
        test('renders inputs and textareas correctly', () => {
            renderModal();

            expect(screen.getByPlaceholderText('create_modal.mindmap_name.placeholder')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('create_modal.mindmap_description.placeholder')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('create_modal.mindmap_tags.placeholder')).toBeInTheDocument();
            expect(screen.getByTestId('colour-picker-mock')).toBeInTheDocument();
        });
    });

    describe('Form Interactions', () => {
        test('updates name and description state on change', () => {
            renderModal();
            const submitBtn = document.querySelector('.submit-btn');
            const nameInput = screen.getByPlaceholderText('create_modal.mindmap_name.placeholder');
            const descInput = screen.getByPlaceholderText('create_modal.mindmap_description.placeholder');

            fireEvent.change(nameInput, { target: { value: 'Mindmap Mindmap' } });
            fireEvent.change(descInput, { target: { value: 'Mindmap^2' } });

            expect(nameInput.value).toBe('Mindmap Mindmap');
            expect(descInput.value).toBe('Mindmap^2');
            fireEvent.click(submitBtn);
            expect(mockCreateMindmap).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Mindmap Mindmap',
                description: 'Mindmap^2',
            }));
        });

        test('submits mindmap with custom background colour', async () => {
            const closeModal = vi.fn();
            renderModal({ closeModal });

            const nameInput = screen.getByPlaceholderText('create_modal.mindmap_name.placeholder');
            fireEvent.change(nameInput, { target: { value: 'Un deux trois' } });

            const colorPicker = screen.getByTestId('colour-picker-mock');
            fireEvent.change(colorPicker, { target: { value: '#ff5733' } });

            const submitBtn = document.querySelector('.submit-btn');
            fireEvent.click(submitBtn);

            expect(mockCreateMindmap).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Un deux trois',
                background_colour: '#ff5733',
                tags: []
            }));

            await waitFor(() => {
                expect(closeModal).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith('/mindmap/12345');
            });
        });
    });

    describe('Tags Logic', () => {
        test('adds a tag when pressing enter', () => {
            renderModal();
            const tagInput = screen.getByPlaceholderText('create_modal.mindmap_tags.placeholder');

            fireEvent.change(tagInput, { target: { value: 'red' } });
            fireEvent.keyDown(tagInput, { key: 'Enter', code: 'Enter' });

            expect(screen.getByText('red')).toBeInTheDocument();
            expect(tagInput.value).toBe(''); 
        });

        test('adds a tag when pressing comma', () => {
            renderModal();
            const tagInput = screen.getByPlaceholderText('create_modal.mindmap_tags.placeholder');

            fireEvent.change(tagInput, { target: { value: 'blue' } });
            fireEvent.keyDown(tagInput, { key: ',' });

            expect(screen.getByText('blue')).toBeInTheDocument();
            expect(tagInput.value).toBe('');
        });

        test('prevents duplicate tags', () => {
            renderModal();
            const tagInput = screen.getByPlaceholderText('create_modal.mindmap_tags.placeholder');

            fireEvent.change(tagInput, { target: { value: 'Duplicate' } });
            fireEvent.keyDown(tagInput, { key: 'Enter' });

            fireEvent.change(tagInput, { target: { value: 'Duplicate' } });
            fireEvent.keyDown(tagInput, { key: 'Enter' });

            const tags = screen.getAllByText('Duplicate');
            expect(tags.length).toBe(1);
        });

        test('removes a tag when clicking the cross icon', () => {
            renderModal();
            const tagInput = screen.getByPlaceholderText('create_modal.mindmap_tags.placeholder');

            fireEvent.change(tagInput, { target: { value: 'removeMe' } });
            fireEvent.keyDown(tagInput, { key: 'Enter' });

            //Checks it gets added
            const tagElement = screen.getByText('removeMe');
            expect(tagElement).toBeInTheDocument();

            const removeBtn = tagElement.querySelector('.remove_tag');
            fireEvent.click(removeBtn);

            // Checks its visually removed
            expect(screen.queryByText('removeMe')).not.toBeInTheDocument();

            const nameInput = screen.getByPlaceholderText('create_modal.mindmap_name.placeholder');
            fireEvent.change(nameInput, { target: { value: 'Test Name' } });

            const submitBtn = document.querySelector('.submit-btn');
            fireEvent.click(submitBtn);

            // Checks that it gets submitted with no tags
            expect(mockCreateMindmap).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Test Name',
                    tags: [] 
                })
            );
        });
    });

    describe('Submission', () => {
        test('shows alert and does not submit if name is empty', () => {
            const closeModal = vi.fn();
            renderModal({ closeModal });

            const submitBtn = document.querySelector('.submit-btn');
            fireEvent.click(submitBtn);

            expect(window.alert).toHaveBeenCalledWith("Please enter a mindmap name.");
            expect(mockCreateMindmap).not.toHaveBeenCalled();
            expect(closeModal).not.toHaveBeenCalled();
        });

        test('calls createMindmap and navigates on valid submission', async () => {
            const closeModal = vi.fn();
            renderModal({ closeModal });

            const nameInput = screen.getByPlaceholderText('create_modal.mindmap_name.placeholder');
            fireEvent.change(nameInput, { target: { value: 'AAA' } });

            const tagInput = screen.getByPlaceholderText('create_modal.mindmap_tags.placeholder');
            fireEvent.change(tagInput, { target: { value: 'VVV' } });
            fireEvent.keyDown(tagInput, { key: 'Enter' });

            const submitBtn = document.querySelector('.submit-btn');
            fireEvent.click(submitBtn);

            expect(mockCreateMindmap).toHaveBeenCalledWith(expect.objectContaining({
                name: 'AAA',
                tags: ['VVV'],
                background_colour: '#ffffff' 
            }));

            await waitFor(() => {
                expect(closeModal).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith('/mindmap/12345');
            });
        });

        test('can submit with only required fields', async () => {
            const closeModal = vi.fn();
            renderModal({ closeModal });

            const nameInput = screen.getByPlaceholderText('create_modal.mindmap_name.placeholder');
            fireEvent.change(nameInput, { target: { value: 'MinDataBeHere' } });

            const submitBtn = document.querySelector('.submit-btn');
            fireEvent.click(submitBtn);

            expect(mockCreateMindmap).toHaveBeenCalledWith(expect.objectContaining({
                name: 'MinDataBeHere',
                description: '',
                tags: [],
                background_colour: '#ffffff'
            }));

            await waitFor(() => {
                expect(closeModal).toHaveBeenCalled();
                expect(mockNavigate).toHaveBeenCalledWith('/mindmap/12345');
            });
        });
    });
});