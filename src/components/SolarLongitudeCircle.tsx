/**
 * 太陽黄経と二十四節気・七十二候の円形可視化コンポーネント
 * Solar Longitude Circle Visualization Component
 * 
 * 太陽黄経を円形で可視化し、二十四節気と七十二候をラベリングする。
 * 主要な節気（春分、立夏、夏至、立秋、秋分、立冬、冬至、立春）を強調表示し、
 * 現在の太陽黄経位置に線を引いて表示する。
 * 
 * Visualizes solar longitude in a circle and labels 24 solar terms and 72 micro-seasons.
 * Highlights major solar terms (Spring Equinox, Start of Summer, Summer Solstice, etc.)
 * and draws a line indicating the current solar longitude position.
 */

import { useMemo, useRef, useEffect, useState } from 'react';
import { SOLAR_TERMS } from '../core/solar-terms';
import type { EdoTimeData } from '../core/types';
import styles from './SolarLongitudeCircle.module.css';

/**
 * SolarLongitudeCircleコンポーネントのプロパティ
 * Props for SolarLongitudeCircle component
 */
interface SolarLongitudeCircleProps {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 主要な節気の定義（強調表示する節気）
 * Major solar terms definition (highlighted terms)
 */
const MAJOR_TERMS: Array<{ term: string; angle: number }> = [
  { term: "春分", angle: 0 },
  { term: "立夏", angle: 45 },
  { term: "夏至", angle: 90 },
  { term: "立秋", angle: 135 },
  { term: "秋分", angle: 180 },
  { term: "立冬", angle: 225 },
  { term: "冬至", angle: 270 },
  { term: "立春", angle: 315 },
];

/**
 * 角度をラジアンに変換（0度を上（12時の方向）として）
 * Convert angle to radians (0 degrees at top, 12 o'clock direction)
 */
function angleToRadians(angle: number): number {
  // 0度を上（12時の方向）として、時計回りに配置
  // 0 degrees at top (12 o'clock), arranged clockwise
  // 数学座標系では0度が右（3時の方向）なので、-90度回転して調整
  // In mathematical coordinate system, 0 degrees is right (3 o'clock), so rotate by -90 degrees
  return ((angle - 90) * Math.PI) / 180;
}

/**
 * 太陽黄経と二十四節気・七十二候の円形可視化コンポーネント
 * Solar longitude circle visualization component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 円形可視化の表示要素 / Circular visualization display element
 */
export function SolarLongitudeCircle({ data }: SolarLongitudeCircleProps) {
  const { solarLongitude, solarTerm } = data;
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(800);

  // コンテナのサイズに応じて円のサイズを調整
  // Adjust circle size based on container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // パディングを考慮して少し小さくする
        // Make it slightly smaller considering padding
        const newSize = Math.min(width - 40, window.innerWidth - 40);
        setSize(Math.max(400, newSize));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  /** 円の半径 / Circle radius */
  const radius = useMemo(() => size / 2 - 100, [size]);
  /** 円の中心X座標 / Circle center X coordinate */
  const centerX = size / 2;
  /** 円の中心Y座標 / Circle center Y coordinate */
  const centerY = size / 2;

  /** 現在の太陽黄経の角度（ラジアン）/ Current solar longitude angle (radians) */
  const currentAngle = useMemo(() => angleToRadians(solarLongitude), [solarLongitude]);

  /** 角度ごとの線の太さを計算 / Calculate line thickness for each angle */
  const angleLines = useMemo(() => {
    const lines: Array<{ angle: number; strokeWidth: number }> = [];
    
    // 太線（主要な節気の位置: 0度、45度、90度、135度、180度、225度、270度、315度）
    // Thick lines (major solar term positions: 0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
    const thickAngles = [0, 45, 90, 135, 180, 225, 270, 315];
    thickAngles.forEach(angle => {
      lines.push({ angle, strokeWidth: 3 });
    });
    
    // 中線（他の二十四節気の位置: 15度、30度、60度、75度、105度、120度、150度、165度、195度、210度、240度、255度、285度、300度、330度、345度）
    // Medium lines (other solar term positions: 15°, 30°, 60°, 75°, 105°, 120°, 150°, 165°, 195°, 210°, 240°, 255°, 285°, 300°, 330°, 345°)
    const mediumAngles = [15, 30, 60, 75, 105, 120, 150, 165, 195, 210, 240, 255, 285, 300, 330, 345];
    mediumAngles.forEach(angle => {
      lines.push({ angle, strokeWidth: 2 });
    });
    
    // 細線（七十二候の位置: 5度刻みの残り）
    // Thin lines (72 micro-season positions: remaining 5-degree intervals)
    for (let angle = 0; angle < 360; angle += 5) {
      // 太線と中線の角度はスキップ
      // Skip thick and medium line angles
      if (!thickAngles.includes(angle) && !mediumAngles.includes(angle)) {
        lines.push({ angle, strokeWidth: 1 });
      }
    }
    
    return lines;
  }, []);

  /** ラベル位置の計算（重なりを避けるため、異なる半径に配置）/ Calculate label positions (place at different radii to avoid overlap) */
  const labelPositions = useMemo(() => {
    const positions: Array<{
      type: 'major' | 'solar' | 'sekki';
      text: string;
      angle: number;
      radius: number;
      fontSize: number;
    }> = [];

    // 主要な節気（大きめの文字、太線の延長先）
    // Major solar terms (larger text, at the end of thick lines)
    MAJOR_TERMS.forEach(({ term, angle }) => {
      positions.push({
        type: 'major',
        text: term,
        angle,
        radius: radius + 40, // 太線の延長先に配置
        fontSize: 20,
      });
    });

    // 他の二十四節気（中程度の文字、中線の延長先）
    // Other solar terms (medium text, at the end of medium lines)
    SOLAR_TERMS.forEach(({ term, longitude }) => {
      // 主要な節気はスキップ
      // Skip major terms
      if (MAJOR_TERMS.some(mt => mt.term === term)) {
        return;
      }
      positions.push({
        type: 'solar',
        text: term,
        angle: longitude,
        radius: radius + 25, // 中線の延長先に配置
        fontSize: 13,
      });
    });

    // 七十二候のラベルは表示しない（文字が読めないため）
    // 72 micro-season labels are not displayed (text is unreadable)

    // ラベルの重なりを避けるため、角度が近いラベルを調整
    // Adjust labels with similar angles to avoid overlap
    const adjustedPositions = positions.map((pos, idx) => {
      // 同じタイプのラベルで角度が近いものを検出
      // Detect labels of the same type with similar angles
      const nearbyLabels = positions.filter((other, otherIdx) => {
        if (idx === otherIdx || other.type !== pos.type) return false;
        const angleDiff = Math.abs(other.angle - pos.angle);
        const normalizedAngleDiff = Math.min(angleDiff, 360 - angleDiff);
        return normalizedAngleDiff < 10; // 10度以内
      });

      // 近くにラベルがある場合、半径を微調整
      // Slightly adjust radius if there are nearby labels
      if (nearbyLabels.length > 0) {
        const adjustment = nearbyLabels.length * 2;
        return {
          ...pos,
          radius: pos.radius + (pos.type === 'sekki' ? -adjustment : adjustment),
        };
      }

      return pos;
    });

    return adjustedPositions;
  }, [radius]);

  return (
    <div className={styles.container} ref={containerRef}>
      <h2 className={styles.title}>太陽黄経と二十四節気の対応</h2>
      <div className={styles.circleWrapper}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={styles.svg}>
          {/* 背景円 */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="2"
          />

          {/* 角度ごとの線（太線・中線・細線） */}
          {angleLines.map(({ angle, strokeWidth }) => {
            const rad = angleToRadians(angle);
            // すべての線は円周（radius）まで（ラベルと触れないように）
            // All lines extend to circle circumference (radius) to avoid touching labels
            const x = centerX + radius * Math.cos(rad);
            const y = centerY + radius * Math.sin(rad);
            return (
              <line
                key={`angle-line-${angle}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke="#ccc"
                strokeWidth={strokeWidth}
                strokeOpacity={strokeWidth === 1 ? 0.5 : 0.7}
              />
            );
          })}

          {/* 主要な節気のマーカー線は削除（角度ごとの線で十分） */}
          {/* Major solar term marker lines removed (angle lines are sufficient) */}

          {/* 現在の太陽黄経位置の線 */}
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + radius * Math.cos(currentAngle)}
            y2={centerY + radius * Math.sin(currentAngle)}
            stroke="#ff5722"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* 現在位置のマーカー */}
          <circle
            cx={centerX + radius * Math.cos(currentAngle)}
            cy={centerY + radius * Math.sin(currentAngle)}
            r="5"
            fill="#ff5722"
          />

          {/* ラベル */}
          {labelPositions.map((pos, index) => {
            const rad = angleToRadians(pos.angle);
            const x = centerX + pos.radius * Math.cos(rad);
            const y = centerY + pos.radius * Math.sin(rad);
            
            // テキストを線に沿って回転させる
            // Rotate text along the line
            const rotationAngle = pos.angle;
            
            // テキストの中心が線の先端に来るように配置
            // Position text so its center aligns with the end of the line
            const textAnchor: 'start' | 'middle' | 'end' = 'middle';
            const dominantBaseline: 'auto' | 'middle' | 'central' = 'central';

            return (
              <text
                key={`label-${index}`}
                x={x}
                y={y}
                textAnchor={textAnchor}
                dominantBaseline={dominantBaseline}
                fontSize={pos.fontSize}
                fill={pos.type === 'major' ? '#1a1a1a' : pos.type === 'solar' ? '#666' : '#999'}
                fontWeight={pos.type === 'major' ? 'bold' : 'normal'}
                className={styles.label}
                transform={`rotate(${rotationAngle}, ${x}, ${y})`}
              >
                {pos.text}
              </text>
            );
          })}
        </svg>
      </div>
      <div className={styles.info}>
        <div className={styles.currentPosition}>
          現在の太陽黄経: <span className={styles.value}>{solarLongitude.toFixed(2)}度</span>
          {(() => {
            // 現在の節気の範囲を計算
            // Calculate the range of the current solar term
            const currentIndex = SOLAR_TERMS.findIndex(st => st.term === solarTerm);
            if (currentIndex === -1) return null;
            const current = SOLAR_TERMS[currentIndex];
            const next = SOLAR_TERMS[(currentIndex + 1) % SOLAR_TERMS.length];
            const range = next.longitude < current.longitude 
              ? `${current.longitude}°〜${next.longitude + 360}°`
              : `${current.longitude}°〜${next.longitude}°`;
            return `（${solarTerm}：${range}）`;
          })()}
        </div>
      </div>
    </div>
  );
}

