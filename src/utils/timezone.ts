/**
 * タイムゾーン変換ユーティリティ
 * Timezone Conversion Utility
 * 
 * Dateオブジェクトを指定のタイムゾーンの暦日・時刻に合わせた新しいDateに変換する。
 * 
 * Converts a Date object to a new Date adjusted to the calendar date and time of the specified timezone.
 */

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

