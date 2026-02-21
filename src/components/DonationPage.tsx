/**
 * ドネーションページ
 * Donation Page
 *
 * チップ・お気持ちの受け取り方法（PayPay）とお問い合わせ先を掲載。
 */

import { Link } from 'react-router-dom';
import styles from './DonationPage.module.css';

const BUYMEACOFFEE_URL = 'https://buymeacoffee.com/mnrj.vv.w';

export function DonationPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link to="/" className={styles.backLink}>
          ← 江戸ごよみへ戻る
        </Link>
        <h1 className={styles.title}>チップを贈る</h1>
        <p className={styles.lead}>
        本サービスの継続と改善のため、無理のない範囲でご支援いただけますと嬉しいです。
        ご意見・ご感想・ご要望もお待ちしております。
        </p>

        <section className={styles.section}>
          <div className={styles.paypayRow}>
            <img
              src={`${import.meta.env.BASE_URL}images/paypay-logo.png`}
              alt="PayPay"
              className={styles.paypayLogo}
              width={48}
              height={48}
            />
            <p className={styles.paypayInfo}>
              PayPay ID: <strong>mnrj_vv_w</strong>
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <a
            href={BUYMEACOFFEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bmcButton}
          >
            <span className={styles.bmcButtonIcon} aria-hidden>☕</span>
            <span className={styles.bmcButtonText}>Buy me a coffee</span>
          </a>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>お問い合わせ</h2>
          <p className={styles.contactInfo}>
            mnrj.vv.w@gmail.com
          </p>
        </section>

        <Link to="/" className={styles.backLinkBottom}>
          ← 江戸ごよみへ戻る
        </Link>
      </div>
    </div>
  );
}
