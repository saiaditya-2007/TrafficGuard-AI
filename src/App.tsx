import { useState, useEffect } from 'react';
import './styles/index.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationDrawer from './components/NotificationDrawer';

import LandingPage from './pages/LandingPage';
import CommandCenter from './pages/CommandCenter';
import IncidentsPage from './pages/IncidentsPage';
import LiveMapPage from './pages/LiveMapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HotspotsPage from './pages/HotspotsPage';
import AiInsightsPage from './pages/AiInsightsPage';
import AssistantPage from './pages/AssistantPage';
import CitizenPage from './pages/CitizenPage';
import PrivacyPage from './pages/PrivacyPage';
import SettingsPage from './pages/SettingsPage';
import LiveDemoPage from './pages/LiveDemoPage';

import type { NavPage } from './types';

type AppMode = 'landing' | 'police' | 'citizen';

function useClock() {
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

export default function App() {
  const [mode, setMode] = useState<AppMode>('landing');
  const [activePage, setActivePage] = useState<NavPage>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const clock = useClock();

  const unreadCount = 2;

  const handleNavigate = (page: string) => {
    const clean = page.replace(/^\//, '') as NavPage;
    setActivePage(clean);
    setShowNotifications(false);
  };

  const handleLaunchCommandCenter = () => {
    setMode('police');
    setActivePage('overview');
    setShowNotifications(false);
  };

  const handleGoToLanding = () => {
    setMode('landing');
    setActivePage('overview');
    setShowNotifications(false);
  };

  const handleGoToCitizen = () => {
    setMode('citizen');
    setShowNotifications(false);
  };

  // Landing mode
  if (mode === 'landing') {
    return (
      <LandingPage
        onLaunch={handleLaunchCommandCenter}
        onCitizen={handleGoToCitizen}
        onLiveDemo={() => {
          setMode('police');
          setActivePage('live-demo');
          setShowNotifications(false);
        }}
      />
    );
  }

  // Citizen mode
  if (mode === 'citizen') {
    return <CitizenPage onBack={handleGoToLanding} />;
  }

  // Police command center mode
  const renderPage = () => {
    switch (activePage) {
      case 'overview':   return <CommandCenter onNavigate={(p: string) => handleNavigate(p as NavPage)} />;
      case 'live-demo':  return <LiveDemoPage onNavigate={(p: string) => handleNavigate(p as NavPage)} />;
      case 'incidents':
      case 'evidence':   return <IncidentsPage />;
      case 'map':        return <LiveMapPage />;
      case 'analytics':  return <AnalyticsPage />;
      case 'hotspots':   return <HotspotsPage />;
      case 'insights':   return <AiInsightsPage />;
      case 'assistant':  return <AssistantPage />;
      case 'citizen':    return <CitizenPage onBack={handleGoToLanding} />;
      case 'privacy':    return <PrivacyPage />;
      case 'settings':   return <SettingsPage />;
      default:           return <CommandCenter onNavigate={(p) => handleNavigate(p as NavPage)} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        onLanding={handleGoToLanding}
      />

      <div className="main-area">
        <div style={{ position: 'relative' }}>
          <Header
            page={activePage}
            onNavigate={handleNavigate}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            unreadCount={unreadCount}
            clock={clock}
          />
          {showNotifications && (
            <NotificationDrawer onClose={() => setShowNotifications(false)} />
          )}
        </div>

        <div className="page-content" style={{ padding: 0, flex: 1, overflow: 'hidden' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
