/**
 * 旧暦カレンダーデータローダー
 * Lunar Calendar Data Loader
 * 
 * koyomi8.com (https://koyomi8.com/kyuureki.html) のデータを参照
 */

import type { Rokuyo } from './types';
import lunarCalendarCsv from './data/lunar_2026_2028.csv?raw';

/**
 * CSVレコードの型定義
 */
interface LunarCalendarRecord {
  date: string; // "YYYY-MM-DD" 形式
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  rokuyo: Rokuyo;
}

/**
 * 六曜の互換文字を通常文字に変換
 * Convert compatibility characters to normal characters for rokuyo
 */
function normalizeRokuyo(rokuyo: string): Rokuyo {
  const rokuyoMap: Record<string, Rokuyo> = {
    '⼤安': '大安',
    '⾚⼝': '赤口',
    '先勝': '先勝',
    '友引': '友引',
    '先負': '先負',
    '仏滅': '仏滅',
  };
  return rokuyoMap[rokuyo] || rokuyo as Rokuyo;
}

/**
 * CSVデータをパースしてマップを作成
 */
function parseLunarCalendarCSV(csvText: string): Map<string, LunarCalendarRecord> {
  const lines = csvText.trim().split('\n');
  const map = new Map<string, LunarCalendarRecord>();
  
  // ヘッダー行をスキップ
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [date, , lunarYear, lunarMonth, lunarDay, isLeapMonth, , rokuyo] = line.split(',');
    
    if (!date || !rokuyo) continue;
    
    const record: LunarCalendarRecord = {
      date: date.trim(),
      lunarYear: parseInt(lunarYear, 10),
      lunarMonth: parseInt(lunarMonth, 10),
      lunarDay: parseInt(lunarDay, 10),
      isLeapMonth: isLeapMonth === 'TRUE',
      rokuyo: normalizeRokuyo(rokuyo.trim()),
    };
    
    map.set(record.date, record);
  }
  
  return map;
}

/**
 * 旧暦カレンダーデータマップ
 * Lunar calendar data map (key: "YYYY-MM-DD")
 */
const LUNAR_CALENDAR_MAP = parseLunarCalendarCSV(lunarCalendarCsv);

/**
 * 指定日付の旧暦データを取得
 * Get lunar calendar data for specified date
 * 
 * @param date - 計算対象の日時 / Target date and time for calculation
 * @returns 旧暦データ（見つからない場合はnull）/ Lunar calendar data (null if not found)
 */
export function getLunarCalendarData(date: Date): LunarCalendarRecord | null {
  // JSTの日付文字列に変換（タイムゾーン変換は呼び出し側で行う想定）
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${year}-${month}-${day}`;
  
  return LUNAR_CALENDAR_MAP.get(dateKey) || null;
}
