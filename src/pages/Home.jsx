import '@scss/pages/_home.scss';
import SettingsDots from '~icons/ph/dots-three-outline-vertical-bold';
import Tags from "../components/utilities/Tags.jsx";
import React from "react";
import { useModal } from "@ctx/Modal"; // Import path as needed
import MindmapCreationModal from "../components/navigation/modals/MindmapCreationModal.jsx";
import {useTranslation} from "react-i18next";

// Dummy mindmaps data and MindmapList for illustration;
// TODO: REMOVE
const mindmaps = [
    {
        id: 1,
        name: "IDK A Mindmap I Guess",
        date_created: "2024-06-10T15:23:00Z",
        last_modified: "2024-06-10T15:23:00Z",
        tags: ["crisis", "purple", "coding attempts","cait","adam","love","testing the colours"],
        description: "IDK CAIT JUST NEEDED DEMO DATA",
    },
    {
        id: 2,
        name: "a la la la",
        date_created: "2026-03-28T11:13:07Z",
        last_modified: "2026-03-28T11:13:07Z",
        tags: ["france", "red", "pain au chocolat"],
        description: "waffle waffle waffle waffle cruffle brookie war crimes bread",
    },
    {
        id: 3,
        name: "Boeing",
        date_created: "2009-12-15T07:08:07Z",
        last_modified: "2009-12-15T07:08:07Z",
        tags: ["dream", "liner", "favourite plane", "apparently there's a boeing dreamlifter"],
        description: "jtm jtm jtm jtm",
    },
    {
        id: 4,
        name: "AIRBUS",
        date_created: "1987-02-22T03:20:00Z",
        last_modified: "1987-02-22T03:20:00Z",
        tags: ["plane", "sometimes neo", "geneve","plane", "xyz", "geneve","cake", "cookie", "ted","teddy", "sometimes neo", "geneve"],
        description: "jtm jtm jtm jtm",
    },
    {
        id: 5,
        name: "AIRBUS",
        date_created: "1987-02-22T03:20:00Z",
        last_modified: "1987-02-22T03:20:00Z",
        tags: ["plane", "sometimes neo", "geneve","plane", "neo", "geneve","plane", "a", "b","c", "d", "e"],
        description: "jtm jtm jtm jtm",
    },
    {
        id: 6,
        name: "AIRBUS",
        date_created: "1987-02-22T03:20:00Z",
        last_modified: "1987-02-22T03:20:00Z",
        tags: ["plane", "sometimes neo", "geneve","plane", "sometimes neo", "geneve"],
        description: "jtm jtm jtm jtm",
    },
];

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

const CreateMindmapCard = ({ onClick, t }) => (
    <div
        className="mindmap_card mindmap_card--new"
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

    return (
        <div className={"mindmap_container"}>
            <CreateMindmapCard
                onClick={() =>
                    openModal(
                        <MindmapCreationModal onCreate={closeModal} onCancel={closeModal} />,
                        t("create_modal.title")
                    )
                }
                t={t}
            />
            {mindmaps.map(mindmap => (
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