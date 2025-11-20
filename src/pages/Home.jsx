import '@scss/pages/_home.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import MagnifyingGlass from '~icons/ph/magnifying-glass-bold';
import StarEmpty from '~icons/ph/star-bold';
import StarFull from '~icons/ph/star-fill';
import MindmapCreationModal from '@ui/modals/single_page/MindmapCreationModal.jsx';
import {useTranslation} from 'react-i18next';
import React, {useMemo, useState, forwardRef, useRef, useEffect} from 'react';
import {useMindmapCreation} from "@ctx/MindmapCreation.jsx";
import {useNavigate} from "react-router-dom";
import idb from "@util/indexed_db.js";
import Tags from "@util/Tags.jsx";
import '@scss/ui/modals/_mindmapCreationModal.scss';
import ConfirmDeletionModal from "@ui/modals/single_page/ConfirmDeletionModal.jsx";

// --- Standalone Components ---

/**
 * This is the base card for a mindmap.
 */
const MindmapCard = ({ mindmap }) => {
    const navigate = useNavigate();
    return (
        <div className="mindmap_card_wrapper" onClick={() => navigate(`/mindmap/${mindmap.id}`)}>
            <div className="mindmap_card"></div>
            <div className="mindmap_card_side_panel">
                <h3>{mindmap.name}</h3>
                <img src={`https://picsum.photos/seed/${mindmap.id}/150/150`} alt="mindmap preview" />
            </div>
            <Tags tags={mindmap.tags}/>
        </div>
    );
};

/**
 * This displays a create mindmap card.
 */
const CreateMindmapCard = forwardRef(({ onClick, className }, ref) => {
    const { t } = useTranslation("common");
    const combinedClassName = `create_mindmap_nebula_button ${className || ''}`;
    return (
        <button ref={ref} className={combinedClassName} onClick={onClick} tabIndex={0} role="button">
            <video autoPlay muted loop className={"swirl_vortex"}><source src="/renders/swirl_vortex.webm" type="video/mp4"/></video>
            <div className="swirl_vortex_overlay"></div>
            <div className="nebula_label">{t("create_modal.title")}</div>
            <div className="swirl_vortex_circle"></div>
        </button>
    );
});

/**
 * Renders a single search result item with an expandable tag grid
 * and a swipe-to-reveal action panel.
 */
const SearchResultItem = ({ mindmap, navigate, handleToggleFavourite, setSearchQuery, openDeletionModal }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [startX, setStartX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const swipeThreshold = 60;

    const [isTagsExpanded, setIsTagsExpanded] = useState(false);
    const VISIBLE_TAG_LIMIT = 4;
    const hasTags = mindmap.tags && mindmap.tags.length > 0;
    const needsPagination = hasTags && mindmap.tags.length > VISIBLE_TAG_LIMIT;
    const tagsToShow = isTagsExpanded ? mindmap.tags : mindmap.tags?.slice(0, VISIBLE_TAG_LIMIT);
    const remainingTagCount = hasTags ? mindmap.tags.length - VISIBLE_TAG_LIMIT : 0;

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
        setIsSwiping(true);
    };

    const handleTouchMove = (e) => {
        if (!isSwiping || isRevealed) return;
        const diffX = startX - e.touches[0].clientX;
        if (diffX > 10) {
            e.stopPropagation();
        }
    };

    const handleTouchEnd = (e) => {
        if (!isSwiping) return;

        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        if (isRevealed) {
            if (diffX < -swipeThreshold) {
                setIsRevealed(false);
            }
        } else {
            if (diffX > swipeThreshold) {
                setIsRevealed(true);
            }
        }

        setIsSwiping(false);
        setStartX(0);
    };

    const handleToggleReveal = (e) => {
        e.stopPropagation();
        setIsRevealed(prev => !prev);
    };

    const handleToggleExpand = (e) => {
        e.stopPropagation();
        setIsTagsExpanded(prev => !prev);
    };

    const handleRowClick = () => {
        if (isRevealed) {
            setIsRevealed(false);
        } else {
            navigate(`/mindmap/${mindmap.id}`);
        }
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        openDeletionModal(mindmap);
    };

    return (
        <div
            className="search_result_item"
            onClick={handleRowClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="search_item_actions">
                <button className="action-button edit" onClick={(e) => {e.stopPropagation(); alert(`Not implemented yet!`);}}>Edit</button>
                <button className="action-button delete" onClick={handleDeleteClick}>Delete</button>
            </div>
            <div className={`search_item_content ${isRevealed ? 'revealed' : ''}`}>
                <div className="search_item_title">
                    <h4 title={mindmap.name}>{mindmap.name}</h4>
                </div>
                {hasTags && (
                    <div className={`tags ${isTagsExpanded ? 'tags-expanded' : ''}`}>
                        {tagsToShow.map(tag => (
                            <span key={tag} className="tag" onClick={(e) => { e.stopPropagation(); setSearchQuery(tag); }}>{tag}</span>
                        ))}
                        {needsPagination && !isTagsExpanded && (
                            <span className="tag tag-more" onClick={handleToggleExpand}>+{remainingTagCount}</span>
                        )}
                        {isTagsExpanded && (
                            <button className="tags-close-button" onClick={handleToggleExpand}>×</button>
                        )}
                    </div>
                )}
                <div className="options">
                    {mindmap.favourite ? (
                        <StarFull onClick={(e) => { e.stopPropagation(); handleToggleFavourite(mindmap.id, mindmap.favourite); }} />
                    ) : (
                        <StarEmpty onClick={(e) => { e.stopPropagation(); handleToggleFavourite(mindmap.id, mindmap.favourite); }} />
                    )}
                    <SettingsDots onClick={handleToggleReveal} />
                </div>
            </div>
        </div>
    );
};


/**
 * This displays a create mindmap card and the list of stored mindmaps
 */
const StarfieldMindmapDisplay = ({  openCreationModal, openDeletionModal }) => {
    const { mindmaps, setMindmaps } = useMindmapCreation();
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useTranslation("common");
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    const [circleLimit, setCircleLimit] = useState(5);
    const containerRef = useRef(null);

    useEffect(() => {
        const containerElement = containerRef.current;
        if (!containerElement) return;
        const updateLimit = () => {
            const limitStr = getComputedStyle(containerElement).getPropertyValue('--circle-limit');
            const limitNum = Number.parseInt(limitStr.trim(), 10);
            if (!Number.isNaN(limitNum)) setCircleLimit(limitNum);
        };
        const resizeObserver = new ResizeObserver(updateLimit);
        resizeObserver.observe(containerElement);
        updateLimit();
        return () => resizeObserver.disconnect();
    }, []);

    // Toggles favourite status of a mindmap and updates the local state
    const handleToggleFavourite = async (mindmapId, currentStatus) => {
        const newFavouriteStatus = !currentStatus;
        try {
            await idb.UpdateMindmapMetadataField(mindmapId, 'favourite', newFavouriteStatus);
            setMindmaps(prev => prev.map(m => m.id === mindmapId ? { ...m, favourite: newFavouriteStatus } : m));
        } catch (error) {
            console.error("Failed to update favourite status in DB:", error);
        }
    };

    /**
     * This filters the mindmaps based on the active filter and search query.
     * @type {*[]|*}
     */
    const filteredMindmaps = useMemo(() => {
        let results = [...mindmaps];
        if (activeFilter === 'favourites') results = results.filter(m => m.favourite);
        else if (activeFilter === 'recent') results.sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified));
        const query = searchQuery.toLowerCase().trim();
        if (!query) return results;
        return results.filter(m => m.name.toLowerCase().includes(query) || m.tags?.some(t => t.toLowerCase().includes(query)));
    }, [mindmaps, activeFilter, searchQuery]);

    /**
     * This returns the most recent however many mindmaps.
     * This is controlled by screen size and css selectors
     */
    const recentMindmaps = useMemo(() => {
        return mindmaps.slice().sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified)).slice(0, circleLimit);
    }, [mindmaps, circleLimit]);

    const hasMindmaps = mindmaps.length > 0;

    const isEmpty = mindmaps.length === 0;

    return (
        <div className="starfield_display_area">
            <div ref={containerRef} className={`starfield_action_area ${hasMindmaps ? '' : 'no-mindmaps'}`}>
                <CreateMindmapCard onClick={openCreationModal} className={hasMindmaps ? '' : 'empty-state-large'} />
                {hasMindmaps && recentMindmaps.map((mindmap) => (
                    <MindmapCard key={mindmap.id} mindmap={mindmap} />
                ))}
            </div>

            {/* Correct conditional rendering for the filtering section */}
            {hasMindmaps && (
                <div className="filtering_section">
                    <span className="search_bar">
                        <MagnifyingGlass/>
                        <input type="text" placeholder={t("home.filter.placeholder")} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </span>
                    <div className="filter_options">
                        <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}>{t("home.filter.all")}</button>
                        <button className={activeFilter === 'favourites' ? 'active' : ''} onClick={() => { setActiveFilter('favourites'); setSearchQuery(''); }}>{t("home.filter.favourites")}</button>
                        <button className={activeFilter === 'recent' ? 'active' : ''} onClick={() => { setActiveFilter('recent'); setSearchQuery(''); }}>{t("home.filter.recent")}</button>
                    </div>
                    <div className="results_of_filter">
                        {filteredMindmaps.length > 0 ? (
                            filteredMindmaps.map(mindmap => (
                                <SearchResultItem
                                    key={mindmap.id}
                                    mindmap={mindmap}
                                    navigate={navigate}
                                    handleToggleFavourite={handleToggleFavourite}
                                    setSearchQuery={setSearchQuery}
                                    openDeletionModal={openDeletionModal}
                                />
                            ))
                        ) : (
                            searchQuery.length > 0 && <p className="no_results_message">No results for "{searchQuery}"</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const Home = () => {
    // State for the creation modal
    const [creationModalOpen, setCreationModalOpen] = useState(false);

    // State for the deletion modal
    const [mindmapToDelete, setMindmapToDelete] = useState(null);

    // Get the deleteMindmap function from your context
    const { deleteMindmap } = useMindmapCreation();

    const handleConfirmDelete = async () => {
        if (mindmapToDelete) {
            await deleteMindmap(mindmapToDelete.id);
            setMindmapToDelete(null); 
        }
    };

    return (
        <div className="app_container">
            <div className="home_container starfield_background">
                <main>
                    <StarfieldMindmapDisplay
                        openCreationModal={() => setCreationModalOpen(true)}
                        openDeletionModal={setMindmapToDelete}
                    />
                </main>
            </div>

            <MindmapCreationModal
                isOpen={creationModalOpen}
                closeModal={() => setCreationModalOpen(false)}
            />

            <ConfirmDeletionModal
                isOpen={!!mindmapToDelete}
                closeModal={() => setMindmapToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

//TODO: fix mobile and light mode UIs
//TODO: fix UI for if there are no mindmaps
//todo: refactor, this is rly messy
export default Home;