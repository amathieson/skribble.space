import '@scss/pages/_home.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import MagnifyingGlass from '~icons/ph/magnifying-glass-bold';
import StarEmpty from '~icons/ph/star-bold';
import StarFull from '~icons/ph/star-fill';
import MindmapCreationModal from '@ui/modals/single_page/MindmapCreationModal.jsx';
import {useTranslation} from 'react-i18next';
import React, {useMemo, useState, forwardRef} from 'react';
import {useMindmapCreation} from "@ctx/MindmapCreation.jsx";
import {useNavigate} from "react-router-dom";
import idb from "@util/indexed_db.js";

/**
 * This is the base card for a mindmap.
 */
const MindmapCard = ({ mindmap }) => { 
    const navigate = useNavigate();

    return (
        <div className="mindmap_card_wrapper" onClick={() => navigate(`/mindmap/${mindmap.id}`)}>
            <div
                className="mindmap_card"
            >
            </div>
            <div className="mindmap_card_side_panel">
                <div><h3>{mindmap.name}</h3></div>
                <div><img src={`https://picsum.photos/seed/${mindmap.id}/150/150`} alt="mindmap preview" /></div>
            </div>
        </div>
    );
};

/**
 * This displays a create mindmap card, and opens a modal when clicked.
 */
const CreateMindmapCard = forwardRef(({ onClick }, ref) => {
    const { t } = useTranslation("common");

    return (
        <button ref={ref} className="create_mindmap_nebula_button" onClick={onClick} tabIndex={0} role="button">
            <video autoPlay muted loop className={"swirl_vortex"}><source src="/renders/swirl_vortex.webm" type="video/mp4"/></video>
            <div className="swirl_vortex_overlay"></div>
            <div className="nebula_label">{t("create_modal.title")}</div>
            <div className="swirl_vortex_circle"></div>
        </button>
    );
});


/**
 * This displays a create mindmap card and the list of stored mindmaps
 */
const StarfieldMindmapDisplay = ({ openModal }) => {
    const { mindmaps, setMindmaps } = useMindmapCreation();
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useTranslation("common");
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');
    
    // Toggles favourite status of a mindmap and updates the local state
    const handleToggleFavourite = async (mindmapId, currentStatus) => {
        const newFavouriteStatus = !currentStatus;
        try {
            await idb.UpdateMindmapMetadataField(mindmapId, 'favourite', newFavouriteStatus);
            const updatedMindmaps = mindmaps.map(mindmap => {
                if (mindmap.id === mindmapId) return { ...mindmap, favourite: newFavouriteStatus };
                return mindmap;
            });
            setMindmaps(updatedMindmaps);
        } catch (error) {
            console.error("Failed to update favourite status in DB:", error);
        }
    };

    /**
     * This is the item that appears in the search results.
     * @param mindmap
     * @returns {React.JSX.Element}
     * @constructor
     */
    const SearchResultItem = ({ mindmap }) => (
        <div className="search_result_item" onClick={() => navigate(`/mindmap/${mindmap.id}`)}>
            <div><h4>{mindmap.name}</h4></div>
            {mindmap.tags?.length > 0 && (
                <div className="tags">
                    {mindmap.tags.map(tag => (
                        <span key={tag} className="tag" onClick={(e) => { e.stopPropagation(); setSearchQuery(tag); }}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <div className="options">
                {mindmap.favourite ? (
                    <StarFull onClick={(e) => { e.stopPropagation(); handleToggleFavourite(mindmap.id, mindmap.favourite); }} />
                ) : (
                    <StarEmpty onClick={(e) => { e.stopPropagation(); handleToggleFavourite(mindmap.id, mindmap.favourite); }} />
                )}
                <SettingsDots />
            </div>
        </div>
    );

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
     * This returns the most recent 5 mindmaps.
     * TODO: change how many it returns depending on screen size.
     */
    const recentMindmaps = useMemo(() => {
        return mindmaps
            .slice()
            .sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified))
            .slice(0, 5);
    }, [mindmaps]);


    return (
        <div className="starfield_display_area">
            <div className="starfield_action_area">
                <CreateMindmapCard onClick={openModal}/>
                {recentMindmaps.map((mindmap) => (
                    <MindmapCard
                        key={mindmap.id}
                        mindmap={mindmap}
                    />
                ))}
            </div>

            {/*This is the filtering section. It contains the search bar, filter options and the results of the filter.*/}
            <div className="filtering_section">
                <span className="search_bar">
                    <MagnifyingGlass/>
                    <input
                        type="text"
                        placeholder={t("home.filter.placeholder")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </span>
                <div className="filter_options">
                    <button className={activeFilter === 'all' ? 'active' : ''} onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}>
                        {t("home.filter.all")}
                    </button>
                    <button className={activeFilter === 'favourites' ? 'active' : ''} onClick={() => { setActiveFilter('favourites'); setSearchQuery(''); }}>
                        {t("home.filter.favourites")}
                    </button>
                    <button className={activeFilter === 'recent' ? 'active' : ''} onClick={() => { setActiveFilter('recent'); setSearchQuery(''); }}>
                        {t("home.filter.recent")}
                    </button>
                </div>
                <div className="results_of_filter">
                    {filteredMindmaps.length > 0 ? (
                        filteredMindmaps.map(mindmap => (
                            <SearchResultItem key={mindmap.id} mindmap={mindmap}/>
                        ))
                    ) : (
                        searchQuery.length > 0 && <p className="no_results_message">No results for "{searchQuery}"</p>
                    )}
                </div>
            </div>
        </div>
    );
};



const Home = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <div className="app_container">
            <div className="home_container starfield_background">
                <main>
                    <StarfieldMindmapDisplay openModal={openModal}/>
                </main>
            </div>
            <MindmapCreationModal
                isOpen={modalOpen}
                closeModal={closeModal}
            />
        </div>
    );
};

//TODO: fix mobile and light mode UIs
//TODO: fix UI for if there are no mindmaps
export default Home;