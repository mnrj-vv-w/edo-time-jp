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
 * 現在時刻が明け六つより前（深夜）のときは、前日の暮れ六つを渡すと正しい夜の区間で刻を計算する。
 *
 * @param akeMutsu - 明け六つ（昼の開始時刻）/ Ake-mutsu (day start)
 * @param kureMutsu - 暮れ六つ（昼の終了時刻）/ Kure-mutsu (day end)
 * @param now - 現在時刻 / Current time
 * @param prevKureMutsu - 前日の暮れ六つ（now が明け六つより前のときのみ使用）/ Previous day's kure-mutsu (used only when now is before ake-mutsu)
 * @returns 不定時法の意味構造 / Temporal time system meaning structure
 */
export function getTemporalTime(
  akeMutsu: Date,
  kureMutsu: Date,
  now: Date,
  prevKureMutsu?: Date
): TemporalTime {
  const nowTime = now.getTime();
  const akeMutsuTime = akeMutsu.getTime();
  const kureMutsuTime = kureMutsu.getTime();

  // 昼の時間帯（明け六つから暮れ六つまで）
  const dayDuration = kureMutsu.getTime() - akeMutsu.getTime();
  const dayKokuDuration = dayDuration / 6;

  /** 昼か夜か / Day or night */
  let period: "day" | "night";
  let koku: 1 | 2 | 3 | 4 | 5 | 6;
  let start: Date;
  let end: Date;

  if (nowTime >= akeMutsuTime && nowTime < kureMutsuTime) {
    // 昼の時間帯
    period = "day";
    const elapsed = nowTime - akeMutsuTime;
    koku = (Math.floor(elapsed / dayKokuDuration) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    if (koku > 6) koku = 6;
    const kokuStart = akeMutsuTime + (koku - 1) * dayKokuDuration;
    const kokuEnd = akeMutsuTime + koku * dayKokuDuration;
    start = new Date(kokuStart);
    end = new Date(kokuEnd);
    return { period, koku, start, end };
  }

  // 夜の時間帯
  period = "night";

  // 現在が明け六つより前で、前日の暮れ六つが渡されている → 夜は「前日暮れ六つ〜今日明け六つ」
  if (nowTime < akeMutsuTime && prevKureMutsu != null) {
    const prevKureMutsuTime = prevKureMutsu.getTime();
    const nightDuration = akeMutsuTime - prevKureMutsuTime;
    const nightKokuDuration = nightDuration / 6;
    const elapsed = nowTime - prevKureMutsuTime;
    koku = (Math.floor(elapsed / nightKokuDuration) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    if (koku > 6) koku = 6;
    const kokuStart = prevKureMutsuTime + (koku - 1) * nightKokuDuration;
    const kokuEnd = prevKureMutsuTime + koku * nightKokuDuration;
    start = new Date(kokuStart);
    end = new Date(kokuEnd);
    return { period, koku, start, end };
  }

  // 通常の夜（今日の暮れ六つ〜翌日明け六つ）
  const nightDuration = 24 * 60 * 60 * 1000 - dayDuration;
  const nightKokuDuration = nightDuration / 6;
  let elapsed: number;
  if (nowTime >= kureMutsuTime) {
    elapsed = nowTime - kureMutsuTime;
  } else {
    // 前日の夜（+24h してから経過を計算）
    const normalizedNowTime = nowTime + 24 * 60 * 60 * 1000;
    elapsed = (normalizedNowTime - akeMutsuTime) + (24 * 60 * 60 * 1000 - dayDuration);
  }

  koku = (Math.floor(elapsed / nightKokuDuration) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
  if (koku > 6) koku = 6;
  const kokuStart = kureMutsuTime + (koku - 1) * nightKokuDuration;
  const kokuEnd = kureMutsuTime + koku * nightKokuDuration;
  start = new Date(kokuStart);
  end = new Date(kokuEnd);

  return { period, koku, start, end };
}

