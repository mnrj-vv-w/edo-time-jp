/**
 * 外部公開型の入口
 * External Type Definitions Entry Point
 * 
 * アプリケーション全体で使用される主要な型定義を提供する。
 * 各モジュール内で内部用の詳細型を持つ設計になっている。
 * 
 * Provides main type definitions used throughout the application.
 * Designed to have detailed internal types within each module.
 */

/**
 * 位置情報
 * Location Information
 * 
 * 観測地点の緯度、経度、タイムゾーンを表す。
 * 初期実装では "Asia/Tokyo" 固定で割り切り、将来拡張に備えた設計。
 * 
 * Represents the latitude, longitude, and timezone of the observation point.
 * Initial implementation uses "Asia/Tokyo" as fixed, designed for future expansion.
 */
export interface Location {
  /** 緯度（度）/ Latitude (degrees) */
  lat: number;
  /** 経度（度）/ Longitude (degrees) */
  lon: number;
  /** タイムゾーン（例: "Asia/Tokyo"）/ Timezone (e.g., "Asia/Tokyo") */
  tz: string;
}

/**
 * 不定時法の意味構造型
 * Temporal Time System Meaning Structure
 * 
 * 不定時法の意味構造を表す型。
 * coreは「意味を返す」、UIは「表示するだけ」の責務分離の設計。
 * 
 * Type representing the meaning structure of the temporal time system.
 * Design separates responsibilities: core "returns meaning", UI "only displays".
 */
export interface TemporalTime {
  /** 昼か夜か / Day or night */
  period: "day" | "night";
  /** 一刻（1-6）/ Koku (time period, 1-6) */
  koku: 1 | 2 | 3 | 4 | 5 | 6;
  /** この刻の開始時刻 / Start time of this koku */
  start: Date;
  /** この刻の終了時刻 / End time of this koku */
  end: Date;
}

/**
 * 二十四節気（外部公開用）
 * Solar Terms (External Type)
 * 
 * 太陽黄経を15度刻みで24分割した季節の区分。
 * 詳細な定義は solar-terms.ts 内で管理される。
 * 
 * Seasonal divisions dividing solar longitude into 24 periods (15-degree intervals).
 * Detailed definitions are managed in solar-terms.ts.
 */
export type SolarTerm =
  | "立春" | "雨水" | "啓蟄" | "春分" | "清明" | "穀雨"
  | "立夏" | "小満" | "芒種" | "夏至" | "小暑" | "大暑"
  | "立秋" | "処暑" | "白露" | "秋分" | "寒露" | "霜降"
  | "立冬" | "小雪" | "大雪" | "冬至" | "小寒" | "大寒";

/**
 * 七十二候（外部公開用）
 * 72 Micro-Seasons (External Type)
 * 
 * 太陽黄経を5度刻みで72分割した、より細かい季節の区分。
 * 詳細な定義は sekki-72.ts 内で管理される。
 * 
 * More detailed seasonal divisions dividing solar longitude into 72 periods (5-degree intervals).
 * Detailed definitions are managed in sekki-72.ts.
 */
export type Sekki72 = string; // 七十二候の名称（詳細は sekki-72.ts で定義）/ Name of 72 micro-seasons (details defined in sekki-72.ts)

/**
 * 六曜（外部公開用）
 * Rokuyo (External Type)
 * 
 * 6日周期の民間暦注。自然暦ではなく、民間暦注であることを明記。
 * 
 * 6-day cycle folk calendar annotation. Note that this is not a natural calendar but a folk calendar annotation.
 */
export type Rokuyo = "大安" | "赤口" | "先勝" | "友引" | "先負" | "仏滅";

/**
 * 全表示データをまとめる型
 * Complete Display Data Type
 * 
 * 江戸時間アプリケーションで表示するすべてのデータをまとめる型。
 * calculateEdoTime関数の戻り値として使用される。
 * 
 * Type that aggregates all data displayed in the Edo time application.
 * Used as the return value of the calculateEdoTime function.
 */
export interface EdoTimeData {
  /** 現在時刻（現代時刻）/ Current time (modern time) */
  currentTime: Date;
  
  /** 太陽黄経（度数、0-360）/ Solar longitude (degrees, 0-360) */
  solarLongitude: number;
  
  /** 二十四節気 / Solar term (24 sekki) */
  solarTerm: SolarTerm;
  
  /** 七十二候 / 72 micro-seasons */
  sekki72: Sekki72;
  
  /** 不定時法 / Temporal time system */
  temporalTime: TemporalTime;
  
  /** 明け六つ（日の出30分前）/ Ake-mutsu (30 minutes before sunrise) */
  akeMutsu: Date;
  
  /** 暮れ六つ（日の入り30分後）/ Kure-mutsu (30 minutes after sunset) */
  kureMutsu: Date;
  
  /** 六曜（民間暦注）/ Rokuyo (folk calendar annotation) */
  rokuyo: Rokuyo;
  
  /** 旧暦の月日（簡易モデル）/ Lunar calendar date (simplified model) */
  lunarDate: {
    /** 年 / Year */
    year: number;
    /** 月 / Month */
    month: number;
    /** 日 / Day */
    day: number;
  };
  
  /** 月齢（日数、0-29.5程度）/ Moon age (days, approximately 0-29.5) */
  moonAge: number;
  
  /** 月齢計算のエラーメッセージ（データ範囲外の場合）/ Moon age calculation error message (if out of data range) */
  moonAgeError?: string;
  
  /** 日の出 / Sunrise */
  sunrise: Date;
  /** 日の入り / Sunset */
  sunset: Date;
}

