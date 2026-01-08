/**
 * 和風月名（旧暦の月の別名）
 * Traditional Japanese Month Names (alternative names for lunar calendar months)
 * 
 * 参考資料：国立国会図書館「暦のページ」
 * https://www.ndl.go.jp/koyomi/chapter3/s8.html
 */

/**
 * 旧暦の月（1-12）から和風月名へのマッピング（由来・解説付き）
 * Mapping from lunar calendar month (1-12) to traditional Japanese month names (with origins and explanations)
 * 
 * 各月名の由来は国立国会図書館の資料を参照しています。
 */
export const WAFU_MONTH_NAMES: Record<number, { name: string; kana: string; origin: string }> = {
  1: { 
    name: '睦月', 
    kana: 'むつき',
    origin: '正月に親族が集まり、仲睦まじく過ごすことから「睦び月（むつびつき）」が転じたとされます。（参考：国立国会図書館「暦のページ」）'
  },
  2: { 
    name: '如月', 
    kana: 'きさらぎ',
    origin: '寒さが残り、衣をさらに重ね着する「衣更着（きさらぎ）」が語源とされています。（参考：国立国会図書館「暦のページ」）'
  },
  3: { 
    name: '弥生', 
    kana: 'やよい',
    origin: '草木がいよいよ生い茂る「木草弥生い茂る（きくさいやおいしげる）」から名付けられました。（参考：国立国会図書館「暦のページ」）'
  },
  4: { 
    name: '卯月', 
    kana: 'うづき',
    origin: '卯の花（ウツギ）が咲く月であることに由来します。（参考：国立国会図書館「暦のページ」）'
  },
  5: { 
    name: '皐月', 
    kana: 'さつき',
    origin: '早苗を植える月であることから「早苗月（さなえづき）」が略されたとされます。（参考：国立国会図書館「暦のページ」）'
  },
  6: { 
    name: '水無月', 
    kana: 'みなづき',
    origin: '田に水を引く「水張月（みずはりづき）」が転じたとも、水が枯れる月とも言われます。（参考：国立国会図書館「暦のページ」）'
  },
  7: { 
    name: '文月', 
    kana: 'ふみづき',
    origin: '七夕に詩歌を献じる風習から「文披月（ふみひらきづき）」が転じたとされます。（参考：国立国会図書館「暦のページ」）'
  },
  8: { 
    name: '葉月', 
    kana: 'はづき',
    origin: '葉が落ちる月であることから「葉落月（はおちづき）」が転じたとされます。（参考：国立国会図書館「暦のページ」）'
  },
  9: { 
    name: '長月', 
    kana: 'ながつき',
    origin: '夜が長くなる「夜長月（よながづき）」が略されたとされます。（参考：国立国会図書館「暦のページ」）'
  },
  10: { 
    name: '神無月', 
    kana: 'かんなづき',
    origin: '全国の神々が出雲に集まり、各地に神が不在となる月とされます。（参考：国立国会図書館「暦のページ」）'
  },
  11: { 
    name: '霜月', 
    kana: 'しもつき',
    origin: '霜が降りる月であることに由来します。（参考：国立国会図書館「暦のページ」）'
  },
  12: { 
    name: '師走', 
    kana: 'しわす',
    origin: '師（僧侶）が年末の法要で忙しく走り回る月とされます。（参考：国立国会図書館「暦のページ」）'
  },
};

/**
 * 旧暦の月から和風月名を取得
 * Get traditional Japanese month name from lunar calendar month
 * 
 * @param month - 旧暦の月（1-12）/ Lunar calendar month (1-12)
 * @returns 和風月名（漢字・かな・由来）/ Traditional Japanese month name (kanji, kana, and origin)
 */
export function getWafuMonthName(month: number): { name: string; kana: string; origin: string } | null {
  return WAFU_MONTH_NAMES[month] || null;
}

