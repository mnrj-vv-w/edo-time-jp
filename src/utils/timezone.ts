/**
 * タイムゾーン変換ユーティリティ
 * Timezone Conversion Utility
 *
 * Dateオブジェクトを指定のタイムゾーンの暦日・時刻に合わせた新しいDateに変換する。
 *
 * Converts a Date object to a new Date adjusted to the calendar date and time of the specified timezone.
 */

import { log } from './debugLog';

/**
 * 指定タイムゾーンの現地時刻に変換したDateを返す
 * Convert Date to local time in specified timezone
 * 
 * 指定されたタイムゾーンの現地時刻を表す新しいDateオブジェクトを返す。
 * toLocaleStringを使用してタイムゾーン変換を行う簡易実装。
 * 
 * Returns a new Date object representing the local time in the specified timezone.
 * Simple implementation using toLocaleString for timezone conversion.
 * 
 * @param date - 基準となる日時（UTC基準で構わない）/ Base date and time (can be UTC-based)
 * @param timeZone - IANAタイムゾーン文字列 (e.g., "Asia/Tokyo") / IANA timezone string (e.g., "Asia/Tokyo")
 * @returns 指定タイムゾーンの現地時刻を表す新しいDate / New Date representing local time in specified timezone
 */
export function toTimeZone(date: Date, timeZone: string): Date {
  // locale stringを介して、指定TZのローカル時刻をパースした新しいDateを生成
  // Generate new Date by parsing local time in specified TZ via locale string
  const localeString = date.toLocaleString("en-US", { timeZone });
  return new Date(localeString);
}

/**
 * 指定タイムゾーンでの暦日（年・月・日）を返す
 * Get calendar date (year, month, day) in the specified timezone
 *
 * @param date - 基準となる日時 / Base date
 * @param timeZone - IANAタイムゾーン文字列 (e.g., "Asia/Tokyo") / IANA timezone string
 * @returns そのTZでの暦日（month は 1-12）/ Calendar date in that TZ (month is 1-12)
 */
export function getCalendarDateInTimeZone(
  date: Date,
  timeZone: string
): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parseInt(parts.find((p) => p.type === "year")!.value, 10);
  const month = parseInt(parts.find((p) => p.type === "month")!.value, 10);
  const day = parseInt(parts.find((p) => p.type === "day")!.value, 10);
  const result = { year, month, day };
  log('timezone:getCalendarDateInTimeZone', {
    dateMs: date.getTime(),
    dateISO: date.toISOString(),
    timeZone,
    result,
  });
  return result;
}

/**
 * 指定タイムゾーンでの「その日の 12:00」の瞬間を表す Date を返す
 * Return a Date representing noon (12:00) on that day in the specified timezone
 *
 * @param year - 年 / Year
 * @param month - 月（1-12）/ Month (1-12)
 * @param day - 日 / Day
 * @param timeZone - IANAタイムゾーン文字列 / IANA timezone string
 * @returns そのTZで year-month-day 12:00:00 の瞬間 / Moment when it is 12:00 on that day in that TZ
 */
export function getNoonInTimeZone(
  year: number,
  month: number,
  day: number,
  timeZone: string
): Date {
  const utcNoon = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(utcNoon);
  const hour = parseInt(parts.find((p) => p.type === "hour")!.value, 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")!.value, 10);
  const diffMs =
    ((12 - hour) * 3600 + (0 - minute) * 60) * 1000;
  const result = new Date(utcNoon.getTime() + diffMs);
  const invalid = Number.isNaN(result.getTime());
  log('timezone:getNoonInTimeZone', {
    year,
    month,
    day,
    timeZone,
    resultMs: invalid ? null : result.getTime(),
    resultISO: invalid ? null : result.toISOString(),
    invalidDate: invalid,
  });
  return result;
}

