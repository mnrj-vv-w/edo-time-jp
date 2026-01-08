/**
 * 月相可視化コンポーネント（正投影方式）
 * Moon Phase Visualization Component (Orthographic)
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './MoonPhaseVisualization.module.css';

interface MoonPhaseVisualizationProps {
  /** 月齢（日） / Moon age in days */
  moonAge: number;
  /** エラーがある場合 / Error if exists */
  error?: string;
}

/**
 * 月齢から位相角への変換関数
 * Convert moon age to phase angle
 */
function moonAgeToPhase(age: number): number {
  const synodicMonth = 29.530588;
  return (age / synodicMonth) * Math.PI * 2;
}

/**
 * 位相角から月相名を取得
 * Get phase name from phase angle
 */
function getPhaseName(phase: number): string {
  const normalized = phase % (Math.PI * 2);
  if (normalized < 0.1 || normalized > Math.PI * 2 - 0.1) return '新月';
  if (normalized < Math.PI / 2 - 0.1) return '三日月';
  if (normalized < Math.PI / 2 + 0.1) return '上弦の月';
  if (normalized < Math.PI - 0.1) return '十三夜';
  if (normalized < Math.PI + 0.1) return '満月';
  if (normalized < Math.PI * 1.5 - 0.1) return '十六夜';
  if (normalized < Math.PI * 1.5 + 0.1) return '下弦の月';
  return '有明の月';
}

/**
 * 月相可視化コンポーネント
 * Moon phase visualization component
 */
export function MoonPhaseVisualization({ moonAge, error }: MoonPhaseVisualizationProps) {
  // スライダーで操作する月齢（ローカルステート）
  const [sliderAge, setSliderAge] = useState(moonAge);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);

  // propsのmoonAgeが変更されたらスライダーの値も更新
  useEffect(() => {
    setSliderAge(moonAge);
  }, [moonAge]);

  useEffect(() => {
    if (!containerRef.current || error) return;

    const container = containerRef.current;
    const width = 300;
    const height = 300;

    // シーンの初期化
    const scene = new THREE.Scene();
    scene.background = null;
    sceneRef.current = scene;

    // 正投影カメラ
    const size = 2;
    const camera = new THREE.OrthographicCamera(
      -size, size,
      size, -size,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // レンダラーの初期化
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 月の球体
    const moonGeometry = new THREE.SphereGeometry(1, 64, 64);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // 環境光
    const ambientLight = new THREE.AmbientLight(0x222222, 0.3);
    scene.add(ambientLight);

    // 太陽光
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 初期レンダリング（初期値はmoonAgeを使用）
    // 位相角0（新月）: 太陽が月の後ろ（Z軸負の方向）= 真っ黒
    // 位相角π（満月）: 太陽が月の前（Z軸正の方向）= 完全に明るい
    // 位相角π/2（上弦）: 太陽が月の右側（X軸正の方向）= 右半分が明るい
    // 位相角3π/2（下弦）: 太陽が月の左側（X軸負の方向）= 左半分が明るい
    const initialPhase = moonAgeToPhase(moonAge);
    const sunDistance = 10;
    sunLight.position.set(
      Math.sin(initialPhase) * sunDistance,  // X軸: 位相角0で0、π/2で10
      0,
      -Math.cos(initialPhase) * sunDistance  // Z軸: 位相角0で-10、π/2で0
    );
    sunLight.target.position.set(0, 0, 0);
    sunLight.target.updateMatrixWorld();
    renderer.render(scene, camera);

    // クリーンアップ
    return () => {
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      moonGeometry.dispose();
      moonMaterial.dispose();
    };
  }, [error, moonAge]);

  // スライダーの月齢が変更されたら更新
  useEffect(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current || !sunLightRef.current || error) {
      return;
    }

    // 位相角0（新月）: 太陽が月の後ろ（Z軸負の方向）= 真っ黒
    // 位相角π（満月）: 太陽が月の前（Z軸正の方向）= 完全に明るい
    // 位相角π/2（上弦）: 太陽が月の右側（X軸正の方向）= 右半分が明るい
    // 位相角3π/2（下弦）: 太陽が月の左側（X軸負の方向）= 左半分が明るい
    const phase = moonAgeToPhase(sliderAge);
    const sunDistance = 10;
    sunLightRef.current.position.set(
      Math.sin(phase) * sunDistance,  // X軸: 位相角0で0、π/2で10
      0,
      -Math.cos(phase) * sunDistance  // Z軸: 位相角0で-10、π/2で0
    );
    sunLightRef.current.target.position.set(0, 0, 0);
    sunLightRef.current.target.updateMatrixWorld();
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [sliderAge, error]);

  if (error) {
    return null;
  }

  const phase = moonAgeToPhase(sliderAge);
  const phaseName = getPhaseName(phase);

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.canvas} />
      <div className={styles.controls}>
        <label className={styles.label}>
          月齢: <span className={styles.value}>{sliderAge.toFixed(2)}</span> 日
        </label>
        <input
          type="range"
          className={styles.slider}
          min="0"
          max="29.530588"
          step="0.01"
          value={sliderAge}
          onChange={(e) => setSliderAge(parseFloat(e.target.value))}
        />
        <div className={styles.phaseInfo}>
          <div className={styles.phaseDisplay}>
            位相角: {(phase * 180 / Math.PI).toFixed(1)}°
          </div>
          <div className={styles.phaseName}>
            月相: {phaseName}
          </div>
        </div>
      </div>
    </div>
  );
}

