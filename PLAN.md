# フットサル対応追加 — 実装計画

## Context

現在はサッカー（11人制）専用のタクティクスボード。フットサル（5人制）にも対応したい。
両競技はコートのマーキング・人数・フォーメーションがそれぞれ異なるため、スポーツ種別を切り替えられる構造が必要。

---

## 変更方針

- `sportType: 'soccer' | 'futsal'` を `TacticBoard` に追加し、下位フックにプロップとして渡す
- サッカー側のデータ・動作は一切変更しない（後方互換を維持）
- localStorage を別キーで管理（`'futsal-tactics-data'`）

---

## 新規ファイル

### `src/data/futsalFormations.js`

- `futsalBaseItems` — A1〜A5・B1〜B5・ball（各 GK=1 + フィールド4人）
- `futsalTacticsPositions` — `'1-2-1'`, `'2-2'`, `'3-1'`, `'1-3'`, `'CK'`, `'KI-own'` の6プリセット
- `futsalTacticMenus` — UIリスト用（既存 `tacticMenus` と同形式）
- `FUTSAL_DEFAULT_TACTIC = '1-2-1'`

選手初期座標（1-2-1 ダイヤモンド、SVG 1000×600 基準）:
```
A1 GK (100,300)  A2 (250,300)  A3 (400,180)  A4 (400,420)  A5 (520,300)
B1 GK (900,300)  B2 (750,300)  B3 (600,180)  B4 (600,420)  B5 (480,300)
ball  (500,300)
```

### `src/components/FutsalField.jsx`

SVG 1000×600、PADDING=40 の同一キャンバスでフットサルコートを描画（`Field.jsx` と同構造、props なし）。

コートのマーキング（スケール: 23px/m 横、26px/m 縦）:
- コート外枠（白塗り、黒ボーダー）: 既存と同じ `x=40 y=40 w=920 h=520`
- センターライン・サークル（半径 69px = 3m）
- ゴール: 両端に短形（幅8×高78px）でゴールネット表現
- 第1PK スポット（6m = 138px → `x=178, x=822`）
- 第2PK スポット（10m = 230px → `x=270, x=730`）
- ペナルティアーク: 第1PKスポット中心・半径138pxの半円（SVGアーク）
- コーナーアーク: 各コーナーに半径 6px の四半円

---

## 既存ファイルの変更

### `src/constants/board.js`

追加エクスポート（既存 `STORAGE_KEY` は変更なし）:
```js
export const STORAGE_KEY_SOCCER = 'football-tactics-data';  // STORAGE_KEY と同値
export const STORAGE_KEY_FUTSAL = 'futsal-tactics-data';
export const getStorageKey = (sportType) =>
    sportType === 'futsal' ? STORAGE_KEY_FUTSAL : STORAGE_KEY_SOCCER;
export const loadFromStorageByKey = (key) => { /* try/catch JSON.parse */ };
```

### `src/hooks/useItems.js`

シグネチャ変更: `useItems({ setShowImportModal, sportType })`

- `buildItemsForSport(sportType)` — `loadFromStorageByKey(getStorageKey(sportType))` → fallback to baseItems/futsalBaseItems
- `buildTeamColorsByKey(storageKey)` — キー別にロード
- 初期化: `useState(() => buildItemsForSport(sportType))` の lazy initializer で初回のみ呼ぶ
- `handleTacticClick` — `sportType === 'futsal' ? futsalTacticsPositions : tacticsPositions` を選択。deps に `sportType` 追加
- `handleInitializeBoard` — `getStorageKey(sportType)` の localStorage をクリア。`sportType` に応じた baseItems にリセット
- `handleImport` — `parsedPlayers.slice(0, sportType === 'futsal' ? 5 : 11)`
- `handleResetNumbers` — 確認メッセージを `sportType` に応じて変更（`1〜5` / `1〜11`）
- 新規: `handleSportSwitch(newSportType)` — items/teamColors/isSecondHalf を新スポーツの初期値にリセット
- return に `handleSportSwitch` 追加

### `src/hooks/usePersistence.js`

シグネチャ変更: `usePersistence({ items, teamColors, isSecondHalf, sportType })`

- `localStorage.setItem(getStorageKey(sportType), ...)` に変更
- `useEffect` の deps に `sportType` 追加

### `src/hooks/useCSV.js`

シグネチャ変更: `useCSV({ items, setItems, isSecondHalf, fileInputRef, sportType })`

- CSV インポート時の上限を `sportType === 'futsal' ? 5 : 11` に変更

### `src/TacticBoard.jsx`

1. `sportType` state 追加:
   ```js
   const [sportType, setSportType] = useState(
       () => localStorage.getItem('tactics-sport-type') || 'soccer'
   );
   ```

2. 各フックに `sportType` を渡す:
   ```js
   useItems({ setShowImportModal, sportType })
   usePersistence({ items, teamColors, isSecondHalf, sportType })
   useCSV({ items, setItems, isSecondHalf, fileInputRef, sportType })
   ```

3. スポーツ切り替えハンドラ:
   ```js
   const handleSportTypeChange = (newSport) => {
       if (newSport === sportType) return;
       setSportType(newSport);
       localStorage.setItem('tactics-sport-type', newSport);
       handleSportSwitch(newSport);
       setLines([]);
       setIsTacticsOpen(false);
   };
   ```

4. フィールド切り替え:
   ```jsx
   {sportType === 'futsal' ? <FutsalField /> : <Field />}
   ```

5. タクティクスメニュー切り替え:
   ```js
   const currentTacticMenus = sportType === 'futsal' ? futsalTacticMenus : tacticMenus;
   ```

6. スポーツセレクター UI（ヘッダー上部に追加）:
   ```jsx
   <div className="flex bg-slate-100 p-1 rounded-lg">
       <button onClick={() => handleSportTypeChange('soccer')}
           className={`px-3 py-1.5 rounded-md font-bold text-sm ${
               sportType === 'soccer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
           }`}>
           サッカー
       </button>
       <button onClick={() => handleSportTypeChange('futsal')}
           className={`px-3 py-1.5 rounded-md font-bold text-sm ${
               sportType === 'futsal' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500'
           }`}>
           フットサル
       </button>
   </div>
   ```

---

## 実装順序

1. `futsalFormations.js` + `FutsalField.jsx` + `constants/board.js` への追加（並行可）
2. `useItems.js` + `usePersistence.js` + `useCSV.js` の変更（並行可）
3. `TacticBoard.jsx` の変更（最後）

---

## 検証

- `npm run dev` で起動
- サッカー/フットサル切り替えでフィールドと人数が変わることを確認
- フットサルでフォーメーションプリセットが動作することを確認
- 切り替え後も各スポーツのデータが localStorage に独立して保持されることを確認（別キー）
- CSV エクスポート・インポートがフットサル（5人）でも動作することを確認
- ページリロード後に前回のスポーツ種別が復元されることを確認
