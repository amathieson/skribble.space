import '@scss/pages/_home.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import Tags from '@util/Tags.jsx';
import MindmapCreationModal from '@ui/modals/MindmapCreationModal.jsx';
import {useTranslation} from 'react-i18next';
import {useState} from 'react';
import {useMindmapCreation} from "@ctx/MindmapCreation.jsx";


/**
 * This is the base card for a mindmap.
 * @param mindmap
 * @returns {JSX.Element}
 * @constructor
 */
const MindmapCard = ({ mindmap }) => (
    <div className="mindmap_card" onClick={() => alert("This will eventually open a thing!")}>
        <div>
            <div className="card_settings_dots">
                <SettingsDots />
            </div>
            <div className="mindmap_preview">
                <img src="https://placecats.com/200/200" alt="mindmap preview" />
            </div>
            <div className="mindmap_card_header">
                <h2>{mindmap.name}</h2>
                <p>{mindmap.description}</p>
            </div>
            <Tags tags={mindmap.tags} />
        </div>
    </div>
);

/**
 * This displays a create mindmap card, and opens a modal when clicked.
 * @param onClick
 * @param className
 * @returns {JSX.Element}
 * @constructor
 */
const CreateMindmapCard = ({ onClick, className = "" }) => {
    const {t} = useTranslation("common");
    return (
        <div
            className={`mindmap_card mindmap_card_new${className ? " " + className : ""}`}
            onClick={onClick}
            tabIndex={0}
            role="button"
        >
            <div className="mindmap_card_new_content">
                <div className="mindmap_card_plus">+</div>
                <div className="mindmap_card_label">{t("home.title")}</div>
            </div>
        </div>
    );

};


/**
 * This displays a create mindmap card and the list of stored mindmaps
 * @param openModal
 * @returns {JSX.Element}
 * @constructor
 */

const MindmapList = ({ openModal }) => {
    const { mindmaps } = useMindmapCreation();
    const isEmpty = mindmaps.length === 0;

    return (
        <div className={`mindmap_container${isEmpty ? " mindmap_container--empty" : ""}`}>
            <CreateMindmapCard
                onClick={openModal}
                className={isEmpty ? "mindmap_card_expanded" : ""}
            />
            {!isEmpty && mindmaps.map(mindmap => (
                <MindmapCard key={mindmap.id} mindmap={mindmap} />
            ))}
        </div>
    );
};



const Home = () => {
    
    // Modal States. Etc
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true); 
    const closeModal = () => setModalOpen(false);


    return (
        <>
            <div className={"home_container"}>
                <main>
                    <MindmapList openModal={openModal}/>
                </main>
            </div>

            <MindmapCreationModal
                isOpen={modalOpen}
                closeModal={closeModal}
            />
        </>
    );
};

export default Home;