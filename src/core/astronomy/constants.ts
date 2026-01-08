/**
 * 天文計算で使用する定数
 * Astronomical Constants
 * 
 * 天文計算で使用する定数（位置情報、天文定数）を定義する。
 * 
 * Defines constants used in astronomical calculations (location information, astronomical constants).
 */

/**
 * 東京座標のデフォルト値
 * Default Tokyo Coordinates
 * 
 * 初期実装では東京座標をデフォルトとして使用する。
 * 
 * Uses Tokyo coordinates as default in the initial implementation.
 */
export const DEFAULT_LOCATION = {
  /** 東京の緯度（度）/ Tokyo latitude (degrees) */
  lat: 35.6762,
  /** 東京の経度（度）/ Tokyo longitude (degrees) */
  lon: 139.6503,
  /** タイムゾーン / Timezone */
  tz: "Asia/Tokyo" as const,
};

/**
 * 天文定数
 * Astronomical Constants
 * 
 * 太陽の視半径、大気差などの天文計算で使用する定数。
 * 
 * Constants used in astronomical calculations such as solar apparent radius and atmospheric refraction.
 */
export const ASTRONOMICAL_CONSTANTS = {
  /** 1天文単位（メートル）/ 1 Astronomical Unit (meters) */
  AU: 149597870700,
  
  /** 太陽の視半径（度）/ Solar apparent radius (degrees) */
  SOLAR_RADIUS: 0.26667,
  
  /** 大気差（度）/ Atmospheric refraction (degrees) */
  ATMOSPHERIC_REFRACTION: 0.583,
} as const;

