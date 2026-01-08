/**
 * 江戸時間データ管理フック
 * Edo Time Data Management Hook
 * 
 * 1分ごとの自動更新（表示の一貫性のため、刻の変化を追える粒度として）。
 * 
 * 注意: Phase1の近似計算では「節気の瞬間の厳密さ」は出ないため、
 * 更新理由は「表示の一貫性」「刻の変化を追える粒度」として誠実に表現。
 * 
 * Automatic update every 1 minute (for display consistency and granularity to track koku changes).
 * 
 * Note: Phase 1 approximation calculations do not provide "strictness of solar term moments",
 * so update reason is honestly expressed as "display consistency" and "granularity to track koku changes".
 */

import { useState, useEffect } from 'react';
import { calculateEdoTime } from '../core';
import { DEFAULT_LOCATION } from '../core/astronomy/constants';
import type { EdoTimeData, Location } from '../core/types';

/**
 * 江戸時間データを管理するフック
 * Hook for managing Edo time data
 * 
 * 1分ごとに現在時刻を取得し、calculateEdoTimeを呼び出してEdoTimeDataを更新する。
 * 位置情報の取得（Geolocation API）も行う（許可が得られない場合は東京にフォールバック）。
 * 
 * Gets current time every 1 minute and calls calculateEdoTime to update EdoTimeData.
 * Also fetches location information (Geolocation API) (falls back to Tokyo if permission is not granted).
 * 
 * @param location - 位置情報（省略時は東京座標・"Asia/Tokyo"タイムゾーン）/ Location information (default: Tokyo coordinates, "Asia/Tokyo" timezone)
 * @returns 江戸時間データ / Edo time data
 */
export function useEdoTime(location?: Location): EdoTimeData {
  /** 位置情報の状態 / Location state */
  const [loc, setLoc] = useState<Location>(location || DEFAULT_LOCATION);
  /** 江戸時間データの状態 / Edo time data state */
  const [data, setData] = useState<EdoTimeData>(() => calculateEdoTime(new Date(), loc));
  
  // ブラウザの現在地とタイムゾーンを取得（許可が得られない場合は東京にフォールバック）
  // Get browser's current location and timezone (fallback to Tokyo if permission not granted)
  useEffect(() => {
    if (location) {
      setLoc(location);
      return;
    }
    
    /**
     * 位置情報を取得する
     * Fetch location information
     */
    const fetchLocation = () => {
      if (!navigator?.geolocation) {
        setLoc(DEFAULT_LOCATION);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          setLoc({ lat: latitude, lon: longitude, tz });
        },
        () => {
          setLoc(DEFAULT_LOCATION);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    };
    
    fetchLocation();
  }, [location]);
  
  // 1分ごとにデータを更新
  // Update data every 1 minute
  useEffect(() => {
    // 初回計算
    // Initial calculation
    setData(calculateEdoTime(new Date(), loc));
    
    // 1分ごとに更新
    // Update every 1 minute
    const interval = setInterval(() => {
      setData(calculateEdoTime(new Date(), loc));
    }, 60 * 1000); // 1分 = 60秒 = 60000ミリ秒 / 1 minute = 60 seconds = 60000 milliseconds
    
    return () => {
      clearInterval(interval);
    };
  }, [loc]);
  
  return data;
}

