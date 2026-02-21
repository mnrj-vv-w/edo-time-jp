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

import { Link } from 'react-router-dom';
import styles from './AppLayout.module.css';
import { isDebug, downloadLogs } from '../utils/debugLog';

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
        <div className={styles.footerInner}>
          {isDebug() && (
            <p className={styles.footerText} style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => downloadLogs()}
                className={styles.debugDownload}
              >
                ログをダウンロード
              </button>
            </p>
          )}
          <p className={styles.footerText}>
            ・旧暦・六曜データはkoyomi8.com（新暦と旧暦変換）のデータを参照しています。
          </p>
          <p className={styles.footerText}>
            ・本アプリでは、不定時法計算などに、ブラウザの位置情報（Geolocation）を要求します。位置情報を取得できない場合は、東京をデフォルトとして計算します。個人を特定する情報は取得・保存しておりません。
          </p>
          <p className={styles.footerText} style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to="/donation" className={styles.sponsorLink}>
              チップを贈る
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

