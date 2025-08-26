
import React, { useState, useEffect } from 'react';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import QuranPage from './pages/QuranPage';
import AthkarPage from './pages/AthkarPage';
import MorePage from './pages/MorePage';
import MessagesPage from './pages/MessagesPage';
import AsmaulHusnaPage from './pages/AsmaulHusnaPage';
import SettingsPage from './pages/SettingsPage';
import StatisticsPage from './pages/StatisticsPage';
import FeelingPage from './pages/FeelingPage';
import TasbeehListPage from './pages/TasbeehListPage';
import QiblaPage from './pages/QiblaPage';
import PrayerTimesPage from './pages/PrayerTimesPage';
import AddHabitPage from './pages/AddHabitPage';
import ProphetsDuasPage from './pages/ProphetsDuasPage';
import AlhamdPage from './pages/AlhamdPage';
import QuranicDuasPage from './pages/QuranicDuasPage';
import IstighfarPage from './pages/IstighfarPage';
import type { Page, Overlay } from './types';
import Header from './components/Header';

// --- Main App Component ---

const ComingSoonPage: React.FC<{ featureName: string; onClose: () => void }> = ({ featureName, onClose }) => (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col animate-fade-in">
        <Header title={featureName} onBack={onClose} showSettings={false} />
        <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400 px-4">
            <h2 className="text-3xl font-bold text-green-400 mb-2">قريباً</h2>
            <p className="text-lg">ميزة "{featureName}" ستكون متاحة في التحديثات القادمة.</p>
        </div>
    </div>
);


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [overlay, setOverlay] = useState<Overlay | null>(null);

  const handleShowOverlay = (overlay: Overlay) => {
    setOverlay(overlay);
  };
  
  const handleCloseOverlay = () => {
    setOverlay(null);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage setActivePage={setActivePage} showOverlay={handleShowOverlay} />;
      case 'quran':
        return <QuranPage />;
      case 'athkar':
        return <AthkarPage />;
      case 'messages':
        return <MessagesPage />;
      case 'more':
        return <MorePage setActivePage={setActivePage} showOverlay={handleShowOverlay} />;
      default:
        return <HomePage setActivePage={setActivePage} showOverlay={handleShowOverlay} />;
    }
  };

  const renderOverlay = () => {
    if (!overlay) return null;
    switch (overlay.name) {
      case 'asmaulhusna':
        return <AsmaulHusnaPage onClose={handleCloseOverlay} />;
      case 'settings':
        return <SettingsPage onClose={handleCloseOverlay} />;
      case 'statistics':
        return <StatisticsPage onClose={handleCloseOverlay} />;
      case 'feeling':
        return <FeelingPage onClose={handleCloseOverlay} />;
      case 'tasbeehList':
          return <TasbeehListPage onClose={handleCloseOverlay} />;
      case 'qibla':
        return <QiblaPage onClose={handleCloseOverlay} />;
      case 'prayerTimes':
        return <PrayerTimesPage onClose={handleCloseOverlay} />;
      case 'addHabit':
        return <AddHabitPage onClose={handleCloseOverlay} />;
      case 'prophetsDuas':
        return <ProphetsDuasPage onClose={handleCloseOverlay} />;
      case 'quranicDuas':
        return <QuranicDuasPage onClose={handleCloseOverlay} />;
      case 'istighfar':
        return <IstighfarPage onClose={handleCloseOverlay} />;
      case 'alhamd':
        return <AlhamdPage onClose={handleCloseOverlay} />;
      case 'comingSoon':
        return <ComingSoonPage featureName={overlay.props.featureName} onClose={handleCloseOverlay} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <main className="flex-grow pb-20">
        {renderPage()}
      </main>
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
      {renderOverlay()}
    </div>
  );
};

export default App;
