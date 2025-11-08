import '@scss/pages/_home.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import Tags from '@util/Tags.jsx';
import MindmapCreationModal from '@ui/modals/single_page/MindmapCreationModal.jsx';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {useMindmapCreation} from "@ctx/MindmapCreation.jsx";
import {useNavigate} from "react-router-dom";
import CardDropdown from "@ui/dropdowns/CardDropdown.jsx";


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
        <div className="mindmap_planet_card" onClick={() => navigate(`/mindmap/${mindmap.id}`)}> {/* New class */}
            <div className="planet_core"> {/* For styling the circular body */}
                <div className="card_settings_dots" onClick={toggleDropdown}>
                    <SettingsDots onClick={toggleDropdown}/>
                </div>
                <CardDropdown
                    isOpen={dropdownOpen}
                    closeDropdown={closeDropdown}
                    mindmapId={mindmap.id}
                />
                <div className="mindmap_preview">
                    {/* Placeholder image, eventually a real mindmap preview */}
                    <img src={`https://picsum.photos/seed/${mindmap.id}/150/150`} alt="mindmap preview" />
                </div>
                <div className="planet_info"> {/* Renamed for theme */}
                    <h3>{mindmap.name}</h3> {/* Changed to h3 for hierarchy */}
                    {/* Description might be hidden or truncated in this view */}
                    {/* <p>{mindmap.description}</p> */}
                </div>
                {/* Tags could be styled as orbiting elements or a small footer */}
                {/* <Tags tags={mindmap.tags} /> */}
            </div>
        </div>
    );
};


/**
 * This displays a create mindmap card, and opens a modal when clicked.
 * @param onClick
 * @param className
 * @returns {JSX.Element}
 * @constructor
 */
const CreateMindmapCard = ({ onClick }) => {
    // const { t } = useTranslation("common"); // No longer needed for the label

    return (
        <button
            className="create_mindmap_nebula_button"
            onClick={onClick}
            tabIndex={0}
            role="button"
        >
            {/*<div className="nebula_content">*/}
            {/*    <div className="nebula_label">*/}
            {/*        Create New<br/>Mindmap*/}
            {/*    </div>*/}
            {/*</div>*/}
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
    const { mindmaps } = useMindmapCreation();
    
    return (
        <div className="starfield_display_area"> {/* New container */}
            {/* Left side: Create New Mindmap */}
            <div className="starfield_action_area">
                <CreateMindmapCard onClick={openModal} />
            </div>

            {/* Right side: Recent Mindmaps as celestial objects */}
            <div className="recent_mindmaps_section">
                <h3>Recent Skribbles</h3> {/* Or "Your Galaxies" */}
                <div className="mindmap_planets_grid"> {/* Grid for planets */}
                    {mindmaps.map(mindmap => (
                        <MindmapCard key={mindmap.id} mindmap={mindmap} />
                    ))}
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
        <div className="app_container"> {/* Overall app container to hold header and main content */}

            <div className="home_container starfield_background"> {/* Apply starfield background here */}
                <main>
                    <StarfieldMindmapDisplay openModal={openModal} />
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