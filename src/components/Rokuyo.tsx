/**
 * 六曜表示コンポーネント
 * Rokuyo Display Component
 * 
 * 六曜（大安、赤口、先勝、友引、先負、仏滅）を表示するコンポーネント。
 * 六曜は自然暦ではなく、民間暦注であることを明記する。
 * 
 * Component that displays rokuyo (six-day cycle: taian, shakku, senshō, tomobiki, senbu, butsumetsu).
 * Notes that rokuyo is not a natural calendar but a folk calendar annotation.
 */

import { DisplayItem } from './DisplayItem';
import type { EdoTimeData } from '../core/types';

/**
 * Rokuyoコンポーネントのプロパティ
 * Props for Rokuyo component
 */
interface RokuyoProps {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 六曜表示コンポーネント
 * Rokuyo display component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 六曜の表示要素 / Rokuyo display element
 */
export function Rokuyo({ data }: RokuyoProps) {
  return (
    <DisplayItem
      label="六曜"
      value={data.rokuyo}
      description="※六曜は自然暦ではなく民間暦注です"
    />
  );
}

