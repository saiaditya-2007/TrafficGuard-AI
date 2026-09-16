import { Shield } from 'lucide-react';
import type { NavPage } from '../types';

interface Props {
  page: string;
  onNavigate: (page: NavPage) => void;
  showNotifications: boolean;
  setShowNotifications: (v: boolean) => void;
  unreadCount: number;
  clock: string;
}

export default function Header({ page, onNavigate: _onNavigate, showNotifications, setShowNotifications, unreadCount, clock }: Props) {
  const greetings: Record<string, { title: string; sub: string }> = {
    overview:   { title: 'Good evening, Officer', sub: 'Hyderabad Road Safety Command Center' },
    incidents:  { title: 'Live Incident Feed', sub: 'Real-time incoming violations across Hyderabad' },
    map:        { title: 'Live Incident Map', sub: 'Hyderabad — Geospatial incident overview' },
    evidence:   { title: 'Evidence Review', sub: 'Multi-camera incident investigation' },
    analytics:  { title: 'Analytics Dashboard', sub: 'Violation trends and resolution metrics' },
    hotspots:   { title: 'Road Safety Hotspots', sub: 'High-risk areas requiring attention' },
    insights:   { title: 'AI Urban Safety Insights', sub: 'AI-generated recommendations for review' },
    assistant:  { title: 'TrafficGuard Assistant', sub: 'Ask about Hyderabad road safety data' },
    citizen:    { title: 'Citizen Dashboard', sub: 'Your contribution to Hyderabad road safety' },
    privacy:    { title: 'Privacy & Security', sub: 'Data protection and access controls' },
    settings:   { title: 'Settings', sub: 'System configuration and preferences' },
    'live-demo': { title: 'Live Patrol Unit & ANPR Capture', sub: 'In-vehicle mobile AI enforcement & optical plate recognition' },
  };

  const g = greetings[page] || greetings['overview'];

  return (
    <header className="header">
      <div className="header-greeting">
        <h2>{g.title}</h2>
        <p>{g.sub}</p>
      </div>

      <div className="header-right">
        <div className="status-indicator">
          <span className="status-dot" />
          All Systems Operational
        </div>

        <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{clock}</div>

        <span className="demo-badge">DEMO MODE</span>

        <button
          className="icon-btn"
          onClick={() => setShowNotifications(!showNotifications)}
          title="Notifications"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>

        <button className="icon-btn" title="Officer profile">
          <Shield size={15} />
        </button>
      </div>
    </header>
  );
}
