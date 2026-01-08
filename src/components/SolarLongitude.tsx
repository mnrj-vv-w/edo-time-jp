/**
 * 太陽黄経表示コンポーネント
 * Solar Longitude Display Component
 * 
 * 太陽の黄経（0-360度）を表示するコンポーネント。
 * 太陽黄経は二十四節気や七十二候の判定に使用される重要な値。
 * 
 * Component that displays the solar longitude (0-360 degrees).
 * Solar longitude is an important value used for determining solar terms and 72 micro-seasons.
 */

import { DisplayItem } from './DisplayItem';
import type { EdoTimeData } from '../core/types';

/**
 * SolarLongitudeコンポーネントのプロパティ
 * Props for SolarLongitude component
 */
interface SolarLongitudeProps {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 太陽黄経表示コンポーネント
 * Solar longitude display component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 太陽黄経の表示要素 / Solar longitude display element
 */
export function SolarLongitude({ data }: SolarLongitudeProps) {
  return (
    <DisplayItem
      label="太陽黄経"
      value={data.solarLongitude}
      unit="度"
    />
  );
}

