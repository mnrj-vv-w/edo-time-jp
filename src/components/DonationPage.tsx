/**
 * ドネーションページ
 * Donation Page
 *
 * チップ・お気持ちの受け取り方法（PayPay）とお問い合わせ先を掲載。
 */

import { Link } from 'react-router-dom';
import styles from './DonationPage.module.css';

export function DonationPage() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link to="/" className={styles.backLink}>
          ← 江戸ごよみへ戻る
        </Link>
        <h1 className={styles.title}>チップを贈る</h1>
        <p className={styles.lead}>
          もし本サービスを気に入っていただけましたら、今後の維持、保守、拡張の為にお気持ちいただけると励みになります。また、ご意見ご感想ご要望などもお待ちしております
        </p>

        <section className={styles.section}>
          <p className={styles.paypayInfo}>
            PayPay ID: <strong>mnrj_vv_w</strong>
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>お問い合わせ</h2>
          <p className={styles.contactInfo}>
            mnrj.vv.w(アットマーク)gmail.com
          </p>
        </section>

        <Link to="/" className={styles.backLinkBottom}>
          ← 江戸ごよみへ戻る
        </Link>
      </div>
    </div>
  );
}
