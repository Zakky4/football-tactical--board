import { useState, useRef, useCallback } from 'react';
import { SVG_W, SVG_H } from '../constants/board';

export function useInteraction({ svgRef, items, setItems }) {
    const [draggingId, setDraggingId] = useState(null);
    const [isPenMode, setIsPenMode] = useState(false);
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState('');
    const [isDrawing, setIsDrawing] = useState(false);
    const hasMovedRef = useRef(false);

    const flipLines = useCallback(() => {
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
    }, [isPenMode, svgRef]);

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
    }, [draggingId, isPenMode, isDrawing, svgRef, setItems]);

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
    }, [isPenMode, setItems]);

    const handleDoubleClick = useCallback((e, targetItem, setEditTarget, setEditForm) => {
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
    }, [isPenMode, svgRef]);

    const handleWheel = useCallback((e, id) => {
        if (isPenMode || id === 'ball') return;
        e.stopPropagation();
        const delta = e.deltaY > 0 ? 15 : -15;
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, angle: (item.angle || 0) + delta } : item
        ));
    }, [isPenMode, setItems]);

    return {
        draggingId,
        isPenMode,
        setIsPenMode,
        lines,
        setLines,
        currentLine,
        isDrawing,
        flipLines,
        handlePointerDown,
        handleSvgPointerDown,
        handlePointerMove,
        handlePointerUp,
        handleClick,
        handleDoubleClick,
        handleWheel,
    };
}
