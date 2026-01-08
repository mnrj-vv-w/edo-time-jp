/**
 * レイアウトコンポーネント
 * Layout Component
 * 
 * アプリケーション全体のレイアウトを提供するコンポーネント。
 * ヘッダー（タイトル・サブタイトル）、メインコンテンツエリア、フッター（注意書き）を縦に並べたシンプルな構造。
 * 学術的で落ち着いたデザインを採用。
 * 
 * Provides the overall layout for the application.
 * A simple vertical structure with header (title/subtitle), main content area, and footer (disclaimers).
 * Uses an academic and calm design.
 */

import styles from './AppLayout.module.css';

/**
 * AppLayoutコンポーネントのプロパティ
 * Props for AppLayout component
 */
interface AppLayoutProps {
  /** 子コンポーネント / Child components */
  children: React.ReactNode;
}

/**
 * アプリケーション全体のレイアウトコンポーネント
 * Overall application layout component
 * 
 * @param props - コンポーネントのプロパティ / Component props
 * @returns レイアウト要素 / Layout element
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>江戸ごよみ</h1>
        <p className={styles.subtitle}>
        現代と江戸の暦を重ねて
        </p>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          本アプリの旧暦・六曜データはkoyomi8.com（新暦と旧暦変換）のデータを参照しています。
        </p>
        <p className={styles.footerText}>
          六曜は自然暦ではなく民間暦注です。
        </p>
      </footer>
    </div>
  );
}

