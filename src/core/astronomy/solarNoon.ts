/**
 * 真太陽南中（solar noon）計算
 * Solar Noon Calculation
 *
 * 時計の正午（clock noon）に経度補正と均時差（EoT）を加え、
 * 真太陽が子午線を通過する時刻を求める。
 *
 * Computes the moment of true solar transit (solar noon) by adding
 * longitude correction and equation of time (EoT) to clock noon.
 */

import type { Location } from '../types';
import { getNoonInTimeZone } from '../../utils/timezone';
import { log } from '../../utils/debugLog';

/** JST の標準子午線（度）。他 TZ は将来マッピングで拡張。 */
const JST_STANDARD_MERIDIAN_DEG = 135;

/**
 * 指定タイムゾーンの標準子午線（度）を返す。
 * 現状は Asia/Tokyo のみ対応。
 */
function getStandardMeridianDeg(timeZone: string): number {
  if (timeZone === 'Asia/Tokyo') {
    return JST_STANDARD_MERIDIAN_DEG;
  }
  return JST_STANDARD_MERIDIAN_DEG;
}

/**
 * その日の通日 N（1–365 または 366）を、指定 TZ の暦で計算する。
 */
function getDayOfYear(year: number, month: number, day: number, timeZone: string): number {
  const clockNoon = getNoonInTimeZone(year, month, day, timeZone);
  const jan1Noon = getNoonInTimeZone(year, 1, 1, timeZone);
  const days = (clockNoon.getTime() - jan1Noon.getTime()) / (1000 * 60 * 60 * 24);
  return Math.round(days) + 1;
}

/**
 * 均時差 EoT（分）を NOAA 簡易式で計算する。
 * EoT = 真太陽時 − 平均太陽時（分）。資料によって符号定義が逆の場合があるため、実装後に松山 2/22 で検証すること。
 */
function getEquationOfTimeMinutes(dayOfYear: number): number {
  const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
  return (
    9.87 * Math.sin(2 * B) -
    7.53 * Math.cos(B) -
    1.5 * Math.sin(B)
  );
}

/**
 * 真太陽南中の瞬間を返す。
 *
 * 経度補正: 東に行くほど太陽は早く南中、西に行くほど遅い。
 * 標準子午線より西（経度が小さい）なら補正は正になり、真太陽南中は時計正午より遅い。
 *
 * @param year - 年
 * @param month - 月（1–12）
 * @param day - 日
 * @param location - 位置情報（経度・タイムゾーンを使用）
 * @returns 真太陽南中の瞬間を表す Date
 */
export function getSolarNoon(
  year: number,
  month: number,
  day: number,
  location: Location
): Date {
  const clockNoon = getNoonInTimeZone(year, month, day, location.tz);
  const standardMeridian = getStandardMeridianDeg(location.tz);

  const longitudeCorrectionMinutes = 4 * (standardMeridian - location.lon);
  const dayOfYear = getDayOfYear(year, month, day, location.tz);
  const eotMinutes = getEquationOfTimeMinutes(dayOfYear);

  const offsetMinutes = longitudeCorrectionMinutes - eotMinutes;
  const solarNoon = new Date(clockNoon.getTime() + offsetMinutes * 60 * 1000);

  log('solarNoon:getSolarNoon', {
    longitudeCorrection: longitudeCorrectionMinutes,
    EoT: eotMinutes,
    offsetMinutes,
    solarNoon: solarNoon.toISOString(),
  });

  return solarNoon;
}
