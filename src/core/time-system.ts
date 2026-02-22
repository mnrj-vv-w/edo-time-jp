/**
 * 不定時法計算
 * Temporal Time System Calculation
 * 
 * 不定時法（江戸時代の時間システム）の計算を行う。
 * coreは「意味を返す」、UIは「表示するだけ」の責務分離の設計。
 * 
 * Calculates the temporal time system (Edo period time system).
 * Design separates responsibilities: core "returns meaning", UI "only displays".
 */

import type { TemporalTime } from './types';

/**
 * 明け六つ（日の出30分前）を計算する
 * Calculate ake-mutsu (30 minutes before sunrise)
 * 
 * 不定時法では、日の出30分前を「明け六つ」と呼び、昼の時間帯の開始点とする。
 * 
 * In the temporal time system, 30 minutes before sunrise is called "ake-mutsu" and marks the start of the daytime period.
 * 
 * @param sunrise - 日の出の時刻 / Sunrise time
 * @returns 明け六つの時刻 / Ake-mutsu time
 */
export function getAkeMutsu(sunrise: Date): Date {
  return new Date(sunrise.getTime() - 30 * 60 * 1000);
}

/**
 * 暮れ六つ（日の入り30分後）を計算する
 * Calculate kure-mutsu (30 minutes after sunset)
 * 
 * 不定時法では、日の入り30分後を「暮れ六つ」と呼び、昼の時間帯の終了点とする。
 * 
 * In the temporal time system, 30 minutes after sunset is called "kure-mutsu" and marks the end of the daytime period.
 * 
 * @param sunset - 日の入りの時刻 / Sunset time
 * @returns 暮れ六つの時刻 / Kure-mutsu time
 */
export function getKureMutsu(sunset: Date): Date {
  return new Date(sunset.getTime() + 30 * 60 * 1000);
}

/**
 * 不定時法の完全な情報を返す
 * Get complete temporal time system information
 *
 * 明け六つから暮れ六つまでを昼6刻、それ以外を夜6刻として分割し、現在時刻がどの刻に属するかを判定する。
 * 明け六つ・暮れ六つは呼び出し側で計算（例: 伏角7°21′40″による夜明・日暮）して渡す。
 *
 * @param akeMutsu - 明け六つ（昼の開始時刻）/ Ake-mutsu (day start)
 * @param kureMutsu - 暮れ六つ（昼の終了時刻）/ Kure-mutsu (day end)
 * @param now - 現在時刻 / Current time
 * @returns 不定時法の意味構造 / Temporal time system meaning structure
 */
export function getTemporalTime(
  akeMutsu: Date,
  kureMutsu: Date,
  now: Date
): TemporalTime {
  // 昼の時間帯（明け六つから暮れ六つまで）
  // Daytime period (from ake-mutsu to kure-mutsu)
  const dayDuration = kureMutsu.getTime() - akeMutsu.getTime();
  /** 昼の一刻の長さ（ミリ秒）/ Length of one day koku (milliseconds) */
  const dayKokuDuration = dayDuration / 6;
  
  // 夜の時間帯（暮れ六つから翌日の明け六つまで）
  // Nighttime period (from kure-mutsu to next day's ake-mutsu)
  const nightDuration = (24 * 60 * 60 * 1000) - dayDuration;
  /** 夜の一刻の長さ（ミリ秒）/ Length of one night koku (milliseconds) */
  const nightKokuDuration = nightDuration / 6;
  
  // 現在時刻が昼か夜かを判定
  // Determine if current time is day or night
  const nowTime = now.getTime();
  const akeMutsuTime = akeMutsu.getTime();
  const kureMutsuTime = kureMutsu.getTime();
  
  // 日をまたぐ場合の処理
  // Handle cases where time crosses midnight
  let normalizedNowTime = nowTime;
  if (normalizedNowTime < akeMutsuTime) {
    // 前日の夜の時間帯
    // Previous day's nighttime period
    normalizedNowTime += 24 * 60 * 60 * 1000;
  }
  
  /** 昼か夜か / Day or night */
  let period: "day" | "night";
  /** 刻（1-6）/ Koku (1-6) */
  let koku: 1 | 2 | 3 | 4 | 5 | 6;
  /** 刻の開始時刻 / Koku start time */
  let start: Date;
  /** 刻の終了時刻 / Koku end time */
  let end: Date;
  
  if (normalizedNowTime >= akeMutsuTime && normalizedNowTime < kureMutsuTime) {
    // 昼の時間帯
    // Daytime period
    period = "day";
    /** 明け六つからの経過時間（ミリ秒）/ Elapsed time from ake-mutsu (milliseconds) */
    const elapsed = normalizedNowTime - akeMutsuTime;
    koku = (Math.floor(elapsed / dayKokuDuration) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    if (koku > 6) koku = 6;
    
    /** 刻の開始時刻（ミリ秒）/ Koku start time (milliseconds) */
    const kokuStart = akeMutsuTime + (koku - 1) * dayKokuDuration;
    /** 刻の終了時刻（ミリ秒）/ Koku end time (milliseconds) */
    const kokuEnd = akeMutsuTime + koku * dayKokuDuration;
    
    start = new Date(kokuStart);
    end = new Date(kokuEnd);
  } else {
    // 夜の時間帯
    // Nighttime period
    period = "night";
    
    // 暮れ六つからの経過時間
    // Elapsed time from kure-mutsu
    let elapsed: number;
    if (normalizedNowTime >= kureMutsuTime) {
      elapsed = normalizedNowTime - kureMutsuTime;
    } else {
      // 前日の夜の時間帯
      // Previous day's nighttime period
      elapsed = (normalizedNowTime - akeMutsuTime) + (24 * 60 * 60 * 1000 - dayDuration);
    }
    
    koku = (Math.floor(elapsed / nightKokuDuration) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    if (koku > 6) koku = 6;
    
    /** 刻の開始時刻（ミリ秒）/ Koku start time (milliseconds) */
    const kokuStart = kureMutsuTime + (koku - 1) * nightKokuDuration;
    /** 刻の終了時刻（ミリ秒）/ Koku end time (milliseconds) */
    const kokuEnd = kureMutsuTime + koku * nightKokuDuration;
    
    start = new Date(kokuStart);
    end = new Date(kokuEnd);
  }
  
  return {
    period,
    koku,
    start,
    end,
  };
}

