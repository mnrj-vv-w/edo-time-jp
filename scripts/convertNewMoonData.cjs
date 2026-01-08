const fs = require('fs');
const path = require('path');

const newMoonDates = [];

// 2000年から50年分（または配置した年数分）のCSVファイルを処理
for (let year = 2000; year < 2050; year++) {
  const csvPath = path.join(__dirname, `../src/core/data/moonface${year}.csv`);
  
  if (!fs.existsSync(csvPath)) {
    console.log(`Skipping ${year}: file not found`);
    continue;
  }
  
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const lines = csv.trim().split('\n');
  
  // ヘッダー行をスキップ（1行目）
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length < 4) continue;
    
    const [date, hour, minute, phase] = parts;
    
    // 新月のみを抽出（4列目に「新月」が含まれる場合）
    if (phase && phase.includes('新月')) {
      const [month, day] = date.split('/');
      
      // JST時刻をUTCに変換（JST = UTC+9）
      const jstDate = new Date(
        year,
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );
      
      // JSTからUTCに変換（9時間引く）
      const utcDate = new Date(jstDate.getTime() - 9 * 60 * 60 * 1000);
      
      newMoonDates.push(utcDate.toISOString());
    }
  }
}

// 日付順にソート
newMoonDates.sort();

// JSONファイルに出力
const outputPath = path.join(__dirname, '../src/core/data/newMoonDates.json');
fs.writeFileSync(outputPath, JSON.stringify(newMoonDates, null, 2), 'utf-8');
console.log(`Converted ${newMoonDates.length} new moon dates to JSON`);
if (newMoonDates.length > 0) {
  console.log(`First: ${newMoonDates[0]}`);
  console.log(`Last: ${newMoonDates[newMoonDates.length - 1]}`);
}

