/**
 * 七十二候表示コンポーネント
 * 72 Micro-Seasons Display Component
 * 
 * 現在の七十二候を表示するコンポーネント。
 * 七十二候は太陽黄経を5度刻みで72分割した、より細かい季節の区分。
 * 読み仮名と説明文も併記する。
 * 
 * Component that displays the current 72 micro-seasons (shichijūni kō).
 * The 72 micro-seasons divide the year into 72 periods based on solar longitude (5-degree intervals),
 * providing a more detailed seasonal division.
 * Also displays reading (pronunciation) and description.
 */

import { DisplayItem } from './DisplayItem';
import { SEKKI_72_DESCRIPTIONS, SEKKI_72_READINGS } from '../core/sekki-72';
import type { EdoTimeData } from '../core/types';

/**
 * Sekki72コンポーネントのプロパティ
 * Props for Sekki72 component
 */
interface Sekki72Props {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 七十二候表示コンポーネント
 * 72 micro-seasons display component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 七十二候の表示要素 / 72 micro-seasons display element
 */
export function Sekki72({ data }: Sekki72Props) {
  /** 読み仮名 / Reading (pronunciation) */
  const reading = SEKKI_72_READINGS[data.sekki72] || '';
  /** 説明文 / Description */
  const description = SEKKI_72_DESCRIPTIONS[data.sekki72] || '';
  
  // 読み仮名を含めた表示
  // Display with reading included
  const valueWithReading = reading 
    ? `${data.sekki72}（${reading}）`
    : data.sekki72;
  
  return (
    <DisplayItem
      label="七十二候"
      value={valueWithReading}
      description={description}
    />
  );
}

