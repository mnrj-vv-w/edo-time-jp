/**
 * 十二支（十二時辰）のデータと配置
 * 12 Zodiac Signs (12 Time Periods) Data and Positioning
 * 
 * 十二支（十二時辰）の定義と配置を提供する。
 * 午（正午）を上（-π/2）として配置する。
 * 
 * Provides definitions and positioning for the 12 zodiac signs (12 time periods).
 * Positions noon (午) at the top (-π/2).
 */

/**
 * 十二支の定義
 * 12 Zodiac Signs Definition
 * 
 * 各支は2時間（120分）を表す。
 * 正午（12時）を上（-π/2）として、時計回りに配置する。
 * 
 * Each sign represents 2 hours (120 minutes).
 * Arranged clockwise with noon (12:00) at the top (-π/2).
 */
export const JUNI_SHIN = [
  { name: "子", hour: 0, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 6 }, // 0時（下）/ 0:00 (bottom)
  { name: "丑", hour: 2, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 7 },
  { name: "寅", hour: 4, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 8 },
  { name: "卯", hour: 6, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 9 }, // 6時（左）/ 6:00 (left)
  { name: "辰", hour: 8, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 10 },
  { name: "巳", hour: 10, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 11 },
  { name: "午", hour: 12, angle: -Math.PI / 2 }, // 12時（上）/ 12:00 (top)
  { name: "未", hour: 14, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 1 },
  { name: "申", hour: 16, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 2 },
  { name: "酉", hour: 18, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 3 }, // 18時（右）/ 18:00 (right)
  { name: "戌", hour: 20, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 4 },
  { name: "亥", hour: 22, angle: -Math.PI / 2 + (Math.PI * 2 / 12) * 5 },
] as const;

/**
 * 時刻から十二支を取得する
 * Get zodiac sign from time
 * 
 * 時刻から対応する十二支を取得する。
 * 各支は2時間を表すため、時刻を2で割って判定する。
 * 
 * Gets the corresponding zodiac sign from time.
 * Each sign represents 2 hours, so determines by dividing time by 2.
 * 
 * @param time - 時刻 / Time
 * @returns 十二支の名前 / Zodiac sign name
 */
export function getJuniShin(time: Date): string {
  const hour = time.getHours();
  const index = Math.floor(hour / 2) % 12;
  return JUNI_SHIN[index].name;
}

/**
 * 十二支が昼の部分かどうかを判定
 * Determine if zodiac sign is in daytime period
 * 
 * 昼の部分：卯、辰、巳、午、未、申、酉（6時から18時まで）
 * 
 * Daytime signs: 卯, 辰, 巳, 午, 未, 申, 酉 (from 6:00 to 18:00)
 * 
 * @param juniShin - 十二支の名前 / Zodiac sign name
 * @returns 昼の部分かどうか / Whether it is a daytime period
 */
export function isDayJuniShin(juniShin: string): boolean {
  const dayJuniShin = ["卯", "辰", "巳", "午", "未", "申", "酉"];
  return dayJuniShin.includes(juniShin);
}

/**
 * 刻から十二支を取得する（江戸時代の不定時法）
 * Get zodiac sign from koku (Edo period temporal time system)
 * 
 * 江戸時代の不定時法では、刻と十二支の対応は固定されている。
 * 昼：六刻→卯、五刻→辰、四刻→巳、九刻→午、八刻→未、七刻→申
 * 夜：六刻→酉、五刻→戌、四刻→亥、九刻→子、八刻→丑、七刻→寅
 * 
 * In the Edo period temporal time system, the correspondence between koku and zodiac signs is fixed.
 * Day: 六刻→卯, 五刻→辰, 四刻→巳, 九刻→午, 八刻→未, 七刻→申
 * Night: 六刻→酉, 五刻→戌, 四刻→亥, 九刻→子, 八刻→丑, 七刻→寅
 * 
 * @param period - 昼か夜か / Day or night
 * @param koku - 刻（1-6）/ Koku (1-6)
 * @returns 十二支の名前 / Zodiac sign name
 */
export function getJuniShinFromKoku(period: "day" | "night", koku: 1 | 2 | 3 | 4 | 5 | 6): string {
  // 刻と十二支の対応（江戸時代の不定時法）
  // Correspondence between koku and zodiac signs (Edo period temporal time system)
  const dayMapping: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
    1: "卯", // 六刻
    2: "辰", // 五刻
    3: "巳", // 四刻
    4: "午", // 九刻
    5: "未", // 八刻
    6: "申", // 七刻
  };
  
  const nightMapping: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
    1: "酉", // 六刻
    2: "戌", // 五刻
    3: "亥", // 四刻
    4: "子", // 九刻
    5: "丑", // 八刻
    6: "寅", // 七刻
  };
  
  return period === 'day' ? dayMapping[koku] : nightMapping[koku];
}

