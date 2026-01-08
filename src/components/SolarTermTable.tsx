/**
 * 太陽黄経と二十四節気の対応表表示コンポーネント
 * Solar Longitude and Solar Term Correspondence Table Component
 * 
 * 太陽黄経と二十四節気の対応関係を表形式で表示するコンポーネント。
 * 現在の太陽黄経と対応する二十四節気を表示し、展開可能な詳細表で全24節気の黄経範囲を表示する。
 * 
 * Component that displays the correspondence between solar longitude and solar terms in a table format.
 * Shows the current solar longitude and corresponding solar term, with an expandable detailed table
 * showing the longitude ranges for all 24 solar terms.
 */

import React, { useState } from 'react';
import { DisplayItem } from './DisplayItem';
import { SOLAR_TERMS } from '../core/solar-terms';
import { SEKKI_72_LIST, SEKKI_72_DESCRIPTIONS } from '../core/sekki-72';
import type { EdoTimeData, Sekki72 } from '../core/types';
import styles from './SolarTermTable.module.css';

/**
 * SolarTermTableコンポーネントのプロパティ
 * Props for SolarTermTable component
 */
interface SolarTermTableProps {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 黄経範囲の文字列を生成する
 * Generate longitude range string
 * 
 * 現在の節気と次の節気の黄経から、範囲文字列を生成する。
 * 360度をまたぐ場合は適切に処理する。
 * 
 * Generates a range string from the current and next solar term longitudes.
 * Handles cases where the range crosses 360 degrees.
 * 
 * @param current - 現在の節気の黄経 / Current solar term longitude
 * @param next - 次の節気の黄経 / Next solar term longitude
 * @returns 黄経範囲の文字列 / Longitude range string
 */
function getRangeString(current: number, next: number): string {
  if (next < current) {
    // 360度をまたぐ場合
    return `${current}°〜${next + 360}°`;
  }
  return `${current}°〜${next}°`;
}

/**
 * 二十四節気の開始黄経から、その節気に含まれる七十二候3件を取得
 * 七十二候は立春(315°)始まりで5度刻み
 */
function getSekkiForSolarTerm(longitude: number): Sekki72[] {
  const baseLongitude = 315; // 立春の黄経
  const normalized = ((longitude - baseLongitude) % 360 + 360) % 360;
  const startIndex = Math.floor(normalized / 5) % 72;
  
  return [
    SEKKI_72_LIST[startIndex],
    SEKKI_72_LIST[(startIndex + 1) % 72],
    SEKKI_72_LIST[(startIndex + 2) % 72],
  ];
}

/**
 * 太陽黄経と二十四節気の対応表表示コンポーネント
 * Solar longitude and solar term correspondence table display component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 対応表の表示要素 / Correspondence table display element
 */
export function SolarTermTable({ data }: SolarTermTableProps) {
  /** 詳細表の展開状態 / Expanded state of the detailed table */
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 対応表データを生成
  // Generate correspondence table data
  const tableData = SOLAR_TERMS.map((item, index) => {
    const next = SOLAR_TERMS[(index + 1) % SOLAR_TERMS.length];
    const range = getRangeString(item.longitude, next.longitude);
    const isCurrent = item.term === data.solarTerm;
    const sekkiList = getSekkiForSolarTerm(item.longitude);
    
    return {
      range,
      term: item.term,
      isCurrent,
      sekkiList,
    };
  });
  
  const currentItem = tableData.find(item => item.isCurrent);
  
  return (
    <div>
      <DisplayItem
        label="太陽黄経と二十四節気の対応"
        value={`現在: ${data.solarLongitude.toFixed(2)}° → ${data.solarTerm}`}
        description={currentItem ? `範囲: ${currentItem.range}` : undefined}
      />
      <details 
        className={styles.details}
        open={isExpanded}
        onToggle={(e) => setIsExpanded((e.target as HTMLDetailsElement).open)}
      >
        <summary className={styles.summary}>
          {isExpanded ? '対応表を閉じる' : '全対応表を表示'}
        </summary>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>黄経範囲</th>
              <th className={styles.th}>二十四節気</th>
              <th className={styles.th}>七十二候</th>
              <th className={styles.th}>説明</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <React.Fragment key={index}>
                {item.sekkiList.map((sekki, idx) => (
                  <tr
                    key={`${index}-${idx}`}
                    className={item.isCurrent ? styles.currentRow : ''}
                  >
                    {idx === 0 && (
                      <>
                        <td className={styles.td} rowSpan={3}>{item.range}</td>
                        <td className={styles.td} rowSpan={3}>{item.term}</td>
                      </>
                    )}
                    <td className={styles.td}>{sekki}</td>
                    <td className={styles.td}>{SEKKI_72_DESCRIPTIONS[sekki] || ''}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

