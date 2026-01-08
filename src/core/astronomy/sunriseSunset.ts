/**
 * 日の出・日の入り計算
 * Sunrise and Sunset Calculation
 * 
 * 太陽高度が0度になる時刻を計算する。簡易天文式を使用。
 * 
 * 重要: date はそのタイムゾーン（location.tz）の暦日として扱う。
 * 初期実装では "Asia/Tokyo" 固定で割り切り、将来拡張に備える。
 * 
 * Calculates the time when solar altitude reaches 0 degrees. Uses simplified astronomical formulas.
 * 
 * Important: date is treated as a calendar date in the specified timezone (location.tz).
 * Initial implementation uses "Asia/Tokyo" as fixed, designed for future expansion.
 */

import type { Location } from '../types';
import { getSolarLongitude } from './solarLongitude';

/**
 * 太陽の時角を計算する（簡易版）
 * Calculate solar hour angle (simplified version)
 * 
 * 地方恒星時を計算し、太陽の時角を求める。
 * 簡易計算のため、実際の実装ではより精密な計算が必要。
 * 
 * Calculates local sidereal time and determines solar hour angle.
 * Simplified calculation; more precise calculations are needed in actual implementation.
 * 
 * @param date - 計算対象の日時 / Target date and time for calculation
 * @param location - 位置情報 / Location information
 * @returns 太陽の時角（度）/ Solar hour angle (degrees)
 */
function getHourAngle(date: Date, location: Location): number {
  // 簡易計算：太陽の赤経を近似
  // Simplified calculation: approximate solar right ascension
  // 実際の実装ではより精密な計算が必要だが、簡易版として
  // 太陽黄経から概算する
  // More precise calculations are needed in actual implementation, but as a simplified version,
  // approximate from solar longitude
  
  // 地方恒星時を計算（簡易版）
  // Calculate local sidereal time (simplified version)
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60;
  /** J2000.0からの経過日数 / Days since J2000.0 */
  const daysSinceJ2000 = (date.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / (1000 * 60 * 60 * 24);
  
  // グリニッジ恒星時（度）
  // Greenwich Mean Sidereal Time (degrees)
  const GMST = 280.46061837 + 360.98564736629 * daysSinceJ2000 + 0.000387933 * daysSinceJ2000 * daysSinceJ2000;
  
  // 地方恒星時（度）
  // Local Sidereal Time (degrees)
  const LST = (GMST + location.lon) % 360;
  
  return LST;
}

/**
 * 太陽の高度を計算する（簡易版）
 * Calculate solar altitude (simplified version)
 * 
 * 太陽の高度角を計算する。簡易計算のため、実際の実装ではより精密な計算が必要。
 * 
 * Calculates the solar altitude angle. Simplified calculation; more precise calculations are needed in actual implementation.
 * 
 * @param date - 計算対象の日時 / Target date and time for calculation
 * @param location - 位置情報 / Location information
 * @returns 太陽の高度（度）/ Solar altitude (degrees)
 */
function getSolarAltitude(date: Date, location: Location): number {
  // 簡易計算：太陽の赤緯を近似
  // Simplified calculation: approximate solar declination
  // 実際の実装では太陽黄経から赤緯を計算する必要がある
  // In actual implementation, declination should be calculated from solar longitude
  
  // 太陽黄経から概算（簡易版）
  // Approximate from solar longitude (simplified version)
  const daysSinceJ2000 = (date.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / (1000 * 60 * 60 * 24);
  const T = daysSinceJ2000 / 36525.0;
  const L = (280.4665 + 36000.7698 * T) % 360;
  
  // 黄道傾斜角（度）
  // Obliquity of the ecliptic (degrees)
  const obliquity = 23.4393 - 0.0000004 * daysSinceJ2000;
  
  // 太陽の赤緯（簡易近似）
  // Solar declination (simplified approximation)
  const declination = Math.asin(Math.sin((L * Math.PI) / 180) * Math.sin((obliquity * Math.PI) / 180)) * (180 / Math.PI);
  
  // 時角
  // Hour angle
  const hourAngle = getHourAngle(date, location);
  const hourAngleRad = (hourAngle * Math.PI) / 180;
  const latRad = (location.lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  
  // 太陽の高度（度）
  // Solar altitude (degrees)
  const altitude = Math.asin(
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad)
  ) * (180 / Math.PI);
  
  return altitude;
}

/**
 * 日の出・日の入りの時刻を計算する
 * Calculate sunrise and sunset times
 * 
 * 太陽高度が0度になる時刻を計算する。太陽の赤緯と観測地点の緯度から時角を求め、
 * 正午からの前後時間を計算する。
 * 
 * Calculates the time when solar altitude reaches 0 degrees. Determines hour angle from
 * solar declination and observer's latitude, then calculates time before/after noon.
 * 
 * @param date - 計算対象の日（そのタイムゾーンの暦日として扱う）/ Target date (treated as calendar date in that timezone)
 * @param location - 位置情報 / Location information
 * @returns 日の出・日の入りの時刻（ローカルタイムゾーン）/ Sunrise and sunset times (local timezone)
 */
export function getSunriseSunset(date: Date, location: Location): { sunrise: Date; sunset: Date } {
  // その日の正午（ローカル時間）を基準とする
  // Use that day's noon (local time) as reference
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  // 正午（ローカル時間）
  // Noon (local time)
  const noon = new Date(year, month, day, 12, 0, 0);
  
  // 太陽黄経を正確に計算（既存の関数を使用）
  // Calculate solar longitude accurately (using existing function)
  const solarLongitude = getSolarLongitude(noon);
  
  // 黄道傾斜角（度）
  // Obliquity of the ecliptic (degrees)
  const daysSinceJ2000 = (noon.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / (1000 * 60 * 60 * 24);
  const obliquity = 23.4393 - 0.0000004 * daysSinceJ2000;
  
  // 太陽の赤緯（度）- 太陽黄経から正確に計算
  // Solar declination (degrees) - calculated accurately from solar longitude
  const L_rad = (solarLongitude * Math.PI) / 180;
  const obliquity_rad = (obliquity * Math.PI) / 180;
  const declination = Math.asin(Math.sin(L_rad) * Math.sin(obliquity_rad)) * (180 / Math.PI);
  
  // 日の出・日の入りの時角（度）
  // Hour angle for sunrise/sunset (degrees)
  const latRad = (location.lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  
  // cos(H) = -tan(φ) * tan(δ)
  // Formula: cos(H) = -tan(φ) * tan(δ)
  const cosH = -Math.tan(latRad) * Math.tan(decRad);
  
  // 時角が計算可能な場合
  // If hour angle is calculable
  if (Math.abs(cosH) <= 1) {
    /** 時角（度）/ Hour angle (degrees) */
    const hourAngle = Math.acos(cosH) * (180 / Math.PI);
    
    // 日の出・日の入りの時刻（ローカル時間）
    // Sunrise/sunset times (local time)
    // 正午から時角分前後
    // Before/after noon by hour angle
    /** 日の出のオフセット（時間）/ Sunrise offset (hours) */
    const sunriseOffset = -hourAngle / 15;
    /** 日の入りのオフセット（時間）/ Sunset offset (hours) */
    const sunsetOffset = hourAngle / 15;
    
    const sunrise = new Date(noon.getTime() + sunriseOffset * 60 * 60 * 1000);
    const sunset = new Date(noon.getTime() + sunsetOffset * 60 * 60 * 1000);
    
    return { sunrise, sunset };
  } else {
    // 極夜または白夜の場合
    // Polar night or midnight sun case
    // 簡易処理：正午の前後6時間を日の出・日の入りとする
    // Simplified handling: set sunrise/sunset to 6 hours before/after noon
    const sunrise = new Date(noon.getTime() - 6 * 60 * 60 * 1000);
    const sunset = new Date(noon.getTime() + 6 * 60 * 60 * 1000);
    return { sunrise, sunset };
  }
}

