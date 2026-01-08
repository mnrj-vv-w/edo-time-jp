/**
 * 月齢による月の異名データ
 * Moon phase names by moon age
 * 
 * 日本の伝統的な月齢による月の呼び名とその説明を定義します。
 * 参考: 日本の伝統的な月齢の呼び名（和暦・旧暦の文化）
 * 
 * Defines traditional Japanese moon phase names by moon age and their descriptions.
 * Reference: Traditional Japanese moon age names (Japanese calendar culture)
 */

export interface MoonPhaseName {
  /** 月相名（漢字）/ Moon phase name (kanji) */
  name: string;
  /** 読み（ひらがな）/ Reading (hiragana) */
  reading: string;
  /** 説明 / Description */
  description: string;
  /** 月齢範囲（開始日）/ Moon age range (start day) */
  startAge: number;
  /** 月齢範囲（終了日）/ Moon age range (end day) */
  endAge: number;
}

/**
 * 月齢による月の異名一覧
 * List of moon phase names by moon age
 * 
 * 参考資料:
 * - 日本の伝統的な月齢の呼び名（和暦・旧暦の文化）
 * - 国立国会図書館「暦のページ」
 * - 月齢による月の異名に関する文献資料
 * 
 * References:
 * - Traditional Japanese moon age names (Japanese calendar culture)
 * - National Diet Library "Calendar Page"
 * - Literature on moon phase names by moon age
 */
export const MOON_PHASE_NAMES: MoonPhaseName[] = [
  {
    name: '新月',
    reading: 'しんげつ',
    description: '月が太陽と同じ方向にあり、地球からは見えない状態。',
    startAge: 0,
    endAge: 1.5,
  },
  {
    name: '二日月',
    reading: 'ふつかづき',
    description: '新月の翌日。非常に細い月が西の空に見え始める。',
    startAge: 1.5,
    endAge: 2.5,
  },
  {
    name: '三日月',
    reading: 'みかづき',
    description: '弓のような形の細い月。古来より美しい月として親しまれてきた。',
    startAge: 2.5,
    endAge: 4.5,
  },
  {
    name: '五日月',
    reading: 'いつかづき',
    description: '三日月より少し太くなった月。月齢5日頃の細い月。',
    startAge: 4.5,
    endAge: 6.5,
  },
  {
    name: '上弦の月',
    reading: 'じょうげんのつき',
    description: '右半分が光る半月。月齢7日頃で、夕方の空に美しく輝く。',
    startAge: 6.5,
    endAge: 8.5,
  },
  {
    name: '十日夜',
    reading: 'とおかんや',
    description: '上弦の月から満月へ向かう途中の月。月齢10日頃の月。',
    startAge: 8.5,
    endAge: 12.5,
  },
  {
    name: '十三夜',
    reading: 'じゅうさんや',
    description: '満月に近い月で、日本では「栗名月」や「豆名月」とも呼ばれる。十五夜の次に美しい月とされる。',
    startAge: 12.5,
    endAge: 13.5,
  },
  {
    name: '小望月',
    reading: 'こもちづき',
    description: '満月の前日。月齢14日頃で、満月に近い美しい月。',
    startAge: 13.5,
    endAge: 14.5,
  },
  {
    name: '満月',
    reading: 'まんげつ',
    description: '月が完全に満ちた状態。十五夜とも呼ばれ、最も美しい月とされる。',
    startAge: 14.5,
    endAge: 15.5,
  },
  {
    name: '十六夜',
    reading: 'いざよい',
    description: '満月の翌日。月の出が少し遅れ、「いざよう（ためらう）」という意味から名付けられた。',
    startAge: 15.5,
    endAge: 16.5,
  },
  {
    name: '立待月',
    reading: 'たちまちづき',
    description: '満月後、立って待つほど遅く昇る月。月の出がさらに遅れ始める。',
    startAge: 16.5,
    endAge: 17.5,
  },
  {
    name: '居待月',
    reading: 'いまちづき',
    description: '満月後、座って待つほど遅く昇る月。立待月よりさらに遅く昇る。',
    startAge: 17.5,
    endAge: 18.5,
  },
  {
    name: '臥待月',
    reading: 'ねまちづき',
    description: '満月後、寝て待つほど遅く昇る月。居待月よりさらに遅く、深夜近くに昇る。',
    startAge: 18.5,
    endAge: 19.5,
  },
  {
    name: '更待月',
    reading: 'ふけまちづき',
    description: '深夜になってようやく月が昇る。夜更けまで待たなければならない月。',
    startAge: 19.5,
    endAge: 20.5,
  },
  {
    name: '二十日余りの月',
    reading: 'はつかあまりのつき',
    description: '更待月の後、下弦の月に至るまでの期間。月齢20日を過ぎた月。',
    startAge: 20.5,
    endAge: 21.5,
  },
  {
    name: '下弦の月',
    reading: 'かげんのつき',
    description: '左半分が光る半月。月齢22日頃で、明け方の空に美しく輝く。',
    startAge: 21.5,
    endAge: 23.5,
  },
  {
    name: '二十三夜',
    reading: 'にじゅうさんや',
    description: '下弦の月から有明の月へ向かう途中の月。月齢23日頃の月。',
    startAge: 23.5,
    endAge: 25.5,
  },
  {
    name: '有明の月',
    reading: 'ありあけのつき',
    description: '明け方の空に残る月。夜明けとともに見える月として、古来より親しまれてきた。',
    startAge: 25.5,
    endAge: 27.5,
  },
  {
    name: '二十九夜',
    reading: 'にじゅうくや',
    description: '有明の月から新月へ向かう途中の月。月齢29日頃の非常に細い月。',
    startAge: 27.5,
    endAge: 28.5,
  },
  {
    name: '三十日月',
    reading: 'みそかづき',
    description: '新月に近く、ほとんど見えない月。旧暦の月末を表す。',
    startAge: 28.5,
    endAge: 29.530588,
  },
];

/**
 * 月齢から月相名を取得
 * Get moon phase name from moon age
 * 
 * @param moonAge - 月齢（日数）/ Moon age (days)
 * @returns 月相名データ / Moon phase name data
 */
export function getMoonPhaseName(moonAge: number): MoonPhaseName | null {
  // 月齢を0-29.530588の範囲に正規化
  const synodicMonth = 29.530588;
  let normalizedAge = moonAge % synodicMonth;
  if (normalizedAge < 0) {
    normalizedAge += synodicMonth;
  }
  
  // 範囲に該当する月相を探す
  for (const phase of MOON_PHASE_NAMES) {
    if (normalizedAge >= phase.startAge && normalizedAge < phase.endAge) {
      return phase;
    }
  }
  
  // 範囲外の場合は最も近い月相を返す（通常は発生しないはず）
  // 29.530588ちょうどの場合は新月に戻る
  if (normalizedAge >= 29.530588 || normalizedAge < 0) {
    return MOON_PHASE_NAMES[0]; // 新月
  }
  
  // 念のため、最も近い月相を返す
  let closestPhase = MOON_PHASE_NAMES[0];
  let minDistance = Math.abs(normalizedAge - closestPhase.startAge);
  
  for (const phase of MOON_PHASE_NAMES) {
    const distance = Math.min(
      Math.abs(normalizedAge - phase.startAge),
      Math.abs(normalizedAge - phase.endAge)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestPhase = phase;
    }
  }
  
  return closestPhase;
}

