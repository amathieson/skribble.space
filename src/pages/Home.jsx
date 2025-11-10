import '@scss/pages/_home.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import MagnifyingGlass from '~icons/ph/magnifying-glass-bold';
import StarEmpty from '~icons/ph/star-bold';
import StarFull from '~icons/ph/star-fill';
import MindmapCreationModal from '@ui/modals/single_page/MindmapCreationModal.jsx';
import {useTranslation} from 'react-i18next';
import {useMemo, useState} from 'react';
import {useMindmapCreation} from "@ctx/MindmapCreation.jsx";
import {useNavigate} from "react-router-dom";
import CardDropdown from "@ui/dropdowns/CardDropdown.jsx";
import idb from "@util/indexed_db.js";


/**
 * This is the base card for a mindmap.
 * @param mindmap
 * @returns {JSX.Element}
 * @constructor
 */
const MindmapCard = ({ mindmap }) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const closeDropdown = () => setDropdownOpen(false);
    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen((prev) => !prev);
    };

    return (
        <div className="mindmap_planet_card" onClick={() => navigate(`/mindmap/${mindmap.id}`)}>
            <div>
                <div onClick={toggleDropdown}>
                    <SettingsDots onClick={toggleDropdown}/>
                </div>
                <CardDropdown
                    isOpen={dropdownOpen}
                    closeDropdown={closeDropdown}
                    mindmapId={mindmap.id}
                />
                <div>
                    <img src={`https://picsum.photos/seed/${mindmap.id}/150/150`} alt="mindmap preview" />
                </div>
                <div> 
                    <h3>{mindmap.name}</h3> 
                </div>
            </div>
        </div>
    );
};


/**
 * This displays a create mindmap card, and opens a modal when clicked.
 * It renders as a swirling vortex
 * @param onClick
 * @param className
 * @returns {JSX.Element}
 * @constructor
 */
const CreateMindmapCard = ({ onClick }) => {
    const { t } = useTranslation("common"); 

    return (
        <button
            className="create_mindmap_nebula_button"
            onClick={onClick}
            tabIndex={0}
            role="button"
        >
            <video autoPlay muted loop className={"swirl_vortex"}>
                <source src="/renders/swirl_vortex.webm" type="video/mp4"/>
            </video>

            <div className="swirl_vortex_overlay"></div>
            <div className="nebula_label">
                {t("create_modal.title")}
            </div>
            <div className="swirl_vortex_circle"></div>
        </button>
    );
};


/**
 * This displays a create mindmap card and the list of stored mindmaps
 * @param openModal
 * @returns {JSX.Element}
 * @constructor
 */

const StarfieldMindmapDisplay = ({ openModal }) => {
    const { mindmaps, setMindmaps } = useMindmapCreation();
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useTranslation("common");
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('all');

    const handleToggleFavourite = async (mindmapId, currentStatus) => {
        const newFavouriteStatus = !currentStatus;

        try {
            await idb.UpdateMindmapMetadataField(mindmapId, 'favourite', newFavouriteStatus);

            const updatedMindmaps = mindmaps.map(mindmap => {
                if (mindmap.id === mindmapId) {
                    return { ...mindmap, favourite: newFavouriteStatus };
                }
                return mindmap;
            });
            setMindmaps(updatedMindmaps);

        } catch (error) {
            console.error("Failed to update favourite status in DB:", error);
        }
    };


    const SearchResultItem = ({ mindmap }) => (
        <div className="search_result_item" onClick={() => navigate(`/mindmap/${mindmap.id}`)}>
            <div>
                <h4>{mindmap.name}</h4>
            </div>
            {mindmap.tags && mindmap.tags.length > 0 && (
                <div className="tags">
                    {mindmap.tags.map(tag => (
                        <span
                            key={tag}
                            className="tag"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSearchQuery(tag);
                            }}
                        >
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
                
                <SettingsDots></SettingsDots>
            </div>
            
        </div>
    );

    /**
     * A helper function to filter through currently saved mindmaps
     * Supports
     * "favourite" - shows only favourited mindmaps
     * "tag" - where it searches for all mindmaps with a specific tag
     * "name" - where it searches for all mindmaps containing a specific key
     * @type {*}
     */
    const filteredMindmaps = useMemo(() => {
        let results = [...mindmaps];

        if (activeFilter === 'favourites') {
            results = results.filter(mindmap => mindmap.favourite);
        } else if (activeFilter === 'recent') {
            results = results.sort((a, b) => new Date(b.date_modified) - new Date(a.date_modified));
        }

        const lowercasedQuery = searchQuery.toLowerCase().trim();

        if (!lowercasedQuery) {
            return results;
        }

        return results.filter(mindmap => {
            const nameMatch = mindmap.name.toLowerCase().includes(lowercasedQuery);
            const tagMatch = mindmap.tags?.some(tag =>
                tag.toLowerCase().includes(lowercasedQuery)
            );
            return nameMatch || tagMatch;
        });
    }, [mindmaps, activeFilter, searchQuery]);

    return (
        <div className="starfield_display_area">
            <div className="starfield_action_area">
                <CreateMindmapCard onClick={openModal}/>
            </div>

            <div className="recent_mindmaps_section">
                <div className="mindmap_planets_grid">
                    {mindmaps.map(mindmap => (
                        <MindmapCard key={mindmap.id} mindmap={mindmap}/>
                    ))}
                </div>
            </div>

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
                    <button
                        className={activeFilter === 'all' ? 'active' : ''}
                        onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                    >
                        {t("home.filter.all")}
                    </button>

                    <button
                        className={activeFilter === 'favourites' ? 'active' : ''}
                        onClick={() => {
                            setActiveFilter('favourites');
                            setSearchQuery('');
                        }} 
                    >
                        {t("home.filter.favourites")}
                    </button>

                    <button
                        className={activeFilter === 'recent' ? 'active' : ''}
                        onClick={() => { 
                            setActiveFilter('recent');
                            setSearchQuery('');
                        }} 
                    >
                        {t("home.filter.recent")}
                    </button>
                </div>

                <div className="results_of_filter">
                    {filteredMindmaps.length > 0 ? (
                        // Filter this by
                        // if activeFilter = recent: sort by last_modified date
                        // if activeFilter is favourited: sort by favourited = true
                        filteredMindmaps.map(mindmap => (
                            <SearchResultItem key={mindmap.id} mindmap={mindmap}/>
                        ))
                    ) : (
                        searchQuery.length > 0 && (
                            <p className="no_results_message">No results for "{searchQuery}"</p>
                        )
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

export default Home;