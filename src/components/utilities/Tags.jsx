import React, { useMemo } from "react";

// Simple in-memory cache
const colorCache = new Map();

/**
 * Determines the color the text will be based on the background
 * @param h
 * @returns {string}
 */
function getContrastingTextColor(h) {
    const f = (n) => {
        const k = (n + h / 30) % 12;
        return 0.6 - 0.6 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    };

    // Convert 0-1 to 0-255
    const R = Math.round(f(0) * 255);
    const G = Math.round(f(8) * 255);
    const B = Math.round(f(4) * 255);

    // Calculate luminance
    const lum = 0.2126*R + 0.7152*G + 0.0722*B;
    
    // WCAG contrast: >128 light → black text
    return lum > 128 ? "#000" : "#fff"; 
}

// Generate a WCAG-safe colour
function generateTagColor(text) {
    const key = `${text}`;
    if (colorCache.has(key)) {
        return colorCache.get(key);
    }

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 7) - hash) +747;
        hash = hash & hash;
    }

    // Multiply the hash by a large prime number to make the colours a little more distinct
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

const Tag = ({ text }) => {
    const { background, textColor } = useTagColor(text);
    return (
        <span
            className="mindmap_tags"
            style={{ background, color: textColor }}
        >
            {text}
        </span>
    );
};

export default function Tags({ tags }) {
    return (
        <div className="tags_container">
            {tags.map(tag => (
                <Tag key={tag} text={tag} />
            ))}
        </div>
    );
}