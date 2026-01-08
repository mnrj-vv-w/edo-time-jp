/**
 * 一刻の番号を漢数字に変換する
 * Convert Koku Number to Kanji
 * 
 * 不定時法の一刻の番号（1-6）を漢数字に変換する。
 * 昼・夜ともに：六、五、四、九、八、七の順序。
 * 
 * Converts temporal time system koku numbers (1-6) to kanji.
 * Same order for both day and night: 六, 五, 四, 九, 八, 七.
 */

/**
 * 一刻の番号（1-6）を漢数字に変換する
 * Convert koku number (1-6) to kanji
 * 
 * 不定時法では、刻の番号を漢数字で表現する。
 * 1刻=六、2刻=五、3刻=四、4刻=九、5刻=八、6刻=七の順序。
 * 
 * In the temporal time system, koku numbers are expressed in kanji.
 * Order: 1 koku = 六, 2 koku = 五, 3 koku = 四, 4 koku = 九, 5 koku = 八, 6 koku = 七.
 * 
 * @param koku - 一刻の番号（1-6）/ Koku number (1-6)
 * @returns 漢数字 / Kanji number
 */
export function kokuToKanji(koku: 1 | 2 | 3 | 4 | 5 | 6): string {
  // 昼・夜ともに：六、五、四、九、八、七の順序
  // Same order for both day and night: 六, 五, 四, 九, 八, 七
  const kanjiMap: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
    1: "六",
    2: "五",
    3: "四",
    4: "九",
    5: "八",
    6: "七",
  };
  
  return kanjiMap[koku];
}

