/**
 * 汎用表示コンポーネント
 * Generic Display Component
 * 
 * ラベルと値を受け取り、統一されたスタイルで表示する汎用コンポーネント。
 * すべての表示コンポーネントがこのコンポーネントを使用して一貫性を保つ。
 * 後でUIテーマ切り替えが可能な構造になっている。
 * 
 * A generic component that displays label and value with unified styling.
 * All display components use this component to maintain consistency.
 * Structured to allow UI theme switching in the future.
 */

import styles from './DisplayItem.module.css';

/**
 * DisplayItemコンポーネントのプロパティ
 * Props for DisplayItem component
 */
interface DisplayItemProps {
  /** ラベル / Label text */
  label: string;
  /** 表示する値（文字列または数値）/ Value to display (string or number) */
  value: string | number;
  /** 単位（オプション）/ Unit (optional) */
  unit?: string;
  /** 説明文（オプション）/ Description text (optional) */
  description?: string;
}

/**
 * 汎用表示コンポーネント
 * Generic display component
 * 
 * ラベル、値、単位、説明文を統一されたスタイルで表示する。
 * 数値の場合は小数点以下2桁で表示する。
 * 
 * Displays label, value, unit, and description with unified styling.
 * Numbers are displayed with 2 decimal places.
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns 表示要素 / Display element
 */
export function DisplayItem({ label, value, unit, description }: DisplayItemProps) {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value}>
        {typeof value === 'number' ? value.toFixed(2) : value}
        {unit && <span className={styles.unit}> {unit}</span>}
      </div>
      {description && <div className={styles.description}>{description}</div>}
    </div>
  );
}

