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
import { getCalendarDateInTimeZone, getNoonInTimeZone } from '../../utils/timezone';
import { log } from '../../utils/debugLog';
import { getSolarLongitude } from './solarLongitude';
import { getSolarNoon } from './solarNoon';
import { CIVIL_TWILIGHT_DEPRESSION_DEG } from './constants';

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
  const { year, month, day } = getCalendarDateInTimeZone(date, location.tz);
  const clockNoon = getNoonInTimeZone(year, month, day, location.tz);
  const solarNoon = getSolarNoon(year, month, day, location);

  // 黄経・赤緯・時角は clockNoon 基準のまま（変更最小）
  const solarLongitude = getSolarLongitude(clockNoon);
  const daysSinceJ2000 = (clockNoon.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / (1000 * 60 * 60 * 24);
  const obliquity = 23.4393 - 0.0000004 * daysSinceJ2000;
  const L_rad = (solarLongitude * Math.PI) / 180;
  const obliquity_rad = (obliquity * Math.PI) / 180;
  const declination = Math.asin(Math.sin(L_rad) * Math.sin(obliquity_rad)) * (180 / Math.PI);

  const latRad = (location.lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;
  const cosH = -Math.tan(latRad) * Math.tan(decRad);

  if (Math.abs(cosH) <= 1) {
    const hourAngle = Math.acos(cosH) * (180 / Math.PI);
    const sunriseOffset = -hourAngle / 15;
    const sunsetOffset = hourAngle / 15;

    const sunrise = new Date(solarNoon.getTime() + sunriseOffset * 60 * 60 * 1000);
    const sunset = new Date(solarNoon.getTime() + sunsetOffset * 60 * 60 * 1000);
    log('sunriseSunset:getSunriseSunset', {
      dateMs: date.getTime(),
      dateISO: date.toISOString(),
      locationTz: location.tz,
      sunrise: sunrise.getTime(),
      sunriseISO: sunrise.toISOString(),
      sunset: sunset.getTime(),
      sunsetISO: sunset.toISOString(),
    });
    return { sunrise, sunset };
  } else {
    // 極夜または白夜の場合
    const sunrise = new Date(solarNoon.getTime() - 6 * 60 * 60 * 1000);
    const sunset = new Date(solarNoon.getTime() + 6 * 60 * 60 * 1000);
    log('sunriseSunset:getSunriseSunset', {
      dateMs: date.getTime(),
      dateISO: date.toISOString(),
      locationTz: location.tz,
      sunrise: sunrise.getTime(),
      sunriseISO: sunrise.toISOString(),
      sunset: sunset.getTime(),
      sunsetISO: sunset.toISOString(),
      polarCase: true,
    });
    return { sunrise, sunset };
  }
}

/**
 * 夜明の始まり・日暮の終わり（明け六つ・暮れ六つ）の時刻を計算する
 * 寛政暦の定義: 太陽の伏角が 7°21′40″ となる時刻（太陽中心の高度が −7°21′40″）。
 *
 * @param date - 計算対象の日（そのタイムゾーンの暦日として扱う）
 * @param location - 位置情報
 * @returns dawn = 夜明の始まり（明け六つ）, dusk = 日暮の終わり（暮れ六つ）
 */
export function getDawnDusk(date: Date, location: Location): { dawn: Date; dusk: Date } {
  const { year, month, day } = getCalendarDateInTimeZone(date, location.tz);
  const clockNoon = getNoonInTimeZone(year, month, day, location.tz);
  const solarNoon = getSolarNoon(year, month, day, location);

  const solarLongitude = getSolarLongitude(clockNoon);
  const daysSinceJ2000 = (clockNoon.getTime() - new Date('2000-01-01T12:00:00Z').getTime()) / (1000 * 60 * 60 * 24);
  const obliquity = 23.4393 - 0.0000004 * daysSinceJ2000;
  const L_rad = (solarLongitude * Math.PI) / 180;
  const obliquity_rad = (obliquity * Math.PI) / 180;
  const declination = Math.asin(Math.sin(L_rad) * Math.sin(obliquity_rad)) * (180 / Math.PI);

  const sunAltitudeDeg = -CIVIL_TWILIGHT_DEPRESSION_DEG;
  const hRad = (sunAltitudeDeg * Math.PI) / 180;
  const latRad = (location.lat * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;

  const cosH =
    (Math.sin(hRad) - Math.sin(latRad) * Math.sin(decRad)) /
    (Math.cos(latRad) * Math.cos(decRad));

  if (Math.abs(cosH) <= 1) {
    const hourAngle = Math.acos(cosH) * (180 / Math.PI);
    const dawnOffset = -hourAngle / 15;
    const duskOffset = hourAngle / 15;
    const dawn = new Date(solarNoon.getTime() + dawnOffset * 60 * 60 * 1000);
    const dusk = new Date(solarNoon.getTime() + duskOffset * 60 * 60 * 1000);
    log('sunriseSunset:getDawnDusk', {
      dateISO: date.toISOString(),
      locationTz: location.tz,
      dawn: dawn.getTime(),
      dawnISO: dawn.toISOString(),
      dusk: dusk.getTime(),
      duskISO: dusk.toISOString(),
    });
    return { dawn, dusk };
  }

  const dawn = new Date(solarNoon.getTime() - 6 * 60 * 60 * 1000);
  const dusk = new Date(solarNoon.getTime() + 6 * 60 * 60 * 1000);
  log('sunriseSunset:getDawnDusk', {
    dateISO: date.toISOString(),
    locationTz: location.tz,
    polarCase: true,
    dawn: dawn.getTime(),
    dusk: dusk.getTime(),
  });
  return { dawn, dusk };
}

