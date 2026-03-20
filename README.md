# Football Tactic Board

サッカー・フットサルのためのインタラクティブな戦術ボードアプリケーションです。

## 主な機能

- **選手の配置と移動**: ドラッグ＆ドロップで選手を自由に配置し、プレースタイルや戦術をシミュレーションできます。
- **チームカラーのカスタマイズ**: チームのユニフォームカラー（フィールドプレイヤーおよびゴールキーパー）を自由に変更可能。
- **選手データの一括インポート**: テキストエリアから選手名と番号をパースし、一括で登録・更新ができます。
- **ビジュアル演出**: Framer Motionを使用したスムーズなアニメーションと、Lucide Reactによる洗練されたアイコン。

## 使用技術

- **Frontend**: React (v19)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Libraries**:
  - `framer-motion`: アニメーション
  - `lucide-react`: アイコン
  - `clsx`, `tailwind-merge`: ユーティリティ

## セットアップ

1. 依存関係のインストール:
   ```bash
   npm install
   ```

2. 開発サーバーの起動:
   ```bash
   npm run dev
   ```

3. ビルド:
   ```bash
   npm run build
   ```
