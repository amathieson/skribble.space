import '@scss/pages/_home.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import Tags from "../components/utilities/Tags.jsx";
import React from "react";
import { useModal } from "@ctx/Modal"; // Import path as needed
import MindmapCreationModal from "../components/navigation/modals/MindmapCreationModal.jsx";
import {useTranslation} from "react-i18next";

const mindmaps = [];

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

const CreateMindmapCard = ({ onClick, t, className = "" }) => (
    <div
        className={`mindmap_card mindmap_card--new${className ? " " + className : ""}`}
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



const MindmapList = () => {
    const { openModal, closeModal } = useModal();
    const { t } = useTranslation("common");

    const isEmpty = mindmaps.length === 0;

    return (
        <div className={`mindmap_container${isEmpty ? " mindmap_container--empty" : ""}`}>
            <CreateMindmapCard
                onClick={() =>
                    openModal(
                        <MindmapCreationModal onCreate={closeModal} onCancel={closeModal} />,
                        t("create_modal.title")
                    )
                }
                t={t}
                className={isEmpty ? "mindmap_card--expanded" : ""}
            />
            {!isEmpty && mindmaps.map(mindmap => (
                <MindmapCard key={mindmap.id} mindmap={mindmap} />
            ))}
        </div>
    );
};


const Home = () => {
    return (
        <div className={"home_container"}>
            <main>
                <MindmapList />
            </main>
        </div>
            );
};

export default Home;