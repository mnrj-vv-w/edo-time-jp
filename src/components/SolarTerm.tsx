/**
 * 二十四節気表示コンポーネント
 * Solar Term Display Component
 * 
 * 現在の二十四節気を表示するコンポーネント。
 * 二十四節気は太陽黄経を15度刻みで24分割した季節の区分。
 * 
 * Component that displays the current solar term (24 sekki).
 * Solar terms divide the year into 24 periods based on solar longitude (15-degree intervals).
 */

import { DisplayItem } from './DisplayItem';
import type { EdoTimeData } from '../core/types';

/**
 * SolarTermコンポーネントのプロパティ
 * Props for SolarTerm component
 */
interface SolarTermProps {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 二十四節気表示コンポーネント
 * Solar term display component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 二十四節気の表示要素 / Solar term display element
 */
export function SolarTerm({ data }: SolarTermProps) {
  return (
    <DisplayItem
      label="二十四節気"
      value={data.solarTerm}
    />
  );
}

