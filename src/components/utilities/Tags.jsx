import React, {Activity, useMemo, useState} from "react";
import Arrow from '~icons/ph/triangle-fill';

const colorCache = new Map();
function getContrastingTextColor(h) {
    const f = (n) => {
        const k = (n + h / 30) % 12;
        return 0.6 - 0.6 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };
    const R = Math.round(f(0) * 255);
    const G = Math.round(f(8) * 255);
    const B = Math.round(f(4) * 255);
    const lum = 0.2126*R + 0.7152*G + 0.0722*B;
    return lum > 128 ? "#000" : "#fff";
}

function generateTagColor(text) {
    if (!text) return { background: '#888', textColor: '#fff' };
    const key = `${text}`;
    if (colorCache.has(key)) return colorCache.get(key);
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 7) - hash) + 747;
        hash = hash & hash;
    }
    const hue = Math.abs(hash * 2654435761) % 360;
    const background = `hsl(${hue}, 60%, 60%)`;
    const textColor = getContrastingTextColor(hue);
    const colors = { background, textColor };
    colorCache.set(key, colors);
    return colors;
}

function useTagColor(text) {
    return useMemo(() => generateTagColor(text), [text]);
}

const Tag = ({ text, style }) => {
    const { background, textColor } = useTagColor(text);
    return (
        <span
            className="mindmap_tag"
            style={{ ...style, background, color: textColor }}
        >
            {text}
        </span>
    );
};

export default function Tags({ tags }) {
    const [currentPage, setCurrentPage] = useState(0);

    if (!tags || tags.length === 0) {
        return null;
    }

    const TAGS_PER_PAGE = 5;
    const needsPagination = tags.length > TAGS_PER_PAGE;
    const totalPages = Math.ceil(tags.length / TAGS_PER_PAGE);

    const handleNext = () => {
        setCurrentPage(current => (current + 1) % totalPages);
    };
    const handlePrev = () => {
        setCurrentPage(current => (current - 1 + totalPages) % totalPages);
    };

    const TAG_CONFIG = {
        HEIGHT: 28,
        GAP: 8,
        CURVE_INTENSITY: -300,
    };

    const tagElements = useMemo(() => {
        const startIndex = currentPage * TAGS_PER_PAGE;
        const visibleTags = tags.slice(startIndex, startIndex + TAGS_PER_PAGE);

        const totalHeight = visibleTags.length * TAG_CONFIG.HEIGHT + Math.max(0, visibleTags.length - 1) * TAG_CONFIG.GAP;
        const arcCenterY = totalHeight / 2;

        return visibleTags.map((tag, index) => {
            const y = index * (TAG_CONFIG.HEIGHT + TAG_CONFIG.GAP);
            const y_from_center = y - arcCenterY + (TAG_CONFIG.HEIGHT / 2);
            const x_offset = (y_from_center ** 2) / TAG_CONFIG.CURVE_INTENSITY;
            const tagStyle = {
                transform: `translateX(${x_offset}px)`,
            };
            return <Tag key={tag} text={tag} style={tagStyle} />;
        });
    }, [tags, currentPage]);

    return (
            <div className="tags_container">
                <Activity mode={needsPagination}>
                    <button className="tags_arrow_button" onClick={(e) => { e.stopPropagation(); handlePrev()}}><Arrow/></button>
                </Activity>
                <div className="tags_list">
                    {tagElements}
                </div>
                <Activity mode={needsPagination}>
                    <button className="tags_arrow_button" onClick={(e) => { e.stopPropagation();handleNext()}}><Arrow/></button>
                </Activity>
            </div>
    );
}