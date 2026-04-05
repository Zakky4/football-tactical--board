import { memo } from 'react';
import { SVG_W, SVG_H, PADDING, COURT_W, COURT_H, COLORS } from '../constants/board';

const FutsalField = memo(() => {
    const cx = SVG_W / 2;
    const cy = SVG_H / 2;

    const left = PADDING;       // 40
    const right = SVG_W - PADDING; // 960
    const top = PADDING;        // 40
    const bottom = SVG_H - PADDING; // 560

    // PK spots (scale: 23px/m horizontal)
    const pk1Left = left + 138;    // 6m: 178
    const pk1Right = right - 138;  // 822
    const pk2Left = left + 230;    // 10m: 270
    const pk2Right = right - 230;  // 730

    // Goals: 3m tall (26px/m × 3 = 78px), shown as rect outside court
    const goalH = 78;
    const goalW = 8;
    const goalTop = cy - goalH / 2; // 261

    // Center circle: 3m radius (23px/m × 3 ≈ 69px)
    const ccRadius = 69;

    // Penalty arc: same distance as 1st PK (138px), half-circle facing center
    const arcR = 138;

    // Corner arc radius: ~1m ≈ 23px
    const cornerR = 23;

    return (
        <>
            <rect width="100%" height="100%" fill="#4ADE80" />
            <rect x={left} y={top} width={COURT_W} height={COURT_H} fill={COLORS.bg} stroke={COLORS.line} strokeWidth="2" />

            {/* Center line */}
            <line x1={cx} y1={top} x2={cx} y2={bottom} stroke={COLORS.line} strokeWidth="2" />

            {/* Center circle and dot */}
            <circle cx={cx} cy={cy} r={ccRadius} fill="none" stroke={COLORS.line} strokeWidth="2" />
            <circle cx={cx} cy={cy} r="4" fill={COLORS.line} />

            {/* Goals */}
            <rect x={left - goalW} y={goalTop} width={goalW} height={goalH} fill="none" stroke={COLORS.line} strokeWidth="2" />
            <rect x={right} y={goalTop} width={goalW} height={goalH} fill="none" stroke={COLORS.line} strokeWidth="2" />

            {/* 1st PK spots */}
            <circle cx={pk1Left} cy={cy} r="3" fill={COLORS.line} />
            <circle cx={pk1Right} cy={cy} r="3" fill={COLORS.line} />

            {/* 2nd PK spots */}
            <circle cx={pk2Left} cy={cy} r="3" fill={COLORS.line} />
            <circle cx={pk2Right} cy={cy} r="3" fill={COLORS.line} />

            {/* Penalty arcs — semicircle facing away from nearest goal */}
            <path
                d={`M ${pk1Left},${cy - arcR} A ${arcR},${arcR} 0 0,1 ${pk1Left},${cy + arcR}`}
                fill="none" stroke={COLORS.line} strokeWidth="2"
            />
            <path
                d={`M ${pk1Right},${cy - arcR} A ${arcR},${arcR} 0 0,0 ${pk1Right},${cy + arcR}`}
                fill="none" stroke={COLORS.line} strokeWidth="2"
            />

            {/* Corner arcs */}
            <path d={`M ${left + cornerR},${top} A ${cornerR},${cornerR} 0 0,0 ${left},${top + cornerR}`} fill="none" stroke={COLORS.line} strokeWidth="2" />
            <path d={`M ${right - cornerR},${top} A ${cornerR},${cornerR} 0 0,1 ${right},${top + cornerR}`} fill="none" stroke={COLORS.line} strokeWidth="2" />
            <path d={`M ${left},${bottom - cornerR} A ${cornerR},${cornerR} 0 0,0 ${left + cornerR},${bottom}`} fill="none" stroke={COLORS.line} strokeWidth="2" />
            <path d={`M ${right},${bottom - cornerR} A ${cornerR},${cornerR} 0 0,1 ${right - cornerR},${bottom}`} fill="none" stroke={COLORS.line} strokeWidth="2" />
        </>
    );
});

export default FutsalField;
