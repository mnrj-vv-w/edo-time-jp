/**
 * 時刻から角度を計算するユーティリティ
 * Time to Angle Conversion Utilities
 * 
 * 時刻を円形表示用の角度（ラジアン）に変換するユーティリティ。
 * 正午（12時）を上（-π/2）として、時計回りに角度を計算する。
 * 
 * Utilities for converting time to angles (radians) for circular display.
 * Calculates angles clockwise with noon (12:00) at the top (-π/2).
 */

/**
 * 時刻から角度を計算する
 * Calculate angle from time
 * 
 * 正午（12時）を上（-π/2）として、時計回りに角度を計算する。
 * 24時間を360度（2π）として、正午からの時差から角度を求める。
 * 
 * Calculates angle clockwise with noon (12:00) at the top (-π/2).
 * Treats 24 hours as 360 degrees (2π) and calculates angle from time difference from noon.
 * 
 * @param time - 時刻 / Time
 * @param noon - 正午の時刻（同じ日の12時）/ Noon time (12:00 of the same day)
 * @returns 角度（ラジアン、-π/2が上）/ Angle (radians, -π/2 is top)
 */
export function timeToAngle(time: Date, noon: Date): number {
  // 正午からの時差を計算（ミリ秒）
  // Calculate time difference from noon (milliseconds)
  const diffMs = time.getTime() - noon.getTime();
  
  // 24時間を360度（2π）として角度を計算
  // Calculate angle treating 24 hours as 360 degrees (2π)
  // 正午を上（-π/2）として、時計回りに配置
  // Position noon at top (-π/2) and arrange clockwise
  const angle = (diffMs / (24 * 60 * 60 * 1000)) * Math.PI * 2 - Math.PI / 2;
  
  return angle;
}

/**
 * 日の出・日の入りから明け六つ・暮れ六つの角度を計算する
 * Calculate angles for ake-mutsu and kure-mutsu from sunrise and sunset
 * 
 * 日の出30分前（明け六つ）と日の入り30分後（暮れ六つ）の時刻から角度を計算する。
 * 
 * Calculates angles from times 30 minutes before sunrise (ake-mutsu) and 30 minutes after sunset (kure-mutsu).
 * 
 * @param sunrise - 日の出の時刻 / Sunrise time
 * @param sunset - 日の入りの時刻 / Sunset time
 * @param noon - 正午の時刻（同じ日の12時）/ Noon time (12:00 of the same day)
 * @returns 明け六つ・暮れ六つの角度 / Angles for ake-mutsu and kure-mutsu
 */
export function calculateAkeKureAngles(
  sunrise: Date,
  sunset: Date,
  noon: Date
): { akeMutsuAngle: number; kureMutsuAngle: number } {
  // 明け六つ（日の出30分前）
  // Ake-mutsu (30 minutes before sunrise)
  const akeMutsu = new Date(sunrise.getTime() - 30 * 60 * 1000);
  const akeMutsuAngle = timeToAngle(akeMutsu, noon);
  
  // 暮れ六つ（日の入り30分後）
  // Kure-mutsu (30 minutes after sunset)
  const kureMutsu = new Date(sunset.getTime() + 30 * 60 * 1000);
  const kureMutsuAngle = timeToAngle(kureMutsu, noon);
  
  return { akeMutsuAngle, kureMutsuAngle };
}

