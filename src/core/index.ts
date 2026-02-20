/**
 * コア計算ロジックの統合関数
 * Core Calculation Logic Integration
 * 
 * すべての計算（太陽黄経、日の出日の入り、不定時法、節気、七十二候、旧暦、六曜）を統合し、
 * EdoTimeDataオブジェクトを返す。アプリケーション全体の計算処理のエントリーポイント。
 * 
 * Integrates all calculations (solar longitude, sunrise/sunset, temporal time, solar terms,
 * 72 micro-seasons, lunar calendar, rokuyo) and returns an EdoTimeData object.
 * Entry point for all calculation processing in the application.
 */

import type { EdoTimeData, Location } from './types';
import { DEFAULT_LOCATION } from './astronomy/constants';
import { getSolarLongitude } from './astronomy/solarLongitude';
import { getSunriseSunset } from './astronomy/sunriseSunset';
import { getSolarTerm } from './solar-terms';
import { getSekki72 } from './sekki-72';
import { getTemporalTime, getAkeMutsu, getKureMutsu } from './time-system';
import { getRokuyo } from './rokuyo';
import { getLunarDate, getMoonAge } from './lunar-calendar';
import {
  getCalendarDateInTimeZone,
  getNoonInTimeZone,
  toTimeZone,
} from '../utils/timezone';
import { log } from '../utils/debugLog';

/**
 * 江戸時間の全データを計算する
 * Calculate all Edo time data
 * 
 * すべての計算処理を統合し、江戸時間に関する全データを返す。
 * 計算順序: 太陽黄経 → 日の出日の入り → 不定時法 → 節気・七十二候 → 旧暦・六曜
 * 
 * Integrates all calculation processes and returns all data related to Edo time.
 * Calculation order: solar longitude → sunrise/sunset → temporal time → solar terms/72 micro-seasons → lunar calendar/rokuyo
 * 
 * @param date - 計算対象の日時 / Target date and time for calculation (default: current time)
 * @param location - 位置情報（省略時は東京座標・"Asia/Tokyo"タイムゾーン）/ Location information (default: Tokyo coordinates, "Asia/Tokyo" timezone)
 * @returns 江戸時間の全データ / All Edo time data
 */
export function calculateEdoTime(
  date: Date = new Date(),
  location?: Location
): EdoTimeData {
  // 位置情報のデフォルト値
  // Default location information
  const loc: Location = location || DEFAULT_LOCATION;
  
  // タイムゾーンに合わせた暦日で計算（ブラウザタイムゾーンとズレる場合に対応）
  // Calculate using calendar date adjusted for timezone (handles cases where browser timezone differs)
  const baseDate = toTimeZone(date, loc.tz);
  
  // 太陽黄経を計算
  // Calculate solar longitude
  const solarLongitude = getSolarLongitude(baseDate);
  
  // 日の出・日の入りを計算
  // Calculate sunrise and sunset
  const { sunrise, sunset } = getSunriseSunset(baseDate, loc);
  
  // 二十四節気を判定
  // Determine solar term (24 sekki)
  const solarTerm = getSolarTerm(solarLongitude);
  
  // 七十二候を判定
  // Determine 72 micro-seasons
  const sekki72 = getSekki72(solarLongitude);
  
  // 不定時法を計算
  // Calculate temporal time system
  const temporalTime = getTemporalTime(sunrise, sunset, baseDate);
  
  // 明け六つ・暮れ六つを計算
  // Calculate ake-mutsu and kure-mutsu
  const akeMutsu = getAkeMutsu(sunrise);
  const kureMutsu = getKureMutsu(sunset);

  // 円盤用正午（地点のタイムゾーンでの暦日で 12:00。現在地で統一）
  // Noon for circle (12:00 on calendar day in location TZ; unified with current location)
  const calendarDate = getCalendarDateInTimeZone(baseDate, loc.tz);
  const { year, month, day } = calendarDate;
  const noonForCircle = getNoonInTimeZone(year, month, day, loc.tz);

  log('core:calculateEdoTime', {
    baseDate: baseDate.toISOString(),
    baseDateMs: baseDate.getTime(),
    loc: { lat: loc.lat, lon: loc.lon, tz: loc.tz },
    sunrise: sunrise.getTime(),
    sunriseISO: sunrise.toISOString(),
    sunset: sunset.getTime(),
    sunsetISO: sunset.toISOString(),
    noonForCircle: noonForCircle.getTime(),
    noonForCircleISO: noonForCircle.toISOString(),
    calendarDate,
  });

  // 六曜を取得（koyomi8.comデータ参照）
  // Get rokuyo (referencing koyomi8.com data)
  const rokuyo = getRokuyo(baseDate);
  
  // 旧暦の月日を取得（koyomi8.comデータ参照）
  // Get lunar calendar date (referencing koyomi8.com data)
  const lunarDate = getLunarDate(baseDate);
  
  // 月齢を計算
  // Calculate moon age
  const moonAgeResult = getMoonAge(baseDate);
  
  return {
    currentTime: baseDate,
    solarLongitude,
    solarTerm,
    sekki72,
    temporalTime,
    akeMutsu,
    kureMutsu,
    rokuyo,
    lunarDate,
    moonAge: moonAgeResult.moonAge,
    moonAgeError: moonAgeResult.error,
    sunrise,
    sunset,
    noonForCircle,
  };
}

