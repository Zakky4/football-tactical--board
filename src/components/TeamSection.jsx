import { memo } from 'react';
import { getTextColor } from '../constants/board';

const TeamSection = memo(({ title, team, items, teamColors, onItemChange, accentColor }) => {
    const teamItems = items.filter(i => i.team === team);
    const borderColorClass = accentColor === 'blue' ? 'border-blue-500' : 'border-red-500';
    const textColorClass = accentColor === 'blue' ? 'text-blue-700' : 'text-red-700';

    return (
        <div>
            <h3 className={`text-sm font-bold ${textColorClass} border-b-2 ${borderColorClass} mb-3 pb-1`}>{title}</h3>
            <div className="flex flex-col gap-2">
                {teamItems.map(item => {
                    const bgColor = item.label === 'GK' ? teamColors[`${team}GK`] : teamColors[team];
                    const txtColor = getTextColor(bgColor);
                    return (
                        <div key={item.id} className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border border-slate-300" style={{ backgroundColor: bgColor, color: txtColor }}>
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
                    );
                })}
            </div>
        </div>
    );
});

export default TeamSection;
