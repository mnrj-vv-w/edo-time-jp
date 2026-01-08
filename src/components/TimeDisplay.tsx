/**
 * 現在時刻表示コンポーネント
 * Current Time Display Component
 * 
 * 現代の時刻（グレゴリオ暦・定時法）を表示するコンポーネント。
 * 江戸時間の計算基準となる現在時刻を表示する。
 * 
 * Component that displays the current time in modern calendar (Gregorian calendar, fixed time system).
 * Displays the current time that serves as the basis for Edo time calculations.
 */

import { DisplayItem } from './DisplayItem';
import { formatDateTime } from '../utils/format';
import type { EdoTimeData } from '../core/types';

/**
 * TimeDisplayコンポーネントのプロパティ
 * Props for TimeDisplay component
 */
interface TimeDisplayProps {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 現在時刻表示コンポーネント
 * Current time display component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 現在時刻の表示要素 / Current time display element
 */
export function TimeDisplay({ data }: TimeDisplayProps) {
  return (
    <DisplayItem
      label="現在時刻（現代時刻）"
      value={formatDateTime(data.currentTime)}
    />
  );
}

