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

The app is a single-page soccer/futsal tactical board (Japanese-audience project). Nearly all application logic lives in one file: `src/TacticBoard.jsx` (~1,200 lines). `src/App.jsx` and `src/main.jsx` are minimal wrappers.

### Component structure (all in TacticBoard.jsx)

- **TacticBoard** — root component; owns all state
- **Field** — renders the SVG soccer field markings
- **Piece** — individual player or ball token; handles drag, rotation, editing popup
- **EditingPopup** — inline form for jersey number / name
- **ColorSettings** — collapsible color pickers per team
- **ImportModal** — modal for bulk text/CSV import

All sub-components are `memo`-wrapped and defined within the same file.

### State & persistence

State is kept in `useState` inside `TacticBoard`. On every state change a 500 ms debounced effect serializes to `localStorage` under the key `football-tactics-data`. On mount, state is rehydrated from that key.

Persisted fields: `teamColors`, player `items` (positions stored as percentages of field dimensions), `isSecondHalf`.

### Player items schema

```js
{
  id,          // unique string
  type,        // 'player' | 'ball'
  team,        // 'A' | 'B'
  role,        // 'field' | 'goalkeeper'
  number,      // jersey number string
  name,        // player name string
  x, y,        // position as fraction of field width/height
  angle,       // rotation in degrees
  color,       // hex color string
}
```

### Key interactions

- **Drag:** pointer events on Piece update `x`/`y` as percentages
- **Rotate:** scroll wheel on a Piece changes `angle`
- **Edit:** double-click opens EditingPopup; Enter/blur saves
- **Half-flip:** mirrors `x` positions (`newX = 1 - x`), inverts angle by 180°, and reverses drawn lines
- **Formations:** preset functions replace `items` with hardcoded position arrays

### Drawing (pen) mode

Pen mode (`isPenMode`) tracks pointer paths in `lines`/`currentLine`. The UI toggle exists but the feature is partially complete.

### CSV import/export

`handleExportCSV` serialises items to CSV. `handleImportCSV` parses uploaded CSV to update positions and labels. Bulk text import (`handleBulkImport`) parses lines of `"number name"` format.
