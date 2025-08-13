import {HomeNav} from "../components/navigation/HomeNav.jsx";
import '@scss/pages/_home.scss';
import React from "react";

// Dummy mindmaps data and MindmapList for illustration;
// TODO: REMOVE
const mindmaps = [
    {
        id: 1,
        name: "IDK A Mindmap I Guess",
        date_created: "2024-06-10T15:23:00Z",
        last_modified: "2024-06-10T15:23:00Z",
        tags: ["crisis", "purple", "coding attempts"],
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
        tags: ["plane", "sometimes neo", "geneve"],
        description: "jtm jtm jtm jtm",
    },
];

const MindmapCard = ({ mindmap }) => (
    <div className={"mindmap_card"}>
        <div>
            <div className={"mindmap_card_header"}>
                <h2>{mindmap.name}</h2>
                <p>{mindmap.description}</p>
            </div>
            <div>
                <p>Date Created: {new Date(mindmap.date_created).toLocaleString()}</p>
                <p>Last Modified: {new Date(mindmap.last_modified).toLocaleString()}</p>
            </div>
            <div>
                {mindmap.tags.map(tag => (
                    <span
                        key={tag}
                        className={"mindmap_tags"}
                    >
                    {tag}
                </span>
                ))}
            </div>
        </div>
        
        <div>
            <img src={"https://picsum.photos/200/200"} alt={"mindmap preview"} />
        </div>
    </div>
);

const MindmapList = () => (
    <div className={"mindmap_container"}>
        {mindmaps.map(mindmap => (
            <MindmapCard key={mindmap.id} mindmap={mindmap} />
        ))}
    </div>
);

const Home = () => {
    return (
        <div className={"home_container"}>
            <HomeNav />
            <main>
                <MindmapList />
            </main>
        </div>
    );
};

export default Home;