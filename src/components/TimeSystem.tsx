/**
 * 不定時法関連表示コンポーネント
 * Temporal Time System Display Component
 * 
 * 不定時法（江戸時代の時間システム）に関する情報を表示するコンポーネント。
 * 円形時計表示、現在の一刻、明け六つ・暮れ六つの時刻を表示する。
 * 
 * Component that displays information about the temporal time system (Edo period time system).
 * Displays circular clock visualization, current koku (time period), and ake-mutsu/kure-mutsu times.
 */

import { TemporalTimeCircle } from './TemporalTimeCircle';
import type { EdoTimeData } from '../core/types';

/**
 * TimeSystemコンポーネントのプロパティ
 * Props for TimeSystem component
 */
interface TimeSystemProps {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 不定時法関連表示コンポーネント
 * Temporal time system display component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 不定時法情報の表示要素 / Temporal time system display element
 */
export function TimeSystem({ data }: TimeSystemProps) {
  return (
    <>
      <TemporalTimeCircle data={data} />
      {/* <DisplayItem
        label="一刻（不定時法）"
        value={`${periodText} ${kokuText}`}
        description={formatTimeRange(temporalTime.start, temporalTime.end)}
      />
      <DisplayItem
        label="明け六つ（日の出30分前頃）"
        value={formatTimeApprox(akeMutsu)}
      />
      <DisplayItem
        label="暮れ六つ（日の入30分後頃）"
        value={formatTimeApprox(kureMutsu)}
      /> */}
    </>
  );
}

