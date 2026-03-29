import { memo } from 'react';

const Piece = memo(({ item, onPointerDown, onClick, onDoubleClick, onWheel, isDragging }) => {
    const r = item.radius || 18;
    const textColor = item.textColor || '#FFFFFF';
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
                        fill={textColor}
                        fontSize={item.label === 'GK' ? '12' : '16'}
                        fontWeight="bold"
                        pointerEvents="none"
                    >
                        {item.label}
                    </text>
                    <text
                        x="0" y={r + 14}
                        textAnchor="middle"
                        fill="#000000"
                        fontSize="12"
                        fontWeight="600"
                        pointerEvents="none"
                        className="select-none"
                        style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.9), -1px -1px 0px rgba(255,255,255,0.9), 1px -1px 0px rgba(255,255,255,0.9), -1px 1px 0px rgba(255,255,255,0.9)' }}
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

export default Piece;
