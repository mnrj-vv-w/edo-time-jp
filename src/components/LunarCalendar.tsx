/**
 * 旧暦・月齢表示コンポーネント
 * Lunar Calendar and Moon Age Display Component
 * 
 * 旧暦の月日と月齢を表示するコンポーネント。
 * koyomi8.comのデータを参照しています。
 * 
 * Component that displays the lunar calendar date and moon age.
 * References data from koyomi8.com.
 */

import { useState } from 'react';
import { DisplayItem } from './DisplayItem';
import { MoonPhaseVisualization } from './MoonPhaseVisualization';
import type { EdoTimeData } from '../core/types';
import { getWafuMonthName, WAFU_MONTH_NAMES } from '../utils/wafuMonthNames';
import { getMoonPhaseName } from '../utils/moonPhaseNames';
import styles from './LunarCalendar.module.css';

/**
 * LunarCalendarコンポーネントのプロパティ
 * Props for LunarCalendar component
 */
interface LunarCalendarProps {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 旧暦・月齢表示コンポーネント
 * Lunar calendar and moon age display component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 旧暦・月齢の表示要素 / Lunar calendar and moon age display element
 */
export function LunarCalendar({ data }: LunarCalendarProps) {
  const { lunarDate, moonAge, moonAgeError } = data;
  const [isExpanded, setIsExpanded] = useState(false);
  
  const wafuMonth = getWafuMonthName(lunarDate.month);
  const displayValue = wafuMonth 
    ? `${lunarDate.year}年${lunarDate.month}月${lunarDate.day}日（${wafuMonth.name}）`
    : `${lunarDate.year}年${lunarDate.month}月${lunarDate.day}日`;
  
  return (
    <>
      <DisplayItem
        label="旧暦の月日"
        value={displayValue}
        description="※koyomi8.comのデータを参照しています"
      />
      <details 
        className={styles.details}
        open={isExpanded}
        onToggle={(e) => setIsExpanded((e.target as HTMLDetailsElement).open)}
      >
        <summary className={styles.summary}>
          {isExpanded ? '旧暦の月と和風月名の対応表を閉じる' : '旧暦の月と和風月名の対応表を表示'}
        </summary>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>旧暦の月</th>
              <th className={styles.th}>和風月名（漢字）</th>
              <th className={styles.th}>読み</th>
              <th className={styles.th}>由来と解説（参考：国立国会図書館「暦のページ」）</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(WAFU_MONTH_NAMES).map(([month, { name, kana, origin }]) => (
              <tr
                key={month}
                className={parseInt(month) === lunarDate.month ? styles.currentRow : ''}
              >
                <td className={styles.td}>{month}月</td>
                <td className={styles.td}>{name}</td>
                <td className={styles.td}>{kana}</td>
                <td className={styles.td}>{origin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <div className={styles.moonAgeContainer}>
        <div className={styles.moonAgeLabel}>月齢</div>
        <div className={styles.moonAgeRow}>
          <div className={styles.moonAgeValue}>
            {moonAgeError ? '計算不可' : moonAge.toFixed(1)}
            <span className={styles.moonAgeUnit}> 日</span>
            {!moonAgeError && (() => {
              const phaseName = getMoonPhaseName(moonAge);
              if (!phaseName) return null;
              return (
                <span className={styles.moonPhaseNameInline}>
                  <span className={styles.moonPhaseNameKanji}>{phaseName.name}</span>
                  <span className={styles.moonPhaseNameReading}>（{phaseName.reading}）</span>
                </span>
              );
            })()}
          </div>
        </div>
        {moonAgeError && (
          <div className={styles.moonAgeError}>{moonAgeError}</div>
        )}
        {!moonAgeError && (() => {
          const phaseName = getMoonPhaseName(moonAge);
          if (!phaseName) return null;
          return (
            <div className={styles.moonPhaseDescription}>
              {phaseName.description}
            </div>
          );
        })()}
      </div>
      <MoonPhaseVisualization moonAge={moonAge} error={moonAgeError} />
      {moonAgeError && (
        <div style={{ 
          color: '#d32f2f', 
          fontSize: '0.875rem', 
          marginTop: '0.5rem',
          padding: '0.75rem',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          ⚠️ {moonAgeError}
        </div>
      )}
    </>
  );
}

