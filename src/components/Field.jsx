import { memo } from 'react';
import { SVG_W, SVG_H, PADDING, COURT_W, COURT_H, COLORS } from '../constants/board';

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

export default Field;
