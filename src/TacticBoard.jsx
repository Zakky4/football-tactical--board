import React, { useState, useRef, useCallback, memo } from 'react';
import { Undo2, MousePointer2, Pencil, Trash2, Users, X } from 'lucide-react';

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

// --- Sub-components ---

const Field = memo(() => (
    <>
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
    </>
));

const Piece = memo(({ item, onPointerDown, onClick, onDoubleClick, onWheel, isDragging }) => {
    const r = item.radius || 18;
    return (
        <g
            transform={`translate(${item.x}, ${item.y})`}
            onPointerDown={(e) => onPointerDown(e, item.id)}
            onClick={(e) => onClick(e, item.id)}
            onDoubleClick={(e) => onDoubleClick(e, item)}
            onWheel={(e) => onWheel(e, item.id)}
            style={{
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className={isDragging ? 'opacity-80 drop-shadow-lg' : 'drop-shadow-md hover:opacity-90'}
        >
            <g transform={`rotate(${item.angle || 0})`} style={{ transition: isDragging ? 'none' : 'transform 0.2s ease' }}>
                <circle cx="0" cy="0" r={r} fill={item.color} stroke="#1E293B" strokeWidth={item.id === 'ball' ? 1 : 2} />
                {item.id !== 'ball' && (
                    <polygon
                        points={`0,-${Math.max(r + 8, 26)} -6,-${r} 6,-${r}`}
                        fill={item.color}
                        stroke="#1E293B"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                )}
            </g>
            {item.id !== 'ball' ? (
                <>
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
                    <text
                        x="0" y={r + 14}
                        textAnchor="middle"
                        fill="#1E293B"
                        fontSize="12"
                        fontWeight="600"
                        pointerEvents="none"
                        className="select-none"
                        style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.8), -1px -1px 0px rgba(255,255,255,0.8), 1px -1px 0px rgba(255,255,255,0.8), -1px 1px 0px rgba(255,255,255,0.8)' }}
                    >
                        {item.name}
                    </text>
                </>
            ) : (
                <text x="0" y="0" textAnchor="middle" dy="0.35em" fontSize="16" pointerEvents="none">
                    {item.label}
                </text>
            )}
        </g>
    );
});

const EditingPopup = memo(({ editTarget, editForm, onFormChange, onFormSubmit, onClose }) => {
    if (!editTarget) return null;
    return (
        <div
            className="fixed bg-white p-3 rounded-lg shadow-xl border border-slate-200 z-50 flex flex-col gap-2 transform -translate-x-1/2 mt-4"
            style={{ left: editTarget.x, top: editTarget.y }}
        >
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-500">選手情報編集</span>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <form onSubmit={onFormSubmit} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold w-12 text-right">背番号</label>
                    <input
                        type="text"
                        value={editForm.label}
                        onChange={(e) => onFormChange(e, 'label')}
                        className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="No."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold w-12 text-right">名前</label>
                    <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => onFormChange(e, 'name')}
                        className="w-24 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="名前"
                        autoFocus
                    />
                </div>
                <button type="submit" className="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-2 rounded text-sm transition-colors">
                    保存
                </button>
            </form>
        </div>
    );
});

// --- Main component ---

export default function TacticBoard() {
    const [items, setItems] = useState(() => baseItems.map(item => ({
        ...item,
        angle: item.team === 'A' ? 90 : item.team === 'B' ? -90 : 0
    })));
    const [draggingId, setDraggingId] = useState(null);
    const svgRef = useRef(null);
    const hasMovedRef = useRef(false);

    const [isPenMode, setIsPenMode] = useState(false);
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState('');
    const [isDrawing, setIsDrawing] = useState(false);
    const [isSecondHalf, setIsSecondHalf] = useState(false);

    const [editTarget, setEditTarget] = useState(null); // { id, x, y }
    const [editForm, setEditForm] = useState({ label: '', name: '' });
    const [showPlayerList, setShowPlayerList] = useState(false);

    const handleTacticClick = useCallback((tacticKey) => {
        const config = tacticsPositions[tacticKey];
        if (!config) return;
        setItems(prevItems => prevItems.map(item => ({
            ...item,
            x: isSecondHalf ? SVG_W - (config[item.id]?.x ?? item.x) : config[item.id]?.x ?? item.x,
            y: isSecondHalf ? SVG_H - (config[item.id]?.y ?? item.y) : config[item.id]?.y ?? item.y,
            angle: isSecondHalf ? (item.team === 'A' ? -90 : item.team === 'B' ? 90 : 0) : (item.team === 'A' ? 90 : item.team === 'B' ? -90 : 0)
        })));
    }, [isSecondHalf]);

    const handleHalfToggle = useCallback(() => {
        setIsSecondHalf(prev => !prev);
        setItems(prev => prev.map(item => ({
            ...item,
            x: SVG_W - item.x,
            y: SVG_H - item.y,
            angle: (item.angle || 0) + 180
        })));

        const flipLine = (lineStr) => {
            if (!lineStr) return '';
            return lineStr.split(' ').map(point => {
                const [px, py] = point.split(',').map(Number);
                if (isNaN(px) || isNaN(py)) return point;
                return `${SVG_W - px},${SVG_H - py}`;
            }).join(' ');
        };

        setLines(prev => prev.map(flipLine));
        setCurrentLine(prev => flipLine(prev));
    }, []);

    const handlePointerDown = useCallback((e, id) => {
        if (isPenMode) return;
        e.target.setPointerCapture(e.pointerId);
        setDraggingId(id);
        hasMovedRef.current = false;
        setEditTarget(null); // 他を選ぶと編集解除
    }, [isPenMode]);

    const handleSvgPointerDown = useCallback((e) => {
        if (!isPenMode) return;
        e.target.setPointerCapture(e.pointerId);
        setIsDrawing(true);
        const svg = svgRef.current;
        if (!svg) return;
        const CTM = svg.getScreenCTM();
        if (!CTM) return;
        const x = (e.clientX - CTM.e) / CTM.a;
        const y = (e.clientY - CTM.f) / CTM.d;
        setCurrentLine(`${x},${y}`);
    }, [isPenMode]);

    const handlePointerMove = useCallback((e) => {
        const svg = svgRef.current;
        if (!svg) return;
        const CTM = svg.getScreenCTM();
        if (!CTM) return;
        const x = (e.clientX - CTM.e) / CTM.a;
        const y = (e.clientY - CTM.f) / CTM.d;

        if (isPenMode && isDrawing) {
            setCurrentLine(prev => `${prev} ${x},${y}`);
            return;
        }

        if (draggingId) {
            hasMovedRef.current = true;
            setItems(prev => prev.map(item => item.id === draggingId ? { ...item, x, y } : item));
        }
    }, [draggingId, isPenMode, isDrawing]);

    const handlePointerUp = useCallback((e) => {
        if (isPenMode && isDrawing) {
            e.target.releasePointerCapture(e.pointerId);
            setIsDrawing(false);
            if (currentLine) {
                setLines(prev => [...prev, currentLine]);
                setCurrentLine('');
            }
            return;
        }

        if (draggingId) {
            e.target.releasePointerCapture(e.pointerId);
            setDraggingId(null);
        }
    }, [draggingId, isPenMode, isDrawing, currentLine]);

    const handleClick = useCallback((e, id) => {
        if (isPenMode || hasMovedRef.current || id === 'ball') return;
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, angle: (item.angle || 0) + 45 } : item
        ));
    }, [isPenMode]);

    const handleDoubleClick = useCallback((e, targetItem) => {
        if (isPenMode || targetItem.id === 'ball') return;
        e.stopPropagation();

        const svg = svgRef.current;
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = targetItem.x;
        pt.y = targetItem.y;
        const CTM = svg.getScreenCTM();
        if (!CTM) return;

        const screenPt = pt.matrixTransform(CTM);
        setEditTarget({ id: targetItem.id, x: screenPt.x, y: screenPt.y });
        setEditForm({ label: targetItem.label, name: targetItem.name });
    }, [isPenMode]);

    const handleEditFormChange = useCallback((e, field) => {
        let val = e.target.value;
        if (field === 'label' && val.length > 3) return;
        if (field === 'name' && val.length > 10) return;
        setEditForm(prev => ({ ...prev, [field]: val }));
    }, []);

    const handleEditFormSubmit = useCallback((e) => {
        e.preventDefault();
        if (editTarget) {
            setItems(prev => prev.map(item =>
                item.id === editTarget.id ? { ...item, label: editForm.label, name: editForm.name } : item
            ));
            setEditTarget(null);
        }
    }, [editTarget, editForm]);

    const handleItemChange = useCallback((id, field, value) => {
        if (field === 'label' && value.length > 3) return;
        if (field === 'name' && value.length > 10) return;
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    }, []);

    const handleWheel = useCallback((e, id) => {
        if (isPenMode || id === 'ball') return;
        e.stopPropagation();
        const delta = e.deltaY > 0 ? 15 : -15;
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, angle: (item.angle || 0) + delta } : item
        ));
    }, [isPenMode]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 text-slate-800 p-4 font-sans max-w-7xl mx-auto">
            <div className="flex-grow flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <MousePointer2 className="w-6 h-6 text-blue-600" />
                    Tactical Board
                </h1>

                <div className="w-full max-w-5xl shadow-xl rounded-lg overflow-hidden border-4 border-slate-300 bg-white relative">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                        className={`w-full h-auto touch-none select-none ${isPenMode ? 'cursor-crosshair' : 'cursor-default'}`}
                        onPointerDown={handleSvgPointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                    >
                        <Field />
                        {/* 描画された線 */}
                        {lines.map((points, index) => (
                            <polyline key={index} points={points} fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />
                        ))}
                        {currentLine && (
                            <polyline points={currentLine} fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />
                        )}

                        {/* プレイヤー＆ボール */}
                        {items.map(item => (
                            <Piece
                                key={item.id}
                                item={item}
                                onPointerDown={handlePointerDown}
                                onClick={handleClick}
                                onDoubleClick={handleDoubleClick}
                                onWheel={handleWheel}
                                isDragging={draggingId === item.id}
                            />
                        ))}
                    </svg>

                    <EditingPopup
                        editTarget={editTarget}
                        editForm={editForm}
                        onFormChange={handleEditFormChange}
                        onFormSubmit={handleEditFormSubmit}
                        onClose={() => setEditTarget(null)}
                    />
                </div>
            </div>

            {/* サイドバー */}
            <div className="w-full lg:w-72 flex flex-col gap-4 mt-8 lg:mt-0">
                <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2 flex items-center justify-between">ハーフ選択</h2>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => isSecondHalf && handleHalfToggle()}
                            className={`flex-1 py-2 rounded-md font-bold transition-all text-sm ${!isSecondHalf ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            前半
                        </button>
                        <button
                            onClick={() => !isSecondHalf && handleHalfToggle()}
                            className={`flex-1 py-2 rounded-md font-bold transition-all text-sm ${isSecondHalf ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            後半
                        </button>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
                    <h2 className="text-lg font-bold mb-4 border-b pb-2">ツールモード</h2>
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setIsPenMode(false)}
                            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg font-bold transition-colors ${!isPenMode ? 'bg-blue-600 text-white shadow-inner' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <MousePointer2 className="w-6 h-6 mb-1" />
                            操作
                        </button>
                        <button
                            onClick={() => setIsPenMode(true)}
                            className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg font-bold transition-colors ${isPenMode ? 'bg-red-500 text-white shadow-inner' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <Pencil className="w-6 h-6 mb-1" />
                            ペン
                        </button>
                    </div>
                    <button
                        onClick={() => setShowPlayerList(!showPlayerList)}
                        className={`mt-4 flex items-center justify-center gap-2 w-full py-2 ${showPlayerList ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'} hover:opacity-90 rounded-lg transition-colors font-bold border border-slate-300`}
                    >
                        <Users className="w-5 h-5" />
                        選手リスト（一括編集）
                    </button>
                    <button
                        onClick={() => { setLines([]); setCurrentLine(''); }}
                        className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-bold border border-slate-300"
                    >
                        <Trash2 className="w-5 h-5" />
                        描画クリア
                    </button>
                </div>

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
                    onClick={() => handleTacticClick('4-3-3')}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-colors font-bold"
                >
                    <Undo2 className="w-5 h-5" />
                    初期配置に戻す (リセット)
                </button>
            </div>

            {/* 選手リスト編集サイドパネル */}
            {showPlayerList && (
                <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col z-40 transform transition-transform duration-300">
                    <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            選手リスト設定
                        </h2>
                        <button onClick={() => setShowPlayerList(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                        <TeamSection title="自チーム (青)" team="A" items={items} onItemChange={handleItemChange} accentColor="blue" />
                        <TeamSection title="相手チーム (赤)" team="B" items={items} onItemChange={handleItemChange} accentColor="red" />
                    </div>
                </div>
            )}
        </div>
    );
}

const TeamSection = memo(({ title, team, items, onItemChange, accentColor }) => {
    const teamItems = items.filter(i => i.team === team);
    const borderColorClass = accentColor === 'blue' ? 'border-blue-500' : 'border-red-500';
    const textColorClass = accentColor === 'blue' ? 'text-blue-700' : 'text-red-700';
    const bgColorClass = accentColor === 'blue' ? 'bg-blue-500' : 'bg-red-500';

    return (
        <div>
            <h3 className={`text-sm font-bold ${textColorClass} border-b-2 ${borderColorClass} mb-3 pb-1`}>{title}</h3>
            <div className="flex flex-col gap-2">
                {teamItems.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                        <div className={`w-6 h-6 rounded-full ${bgColorClass} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {item.label}
                        </div>
                        <input
                            type="text"
                            value={item.label}
                            onChange={(e) => onItemChange(item.id, 'label', e.target.value)}
                            className="w-12 px-1 py-1 text-sm border border-slate-200 rounded text-center"
                            placeholder="No"
                        />
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => onItemChange(item.id, 'name', e.target.value)}
                            className="flex-1 px-2 py-1 text-sm border border-slate-200 rounded"
                            placeholder="選手名"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
});
