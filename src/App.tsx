/**
 * メインアプリケーションコンポーネント
 * Main Application Component
 * 
 * すべての表示コンポーネントを統合し、useEdoTimeフックから取得したデータを
 * 各コンポーネントに配布する。
 * 
 * Integrates all display components and distributes data obtained from useEdoTime hook
 * to each component.
 */

import { AppLayout } from './components/AppLayout';
import { TimeDisplay } from './components/TimeDisplay';
import { SolarLongitude } from './components/SolarLongitude';
import { SolarTerm } from './components/SolarTerm';
import { SolarTermTable } from './components/SolarTermTable';
import { SolarLongitudeCircle } from './components/SolarLongitudeCircle';
import { Sekki72 } from './components/Sekki72';
import { TimeSystem } from './components/TimeSystem';
import { Rokuyo } from './components/Rokuyo';
import { LunarCalendar } from './components/LunarCalendar';
import { useEdoTime } from './hooks/useEdoTime';

/**
 * メインアプリケーションコンポーネント
 * Main application component
 * 
 * useEdoTimeフックから江戸時間データを取得し、すべての表示コンポーネントに配布する。
 * 
 * Gets Edo time data from useEdoTime hook and distributes it to all display components.
 * 
 * @returns アプリケーションのルート要素 / Application root element
 */
function App() {
  /** 江戸時間データ / Edo time data */
  const data = useEdoTime();
  
  return (
    <AppLayout>
      <TimeDisplay data={data} />
      {/* <SolarLongitude data={data} /> */}
      {/* <SolarTerm data={data} /> */}
      <SolarLongitudeCircle data={data} />
      <SolarTermTable data={data} />
      <Sekki72 data={data} />
      <TimeSystem data={data} />
      <Rokuyo data={data} />
      <LunarCalendar data={data} />
    </AppLayout>
  );
}

export default App;

