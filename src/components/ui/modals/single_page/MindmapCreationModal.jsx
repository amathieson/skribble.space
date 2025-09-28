import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '@scss/ui/modals/_mindmapCreationModal.scss';
import ColourPicker from '@util/ColourPicker.jsx';
import { useNavigate } from 'react-router-dom';
import { useMindmapCreation } from '@ctx/MindmapCreation.jsx';
import { BaseTabbedModal } from '@ui/modals/tabbed/BaseTabbedModal.jsx';
import Cross from '~icons/ph/x-bold';

const MindmapCreationModal = ({ isOpen, closeModal }) => {
    const { t } = useTranslation('common');
    const navigate = useNavigate();
    const { createMindmap } = useMindmapCreation();

    const [mindmap, setMindmap] = useState({
        name: '',
        description: '',
        background_colour: '#ffffff',
        date_created: new Date().toISOString(),
        tags: []
    });

    const handleSubmit = async () => {
        closeModal();
        const id = await createMindmap(mindmap);
        navigate(`/mindmap/${id}`);
    };

    const tabs = [
        {
            id: 'general',
            label: t('create_modal.tabs.general'),
            content: (
                <div className="tab_content">
                    <label className="modal_option">
                        <span>{t('create_modal.mindmap_name.name')}</span>
                        <input
                            type="text"
                            id="name"
                            placeholder={t('create_modal.mindmap_name.placeholder')}
                            value={mindmap.name}
                            onChange={e => setMindmap({ ...mindmap, name: e.target.value })}
                            required
                        />
                    </label>

                    <label className="modal_option">
                        <span>{t('create_modal.mindmap_description.name')}</span>
                        <textarea
                            id="description"
                            placeholder={t('create_modal.mindmap_description.placeholder')}
                            rows={4}
                            maxLength={250}
                            value={mindmap.description}
                            onChange={e =>
                                setMindmap({ ...mindmap, description: e.target.value })
                            }
                        />
                    </label>

                    <div className="modal_option tags_section">
                        <label htmlFor="tags-input">
                            <span id="tags-label">{t('create_modal.mindmap_tags.name')}</span>
                        </label>
                        <div className="tags_input_container">
                            {mindmap.tags?.map((tag, index) => (
                                <span key={index} className="tag">
                  {tag}
                                    <button
                                        type="button"
                                        className="remove_tag"
                                        onClick={() => {
                                            const updatedTags = mindmap.tags.filter((_, i) => i !== index);
                                            setMindmap({ ...mindmap, tags: updatedTags });
                                        }}
                                    >
                    <Cross className="remove_tag_icon" />
                  </button>
                </span>
                            ))}
                            <input
                                id="tags-input"
                                type="text"
                                placeholder={t('create_modal.mindmap_tags.placeholder')}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ',') {
                                        e.preventDefault();
                                        const newTag = e.target.value.trim();
                                        if (newTag !== '' && !mindmap.tags.includes(newTag)) {
                                            setMindmap({ ...mindmap, tags: [...mindmap.tags, newTag] });
                                        }
                                        e.target.value = '';
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'appearance',
            label: t('create_modal.tabs.appearance'),
            content: (
                <div className="tab_content">
                    <ColourPicker
                        label={t('settings_dropdown.page_settings.background_colour')}
                        value={mindmap.background_colour}
                        onChange={c => setMindmap({ ...mindmap, background_colour: c })}
                    />
                </div>
            )
        }
    ];

    return (
        <BaseTabbedModal
            isOpen={isOpen}
            title={t('create_modal.title')}
            tabs={tabs}
            closeModal={closeModal}
            onSubmit={handleSubmit}
            submitLabel={t('create_modal.submit')}
        />
    );
};

export default MindmapCreationModal;
