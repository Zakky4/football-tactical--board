# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server (Vite + HMR)
npm run build     # Production build
npm run preview   # Preview production build locally
```

No test, lint, or type-check scripts are configured.

## Architecture

**Stack:** React 19 + Vite 7 + Tailwind CSS 3 + Framer Motion

Single-page soccer/futsal tactical board (Japanese-audience project).

### Module structure

```
src/
├── TacticBoard.jsx          # Orchestrator: composes hooks + JSX layout only (~316 lines)
├── constants/board.js       # SVG dimensions, COLORS, PRESET_COLORS, getTextColor(),
│                            #   toPercentage/fromPercentage, STORAGE_KEY, loadFromStorage()
├── data/formations.jsx      # baseItems (22 players+ball), tacticsPositions (6 presets),
│                            #   tacticMenus, SoccerIcon
├── hooks/
│   ├── useItems.js          # Owns: items, teamColors, isSecondHalf, editTarget/editForm state
│   │                        #   + all mutation handlers (import, clear, reset, tactic, flip)
│   ├── useInteraction.js    # Owns: draggingId, isPenMode, lines/currentLine state
│   │                        #   + all pointer/wheel/click handlers; exposes flipLines()
│   ├── useCSV.js            # handleExportCSV, handleCSVUpload (CSV parse + FileReader)
│   └── usePersistence.js    # Debounced (500ms) localStorage save; returns saveStatus/setSaveStatus
└── components/
    ├── Field.jsx             # SVG field markings (no props)
    ├── Piece.jsx             # Player/ball token (drag, rotate, label)
    ├── EditingPopup.jsx      # Inline jersey/name edit form (fixed-position overlay)
    ├── ColorSettings.jsx     # Collapsible color pickers; owns activeTarget/isOpen state
    ├── ImportModal.jsx       # Bulk text import modal; owns textA/textB/url state
    └── TeamSection.jsx       # Sidebar player list with editable inputs
```

### State ownership

- `useItems` owns `items`, `teamColors`, `isSecondHalf`, `editTarget`, `editForm`
- `useInteraction` owns `draggingId`, `isPenMode`, `lines`, `currentLine`, `isDrawing`
- `TacticBoard` owns UI-toggle state only: `showPlayerList`, `showImportModal`, `isTacticsOpen`, `isDataMenuOpen`
- `usePersistence` watches items/teamColors/isSecondHalf and serializes to `localStorage` key `football-tactics-data`

### Half-flip coordination

`handleHalfToggle` in `TacticBoard.jsx` composes two hook calls:
```js
flipItems();   // from useItems — mirrors x/y, +180° angle, toggles isSecondHalf
flipLines();   // from useInteraction — mirrors all drawn polyline coordinates
```

### Player items schema

```js
{
  id,       // 'A1'–'A11', 'B1'–'B11', 'ball'
  team,     // 'A' | 'B' | 'none'
  label,    // jersey number string (max 3 chars); 'GK' for goalkeepers
  name,     // player name string (max 10 chars)
  x, y,     // pixel position within SVG_W×SVG_H (1000×600)
  angle,    // rotation in degrees (arrow direction)
  color,    // hex — overridden at render time from teamColors
  radius,   // optional; defaults to 18 (ball uses 12)
}
```

Positions are stored as percentages (`x_pct`, `y_pct`) in localStorage and converted back via `fromPercentage()` on load.

### Key interactions

- **Drag:** pointer capture on `Piece`; `useInteraction.handlePointerMove` updates `x`/`y`
- **Click:** rotates piece +45° (skipped if `hasMovedRef` is true after a drag)
- **Double-click:** opens `EditingPopup` at screen coordinates via `svg.getScreenCTM()`
- **Wheel:** ±15° rotation per scroll tick
- **Pen mode:** draws red polylines; pointer events bypass piece interaction entirely

### CSV format

Export columns: `Team (Home/Away)`, `Number`, `Name`, `Position_X(%)`, `Position_Y(%)`. BOM-prefixed UTF-8. Import reads the same format and maps rows sequentially to A1–A11 / B1–B11.
