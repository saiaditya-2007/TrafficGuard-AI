import { useState, useEffect, useCallback } from 'react';
import './styles/index.css';

import OpeningAnimation from './components/OpeningAnimation';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationDrawer from './components/NotificationDrawer';

import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
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

type AppMode = 'landing' | 'login' | 'police' | 'citizen';

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
  const [animationFinished, setAnimationFinished] = useState(false);
  const [mode, setMode] = useState<AppMode>('landing');
  const [activePage, setActivePage] = useState<NavPage>('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [officer, setOfficer] = useState({ name: 'Officer S. Ravi', division: 'Madhapur Division' });
  const clock = useClock();

  const unreadCount = 2;

  const handleAnimationComplete = useCallback(() => {
    setAnimationFinished(true);
  }, []);

  const handleNavigate = (page: string) => {
    const clean = page.replace(/^\//, '') as NavPage;
    setActivePage(clean);
    setShowNotifications(false);
    setMobileMenuOpen(false);
  };

  const handleLaunchCommandCenter = () => {
    setMode('login');
    setShowNotifications(false);
    setMobileMenuOpen(false);
  };

  const handleDirectPoliceAccess = () => {
    setMode('police');
    setActivePage('overview');
    setShowNotifications(false);
    setMobileMenuOpen(false);
  };

  const handleGoToLanding = () => {
    setMode('landing');
    setActivePage('overview');
    setShowNotifications(false);
    setMobileMenuOpen(false);
  };

  const handleGoToCitizen = () => {
    setMode('citizen');
    setShowNotifications(false);
    setMobileMenuOpen(false);
  };

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
    <>
      {!animationFinished && (
        <OpeningAnimation onComplete={handleAnimationComplete} />
      )}

      {mode === 'landing' ? (
        <LandingPage
          onLaunch={handleLaunchCommandCenter}
          onOfficerLogin={() => setMode('login')}
          onCitizen={handleGoToCitizen}
          onLiveDemo={() => {
            setMode('police');
            setActivePage('live-demo');
            setShowNotifications(false);
          }}
        />
      ) : mode === 'login' ? (
        <SignInPage
          onSuccess={(loggedOfficer) => {
            setOfficer(loggedOfficer);
            setMode('police');
            setActivePage('overview');
            setShowNotifications(false);
          }}
          onBackToLanding={handleGoToLanding}
          onGoToCitizen={handleGoToCitizen}
        />
      ) : mode === 'citizen' ? (
        <CitizenPage onBack={handleGoToLanding} />
      ) : (
        <div className="app-shell">
          <Sidebar
            activePage={activePage}
            onNavigate={handleNavigate}
            onLanding={handleGoToLanding}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
            officer={officer}
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
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
              />
              {showNotifications && (
                <NotificationDrawer onClose={() => setShowNotifications(false)} />
              )}
            </div>

            <div className="page-content" style={{ padding: 0, flex: 1 }}>
              {renderPage()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
