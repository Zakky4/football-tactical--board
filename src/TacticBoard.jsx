import React, { useState, useRef } from 'react';
import { Undo2, MousePointer2, Pencil, Trash2, Users, X, Upload, RefreshCw, ChevronDown, ChevronUp, Download, Save, CheckCircle2 } from 'lucide-react';

import { SVG_W, SVG_H, COLORS, getTextColor } from './constants/board';
import { SoccerIcon, tacticMenus } from './data/formations.jsx';
import { futsalTacticMenus, FUTSAL_DEFAULT_TACTIC } from './data/futsalFormations.js';
import { useItems } from './hooks/useItems';
import { useInteraction } from './hooks/useInteraction';
import { useCSV } from './hooks/useCSV';
import { usePersistence } from './hooks/usePersistence';

import Field from './components/Field';
import FutsalField from './components/FutsalField';
import Piece from './components/Piece';
import EditingPopup from './components/EditingPopup';
import ColorSettings from './components/ColorSettings';
import ImportModal from './components/ImportModal';
import TeamSection from './components/TeamSection';

export default function TacticBoard() {
    const svgRef = useRef(null);
    const fileInputRef = useRef(null);

    const [showPlayerList, setShowPlayerList] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [isTacticsOpen, setIsTacticsOpen] = useState(false);
    const [isDataMenuOpen, setIsDataMenuOpen] = useState(true);
    const [sportType, setSportType] = useState(
        () => localStorage.getItem('tactics-sport-type') || 'soccer'
    );

    const {
        items, setItems,
        teamColors, setTeamColors,
        isSecondHalf,
        editTarget, setEditTarget,
        editForm, setEditForm,
        flipItems,
        handleImport,
        handleClearNames,
        handleResetNumbers,
        handleTacticClick,
        handleEditFormChange,
        handleEditFormSubmit,
        handleItemChange,
        handleInitializeBoard,
        handleSportSwitch,
    } = useItems({ setShowImportModal, sportType });

    const {
        draggingId,
        isPenMode, setIsPenMode,
        lines, setLines,
        currentLine,
        flipLines,
        handlePointerDown,
        handleSvgPointerDown,
        handlePointerMove,
        handlePointerUp,
        handleClick,
        handleDoubleClick,
        handleWheel,
    } = useInteraction({ svgRef, items, setItems });

    const { handleExportCSV, handleCSVUpload } = useCSV({ items, setItems, isSecondHalf, fileInputRef, sportType });

    const { saveStatus, setSaveStatus } = usePersistence({ items, teamColors, isSecondHalf, sportType });

    const handleSportTypeChange = (newSport) => {
        if (newSport === sportType) return;
        setSportType(newSport);
        localStorage.setItem('tactics-sport-type', newSport);
        handleSportSwitch(newSport);
        setLines([]);
        setIsTacticsOpen(false);
    };

    const handleHalfToggle = () => {
        flipItems();
        flipLines();
    };

    return (
        <div className="flex flex-col lg:flex-row lg:gap-8 min-h-screen bg-slate-50 text-slate-800 p-4 font-sans max-w-7xl mx-auto">
            <div className="flex-grow flex flex-col items-center">
                <div className="flex justify-between items-center mb-4 w-full max-w-5xl">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <SoccerIcon className="w-6 h-6 text-blue-600" />
                        Football Tactical Board
                    </h1>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => handleSportTypeChange('soccer')}
                            className={`px-3 py-1.5 rounded-md font-bold text-sm transition-all ${sportType === 'soccer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            サッカー
                        </button>
                        <button
                            onClick={() => handleSportTypeChange('futsal')}
                            className={`px-3 py-1.5 rounded-md font-bold text-sm transition-all ${sportType === 'futsal' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            フットサル
                        </button>
                    </div>
                    <div className="h-6 flex items-center">
                        {saveStatus === 'saving' && <span className="text-sm text-slate-500 flex items-center gap-1 font-bold"><RefreshCw className="w-4 h-4 animate-spin" /> 保存中...</span>}
                        {saveStatus === 'saved' && <span className="text-sm text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 保存済み</span>}
                    </div>
                </div>

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
                        {sportType === 'futsal' ? <FutsalField /> : <Field />}
                        {lines.map((points, index) => (
                            <polyline key={index} points={points} fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />
                        ))}
                        {currentLine && (
                            <polyline points={currentLine} fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />
                        )}

                        {items.map(item => {
                            let fillColor = item.id === 'ball' ? COLORS.ball : '';
                            if (item.id !== 'ball') {
                                if (item.team === 'A') fillColor = item.label === 'GK' ? teamColors.AGK : teamColors.A;
                                else if (item.team === 'B') fillColor = item.label === 'GK' ? teamColors.BGK : teamColors.B;
                            }
                            const textColor = item.id !== 'ball' ? getTextColor(fillColor) : '#000000';

                            return (
                                <Piece
                                    key={item.id}
                                    item={{ ...item, color: fillColor, textColor }}
                                    onPointerDown={(e, id) => { handlePointerDown(e, id); setEditTarget(null); }}
                                    onClick={handleClick}
                                    onDoubleClick={(e, targetItem) => handleDoubleClick(e, targetItem, setEditTarget, setEditForm)}
                                    onWheel={handleWheel}
                                    isDragging={draggingId === item.id}
                                />
                            );
                        })}
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
                        onClick={() => { setLines([]); }}
                        className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-bold border border-slate-300"
                    >
                        <Trash2 className="w-5 h-5" />
                        描画クリア
                    </button>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
                    <h2
                        className="text-lg font-bold mb-4 border-b pb-2 flex items-center justify-between cursor-pointer group select-none"
                        onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                    >
                        <span>データ管理</span>
                        {isDataMenuOpen ? <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />}
                    </h2>
                    {isDataMenuOpen && (
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-bold shadow-sm"
                            >
                                <Download className="w-5 h-5" />
                                CSVで書き出し
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-bold shadow-sm"
                            >
                                <Upload className="w-5 h-5" />
                                CSVで読み込み
                            </button>
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleCSVUpload}
                            />
                            <button
                                onClick={() => handleInitializeBoard(setSaveStatus)}
                                className="flex items-center justify-center gap-2 w-full py-2 bg-slate-100 hover:bg-red-50 text-red-600 hover:text-red-700 border border-slate-300 hover:border-red-300 rounded-lg transition-colors font-bold"
                            >
                                <Trash2 className="w-5 h-5" />
                                ボードを初期化（全データ削除）
                            </button>
                        </div>
                    )}
                </div>

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
                    <h2
                        className="text-lg font-bold mb-4 border-b pb-2 flex items-center justify-between cursor-pointer group select-none"
                        onClick={() => setIsTacticsOpen(!isTacticsOpen)}
                    >
                        <span>戦術メニュー</span>
                        {isTacticsOpen ? <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />}
                    </h2>
                    {isTacticsOpen && (
                        <>
                            <div className="flex flex-col gap-3">
                                {(sportType === 'futsal' ? futsalTacticMenus : tacticMenus).map(menu => (
                                    <button
                                        key={menu.id}
                                        onClick={() => handleTacticClick(menu.id)}
                                        className="w-full text-left px-4 py-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors font-semibold"
                                    >
                                        {menu.name}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handleTacticClick(sportType === 'futsal' ? FUTSAL_DEFAULT_TACTIC : '4-3-3')}
                                className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-colors font-bold"
                            >
                                <Undo2 className="w-5 h-5" />
                                初期配置に戻す (リセット)
                            </button>
                        </>
                    )}
                </div>

                <ColorSettings teamColors={teamColors} setTeamColors={setTeamColors} />
            </div>

            {/* 選手リスト編集サイドパネル */}
            {showPlayerList && (
                <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col z-40 transform transition-transform duration-300">
                    <div className="p-4 border-b bg-slate-50 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-600" />
                                選手リスト設定
                            </h2>
                            <button onClick={() => setShowPlayerList(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-bold shadow-sm"
                            >
                                <Upload className="w-4 h-4" />
                                一括登録（インポート）
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleClearNames('ALL')}
                                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors text-xs font-bold shadow-sm"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    名前全クリア
                                </button>
                                <button
                                    onClick={() => handleResetNumbers('ALL')}
                                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors text-xs font-bold shadow-sm"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    背番号リセット
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                        <TeamSection title="自チーム設定" team="A" items={items} teamColors={teamColors} onItemChange={handleItemChange} accentColor="blue" />
                        <TeamSection title="相手チーム設定" team="B" items={items} teamColors={teamColors} onItemChange={handleItemChange} accentColor="red" />
                    </div>
                </div>
            )}

            <ImportModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onImport={handleImport}
            />
        </div>
    );
}
