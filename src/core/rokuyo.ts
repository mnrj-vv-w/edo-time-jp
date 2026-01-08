/**
 * 六曜計算
 * Rokuyo Calculation
 * 
 * koyomi8.com (https://koyomi8.com/kyuureki.html) のデータを参照
 * 
 * 重要: 六曜は自然暦ではなく、民間暦注である。
 * Important: Rokuyo is not a natural calendar but a folk calendar annotation.
 */

import type { Rokuyo } from './types';
import { getLunarCalendarData } from './lunar-calendar-data';

/**
 * 六曜を取得（koyomi8.comデータ参照）
 * Get rokuyo (referencing koyomi8.com data)
 * 
 * @param date - 計算対象の日時 / Target date and time for calculation
 * @returns 六曜 / Rokuyo
 * @throws データが見つからない場合 / Error if data not found
 */
export function getRokuyo(date: Date): Rokuyo {
  const data = getLunarCalendarData(date);
  
  if (!data) {
    throw new Error(`六曜データが見つかりません: ${date.toISOString()}`);
  }
  
  return data.rokuyo;
}

