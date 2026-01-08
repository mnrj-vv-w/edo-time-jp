/**
 * 二十四節気判定
 * Solar Terms Determination
 * 
 * 太陽黄経から二十四節気を判定する。
 * 太陽黄経を15度刻みで24分割した季節の区分。
 * 
 * Determines solar terms (24 sekki) from solar longitude.
 * Seasonal divisions dividing solar longitude into 24 periods (15-degree intervals).
 */

import type { SolarTerm } from './types';

/**
 * 二十四節気の定義テーブル
 * Solar Terms Definition Table
 * 
 * 各節気の黄経を定義する。黄経0度=春分、15度=清明...の順。
 * 
 * Defines the longitude for each solar term. Order: 0° = Spring Equinox, 15° = Clear and Bright, etc.
 */
export const SOLAR_TERMS: Array<{ longitude: number; term: SolarTerm }> = [
  { longitude: 0, term: "春分" },
  { longitude: 15, term: "清明" },
  { longitude: 30, term: "穀雨" },
  { longitude: 45, term: "立夏" },
  { longitude: 60, term: "小満" },
  { longitude: 75, term: "芒種" },
  { longitude: 90, term: "夏至" },
  { longitude: 105, term: "小暑" },
  { longitude: 120, term: "大暑" },
  { longitude: 135, term: "立秋" },
  { longitude: 150, term: "処暑" },
  { longitude: 165, term: "白露" },
  { longitude: 180, term: "秋分" },
  { longitude: 195, term: "寒露" },
  { longitude: 210, term: "霜降" },
  { longitude: 225, term: "立冬" },
  { longitude: 240, term: "小雪" },
  { longitude: 255, term: "大雪" },
  { longitude: 270, term: "冬至" },
  { longitude: 285, term: "小寒" },
  { longitude: 300, term: "大寒" },
  { longitude: 315, term: "立春" },
  { longitude: 330, term: "雨水" },
  { longitude: 345, term: "啓蟄" },
];

/**
 * 太陽黄経から二十四節気を判定する
 * Determine solar term from solar longitude
 * 
 * 太陽黄経を15度刻みで判定し、対応する二十四節気を返す。
 * 各節気は次の節気の手前まで有効とする。
 * 
 * Determines the corresponding solar term by checking solar longitude in 15-degree intervals.
 * Each solar term is valid until the next solar term.
 * 
 * @param solarLongitude - 太陽黄経（度、0-360）/ Solar longitude (degrees, 0-360)
 * @returns 二十四節気 / Solar term
 */
export function getSolarTerm(solarLongitude: number): SolarTerm {
  // 0-360度の範囲に正規化
  // Normalize to 0-360 degree range
  let normalized = solarLongitude % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  
  // 各節気の黄経と比較
  // Compare with each solar term's longitude
  // 最も近い節気を返す（簡易版：次の節気の手前まで現在の節気とする）
  // Return the closest solar term (simplified: current term is valid until next term)
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    const current = SOLAR_TERMS[i];
    const next = SOLAR_TERMS[(i + 1) % SOLAR_TERMS.length];
    
    // 次の節気の黄経（360度を超える場合は0度に戻る）
    // Next solar term's longitude (wraps to 0° if exceeds 360°)
    let nextLongitude = next.longitude;
    if (nextLongitude < current.longitude) {
      nextLongitude += 360;
    }
    
    // 現在の黄経がこの節気の範囲内か
    // Check if current longitude is within this solar term's range
    let normalizedNext = normalized;
    if (normalizedNext < current.longitude) {
      normalizedNext += 360;
    }
    
    if (normalizedNext >= current.longitude && normalizedNext < nextLongitude) {
      return current.term;
    }
  }
  
  // フォールバック（通常は到達しない）
  // Fallback (should not normally reach here)
  return SOLAR_TERMS[0].term;
}

