/**
 * 太陽黄経計算
 * Solar Longitude Calculation
 * 
 * 太陽の黄経（0-360度）を計算する。
 * 近似式を使用しており、±数分の誤差が許容される。
 * 
 * Calculates the solar longitude (0-360 degrees).
 * Uses approximation formulas with ±several minutes error tolerance.
 */

/**
 * 太陽黄経を計算する
 * Calculate solar longitude
 * 
 * J2000.0（2000年1月1日12:00 UTC）を基準とした平均黄経に、
 * 摂動項（中心差）を加算して真黄経を求める。
 * 
 * Calculates true longitude by adding perturbation terms (equation of center)
 * to the mean longitude based on J2000.0 (2000-01-01 12:00 UTC).
 * 
 * @param date - 計算対象の日時 / Target date and time for calculation
 * @returns 太陽黄経（度、0-360）/ Solar longitude (degrees, 0-360)
 */
export function getSolarLongitude(date: Date): number {
  // 2000年1月1日 12:00 UTC を基準とする（J2000.0）
  // Use J2000.0 (2000-01-01 12:00 UTC) as reference
  const j2000 = new Date('2000-01-01T12:00:00Z');
  /** J2000.0からの経過日数 / Days since J2000.0 */
  const daysSinceJ2000 = (date.getTime() - j2000.getTime()) / (1000 * 60 * 60 * 24);
  
  // 平均黄経（度）
  // Mean longitude (degrees)
  // L = 280.4665 + 36000.7698 * T
  // T は J2000.0 からのユリウス世紀数
  // T is Julian centuries since J2000.0
  const T = daysSinceJ2000 / 36525.0;
  /** 平均黄経（度）/ Mean longitude (degrees) */
  let L = 280.4665 + 36000.7698 * T;
  
  // 平均近点角（度）
  // Mean anomaly (degrees)
  // M = 357.5291 + 35999.0503 * T
  const M = 357.5291 + 35999.0503 * T;
  /** 平均近点角（ラジアン）/ Mean anomaly (radians) */
  const M_rad = (M * Math.PI) / 180;
  
  // 摂動項（簡易版）
  // Perturbation terms (simplified version)
  // 中心差（ケプラー方程式の簡易近似）
  // Equation of center (simplified approximation of Kepler's equation)
  const C = (1.9146 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad)
    + 0.000289 * Math.sin(3 * M_rad);
  
  // 真黄経 = 平均黄経 + 中心差
  // True longitude = Mean longitude + Equation of center
  const trueLongitude = L + C;
  
  // 0-360度の範囲に正規化
  // Normalize to 0-360 degree range
  let normalized = trueLongitude % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  
  return normalized;
}

