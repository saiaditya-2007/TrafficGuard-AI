import React from 'react';
import { Sliders, Bell, Database, Globe, Shield, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    {
      title: 'Display & Interface',
      icon: <Sliders size={16} />,
      items: [
        { label: 'Color Theme', value: 'Dark (Command Center)', type: 'select' },
        { label: 'Map Style', value: 'Dark (CartoDB)', type: 'select' },
        { label: 'Default Zoom Level', value: '12', type: 'input' },
        { label: 'Auto-Refresh Feed', value: 'Every 30 seconds', type: 'select' },
      ],
    },
    {
      title: 'Notifications',
      icon: <Bell size={16} />,
      items: [
        { label: 'Critical Incident Alerts', value: 'Enabled', type: 'toggle', active: true },
        { label: 'Evidence Confirmation', value: 'Enabled', type: 'toggle', active: true },
        { label: 'Hotspot Alerts', value: 'Enabled', type: 'toggle', active: true },
        { label: 'System Status Updates', value: 'Enabled', type: 'toggle', active: true },
      ],
    },
    {
      title: 'Data & Privacy',
      icon: <Database size={16} />,
      items: [
        { label: 'Evidence Retention', value: '30 days (verified)', type: 'select' },
        { label: 'Audit Log Access', value: 'Restricted to Admin', type: 'select' },
        { label: 'Data Export', value: 'Authorized requests only', type: 'info' },
      ],
    },
    {
      title: 'System',
      icon: <Globe size={16} />,
      items: [
        { label: 'Jurisdiction', value: 'Hyderabad City Police', type: 'info' },
        { label: 'Officer Division', value: 'Madhapur', type: 'info' },
        { label: 'System Version', value: 'TrafficGuard AI v0.1.0 (Demo)', type: 'info' },
        { label: 'API Status', value: 'Demo Mode — Simulated Data', type: 'info' },
      ],
    },
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>System configuration and preferences · <span style={{ color: 'var(--amber)', fontWeight: 600 }}>DEMO MODE — Changes are not persisted</span></p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 }}>
        {sections.map(section => (
          <div key={section.title} className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--brand)' }}>{section.icon}</span>
                <span className="card-title">{section.title}</span>
              </div>
            </div>
            {section.items.map(item => (
              <div key={item.label} style={{
                padding: '12px 16px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
              }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.type === 'toggle' ? (
                    <div
                      className={`toggle-switch ${'active' in item && item.active ? 'on' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="toggle-knob" />
                    </div>
                  ) : (
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600,
                      color: item.type === 'info' ? 'var(--text-muted)' : 'var(--brand-bright)'
                    }}>{item.value}</span>
                  )}
                  {item.type !== 'info' && item.type !== 'toggle' && (
                    <ChevronRight size={12} color="var(--text-muted)" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 20, padding: '14px 18px',
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        display: 'flex', gap: 10, alignItems: 'flex-start'
      }}>
        <Shield size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          System settings are managed by the TrafficGuard AI administrative team. Changes to enforcement parameters, data retention,
          and privacy controls require approval from authorized administrators. This is a demo prototype — all settings are illustrative only.
        </p>
      </div>
    </div>
  );
}
