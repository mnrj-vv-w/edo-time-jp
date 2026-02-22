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
import { formatTimeApprox, formatTimeRange } from '../utils/format';
import { calculateAkeKureAngles } from '../utils/timeAngle';
import { isDayJuniShin, getJuniShinFromKoku } from '../utils/juniShin';
import { kokuToKanji } from '../utils/kanjiNumbers';
import type { EdoTimeData } from '../core/types';
import { log } from '../utils/debugLog';
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
  const { temporalTime, akeMutsu, kureMutsu, currentTime, sunrise, sunset, noonForCircle, solarNoon, location: loc } = data;

  const solarNoonText =
    loc?.tz != null
      ? solarNoon.toLocaleString('ja-JP', { timeZone: loc.tz, hour: '2-digit', minute: '2-digit', hour12: false })
      : `${String(solarNoon.getHours()).padStart(2, '0')}:${String(solarNoon.getMinutes()).padStart(2, '0')}`;

  // セグメントのレイアウト（昼・夜の扇形の角度）は日出・日落の「時刻」が変わるときだけ再計算する
  // 正午はコアが返す noonForCircle を使い、地点・タイムゾーンが変わっても角度が一貫するようにする
  const segmentLayout = useMemo(() => {
    const radius = 120;
    const centerX = 200;
    const centerY = 200;

    const { akeMutsuAngle, kureMutsuAngle } = calculateAkeKureAngles(akeMutsu, kureMutsu, noonForCircle);
    log('TemporalTimeCircle:segmentLayout', {
      sunrise: sunrise.getTime(),
      sunriseISO: sunrise.toISOString(),
      sunset: sunset.getTime(),
      sunsetISO: sunset.toISOString(),
      noonForCircle: noonForCircle.getTime(),
      noonForCircleISO: noonForCircle.toISOString(),
      akeMutsuAngleRad: akeMutsuAngle,
      akeMutsuAngleDeg: (akeMutsuAngle * 180) / Math.PI,
      kureMutsuAngleRad: kureMutsuAngle,
      kureMutsuAngleDeg: (kureMutsuAngle * 180) / Math.PI,
    });

    const normalizeAngle = (angle: number): number => {
      let n = angle % (Math.PI * 2);
      if (n < 0) n += Math.PI * 2;
      return n;
    };

    const daySegments: Array<{ startAngle: number; endAngle: number; koku: 1 | 2 | 3 | 4 | 5 | 6 }> = [];
    if (akeMutsuAngle < kureMutsuAngle) {
      const angleRange = kureMutsuAngle - akeMutsuAngle;
      for (let i = 0; i < 6; i++) {
        daySegments.push({
          startAngle: akeMutsuAngle + angleRange * (i / 6),
          endAngle: akeMutsuAngle + angleRange * ((i + 1) / 6),
          koku: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
        });
      }
    } else {
      let angleRange = Math.PI * 2 + kureMutsuAngle - akeMutsuAngle;
      // 極夜に近いとき昼が 2π や 0 にならないようガード
      angleRange = Math.max(0.01, Math.min(Math.PI * 2 - 0.01, angleRange));
      for (let i = 0; i < 6; i++) {
        let sa = akeMutsuAngle + angleRange * (i / 6);
        let ea = akeMutsuAngle + angleRange * ((i + 1) / 6);
        if (sa > Math.PI * 2) sa -= Math.PI * 2;
        if (ea > Math.PI * 2) ea -= Math.PI * 2;
        daySegments.push({ startAngle: sa, endAngle: ea, koku: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6 });
      }
    }

    const akeMutsuNorm = normalizeAngle(akeMutsuAngle);
    const kureMutsuNorm = normalizeAngle(kureMutsuAngle);
    // 暮れ六つ→明け六つ（時計回り）の弧の長さ。kureMutsuNorm <= akeMutsuNorm のときは 2π を足さない
    let nightAngleRange =
      kureMutsuNorm > akeMutsuNorm
        ? Math.PI * 2 + akeMutsuNorm - kureMutsuNorm
        : akeMutsuNorm - kureMutsuNorm;
    // 極地などで夜の弧が 0 にならないようガード
    nightAngleRange = Math.max(0.01, nightAngleRange);

    const nightSegments: Array<{
      startAngle: number;
      endAngle: number;
      midAngle: number;
      koku: 1 | 2 | 3 | 4 | 5 | 6;
    }> = [];
    for (let i = 0; i < 6; i++) {
      const startRaw = kureMutsuNorm + nightAngleRange * (i / 6);
      const endRaw = kureMutsuNorm + nightAngleRange * ((i + 1) / 6);
      nightSegments.push({
        startAngle: normalizeAngle(startRaw),
        endAngle: normalizeAngle(endRaw),
        midAngle: normalizeAngle((startRaw + endRaw) / 2),
        koku: (i + 1) as 1 | 2 | 3 | 4 | 5 | 6,
      });
    }

    return {
      radius,
      centerX,
      centerY,
      daySegments,
      nightSegments,
      akeMutsuAngle,
      kureMutsuAngle,
      normalizeAngle,
    };
  }, [sunrise.getTime(), sunset.getTime(), noonForCircle.getTime()]);

  /** 針の角度・現在刻のハイライトは currentTime のたびに更新 */
  const circleData = useMemo(() => {
    const { daySegments, nightSegments, normalizeAngle } = segmentLayout;
    const dayStart = akeMutsu.getTime();
    const dayEnd = kureMutsu.getTime();
    let normalizedNow = currentTime.getTime();
    if (normalizedNow < dayStart) normalizedNow += 24 * 60 * 60 * 1000;
    const isDay = normalizedNow >= dayStart && normalizedNow < dayEnd;

    const daySegmentsWithCurrent = daySegments.map((seg, i) => ({
      ...seg,
      isCurrent: isDay && temporalTime.period === 'day' && temporalTime.koku === i + 1,
    }));
    const nightSegmentsWithCurrent = nightSegments.map((seg, i) => ({
      ...seg,
      isCurrent: !isDay && temporalTime.period === 'night' && temporalTime.koku === i + 1,
    }));

    const seg =
      temporalTime.period === 'day'
        ? daySegmentsWithCurrent[temporalTime.koku - 1]
        : nightSegmentsWithCurrent[temporalTime.koku - 1];
    const segStartAngle = seg.startAngle;
    const segEndAngle = seg.endAngle;
    const segmentDuration = temporalTime.end.getTime() - temporalTime.start.getTime();
    const elapsed = currentTime.getTime() - temporalTime.start.getTime();
    const progress = Math.max(
      0,
      Math.min(1, segmentDuration > 0 ? elapsed / segmentDuration : 0)
    );
    let angleSpan = (segEndAngle - segStartAngle + Math.PI * 2) % (Math.PI * 2);
    if (angleSpan < 0) angleSpan += Math.PI * 2;
    const currentAngle = normalizeAngle(segStartAngle + progress * angleSpan);

    return {
      ...segmentLayout,
      daySegments: daySegmentsWithCurrent,
      nightSegments: nightSegmentsWithCurrent,
      currentAngle,
      isDay,
    };
  }, [segmentLayout, temporalTime, akeMutsu, kureMutsu, currentTime]);
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>一刻（不定時法）</h2>
      <div className={styles.currentKokuInfo}>
        <p className={styles.currentPeriod}>
          現在: <span className={styles.periodText}>{temporalTime.period === 'day' ? '昼' : '夜'}</span> {kokuToKanji(temporalTime.koku)}刻（{getJuniShinFromKoku(temporalTime.period, temporalTime.koku)}の刻）
        </p>
        <p className={styles.timeRange}>
          {formatTimeRange(temporalTime.start, temporalTime.end)}
        </p>
      </div>
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
                {/* 刻の番号（漢数字）- 内側に配置して十二支と重ならないように */}
                <text
                  x={circleData.centerX + (circleData.radius * 0.48) * Math.cos((startAngle + endAngle) / 2)}
                  y={circleData.centerY + (circleData.radius * 0.48) * Math.sin((startAngle + endAngle) / 2)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
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
                {/* 刻の番号（漢数字）- 内側に配置して十二支と重ならないように */}
                <text
                  x={circleData.centerX + (circleData.radius * 0.48) * Math.cos(seg.midAngle)}
                  y={circleData.centerY + (circleData.radius * 0.48) * Math.sin(seg.midAngle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="16"
                  fontWeight="bold"
                  fill={seg.isCurrent ? '#333' : '#999'}
                >
                  {kokuToKanji(seg.koku)}
                </text>
              </g>
            );
          })}
          
          {/* 十二支を表示 - 各刻セグメントの外側に配置（漢数字と離す） */}
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
                  x={circleData.centerX + (circleData.radius * 0.88) * Math.cos(midAngle)}
                  y={circleData.centerY + (circleData.radius * 0.88) * Math.sin(midAngle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
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
                  x={circleData.centerX + (circleData.radius * 0.88) * Math.cos(midAngle)}
                  y={circleData.centerY + (circleData.radius * 0.88) * Math.sin(midAngle)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
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
      <p
        className={styles.solarNoonNote}
        title="太陽は毎日ぴったり12時に真上に来るわけではありません"
      >
        今日の真太陽南中：{solarNoonText}
        <span className={styles.solarNoonSub}>（昼の中心は真太陽南中に基づきます）</span>
      </p>
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
