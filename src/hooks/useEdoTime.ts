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

import { useState, useEffect, useRef } from 'react';
import { calculateEdoTime } from '../core';
import { DEFAULT_LOCATION } from '../core/astronomy/constants';
import type { EdoTimeData, Location } from '../core/types';
import { log } from '../utils/debugLog';

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

  // デバッグ: 初回の loc をログ
  useEffect(() => {
    log('useEdoTime:loc', {
      source: 'initial',
      loc: { lat: loc.lat, lon: loc.lon, tz: loc.tz },
    });
  }, []);

  // ブラウザの現在地とタイムゾーンを取得（許可が得られない場合は東京にフォールバック）
  // Get browser's current location and timezone (fallback to Tokyo if permission not granted)
  useEffect(() => {
    if (location) {
      log('useEdoTime:loc', {
        source: 'prop',
        loc: { lat: location.lat, lon: location.lon, tz: location.tz },
      });
      setLoc(location);
      return;
    }

    const GEOLOCATION_TIMEOUT_MS = 15000;
    const MAX_RETRIES = 1;
    const RETRY_DELAY_MS = 3000;

    const fetchLocation = (retryCount = 0) => {
      if (!navigator?.geolocation) {
        log('useEdoTime:loc', {
          source: 'fallback',
          reason: 'no_geolocation',
          loc: { lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon, tz: DEFAULT_LOCATION.tz },
        });
        setLoc(DEFAULT_LOCATION);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const newLoc = { lat: latitude, lon: longitude, tz };
          log('useEdoTime:loc', { source: 'geolocation', loc: newLoc });
          setLoc(newLoc);
        },
        (error: GeolocationPositionError) => {
          const errorReason =
            error.code === 1
              ? 'PERMISSION_DENIED'
              : error.code === 2
                ? 'POSITION_UNAVAILABLE'
                : error.code === 3
                  ? 'TIMEOUT'
                  : 'UNKNOWN';
          log('useEdoTime:loc', {
            source: 'fallback',
            reason: 'geolocation_error',
            errorCode: error.code,
            errorReason,
            errorMessage: error.message,
            retryCount,
            loc: { lat: DEFAULT_LOCATION.lat, lon: DEFAULT_LOCATION.lon, tz: DEFAULT_LOCATION.tz },
          });
          if (retryCount < MAX_RETRIES) {
            setTimeout(() => fetchLocation(retryCount + 1), RETRY_DELAY_MS);
          } else {
            setLoc(DEFAULT_LOCATION);
          }
        },
        { enableHighAccuracy: true, timeout: GEOLOCATION_TIMEOUT_MS }
      );
    };

    fetchLocation();
  }, [location]);

  // 現在位置が変わったときに即座に描画を更新（円盤・赤線を新しい loc で再計算）
  const isFirstLocRef = useRef(true);
  useEffect(() => {
    if (isFirstLocRef.current) {
      isFirstLocRef.current = false;
      return;
    }
    setData(calculateEdoTime(new Date(), loc));
  }, [loc]);

  // 1分ごとにデータを更新（初回は即時実行しない＝初回描画の data を上書きしない）
  // Update data every 1 minute (do NOT run setData immediately on mount - avoids overwriting correct first paint)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      log('useEdoTime:interval', {
        loc: { lat: loc.lat, lon: loc.lon, tz: loc.tz },
        currentTime: now.toISOString(),
        currentTimeMs: now.getTime(),
      });
      setData(calculateEdoTime(now, loc));
    }, 60 * 1000); // 1分 = 60秒 = 60000ミリ秒 / 1 minute = 60 seconds = 60000 milliseconds

    return () => {
      clearInterval(interval);
    };
  }, [loc]);
  
  return data;
}

