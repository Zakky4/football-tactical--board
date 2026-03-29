export const SVG_W = 1000;
export const SVG_H = 600;
export const PADDING = 40;
export const COURT_W = SVG_W - PADDING * 2;
export const COURT_H = SVG_H - PADDING * 2;

export const COLORS = {
    bg: '#FFFFFF',
    line: '#000000',
    teamA: '#3B82F6',
    teamAGK: '#EAB308',
    teamB: '#EF4444',
    teamBGK: '#22C55E',
    ball: '#F8FAFC'
};

export const getTextColor = (hexColor) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 2), 16);
    const b = parseInt(hex.substring(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
};

export const PRESET_COLORS = [
    { label: '赤', hex: '#EF4444' },
    { label: '青', hex: '#3B82F6' },
    { label: '黄', hex: '#EAB308' },
    { label: '白', hex: '#FFFFFF' },
    { label: '黒', hex: '#1E293B' },
    { label: '緑', hex: '#22C55E' },
    { label: 'オレンジ', hex: '#F97316' },
];

export const STORAGE_KEY = 'football-tactics-data';

export const toPercentage = (val, max) => (val / max) * 100;
export const fromPercentage = (pct, max) => (pct / 100) * max;

export const loadFromStorage = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error("Storage load error", e);
    }
    return null;
};
