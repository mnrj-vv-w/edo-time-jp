# ファイルリファレンス

> **注意**: このドキュメントはソースコードの変更に合わせて都度更新してください。

このドキュメントは、プロジェクト内の各ファイルの役割と説明をまとめたリファレンスです。

## エントリーポイント

### `src/main.tsx`
**役割**: アプリケーションのエントリーポイント  
**説明**: ReactアプリケーションをDOMにマウントする。`App`コンポーネントを`React.StrictMode`でラップしてレンダリングする。

### `src/App.tsx`
**役割**: メインアプリケーションコンポーネント  
**説明**: すべての表示コンポーネントを統合し、`useEdoTime`フックから取得したデータを各コンポーネントに配布する。

## コンポーネント

### `src/components/AppLayout.tsx`
**役割**: アプリケーション全体のレイアウト  
**説明**: ヘッダー（タイトル・サブタイトル）、メインコンテンツエリア、フッター（注意書き）を提供する。子コンポーネントを縦に並べて表示する。

### `src/components/DisplayItem.tsx`
**役割**: 汎用表示コンポーネント  
**説明**: ラベル、値、単位、説明文を統一されたスタイルで表示する。すべての表示コンポーネントがこのコンポーネントを使用して一貫性を保つ。

### `src/components/TimeDisplay.tsx`
**役割**: 現在時刻（現代時刻）の表示  
**説明**: `EdoTimeData.currentTime`をフォーマットして表示する。

### `src/components/SolarLongitude.tsx`
**役割**: 太陽黄経の表示  
**説明**: `EdoTimeData.solarLongitude`を度数で表示する。

### `src/components/SolarTerm.tsx`
**役割**: 二十四節気の表示  
**説明**: `EdoTimeData.solarTerm`を表示する。

### `src/components/SolarTermTable.tsx`
**役割**: 太陽黄経と二十四節気・七十二候の対応表表示  
**説明**: 展開可能な詳細表で全24節気の黄経範囲を表示し、各節気に対応する3つの七十二候とその説明も表示する。

### `src/components/Sekki72.tsx`
**役割**: 七十二候の表示  
**説明**: `EdoTimeData.sekki72`を表示し、読み仮名と説明文も併記する。

### `src/components/TimeSystem.tsx`
**役割**: 不定時法関連情報の表示  
**説明**: `TemporalTimeCircle`コンポーネントと、一刻、明け六つ、暮れ六つの情報を表示する。

### `src/components/TemporalTimeCircle.tsx`
**役割**: 不定時法の円形時計表示  
**説明**: SVGを使用して、昼6刻・夜6刻を円形に可視化する。十二支を各刻セグメントの中央に配置し、漢数字による刻の表示、現在時刻の線、明け六つ・暮れ六つのマーカーと時刻表示、正午・正子のラベルを含む。

### `src/components/Rokuyo.tsx`
**役割**: 六曜の表示  
**説明**: `EdoTimeData.rokuyo`を表示し、民間暦注であることを明記する。

### `src/components/LunarCalendar.tsx`
**役割**: 旧暦・月齢の表示  
**説明**: `EdoTimeData.lunarDate`と`EdoTimeData.moonAge`を表示し、和風月名も併記する。`MoonPhaseVisualization`コンポーネントを統合して月相を3D可視化する。koyomi8.comデータ参照であることを明記する。

### `src/components/MoonPhaseVisualization.tsx`
**役割**: 月相の3D可視化  
**説明**: Three.jsを使用して月相を3Dで可視化する。月齢スライダーで月齢を操作でき、位相角から月相名（新月、三日月、上弦の月など）を表示する。

### `src/components/SolarLongitudeCircle.tsx`
**役割**: 太陽黄経の円形可視化  
**説明**: 太陽黄経を円形で可視化し、二十四節気と七十二候をラベリングする。主要な節気（春分、立夏、夏至など）を強調表示し、現在の太陽黄経位置に線を引いて表示する。

## コアロジック

### `src/core/index.ts`
**役割**: コア計算ロジックの統合関数  
**説明**: `calculateEdoTime`関数を提供。すべての計算（太陽黄経、日の出日の入り、不定時法、節気、七十二候、旧暦、六曜）を統合し、`EdoTimeData`オブジェクトを返す。

### `src/core/types.ts`
**役割**: 外部公開型の定義  
**説明**: アプリケーション全体で使用される主要な型定義（`EdoTimeData`、`TemporalTime`、`Location`、`SolarTerm`、`Sekki72`、`Rokuyo`）を提供する。

### `src/core/time-system.ts`
**役割**: 不定時法の計算  
**説明**: 日の出・日の入りから不定時法の意味構造（period, koku, start, end）を計算する。明け六つ・暮れ六つの計算関数も提供。

### `src/core/solar-terms.ts`
**役割**: 二十四節気の判定  
**説明**: 太陽黄経から二十四節気を判定する。24節気の定義テーブル（黄経15度刻み）を含む。

### `src/core/sekki-72.ts`
**役割**: 七十二候の判定  
**説明**: 太陽黄経からまず二十四節気を判定し、その節気内での位置から対応する七十二候を判定する。72候の定義テーブル、読み仮名、説明文、節気名からSEKKI_72配列の開始インデックスへのマッピングを含む。`SEKKI_72_LIST`をエクスポートしてUI表示用に提供する。

### `src/core/lunar-calendar.ts`
**役割**: 旧暦・月齢の計算（koyomi8.comデータ参照）  
**説明**: `lunar-calendar-data.ts`から旧暦データを取得して旧暦の月日を返す。月齢は新月データベース（`newMoonDates.json`）を使用して計算する。データ範囲外の場合はエラーメッセージを返す。

### `src/core/lunar-calendar-data.ts`
**役割**: 旧暦カレンダーデータローダー  
**説明**: koyomi8.comのCSVデータを読み込み、日付をキーとして旧暦の月日と六曜を取得する。対応期間は2026-2028年。

### `src/core/rokuyo.ts`
**役割**: 六曜の取得  
**説明**: `lunar-calendar-data.ts`から旧暦データと一緒に六曜を取得する。**注意**: 六曜は自然暦ではなく、民間暦注です。

### `src/core/astronomy/constants.ts`
**役割**: 天文計算で使用する定数  
**説明**: デフォルト位置情報（東京座標）と天文定数（天文単位、太陽視半径、大気差）を定義する。

### `src/core/astronomy/solarLongitude.ts`
**役割**: 太陽黄経の計算  
**説明**: J2000.0を基準とした平均黄経に摂動項（中心差）を加算して真黄経を計算する。簡易式を使用（±数分誤差許容）。

### `src/core/astronomy/sunriseSunset.ts`
**役割**: 日の出・日の入りの計算  
**説明**: 太陽高度が0度になる時刻を計算する。太陽の赤緯と観測地点の緯度から時角を求め、正午からの前後時間を計算する。

## フック

### `src/hooks/useEdoTime.ts`
**役割**: 江戸時間データを管理するReactフック  
**説明**: 1分ごとに現在時刻を取得し、`calculateEdoTime`を呼び出して`EdoTimeData`を更新する。位置情報の取得（Geolocation API）も行う（許可が得られない場合は東京にフォールバック）。

## ユーティリティ

### `src/utils/format.ts`
**役割**: 日時フォーマット用ユーティリティ  
**説明**: `formatDateTime`（日時フォーマット）、`formatTime`（時刻フォーマット）、`formatTimeApprox`（時刻を「〜頃」表現でフォーマット）、`formatTimeRange`（時刻範囲を「XX時XX分〜〇〇時〇〇分頃」形式でフォーマット）を提供する。

### `src/utils/timeAngle.ts`
**役割**: 時刻から角度への変換  
**説明**: 時刻を円形表示用の角度（ラジアン）に変換する。正午を上（-π/2）として時計回りに配置。明け六つ・暮れ六つの角度計算も提供。

### `src/utils/juniShin.ts`
**役割**: 十二支（十二時辰）のデータと配置  
**説明**: 十二支の定義（各支は2時間を表す）と角度配置を提供。正午（午）を上として時計回りに配置。時刻から十二支を取得する関数、昼の部分判定関数、刻から十二支を取得する関数（`getJuniShinFromKoku`）を提供。

### `src/utils/kanjiNumbers.ts`
**役割**: 一刻の番号を漢数字に変換  
**説明**: 一刻の番号（1-6）を漢数字（六、五、四、九、八、七）に変換する。昼・夜ともに同じ順序。

### `src/utils/timezone.ts`
**役割**: タイムゾーン変換ユーティリティ  
**説明**: `Date`オブジェクトを指定タイムゾーンの現地時刻に変換した新しい`Date`を返す。`toLocaleString`を使用した簡易実装。

### `src/utils/wafuMonthNames.ts`
**役割**: 和風月名データ  
**説明**: 旧暦の月（1-12）から和風月名（睦月、如月、弥生など）へのマッピングを提供。各月名の読み仮名と由来も含む。

## スタイル

### `src/styles/App.module.css`
**役割**: アプリケーション全体のスタイル  
**説明**: グローバルスタイルとアプリケーション全体のレイアウトスタイルを定義する。

### `src/components/AppLayout.module.css`
**役割**: `AppLayout`コンポーネントのスタイル  
**説明**: ヘッダー、メインコンテンツ、フッターのスタイルを定義する。

### `src/components/DisplayItem.module.css`
**役割**: `DisplayItem`コンポーネントのスタイル  
**説明**: ラベル、値、単位、説明文のスタイルを定義する。

### `src/components/SolarTermTable.module.css`
**役割**: `SolarTermTable`コンポーネントのスタイル  
**説明**: 対応表のスタイル（テーブル、現在行のハイライトなど）を定義する。

### `src/components/TemporalTimeCircle.module.css`
**役割**: `TemporalTimeCircle`コンポーネントのスタイル  
**説明**: 円形時計表示のコンテナと情報表示エリアのスタイルを定義する。

## 設定ファイル

### `package.json`
**役割**: プロジェクトの依存関係とスクリプト定義  
**説明**: npmパッケージの依存関係、ビルドスクリプト、開発サーバー起動スクリプトを定義する。

### `tsconfig.json`
**役割**: TypeScriptコンパイラの設定  
**説明**: TypeScriptのコンパイルオプション（ターゲット、モジュールシステム、パス解決など）を定義する。

### `vite.config.ts`
**役割**: Viteビルドツールの設定  
**説明**: Viteのビルド設定（Reactプラグイン、PWA設定など）を定義する。

### `index.html`
**役割**: HTMLエントリーポイント  
**説明**: アプリケーションのルートHTMLファイル。Reactアプリケーションをマウントする`<div id="root">`を含む。

---

**最終更新**: 2024年（ソースコード更新時に都度更新）

