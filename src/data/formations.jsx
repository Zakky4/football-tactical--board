import { COLORS } from '../constants/board';

export const SoccerIcon = ({ className }) => (
    <img src="/soccer-icon.png" alt="Soccer Icon" className={`${className || ''} mix-blend-multiply`} />
);

export const baseItems = [
    // Team A
    { id: 'A1', team: 'A', label: 'GK', name: 'GK A', x: 100, y: 300, color: COLORS.teamAGK },
    { id: 'A2', team: 'A', label: '2', name: '選手 A2', x: 250, y: 120, color: COLORS.teamA },
    { id: 'A3', team: 'A', label: '3', name: '選手 A3', x: 200, y: 220, color: COLORS.teamA },
    { id: 'A4', team: 'A', label: '4', name: '選手 A4', x: 200, y: 380, color: COLORS.teamA },
    { id: 'A5', team: 'A', label: '5', name: '選手 A5', x: 250, y: 480, color: COLORS.teamA },
    { id: 'A6', team: 'A', label: '6', name: '選手 A6', x: 350, y: 200, color: COLORS.teamA },
    { id: 'A7', team: 'A', label: '7', name: '選手 A7', x: 400, y: 300, color: COLORS.teamA },
    { id: 'A8', team: 'A', label: '8', name: '選手 A8', x: 350, y: 400, color: COLORS.teamA },
    { id: 'A9', team: 'A', label: '9', name: '選手 A9', x: 450, y: 150, color: COLORS.teamA },
    { id: 'A10', team: 'A', label: '10', name: '選手 A10', x: 480, y: 300, color: COLORS.teamA },
    { id: 'A11', team: 'A', label: '11', name: '選手 A11', x: 450, y: 450, color: COLORS.teamA },
    // Team B
    { id: 'B1', team: 'B', label: 'GK', name: 'GK B', x: 900, y: 300, color: COLORS.teamBGK },
    { id: 'B2', team: 'B', label: '2', name: '選手 B2', x: 750, y: 120, color: COLORS.teamB },
    { id: 'B3', team: 'B', label: '3', name: '選手 B3', x: 800, y: 220, color: COLORS.teamB },
    { id: 'B4', team: 'B', label: '4', name: '選手 B4', x: 800, y: 380, color: COLORS.teamB },
    { id: 'B5', team: 'B', label: '5', name: '選手 B5', x: 750, y: 480, color: COLORS.teamB },
    { id: 'B6', team: 'B', label: '6', name: '選手 B6', x: 650, y: 200, color: COLORS.teamB },
    { id: 'B7', team: 'B', label: '7', name: '選手 B7', x: 600, y: 300, color: COLORS.teamB },
    { id: 'B8', team: 'B', label: '8', name: '選手 B8', x: 650, y: 400, color: COLORS.teamB },
    { id: 'B9', team: 'B', label: '9', name: '選手 B9', x: 550, y: 150, color: COLORS.teamB },
    { id: 'B10', team: 'B', label: '10', name: '選手 B10', x: 520, y: 300, color: COLORS.teamB },
    { id: 'B11', team: 'B', label: '11', name: '選手 B11', x: 550, y: 450, color: COLORS.teamB },
    // Ball
    { id: 'ball', team: 'none', label: '⚽', name: '', x: 500, y: 300, color: COLORS.ball, radius: 12 }
];

export const tacticsPositions = {
    '4-3-3': Object.fromEntries(baseItems.map(p => [p.id, { x: p.x, y: p.y }])),
    '3-5-2': {
        'A1': { x: 100, y: 300 }, 'A2': { x: 200, y: 150 }, 'A3': { x: 170, y: 300 }, 'A4': { x: 200, y: 450 },
        'A5': { x: 300, y: 100 }, 'A6': { x: 280, y: 200 }, 'A7': { x: 350, y: 300 }, 'A8': { x: 280, y: 400 },
        'A9': { x: 300, y: 500 }, 'A10': { x: 450, y: 220 }, 'A11': { x: 450, y: 380 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 800, y: 150 }, 'B3': { x: 830, y: 300 }, 'B4': { x: 800, y: 450 },
        'B5': { x: 700, y: 100 }, 'B6': { x: 720, y: 200 }, 'B7': { x: 650, y: 300 }, 'B8': { x: 720, y: 400 },
        'B9': { x: 700, y: 500 }, 'B10': { x: 550, y: 220 }, 'B11': { x: 550, y: 380 },
        'ball': { x: 500, y: 300 }
    },
    'CK': {
        'A1': { x: 200, y: 300 }, 'A2': { x: 500, y: 300 }, 'A3': { x: 600, y: 450 }, 'A4': { x: 750, y: 450 },
        'A5': { x: 780, y: 220 }, 'A6': { x: 800, y: 350 }, 'A7': { x: 850, y: 280 }, 'A8': { x: 850, y: 320 },
        'A9': { x: 880, y: 250 }, 'A10': { x: 880, y: 350 }, 'A11': { x: 950, y: 550 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 880, y: 230 }, 'B3': { x: 880, y: 370 }, 'B4': { x: 850, y: 250 },
        'B5': { x: 850, y: 350 }, 'B6': { x: 830, y: 300 }, 'B7': { x: 800, y: 250 }, 'B8': { x: 800, y: 350 },
        'B9': { x: 700, y: 300 }, 'B10': { x: 650, y: 200 }, 'B11': { x: 650, y: 400 },
        'ball': { x: 950, y: 550 }
    },
    'KI-own': {
        'A1': { x: 150, y: 300 }, 'A2': { x: 250, y: 40 }, 'A3': { x: 250, y: 200 }, 'A4': { x: 220, y: 400 },
        'A5': { x: 350, y: 150 }, 'A6': { x: 400, y: 350 }, 'A7': { x: 350, y: 480 }, 'A8': { x: 500, y: 200 },
        'A9': { x: 480, y: 400 }, 'A10': { x: 600, y: 180 }, 'A11': { x: 600, y: 350 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 450, y: 100 }, 'B3': { x: 450, y: 250 }, 'B4': { x: 450, y: 400 },
        'B5': { x: 600, y: 250 }, 'B6': { x: 600, y: 450 }, 'B7': { x: 700, y: 180 }, 'B8': { x: 700, y: 400 },
        'B9': { x: 800, y: 200 }, 'B10': { x: 800, y: 400 }, 'B11': { x: 850, y: 300 },
        'ball': { x: 250, y: 40 }
    },
    'KI-opp': {
        'A1': { x: 400, y: 300 }, 'A2': { x: 500, y: 200 }, 'A3': { x: 480, y: 450 }, 'A4': { x: 650, y: 200 },
        'A5': { x: 650, y: 400 }, 'A6': { x: 750, y: 300 }, 'A7': { x: 820, y: 150 }, 'A8': { x: 820, y: 380 },
        'A9': { x: 850, y: 250 }, 'A10': { x: 880, y: 350 }, 'A11': { x: 750, y: 550 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 880, y: 200 }, 'B3': { x: 850, y: 300 }, 'B4': { x: 850, y: 450 },
        'B5': { x: 800, y: 200 }, 'B6': { x: 800, y: 380 }, 'B7': { x: 720, y: 250 }, 'B8': { x: 720, y: 450 },
        'B9': { x: 600, y: 200 }, 'B10': { x: 600, y: 400 }, 'B11': { x: 550, y: 300 },
        'ball': { x: 750, y: 550 }
    },
    'PowerPlay': {
        'A1': { x: 550, y: 300 }, 'A2': { x: 650, y: 150 }, 'A3': { x: 650, y: 450 }, 'A4': { x: 750, y: 250 },
        'A5': { x: 750, y: 350 }, 'A6': { x: 800, y: 150 }, 'A7': { x: 800, y: 450 }, 'A8': { x: 850, y: 250 },
        'A9': { x: 850, y: 350 }, 'A10': { x: 880, y: 200 }, 'A11': { x: 880, y: 400 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 860, y: 250 }, 'B3': { x: 860, y: 350 }, 'B4': { x: 830, y: 180 },
        'B5': { x: 830, y: 420 }, 'B6': { x: 800, y: 250 }, 'B7': { x: 800, y: 350 }, 'B8': { x: 750, y: 200 },
        'B9': { x: 750, y: 400 }, 'B10': { x: 680, y: 300 }, 'B11': { x: 600, y: 300 },
        'ball': { x: 650, y: 300 }
    }
};

export const tacticMenus = [
    { id: 'CK', name: 'コーナーキック (CK)' },
    { id: 'KI-own', name: '自陣スローイン' },
    { id: 'KI-opp', name: '敵陣スローイン' },
    { id: 'PowerPlay', name: 'パワープレー' },
    { id: '4-3-3', name: '4-3-3 (定位置)' },
    { id: '3-5-2', name: '3-5-2 (定位置)' }
];
