/**
 * 旧暦・月齢計算
 * Lunar Calendar and Moon Age Calculation
 * 
 * koyomi8.com (https://koyomi8.com/kyuureki.html) のデータを参照
 */

import { getLunarCalendarData } from './lunar-calendar-data';

/**
 * 旧暦の月日を取得（koyomi8.comデータ参照）
 * Get lunar calendar date (referencing koyomi8.com data)
 * 
 * @param date - 計算対象の日時 / Target date and time for calculation
 * @returns 旧暦の月日 / Lunar calendar date
 * @throws データが見つからない場合 / Error if data not found
 */
export function getLunarDate(date: Date): {
  year: number;
  month: number;
  day: number;
} {
  const data = getLunarCalendarData(date);
  
  if (!data) {
    throw new Error(`旧暦データが見つかりません: ${date.toISOString()}`);
  }
  
  return {
    year: data.lunarYear,
    month: data.lunarMonth,
    day: data.lunarDay,
  };
}

import newMoonDatesData from './data/newMoonDates.json';

// JSONからDateオブジェクトの配列に変換（一度だけ実行）
const newMoonDates: Date[] = (newMoonDatesData as string[]).map(
  (dateStr) => new Date(dateStr)
);

/**
 * 月齢計算の結果
 * Moon age calculation result
 */
export interface MoonAgeResult {
  /** 月齢（日数）/ Moon age (days) */
  moonAge: number;
  /** エラーメッセージ（データ範囲外の場合）/ Error message (if out of data range) */
  error?: string;
}

/**
 * 月齢を計算する（新月データベースを使用）
 * Calculate moon age (using new moon database)
 * 
 * 指定日付に最も近い過去の新月時刻を見つけ、
 * その新月時刻からの経過日数から月齢を計算する。
 * 
 * Finds the nearest past new moon time for the specified date,
 * and calculates moon age from the elapsed days since that new moon.
 * 
 * @param date - 計算対象の日時 / Target date and time for calculation
 * @returns 月齢計算の結果 / Moon age calculation result
 */
export function getMoonAge(date: Date): MoonAgeResult {
  // データ範囲のチェック
  if (newMoonDates.length === 0) {
    return {
      moonAge: 0,
      error: '新月データが読み込まれていません。'
    };
  }
  
  const firstNewMoon = newMoonDates[0];
  const lastNewMoon = newMoonDates[newMoonDates.length - 1];
  
  if (date.getTime() < firstNewMoon.getTime()) {
    return {
      moonAge: 0,
      error: `計算対象の日付（${date.toLocaleDateString('ja-JP')}）がデータ範囲外です。データは${firstNewMoon.toLocaleDateString('ja-JP')}以降のみ対応しています。`
    };
  }
  
  // 最後の新月から1朔望月以上経過している場合
  const synodicMonth = 29.53059;
  const maxDate = lastNewMoon.getTime() + synodicMonth * 24 * 60 * 60 * 1000;
  if (date.getTime() > maxDate) {
    return {
      moonAge: 0,
      error: `計算対象の日付（${date.toLocaleDateString('ja-JP')}）がデータ範囲外です。データは${lastNewMoon.toLocaleDateString('ja-JP')}まで対応しています。`
    };
  }
  
  const targetTime = date.getTime();
  
  // 指定日付以前の最も近い新月時刻を見つける
  let nearestNewMoon: Date | null = null;
  
  for (let i = newMoonDates.length - 1; i >= 0; i--) {
    const newMoon = newMoonDates[i];
    if (newMoon.getTime() <= targetTime) {
      nearestNewMoon = newMoon;
      break;
    }
  }
  
  // フォールバック（通常は発生しない）
  if (!nearestNewMoon) {
    return {
      moonAge: 0,
      error: '新月データが見つかりませんでした。'
    };
  }
  
  // 経過日数を計算
  const diffTime = targetTime - nearestNewMoon.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  // 月齢を計算（0-29.5の範囲）
  let moonAge = diffDays % synodicMonth;
  if (moonAge < 0) {
    moonAge += synodicMonth;
  }
  
  return { moonAge };
}

