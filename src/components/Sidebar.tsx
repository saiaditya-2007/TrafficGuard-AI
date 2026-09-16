import React from 'react';
import {
  LayoutDashboard, Activity, Map, FileVideo, BarChart3,
  Flame, Brain, MessageSquare, User, Lock, Settings, LogOut, Video
} from 'lucide-react';
import type { NavPage } from '../types';

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',   label: 'Overview',              icon: <LayoutDashboard size={16} />, section: 'COMMAND CENTER' },
  { id: 'live-demo',  label: 'Live Demo Mode',        icon: <Video size={16} /> },
  { id: 'incidents',  label: 'Live Incidents',        icon: <Activity size={16} />, badge: 127 },
  { id: 'map',        label: 'Map',                   icon: <Map size={16} /> },
  { id: 'evidence',   label: 'Evidence',              icon: <FileVideo size={16} /> },
  { id: 'analytics',  label: 'Analytics',             icon: <BarChart3 size={16} />, section: 'INTELLIGENCE' },
  { id: 'hotspots',   label: 'Hotspots',              icon: <Flame size={16} /> },
  { id: 'insights',   label: 'AI Insights',           icon: <Brain size={16} /> },
  { id: 'assistant',  label: 'TrafficGuard Assistant',icon: <MessageSquare size={16} /> },
  { id: 'citizen',    label: 'Citizen Portal',        icon: <User size={16} />, section: 'PORTALS' },
  { id: 'privacy',    label: 'Privacy & Security',    icon: <Lock size={16} /> },
  { id: 'settings',   label: 'Settings',              icon: <Settings size={16} /> },
];

interface Props {
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  onLanding: () => void;
}

export default function Sidebar({ activePage, onNavigate, onLanding }: Props) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={onLanding}>
        <div className="sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="rgba(255,255,255,0.9)" stroke="white" strokeWidth="1"/>
            <circle cx="12" cy="12" r="3" fill="white" />
          </svg>
        </div>
        <div className="sidebar-logo-text">
          <span>TrafficGuard AI</span>
          <span>Hyderabad Road Safety</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <React.Fragment key={item.id}>
            {item.section && (
              <div className="nav-section-label">{item.section}</div>
            )}
            <button
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none' }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === 'live-demo' && <span className="badge-live-pulse">LIVE</span>}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          </React.Fragment>
        ))}
      </nav>

      {/* Officer Profile */}
      <div className="sidebar-officer">
        <div className="officer-avatar">SR</div>
        <div className="officer-info">
          <span>Officer S. Ravi</span>
          <span>Madhapur Division</span>
        </div>
        <button
          onClick={onLanding}
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-muted)', 
            cursor: 'pointer', padding: '4px', borderRadius: '4px', 
            display: 'flex', alignItems: 'center'
          }}
          title="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  );
}
