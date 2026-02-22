/**
 * 現在位置表示コンポーネント
 * Current Location Display Component
 *
 * 不定時法などの計算に使用している緯度・経度（および逆ジオコーディングで取得した地名）を表示する。
 * Footer と月齢表示ブロックの間に配置する。
 *
 * Displays the latitude and longitude used for calculations (and optionally place name from reverse geocoding).
 * Placed between the moon age block and the footer.
 */

import { useState, useEffect } from 'react';
import type { EdoTimeData } from '../core/types';
import { reverseGeocode } from '../utils/reverseGeocode';
import styles from './CurrentLocationDisplay.module.css';

interface CurrentLocationDisplayProps {
  /** 江戸時間データ（location は useEdoTime が付与）/ Edo time data (location set by useEdoTime) */
  data: EdoTimeData;
}

function formatLatLon(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `緯度 ${Math.abs(lat).toFixed(4)}°${latDir} / 経度 ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

type PlaceNameState = { status: 'idle' } | { status: 'loading' } | { status: 'ok'; name: string } | { status: 'error' };

/**
 * 現在位置表示コンポーネント
 * Current location display component
 */
export function CurrentLocationDisplay({ data }: CurrentLocationDisplayProps) {
  const loc = data.location;
  const [placeNameState, setPlaceNameState] = useState<PlaceNameState>({ status: 'idle' });

  useEffect(() => {
    if (!loc) {
      setPlaceNameState({ status: 'idle' });
      return;
    }

    let cancelled = false;
    setPlaceNameState({ status: 'loading' });

    reverseGeocode(loc.lat, loc.lon)
      .then((name) => {
        if (cancelled) return;
        setPlaceNameState(name != null ? { status: 'ok', name } : { status: 'error' });
      })
      .catch(() => {
        if (!cancelled) setPlaceNameState({ status: 'error' });
      });

    return () => {
      cancelled = true;
    };
  }, [loc?.lat, loc?.lon]);

  return (
    <div className={styles.container}>
      <div className={styles.label}>現在位置</div>
      {loc ? (
        <>
          <div className={styles.value}>{formatLatLon(loc.lat, loc.lon)}</div>
          <div className={styles.placeName}>
            {(placeNameState.status === 'idle' || placeNameState.status === 'loading') && '地名を取得中…'}
            {placeNameState.status === 'ok' && placeNameState.name}
            {placeNameState.status === 'error' && '地名を取得できません'}
          </div>
          <p className={styles.credit}>
            地名表示: <a href="https://www.bigdatacloud.com/" target="_blank" rel="noopener noreferrer">BigDataCloud</a>
          </p>
        </>
      ) : (
        <div className={styles.noLocation}>位置情報なし</div>
      )}
    </div>
  );
}
