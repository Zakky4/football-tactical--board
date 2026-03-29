import { memo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PRESET_COLORS } from '../constants/board';

const ColorSettings = memo(({ teamColors, setTeamColors }) => {
    const [activeTarget, setActiveTarget] = useState('A');
    const [isOpen, setIsOpen] = useState(false);

    const handleColorChange = (key, value) => {
        setTeamColors(prev => ({ ...prev, [key]: value }));
        setActiveTarget(key);
    };

    const applyPreset = (hex) => {
        handleColorChange(activeTarget, hex);
    };

    const ColorRow = ({ label, targetKey }) => (
        <div
            className={`flex items-center justify-between gap-2 p-2 rounded cursor-pointer border ${activeTarget === targetKey ? 'border-blue-400 bg-blue-50' : 'border-transparent hover:bg-slate-50'}`}
            onClick={() => setActiveTarget(targetKey)}
        >
            <span className="text-sm font-semibold w-8">{label}</span>
            <input
                type="color"
                value={teamColors[targetKey]}
                onChange={(e) => handleColorChange(targetKey, e.target.value)}
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0"
                onClick={(e) => e.stopPropagation()}
            />
            <input
                type="text"
                value={teamColors[targetKey].toUpperCase()}
                onChange={(e) => handleColorChange(targetKey, e.target.value.slice(0, 7))}
                className="w-20 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );

    const targets = {
        A: '自チーム (FP)',
        AGK: '自チーム (GK)',
        B: '相手チーム (FP)',
        BGK: '相手チーム (GK)'
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
            <div
                className="flex justify-between items-center border-b pb-2 mb-4 cursor-pointer group select-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-lg font-bold flex items-center gap-2">
                    カラー設定
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />}
                </h2>
                <a href="https://www.colordic.org/" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    カラー参考
                </a>
            </div>

            {isOpen && (
                <>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xs font-bold text-slate-500 ml-1">自チーム</h3>
                            <ColorRow label="FP" targetKey="A" />
                            <ColorRow label="GK" targetKey="AGK" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xs font-bold text-slate-500 ml-1">相手チーム</h3>
                            <ColorRow label="FP" targetKey="B" />
                            <ColorRow label="GK" targetKey="BGK" />
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-xs font-bold text-slate-500">プリセット</h3>
                            <span className="text-[10px] text-slate-400">選択中: {targets[activeTarget]}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map(c => (
                                <button
                                    key={c.label}
                                    onClick={() => applyPreset(c.hex)}
                                    title={c.label}
                                    className="w-6 h-6 rounded-full border border-slate-300 shadow-sm hover:scale-110 transition-transform"
                                    style={{ backgroundColor: c.hex }}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
});

export default ColorSettings;
