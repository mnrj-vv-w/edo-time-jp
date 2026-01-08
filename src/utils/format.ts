/**
 * 表示フォーマット用ユーティリティ
 * Display Formatting Utilities
 * 
 * 日時や時刻を表示用の文字列にフォーマットするユーティリティ関数。
 * 
 * Utility functions for formatting dates and times into display strings.
 */

/**
 * 日時をフォーマットする
 * Format date and time
 * 
 * 日時を "YYYY-MM-DD HH:mm:ss" 形式の文字列にフォーマットする。
 * 
 * Formats date and time into "YYYY-MM-DD HH:mm:ss" format string.
 * 
 * @param date - 日時 / Date and time
 * @returns フォーマットされた文字列 / Formatted string
 */
export function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 時刻をフォーマットする
 * Format time
 * 
 * 時刻を "HH:mm:ss" 形式の文字列にフォーマットする。
 * 
 * Formats time into "HH:mm:ss" format string.
 * 
 * @param date - 日時 / Date and time
 * @returns フォーマットされた時刻文字列 / Formatted time string
 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * 時刻を「〜頃」表現でフォーマットする
 * 分の一桁目を四捨五入して10分刻みにし、「頃」を付ける
 * 例: 6:34 -> "6時30分頃", 6:36 -> "6時40分頃"
 *
 * @param date 日時
 * @returns フォーマットされた時刻文字列（例: "6時30分頃"）
 */
export function formatTimeApprox(date: Date): string {
  const rawMinutes = date.getMinutes();
  const roundedMinutes = Math.round(rawMinutes / 10) * 10;
  
  let hours = date.getHours();
  let minutes = roundedMinutes;
  
  // 60分に丸め上がった場合は1時間繰り上げ
  if (minutes === 60) {
    minutes = 0;
    hours = (hours + 1) % 24;
  }
  
  const hoursText = `${hours}`;
  const minutesText = String(minutes).padStart(2, '0');
  
  return `${hoursText}時${minutesText}分頃`;
}

/**
 * 時刻範囲を「XX時XX分〜〇〇時〇〇分頃」形式でフォーマットする
 * Format time range as "XX時XX分〜〇〇時〇〇分頃"
 * 
 * 開始時刻は分を四捨五入せず、終了時刻は分の一桁目を四捨五入して「頃」を付ける
 * Start time is displayed without rounding, end time is rounded to nearest 10 minutes with "頃"
 * 
 * @param start - 開始時刻 / Start time
 * @param end - 終了時刻 / End time
 * @returns フォーマットされた時刻範囲文字列 / Formatted time range string
 */
export function formatTimeRange(start: Date, end: Date): string {
  // 開始時刻: 分を四捨五入せずに表示
  // Start time: display without rounding minutes
  const startHours = start.getHours();
  const startMinutes = start.getMinutes();
  const startText = `${startHours}時${String(startMinutes).padStart(2, '0')}分`;
  
  // 終了時刻: 分の一桁目を四捨五入して「頃」を付ける
  // End time: round minutes to nearest 10 and add "頃"
  const endRawMinutes = end.getMinutes();
  const endRoundedMinutes = Math.round(endRawMinutes / 10) * 10;
  
  let endHours = end.getHours();
  let endMinutes = endRoundedMinutes;
  
  // 60分に丸め上がった場合は1時間繰り上げ
  // If rounded to 60 minutes, increment hour
  if (endMinutes === 60) {
    endMinutes = 0;
    endHours = (endHours + 1) % 24;
  }
  
  const endText = `${endHours}時${String(endMinutes).padStart(2, '0')}分頃`;
  
  return `${startText}〜${endText}`;
}

