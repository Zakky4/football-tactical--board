import { useState, useRef, useEffect } from 'react';
import { getStorageKey, toPercentage, SVG_W, SVG_H } from '../constants/board';

export function usePersistence({ items, teamColors, isSecondHalf, sportType }) {
    const [saveStatus, setSaveStatus] = useState('');
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        let hideTimeout;
        const saveTimeout = setTimeout(() => {
            try {
                const dataToSave = {
                    teamColors,
                    isSecondHalf,
                    items: items.map(item => ({
                        ...item,
                        x_pct: toPercentage(item.x, SVG_W),
                        y_pct: toPercentage(item.y, SVG_H)
                    }))
                };
                localStorage.setItem(getStorageKey(sportType), JSON.stringify(dataToSave));
                setSaveStatus('saved');
                hideTimeout = setTimeout(() => setSaveStatus(''), 2000);
            } catch (e) {
                console.error("Storage save error", e);
            }
        }, 500);
        setSaveStatus('saving');
        return () => {
            clearTimeout(saveTimeout);
            if (hideTimeout) clearTimeout(hideTimeout);
        };
    }, [items, teamColors, isSecondHalf, sportType]);

    return { saveStatus, setSaveStatus };
}
