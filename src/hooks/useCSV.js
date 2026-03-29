import { useCallback } from 'react';
import { toPercentage, fromPercentage, SVG_W, SVG_H } from '../constants/board';

export function useCSV({ items, setItems, isSecondHalf, fileInputRef }) {
    const handleExportCSV = useCallback(() => {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const halfStr = isSecondHalf ? '2ndHalf' : '1stHalf';
        const filename = `tactics_data_${dateStr}_${halfStr}.csv`;

        const csvHeaders = ['Team (Home/Away)', 'Number', 'Name', 'Position_X(%)', 'Position_Y(%)'];
        const players = items.filter(item => item.id !== 'ball');
        const csvRows = players.map(p => {
            const teamSide = p.team === 'A' ? 'Home' : 'Away';
            const x_pct = toPercentage(p.x, SVG_W).toFixed(2);
            const y_pct = toPercentage(p.y, SVG_H).toFixed(2);
            const name = `"${(p.name || '').replace(/"/g, '""')}"`;
            return [teamSide, p.label, name, x_pct, y_pct].join(',');
        });

        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [items, isSecondHalf]);

    const handleCSVUpload = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;

        const parseCSVRow = (row) => {
            const cols = [];
            let insideQuote = false;
            let current = '';
            for (let i = 0; i < row.length; i++) {
                const char = row[i];
                if (char === '"') {
                    if (insideQuote && row[i + 1] === '"') {
                        current += '"';
                        i++;
                    } else {
                        insideQuote = !insideQuote;
                    }
                } else if (char === ',' && !insideQuote) {
                    cols.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            cols.push(current);
            return cols;
        };

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) {
                alert('CSVデータの形式が正しくありません。');
                return;
            }

            const dataRows = lines.slice(1).map(parseCSVRow);

            setItems(prev => {
                const next = prev.map(item => ({ ...item }));
                let homeIndex = 1;
                let awayIndex = 1;

                dataRows.forEach(cols => {
                    if (cols.length < 5) return;
                    const teamSide = cols[0] === 'Home' ? 'A' : cols[0] === 'Away' ? 'B' : null;
                    if (!teamSide) return;

                    const number = cols[1];
                    const name = cols[2].replace(/^"|"$/g, '').trim();
                    const x_pct = parseFloat(cols[3]);
                    const y_pct = parseFloat(cols[4]);

                    if (isNaN(x_pct) || isNaN(y_pct)) return;

                    const teamIndex = teamSide === 'A' ? homeIndex++ : awayIndex++;
                    if (teamIndex > 11) return;

                    const id = `${teamSide}${teamIndex}`;
                    const target = next.find(item => item.id === id);
                    if (target) {
                        target.label = number;
                        target.name = name;
                        target.x = fromPercentage(x_pct, SVG_W);
                        target.y = fromPercentage(y_pct, SVG_H);
                    }
                });
                return next;
            });

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };
        reader.readAsText(file);
    }, [setItems, fileInputRef]);

    return { handleExportCSV, handleCSVUpload };
}
