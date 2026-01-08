# 江戸ごよみ 〜 現代と江戸の暦を重ねて 〜 

Edo-inspired natural time system for Japan,
based on lunisolar calendar, solar terms,
and pre-modern timekeeping traditions.

This project is not limited to the Edo period,
but uses Edo as a well-documented reference point.

このアプリは、江戸時代に使われていた
不定時法・旧暦・節気・七十二候といった
「自然と同期した時間感覚」を、
現代の技術で可視化する試みです。

## 重要な注意事項

### 旧暦・六曜データについて

**本アプリの旧暦・六曜データは、[新暦と旧暦変換](https://koyomi8.com/kyuureki.html)のデータを参照しています。**
天保暦に準拠した計算結果を使用しています。

**六曜は自然暦ではなく、民間暦注です。**
占いや運勢判断のためのものではありません。

## 技術スタック

- TypeScript
- React (関数コンポーネント)
- Vite
- PWA (vite-plugin-pwa)

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build
```

## データソース

- **旧暦・六曜データ**: [新暦と旧暦変換](https://koyomi8.com/kyuureki.html)（koyomi8.com）
  - 天保暦に準拠した計算結果を参照しています
  - 対応期間: 2026-2028年

- **月齢による月の異名**: 日本の伝統的な月齢の呼び名（和暦・旧暦の文化）
  - 新月、三日月、上弦の月、十三夜、満月、十六夜、立待月、居待月、臥待月、更待月、下弦の月、有明の月、三十日月など
  - 参考資料:
    - 国立国会図書館「暦のページ」
    - 日本の伝統的な月齢の呼び名に関する文献資料
    - 和暦・旧暦の文化に関する資料

## ライセンス

LICENSE ファイルを参照してください。

