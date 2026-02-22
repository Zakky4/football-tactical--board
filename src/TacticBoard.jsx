import React, { useState, useRef, useCallback } from 'react';
import { Undo2, MousePointer2 } from 'lucide-react';

const SVG_W = 1000;
const SVG_H = 600;
const PADDING = 40;
const COURT_W = SVG_W - PADDING * 2;
const COURT_H = SVG_H - PADDING * 2;

const COLORS = {
    bg: '#FFFFFF',
    line: '#000000',
    teamA: '#3B82F6',   // 自チーム 青
    teamAGK: '#EAB308', // 自チームGK 黄
    teamB: '#EF4444',   // 相手チーム 赤
    teamBGK: '#22C55E', // 相手チームGK 緑
    ball: '#F8FAFC'     // ボール
};

// 初期配置 4-3-3
const baseItems = [
    // Team A
    { id: 'A1', team: 'A', label: 'GK', x: 100, y: 300, color: COLORS.teamAGK },
    { id: 'A2', team: 'A', label: '2', x: 250, y: 120, color: COLORS.teamA },
    { id: 'A3', team: 'A', label: '3', x: 200, y: 220, color: COLORS.teamA },
    { id: 'A4', team: 'A', label: '4', x: 200, y: 380, color: COLORS.teamA },
    { id: 'A5', team: 'A', label: '5', x: 250, y: 480, color: COLORS.teamA },
    { id: 'A6', team: 'A', label: '6', x: 350, y: 200, color: COLORS.teamA },
    { id: 'A7', team: 'A', label: '7', x: 400, y: 300, color: COLORS.teamA },
    { id: 'A8', team: 'A', label: '8', x: 350, y: 400, color: COLORS.teamA },
    { id: 'A9', team: 'A', label: '9', x: 450, y: 150, color: COLORS.teamA },
    { id: 'A10', team: 'A', label: '10', x: 480, y: 300, color: COLORS.teamA },
    { id: 'A11', team: 'A', label: '11', x: 450, y: 450, color: COLORS.teamA },
    // Team B
    { id: 'B1', team: 'B', label: 'GK', x: 900, y: 300, color: COLORS.teamBGK },
    { id: 'B2', team: 'B', label: '2', x: 750, y: 120, color: COLORS.teamB },
    { id: 'B3', team: 'B', label: '3', x: 800, y: 220, color: COLORS.teamB },
    { id: 'B4', team: 'B', label: '4', x: 800, y: 380, color: COLORS.teamB },
    { id: 'B5', team: 'B', label: '5', x: 750, y: 480, color: COLORS.teamB },
    { id: 'B6', team: 'B', label: '6', x: 650, y: 200, color: COLORS.teamB },
    { id: 'B7', team: 'B', label: '7', x: 600, y: 300, color: COLORS.teamB },
    { id: 'B8', team: 'B', label: '8', x: 650, y: 400, color: COLORS.teamB },
    { id: 'B9', team: 'B', label: '9', x: 550, y: 150, color: COLORS.teamB },
    { id: 'B10', team: 'B', label: '10', x: 520, y: 300, color: COLORS.teamB },
    { id: 'B11', team: 'B', label: '11', x: 550, y: 450, color: COLORS.teamB },
    // Ball
    { id: 'ball', team: 'none', label: '⚽', x: 500, y: 300, color: COLORS.ball, radius: 12 }
];

// プリセット
const tacticsPositions = {
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

const tacticMenus = [
    { id: 'CK', name: 'コーナーキック (CK)' },
    { id: 'KI-own', name: '自陣スローイン' },
    { id: 'KI-opp', name: '敵陣スローイン' },
    { id: 'PowerPlay', name: 'パワープレー' },
    { id: '4-3-3', name: '4-3-3 (定位置)' },
    { id: '3-5-2', name: '3-5-2 (定位置)' }
];

export default function TacticBoard() {
    const [items, setItems] = useState(baseItems);
    const [draggingId, setDraggingId] = useState(null);
    const svgRef = useRef(null);

    const handleTacticClick = (tacticKey) => {
        const config = tacticsPositions[tacticKey];
        if (!config) return;
        setItems(items.map(item => ({
            ...item,
            x: config[item.id]?.x ?? item.x,
            y: config[item.id]?.y ?? item.y,
        })));
    };

    const handlePointerDown = (e, id) => {
        e.target.setPointerCapture(e.pointerId);
        setDraggingId(id);
    };

    const handlePointerMove = useCallback((e) => {
        if (!draggingId || !svgRef.current) return;
        const svg = svgRef.current;
        const CTM = svg.getScreenCTM();
        if (!CTM) return;
        const x = (e.clientX - CTM.e) / CTM.a;
        const y = (e.clientY - CTM.f) / CTM.d;
        setItems(prev => prev.map(item => item.id === draggingId ? { ...item, x, y } : item));
    }, [draggingId]);

    const handlePointerUp = (e) => {
        if (draggingId) {
            e.target.releasePointerCapture(e.pointerId);
            setDraggingId(null);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 text-slate-800 p-4 font-sans max-w-7xl mx-auto">
            <div className="flex-grow flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <MousePointer2 className="w-6 h-6 text-blue-600" />
                    Tactical Board
                </h1>

                <div className="w-full max-w-5xl shadow-xl rounded-lg overflow-hidden border-4 border-slate-300 bg-white">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                        className="w-full h-auto cursor-crosshair touch-none select-none"
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        <rect width="100%" height="100%" fill="#4ADE80" />
                        <rect x={PADDING} y={PADDING} width={COURT_W} height={COURT_H} fill={COLORS.bg} stroke={COLORS.line} strokeWidth="2" />
                        <line x1={SVG_W / 2} y1={PADDING} x2={SVG_W / 2} y2={SVG_H - PADDING} stroke={COLORS.line} strokeWidth="2" />
                        <circle cx={SVG_W / 2} cy={SVG_H / 2} r="90" fill="none" stroke={COLORS.line} strokeWidth="2" />
                        <circle cx={SVG_W / 2} cy={SVG_H / 2} r="4" fill={COLORS.line} />

                        {/* ペナルティエリア A */}
                        <rect x={PADDING} y={SVG_H / 2 - 120} width="165" height="240" fill="none" stroke={COLORS.line} strokeWidth="2" />
                        {/* ペナルティエリア B */}
                        <rect x={SVG_W - PADDING - 165} y={SVG_H / 2 - 120} width="165" height="240" fill="none" stroke={COLORS.line} strokeWidth="2" />

                        {/* ゴールエリア A */}
                        <rect x={PADDING} y={SVG_H / 2 - 50} width="55" height="100" fill="none" stroke={COLORS.line} strokeWidth="2" />
                        {/* ゴールエリア B */}
                        <rect x={SVG_W - PADDING - 55} y={SVG_H / 2 - 50} width="55" height="100" fill="none" stroke={COLORS.line} strokeWidth="2" />

                        {/* PKマーク */}
                        <circle cx={PADDING + 110} cy={SVG_H / 2} r="3" fill={COLORS.line} />
                        <circle cx={SVG_W - PADDING - 110} cy={SVG_H / 2} r="3" fill={COLORS.line} />

                        {/* プレイヤー＆ボール */}
                        {items.map(item => {
                            const r = item.radius || 18;
                            const isDragging = draggingId === item.id;

                            return (
                                <g
                                    key={item.id}
                                    transform={`translate(${item.x}, ${item.y})`}
                                    onPointerDown={(e) => handlePointerDown(e, item.id)}
                                    style={{
                                        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                        cursor: isDragging ? 'grabbing' : 'grab',
                                    }}
                                    className={isDragging ? 'opacity-80 drop-shadow-lg' : 'drop-shadow-md hover:opacity-90'}
                                >
                                    <circle cx="0" cy="0" r={r} fill={item.color} stroke="#1E293B" strokeWidth={item.id === 'ball' ? 1 : 2} />
                                    {item.id !== 'ball' && (
                                        <text
                                            x="0" y="0"
                                            textAnchor="middle"
                                            dy="0.35em"
                                            fill="#FFFFFF"
                                            fontSize={item.label === 'GK' ? '12' : '16'}
                                            fontWeight="bold"
                                            pointerEvents="none"
                                        >
                                            {item.label}
                                        </text>
                                    )}
                                    {item.id === 'ball' && (
                                        <text x="0" y="0" textAnchor="middle" dy="0.35em" fontSize="16" pointerEvents="none">
                                            {item.label}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* サイドバー: 戦術メニュー */}
            <div className="w-full lg:w-72 flex flex-col gap-4 mt-8 lg:mt-0">
                <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2">戦術メニュー</h2>
                    <div className="flex flex-col gap-3">
                        {tacticMenus.map(menu => (
                            <button
                                key={menu.id}
                                onClick={() => handleTacticClick(menu.id)}
                                className="w-full text-left px-4 py-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-semibold"
                            >
                                {menu.name}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => handleTacticClick('4-3-3')} // リセットとして扱う
                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-colors font-bold"
                >
                    <Undo2 className="w-5 h-5" />
                    初期配置に戻す (リセット)
                </button>
            </div>
        </div>
    );
}
