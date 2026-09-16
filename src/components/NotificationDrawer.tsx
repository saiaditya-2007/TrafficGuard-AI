import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Flame, Radio } from 'lucide-react';
import { NOTIFICATIONS } from '../data/mockData';

interface Props {
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  critical: <AlertTriangle size={14} color="var(--crimson)" />,
  evidence: <CheckCircle  size={14} color="var(--emerald)" />,
  hotspot:  <Flame        size={14} color="var(--orange)" />,
  system:   <Radio        size={14} color="var(--brand-bright)" />,
  verified: <CheckCircle  size={14} color="var(--cyan)" />,
};

const colorMap: Record<string, string> = {
  critical: 'var(--crimson-dim)',
  evidence: 'var(--emerald-dim)',
  hotspot:  'var(--orange-dim)',
  system:   'var(--brand-dim)',
  verified: 'var(--cyan-dim)',
};

export default function NotificationDrawer({ onClose }: Props) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 499 }}
      />
      <div className="notif-drawer">
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={14} color="var(--brand-bright)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Notifications</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.1rem' }}
          >×</button>
        </div>

        {/* Items */}
        {NOTIFICATIONS.map(n => (
          <div key={n.id} className={`notif-item ${n.read ? '' : 'unread'}`}>
            <div className="notif-icon" style={{ background: colorMap[n.type] }}>
              {iconMap[n.type]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {n.title}
                {!n.read && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0 }} />
                )}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>{n.message}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
            </div>
          </div>
        ))}

        <div style={{ padding: '10px 16px', textAlign: 'center' }}>
          <button style={{
            background: 'none', border: 'none', color: 'var(--brand-bright)',
            fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600
          }}>
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
