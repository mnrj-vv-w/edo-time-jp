/**
 * 不定時法の円形時計表示コンポーネント
 * Temporal Time Circle Display Component
 * 
 * 不定時法（昼6刻・夜6刻）を円形の時計として可視化するコンポーネント。
 * SVGを使用して、十二支、漢数字による刻の表示、現在時刻の線、明け六つ・暮れ六つのマーカーを表示する。
 * 正午（12時）を上（0度）として、時計回りに配置する。
 * 
 * Component that visualizes the temporal time system (6 day koku, 6 night koku) as a circular clock.
 * Uses SVG to display the 12 zodiac signs, koku numbers in kanji, current time line, and ake-mutsu/kure-mutsu markers.
 * Positions noon (12:00) at the top (0 degrees) and arranges elements clockwise.
 */

import { useMemo } from 'react';
import { formatTimeApprox } from '../utils/format';
import { timeToAngle, calculateAkeKureAngles } from '../utils/timeAngle';
import { isDayJuniShin, getJuniShinFromKoku } from '../utils/juniShin';
import { kokuToKanji } from '../utils/kanjiNumbers';
import type { EdoTimeData } from '../core/types';
import styles from './TemporalTimeCircle.module.css';

/**
 * TemporalTimeCircleコンポーネントのプロパティ
 * Props for TemporalTimeCircle component
 */
interface TemporalTimeCircleProps {
  /** 江戸時間データ / Edo time data */
  data: EdoTimeData;
}

/**
 * 不定時法の円形時計表示コンポーネント
 * Temporal time circle display component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 円形時計の表示要素 / Circular clock display element
 */
export function TemporalTimeCircle({ data }: TemporalTimeCircleProps) {
  const { temporalTime, akeMutsu, kureMutsu, currentTime, sunrise, sunset } = data;
  
  /** 円形時計の描画データを計算（メモ化） / Calculate circular clock drawing data (memoized) */
  const circleData = useMemo(() => {
    /** 円の半径（ピクセル）/ Circle radius (pixels) */
    const radius = 120;
    /** 円の中心X座標（ピクセル）/ Circle center X coordinate (pixels) */
    const centerX = 200;
    /** 円の中心Y座標（ピクセル）/ Circle center Y coordinate (pixels) */
    const centerY = 200;
    
    // 正午（12時）を基準とする
    // Use noon (12:00) as reference
    const today = new Date(currentTime);
    const noon = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
    
    // 明け六つ・暮れ六つの角度を計算
    // Calculate angles for ake-mutsu and kure-mutsu
    const { akeMutsuAngle, kureMutsuAngle } = calculateAkeKureAngles(sunrise, sunset, noon);
    
    // 昼の時間帯（明け六つから暮れ六つまで）
    // Daytime period (from ake-mutsu to kure-mutsu)
    const dayStart = akeMutsu.getTime();
    const dayEnd = kureMutsu.getTime();
    
    // 現在時刻が昼か夜か
    // Determine if current time is day or night
    const nowTime = currentTime.getTime();
    let normalizedNow = nowTime;
    if (normalizedNow < dayStart) {
      normalizedNow += 24 * 60 * 60 * 1000;
    }
    
    /** 現在が昼かどうか / Whether current time is day */
    const isDay = normalizedNow >= dayStart && normalizedNow < dayEnd;
    
    // 昼の6刻の角度を計算
    // Calculate angles for 6 day koku
    const daySegments = [];
    for (let i = 0; i < 6; i++) {
      const progress = i / 6;
      const nextProgress = (i + 1) / 6;
      
      // 明け六つから暮れ六つまでの角度を6等分
      // Divide the angle from ake-mutsu to kure-mutsu into 6 equal parts
      let startAngle: number;
      let endAngle: number;
      
      if (akeMutsuAngle < kureMutsuAngle) {
        // 通常の場合（日の出が日の入りより前）
        // Normal case (sunrise before sunset)
        const angleRange = kureMutsuAngle - akeMutsuAngle;
        startAngle = akeMutsuAngle + angleRange * progress;
        endAngle = akeMutsuAngle + angleRange * nextProgress;
      } else {
        // 日の出が日の入りより後の場合（極地など）
        // Case where sunrise is after sunset (polar regions, etc.)
        const angleRange = (Math.PI * 2 + kureMutsuAngle) - akeMutsuAngle;
        startAngle = akeMutsuAngle + angleRange * progress;
        endAngle = akeMutsuAngle + angleRange * nextProgress;
        if (endAngle > Math.PI * 2) endAngle -= Math.PI * 2;
        if (startAngle > Math.PI * 2) startAngle -= Math.PI * 2;
      }
      
      /** 現在の刻かどうか / Whether this is the current koku */
      const isCurrent = isDay && temporalTime.period === 'day' && temporalTime.koku === (i + 1);
      
      daySegments.push({
        startAngle,
        endAngle,
        isCurrent,
        koku: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
      });
    }
    
    // 夜の6刻の角度を計算
    // Calculate angles for 6 night koku
    const nightSegments = [];
    
    // 角度を0-2πの範囲に正規化
    // Normalize angle to 0-2π range
    const normalizeAngle = (angle: number): number => {
      let normalized = angle % (Math.PI * 2);
      if (normalized < 0) normalized += Math.PI * 2;
      return normalized;
    };
    
    /** 正規化された明け六つの角度 / Normalized ake-mutsu angle */
    const akeMutsuNorm = normalizeAngle(akeMutsuAngle);
    /** 正規化された暮れ六つの角度 / Normalized kure-mutsu angle */
    const kureMutsuNorm = normalizeAngle(kureMutsuAngle);
    
    // 暮れ六つから翌日の明け六つまでの角度範囲を計算
    // Calculate angle range from kure-mutsu to next day's ake-mutsu
    // Always assumes crossing 360 degrees, so adds 2π
    const nightAngleRange = (Math.PI * 2 + akeMutsuNorm) - kureMutsuNorm;
    
    for (let i = 0; i < 6; i++) {
      const progress = i / 6;
      const nextProgress = (i + 1) / 6;
      
      // 生の角度（正規化前）を計算
      const startRaw = kureMutsuNorm + nightAngleRange * progress;
      const endRaw = kureMutsuNorm + nightAngleRange * nextProgress;
      
      // 表示用に正規化
      const startAngle = normalizeAngle(startRaw);
      const endAngle = normalizeAngle(endRaw);
      
      // テキスト・分割線用の中央角
      // Central angle for text and dividing lines
      const midAngle = normalizeAngle((startRaw + endRaw) / 2);
      
      /** 現在の刻かどうか / Whether this is the current koku */
      const isCurrent = !isDay && temporalTime.period === 'night' && temporalTime.koku === (i + 1);
      
      nightSegments.push({
        startAngle,
        endAngle,
        midAngle,
        isCurrent,
        koku: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
      });
    }
    
    // 現在時刻の角度
    // Current time angle
    const currentAngle = timeToAngle(currentTime, noon);
    
    return {
      radius,
      centerX,
      centerY,
      daySegments,
      nightSegments,
      currentAngle,
      akeMutsuAngle,
      kureMutsuAngle,
      isDay,
    };
  }, [temporalTime, akeMutsu, kureMutsu, currentTime, sunrise, sunset]);
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>一刻（不定時法）</h2>
      <div className={styles.circleWrapper}>
        <svg width="400" height="400" viewBox="0 0 400 400" className={styles.svg}>
          {/* 背景円 */}
          <circle
            cx={circleData.centerX}
            cy={circleData.centerY}
            r={circleData.radius}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="2"
          />
          
          {/* 昼の6刻のセグメント */}
          {circleData.daySegments.map((seg, i) => {
            const startAngle = seg.startAngle;
            const endAngle = seg.endAngle;
            
            const x1 = circleData.centerX + circleData.radius * Math.cos(startAngle);
            const y1 = circleData.centerY + circleData.radius * Math.sin(startAngle);
            const x2 = circleData.centerX + circleData.radius * Math.cos(endAngle);
            const y2 = circleData.centerY + circleData.radius * Math.sin(endAngle);
            
            const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;
            
            return (
              <g key={`day-${i}`}>
                {/* セグメントの背景 */}
                <path
                  d={`M ${circleData.centerX} ${circleData.centerY} L ${x1} ${y1} A ${circleData.radius} ${circleData.radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={seg.isCurrent ? '#ffeb3b' : '#fff3e0'}
                  stroke="#ff9800"
                  strokeWidth="1"
                  opacity={seg.isCurrent ? 0.8 : 0.4}
                />
                {/* 分割線（最初以外） */}
                {i > 0 && (
                  <line
                    x1={circleData.centerX + circleData.radius * Math.cos(startAngle)}
                    y1={circleData.centerY + circleData.radius * Math.sin(startAngle)}
                    x2={circleData.centerX + (circleData.radius * 0.3) * Math.cos(startAngle)}
                    y2={circleData.centerY + (circleData.radius * 0.3) * Math.sin(startAngle)}
                    stroke="#ff9800"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                )}
                {/* 刻の番号（漢数字） */}
                <text
                  x={circleData.centerX + (circleData.radius * 0.6) * Math.cos((startAngle + endAngle) / 2)}
                  y={circleData.centerY + (circleData.radius * 0.6) * Math.sin((startAngle + endAngle) / 2)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="18"
                  fontWeight="bold"
                  fill={seg.isCurrent ? '#333' : '#666'}
                >
                  {kokuToKanji(seg.koku)}
                </text>
              </g>
            );
          })}
          
          {/* 夜の6刻のセグメント */}
          {circleData.nightSegments.map((seg, i) => {
            const startAngle = seg.startAngle;
            const endAngle = seg.endAngle;
            
            const x1 = circleData.centerX + circleData.radius * Math.cos(startAngle);
            const y1 = circleData.centerY + circleData.radius * Math.sin(startAngle);
            
            // 角度差を計算（360度をまたぐ場合を考慮）
            let angleDiff = endAngle - startAngle;
            if (angleDiff < 0) angleDiff += Math.PI * 2;
            if (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2;
            
            // 360度をまたぐ場合はlargeArcを1にする
            const largeArc = angleDiff > Math.PI ? 1 : 0;
            
            // 終点の座標を計算（360度をまたぐ場合を考慮）
            const x2 = circleData.centerX + circleData.radius * Math.cos(endAngle);
            const y2 = circleData.centerY + circleData.radius * Math.sin(endAngle);
            
            return (
              <g key={`night-${i}`}>
                {/* セグメントの背景 */}
                <path
                  d={`M ${circleData.centerX} ${circleData.centerY} L ${x1} ${y1} A ${circleData.radius} ${circleData.radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={seg.isCurrent ? '#e3f2fd' : '#f5f5f5'}
                  stroke="#2196f3"
                  strokeWidth="1"
                  opacity={seg.isCurrent ? 0.6 : 0.2}
                />
                {/* 分割線（各刻の境界） */}
                <line
                  x1={circleData.centerX + circleData.radius * Math.cos(startAngle)}
                  y1={circleData.centerY + circleData.radius * Math.sin(startAngle)}
                  x2={circleData.centerX + (circleData.radius * 0.3) * Math.cos(startAngle)}
                  y2={circleData.centerY + (circleData.radius * 0.3) * Math.sin(startAngle)}
                  stroke="#2196f3"
                  strokeWidth="1"
                  opacity="0.5"
                />
                {/* 刻の番号（漢数字） */}
                <text
                  x={circleData.centerX + (circleData.radius * 0.6) * Math.cos(seg.midAngle)}
                  y={circleData.centerY + (circleData.radius * 0.6) * Math.sin(seg.midAngle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="18"
                  fontWeight="bold"
                  fill={seg.isCurrent ? '#333' : '#999'}
                >
                  {kokuToKanji(seg.koku)}
                </text>
              </g>
            );
          })}
          
          {/* 十二支を表示 - 各刻セグメントの中央に配置 */}
          {circleData.daySegments.map((seg, i) => {
            // 刻セグメントの中央角を計算
            // Calculate central angle of koku segment
            let midAngle: number;
            
            // 角度差を計算（360度をまたぐ場合を考慮）
            // Calculate angle difference (considering 360-degree wrap)
            let angleDiff = seg.endAngle - seg.startAngle;
            if (angleDiff < 0) angleDiff += Math.PI * 2;
            if (angleDiff > Math.PI * 2) angleDiff -= Math.PI * 2;
            
            // 中央角を計算
            // Calculate central angle
            midAngle = seg.startAngle + angleDiff / 2;
            
            // 0-2πの範囲に正規化
            // Normalize to 0-2π range
            midAngle = midAngle % (Math.PI * 2);
            if (midAngle < 0) midAngle += Math.PI * 2;
            
            // この刻に対応する十二支を取得
            // Get zodiac sign corresponding to this koku
            const juniShin = getJuniShinFromKoku('day', seg.koku);
            const isDay = isDayJuniShin(juniShin);
            
            return (
              <g key={`day-juni-${i}`}>
                <text
                  x={circleData.centerX + (circleData.radius * 0.85) * Math.cos(midAngle)}
                  y={circleData.centerY + (circleData.radius * 0.85) * Math.sin(midAngle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight={isDay ? "bold" : "normal"}
                  fill={isDay ? "#ff9800" : "#666"}
                >
                  {juniShin}
                </text>
              </g>
            );
          })}
          
          {circleData.nightSegments.map((seg, i) => {
            // 夜の刻セグメントの中央角（既に計算済み）
            const midAngle = seg.midAngle;
            
            // この刻に対応する十二支を取得
            const juniShin = getJuniShinFromKoku('night', seg.koku);
            const isDay = isDayJuniShin(juniShin);
            
            return (
              <g key={`night-juni-${i}`}>
                <text
                  x={circleData.centerX + (circleData.radius * 0.85) * Math.cos(midAngle)}
                  y={circleData.centerY + (circleData.radius * 0.85) * Math.sin(midAngle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight={isDay ? "bold" : "normal"}
                  fill={isDay ? "#ff9800" : "#666"}
                >
                  {juniShin}
                </text>
              </g>
            );
          })}
          
          {/* 現在時刻の線 */}
          <line
            x1={circleData.centerX}
            y1={circleData.centerY}
            x2={circleData.centerX + circleData.radius * Math.cos(circleData.currentAngle)}
            y2={circleData.centerY + circleData.radius * Math.sin(circleData.currentAngle)}
            stroke="#f44336"
            strokeWidth="3"
            strokeLinecap="round"
          />
          
          {/* 中心点 */}
          <circle
            cx={circleData.centerX}
            cy={circleData.centerY}
            r="5"
            fill="#f44336"
          />
          
          {/* 正午（0度地点、上） */}
          <text
            x={circleData.centerX}
            y={circleData.centerY - circleData.radius - 30}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#333"
          >
            正午
          </text>
          
          {/* 正子（180度地点、下） */}
          <text
            x={circleData.centerX}
            y={circleData.centerY + circleData.radius + 30}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="14"
            fontWeight="bold"
            fill="#333"
          >
            正子
          </text>
          
          {/* 明け六つのマーカー */}
          <g>
            <line
              x1={circleData.centerX + (circleData.radius + 10) * Math.cos(circleData.akeMutsuAngle)}
              y1={circleData.centerY + (circleData.radius + 10) * Math.sin(circleData.akeMutsuAngle)}
              x2={circleData.centerX + (circleData.radius + 20) * Math.cos(circleData.akeMutsuAngle)}
              y2={circleData.centerY + (circleData.radius + 20) * Math.sin(circleData.akeMutsuAngle)}
              stroke="#2196f3"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* テキストを角度に応じて配置（切れないように） */}
            <text
              x={circleData.centerX + (circleData.radius + 50) * Math.cos(circleData.akeMutsuAngle)}
              y={circleData.centerY + (circleData.radius + 50) * Math.sin(circleData.akeMutsuAngle)}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize="12"
              fill="#2196f3"
              fontWeight="500"
            >
              明け六つ
            </text>
            {/* 明け六つの時刻（ラベルの下に配置） */}
            <text
              x={circleData.centerX + (circleData.radius + 50) * Math.cos(circleData.akeMutsuAngle)}
              y={circleData.centerY + (circleData.radius + 50) * Math.sin(circleData.akeMutsuAngle) + 16}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize="11"
              fill="#2196f3"
            >
              {formatTimeApprox(akeMutsu)}
            </text>
          </g>
          
          {/* 暮れ六つのマーカー */}
          <g>
            <line
              x1={circleData.centerX + (circleData.radius + 10) * Math.cos(circleData.kureMutsuAngle)}
              y1={circleData.centerY + (circleData.radius + 10) * Math.sin(circleData.kureMutsuAngle)}
              x2={circleData.centerX + (circleData.radius + 20) * Math.cos(circleData.kureMutsuAngle)}
              y2={circleData.centerY + (circleData.radius + 20) * Math.sin(circleData.kureMutsuAngle)}
              stroke="#ff9800"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* テキストを角度に応じて配置（切れないように） */}
            <text
              x={circleData.centerX + (circleData.radius + 50) * Math.cos(circleData.kureMutsuAngle)}
              y={circleData.centerY + (circleData.radius + 50) * Math.sin(circleData.kureMutsuAngle)}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize="12"
              fill="#ff9800"
              fontWeight="500"
            >
              暮れ六つ
            </text>
            {/* 暮れ六つの時刻（ラベルの下に配置） */}
            <text
              x={circleData.centerX + (circleData.radius + 50) * Math.cos(circleData.kureMutsuAngle)}
              y={circleData.centerY + (circleData.radius + 50) * Math.sin(circleData.kureMutsuAngle) + 16}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize="11"
              fill="#ff9800"
            >
              {formatTimeApprox(kureMutsu)}
            </text>
          </g>
        </svg>
      </div>
      {/* <div className={styles.info}>
        <p className={styles.currentPeriod}>
          現在: <span className={styles.periodText}>{circleData.isDay ? '昼' : '夜'}</span> {kokuToKanji(temporalTime.koku)}刻（{getJuniShinFromKoku(temporalTime.period, temporalTime.koku)}の刻）
        </p>
        <p className={styles.timeRange}>
          {formatTimeRange(temporalTime.start, temporalTime.end)}
        </p>
      </div> */}
    </div>
  );
}
