import { COLORS } from '../constants/board';

export const futsalBaseItems = [
    // Team A
    { id: 'A1', team: 'A', label: 'GK', name: 'GK A', x: 100, y: 300, color: COLORS.teamAGK },
    { id: 'A2', team: 'A', label: '2', name: '選手 A2', x: 250, y: 300, color: COLORS.teamA },
    { id: 'A3', team: 'A', label: '3', name: '選手 A3', x: 400, y: 180, color: COLORS.teamA },
    { id: 'A4', team: 'A', label: '4', name: '選手 A4', x: 400, y: 420, color: COLORS.teamA },
    { id: 'A5', team: 'A', label: '5', name: '選手 A5', x: 520, y: 300, color: COLORS.teamA },
    // Team B
    { id: 'B1', team: 'B', label: 'GK', name: 'GK B', x: 900, y: 300, color: COLORS.teamBGK },
    { id: 'B2', team: 'B', label: '2', name: '選手 B2', x: 750, y: 300, color: COLORS.teamB },
    { id: 'B3', team: 'B', label: '3', name: '選手 B3', x: 600, y: 180, color: COLORS.teamB },
    { id: 'B4', team: 'B', label: '4', name: '選手 B4', x: 600, y: 420, color: COLORS.teamB },
    { id: 'B5', team: 'B', label: '5', name: '選手 B5', x: 480, y: 300, color: COLORS.teamB },
    // Ball
    { id: 'ball', team: 'none', label: '⚽', name: '', x: 500, y: 300, color: COLORS.ball, radius: 12 }
];

export const futsalTacticsPositions = {
    '1-2-1': Object.fromEntries(futsalBaseItems.map(p => [p.id, { x: p.x, y: p.y }])),
    '2-2': {
        'A1': { x: 100, y: 300 }, 'A2': { x: 260, y: 180 }, 'A3': { x: 260, y: 420 },
        'A4': { x: 430, y: 180 }, 'A5': { x: 430, y: 420 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 740, y: 180 }, 'B3': { x: 740, y: 420 },
        'B4': { x: 570, y: 180 }, 'B5': { x: 570, y: 420 },
        'ball': { x: 500, y: 300 }
    },
    '3-1': {
        'A1': { x: 100, y: 300 }, 'A2': { x: 240, y: 150 }, 'A3': { x: 270, y: 300 },
        'A4': { x: 240, y: 450 }, 'A5': { x: 450, y: 300 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 760, y: 150 }, 'B3': { x: 730, y: 300 },
        'B4': { x: 760, y: 450 }, 'B5': { x: 550, y: 300 },
        'ball': { x: 500, y: 300 }
    },
    '1-3': {
        'A1': { x: 100, y: 300 }, 'A2': { x: 250, y: 300 }, 'A3': { x: 420, y: 150 },
        'A4': { x: 460, y: 300 }, 'A5': { x: 420, y: 450 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 750, y: 300 }, 'B3': { x: 580, y: 150 },
        'B4': { x: 540, y: 300 }, 'B5': { x: 580, y: 450 },
        'ball': { x: 500, y: 300 }
    },
    'CK': {
        'A1': { x: 180, y: 300 }, 'A2': { x: 780, y: 230 }, 'A3': { x: 820, y: 300 },
        'A4': { x: 780, y: 370 }, 'A5': { x: 960, y: 557 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 870, y: 220 }, 'B3': { x: 870, y: 380 },
        'B4': { x: 845, y: 300 }, 'B5': { x: 730, y: 300 },
        'ball': { x: 960, y: 557 }
    },
    'KI-own': {
        'A1': { x: 100, y: 300 }, 'A2': { x: 210, y: 200 }, 'A3': { x: 230, y: 390 },
        'A4': { x: 370, y: 150 }, 'A5': { x: 350, y: 560 },
        'B1': { x: 900, y: 300 }, 'B2': { x: 600, y: 180 }, 'B3': { x: 600, y: 390 },
        'B4': { x: 740, y: 200 }, 'B5': { x: 740, y: 400 },
        'ball': { x: 350, y: 560 }
    },
};

export const FUTSAL_DEFAULT_TACTIC = '1-2-1';

export const futsalTacticMenus = [
    { id: 'CK', name: 'コーナーキック (CK)' },
    { id: 'KI-own', name: '自陣キックイン' },
    { id: '1-2-1', name: '1-2-1 ダイヤモンド (定位置)' },
    { id: '2-2', name: '2-2 スクエア (定位置)' },
    { id: '3-1', name: '3-1 (定位置)' },
    { id: '1-3', name: '1-3 (定位置)' },
];
