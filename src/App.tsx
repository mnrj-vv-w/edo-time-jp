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

import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { DonationPage } from './components/DonationPage';
import { TimeDisplay } from './components/TimeDisplay';
import { SolarTermTable } from './components/SolarTermTable';
import { SolarLongitudeCircle } from './components/SolarLongitudeCircle';
import { Sekki72 } from './components/Sekki72';
import { TimeSystem } from './components/TimeSystem';
import { Rokuyo } from './components/Rokuyo';
import { LunarCalendar } from './components/LunarCalendar';
import { useEdoTime } from './hooks/useEdoTime';

/** トップページ（江戸ごよみメイン表示） */
function TopPage() {
  const data = useEdoTime();
  return (
    <AppLayout>
      <TimeDisplay data={data} />
      <SolarLongitudeCircle data={data} />
      <SolarTermTable data={data} />
      <Sekki72 data={data} />
      <TimeSystem data={data} />
      <Rokuyo data={data} />
      <LunarCalendar data={data} />
    </AppLayout>
  );
}

/** メインアプリケーションコンポーネント */
function App() {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/donation" element={<DonationPage />} />
    </Routes>
  );
}

export default App;

