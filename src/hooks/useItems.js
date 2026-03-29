import { useState, useCallback } from 'react';
import { COLORS, STORAGE_KEY, loadFromStorage, fromPercentage, SVG_W, SVG_H } from '../constants/board';
import { baseItems, tacticsPositions } from '../data/formations.jsx';

function buildInitialItems() {
    const saved = loadFromStorage();
    if (saved?.items) {
        return saved.items.map(item => ({
            ...item,
            x: fromPercentage(item.x_pct, SVG_W),
            y: fromPercentage(item.y_pct, SVG_H)
        }));
    }
    return baseItems.map(item => ({
        ...item,
        angle: item.team === 'A' ? 90 : item.team === 'B' ? -90 : 0
    }));
}

function buildInitialTeamColors() {
    const saved = loadFromStorage();
    return saved?.teamColors || {
        A: COLORS.teamA,
        AGK: COLORS.teamAGK,
        B: COLORS.teamB,
        BGK: COLORS.teamBGK,
    };
}

function buildInitialIsSecondHalf() {
    const saved = loadFromStorage();
    return saved?.isSecondHalf || false;
}

export function useItems({ setShowImportModal }) {
    const [items, setItems] = useState(buildInitialItems);
    const [teamColors, setTeamColors] = useState(buildInitialTeamColors);
    const [isSecondHalf, setIsSecondHalf] = useState(buildInitialIsSecondHalf);
    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({ label: '', name: '' });

    const handleImport = useCallback((textA, textB) => {
        const parseText = (text) => {
            if (!text || !text.trim()) return [];
            const lines = text.split('\n').map(l => l.trim()).filter(l => l);
            return lines.map(line => {
                const numMatch = line.match(/^(\d+)/);
                const number = numMatch ? numMatch[1] : '';
                let rest = line.replace(/^\d+[\s,]*/, '').trim();
                const isGK = rest.toUpperCase().includes('GK');
                if (isGK) {
                    rest = rest.replace(/gk/gi, '').trim();
                    rest = rest.replace(/^[\s,]*/, '').trim();
                }
                return { number, name: rest, isGK, originalLine: line };
            });
        };

        const parsedA = parseText(textA);
        const parsedB = parseText(textB);

        setItems(prev => {
            const next = prev.map(item => ({ ...item }));

            const updateTeam = (teamKey, parsedPlayers) => {
                if (parsedPlayers.length === 0) return;
                const teamPlayers = next.filter(p => p.team === teamKey);
                const gkPlayer = teamPlayers.find(p => p.id === `${teamKey}1`);
                const fpPlayers = teamPlayers.filter(p => p.id !== `${teamKey}1`);
                let fpIndex = 0;
                parsedPlayers.slice(0, 11).forEach(parsed => {
                    if (parsed.isGK && gkPlayer) {
                        gkPlayer.label = parsed.number || 'GK';
                        gkPlayer.name = parsed.name;
                    } else if (fpIndex < fpPlayers.length) {
                        const target = fpPlayers[fpIndex];
                        target.label = parsed.number || target.label;
                        target.name = parsed.name;
                        fpIndex++;
                    }
                });
            };

            updateTeam('A', parsedA);
            updateTeam('B', parsedB);
            return next;
        });

        setShowImportModal(false);
    }, [setShowImportModal]);

    const handleClearNames = useCallback((teamKey) => {
        if (window.confirm('名前をすべてクリアしますか？')) {
            setItems(prev => prev.map(item => {
                if (teamKey === 'ALL' || item.team === teamKey) {
                    return { ...item, name: '' };
                }
                return item;
            }));
        }
    }, []);

    const handleResetNumbers = useCallback((teamKey) => {
        if (window.confirm('背番号をデフォルト(1〜11)に戻しますか？')) {
            setItems(prev => prev.map(item => {
                if (teamKey === 'ALL' || item.team === teamKey) {
                    if (item.id === `${item.team}1`) return { ...item, label: 'GK' };
                    const num = item.id.replace(item.team, '');
                    return { ...item, label: num };
                }
                return item;
            }));
        }
    }, []);

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

    const flipItems = useCallback(() => {
        setIsSecondHalf(prev => !prev);
        setItems(prev => prev.map(item => ({
            ...item,
            x: SVG_W - item.x,
            y: SVG_H - item.y,
            angle: (item.angle || 0) + 180
        })));
    }, []);

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

    const handleInitializeBoard = useCallback((setSaveStatus) => {
        if (window.confirm('ボードを初期化し、保存されているデータもすべて削除しますか？')) {
            localStorage.removeItem(STORAGE_KEY);
            setTeamColors({
                A: COLORS.teamA,
                AGK: COLORS.teamAGK,
                B: COLORS.teamB,
                BGK: COLORS.teamBGK,
            });
            setIsSecondHalf(false);
            setItems(baseItems.map(item => ({
                ...item,
                angle: item.team === 'A' ? 90 : item.team === 'B' ? -90 : 0
            })));
            setSaveStatus('');
        }
    }, []);

    return {
        items,
        setItems,
        teamColors,
        setTeamColors,
        isSecondHalf,
        editTarget,
        setEditTarget,
        editForm,
        setEditForm,
        flipItems,
        handleImport,
        handleClearNames,
        handleResetNumbers,
        handleTacticClick,
        handleEditFormChange,
        handleEditFormSubmit,
        handleItemChange,
        handleInitializeBoard,
    };
}
