import React, { useState } from 'react';
import { Camera, Wifi, MapPin, Activity, CheckCircle, Eye, ArrowLeft } from 'lucide-react';
import { INCIDENTS } from '../data/mockData';

interface Props {
  onBack: () => void;
}

const CITIZEN_INCIDENTS = INCIDENTS.slice(0, 5).map((inc, i) => ({
  id: inc.id,
  type: inc.type,
  location: inc.area,
  status: inc.status,
  date: `13 Sep 2026`,
  evidenceStatus: i < 2 ? 'Submitted' : i < 4 ? 'Under Review' : 'Verified',
}));

export default function CitizenPage({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<'home' | 'contributions' | 'camera' | 'privacy'>('home');
  const [cameraMode, setCameraMode] = useState<'off' | 'preview'>('off');

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      'Pending Review': 'var(--amber)', 'Verified': 'var(--emerald)',
      'Rejected': 'var(--crimson)', 'Under Investigation': 'var(--violet)', 'Resolved': 'var(--cyan)',
    };
    return map[s] || 'var(--text-muted)';
  };

  return (
    <div className="citizen-shell">
      {/* Citizen Header */}
      <div className="citizen-header">
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center' }}>
          <div style={{ width: 24, height: 24, background: 'linear-gradient(135deg, var(--brand), var(--cyan))', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="white" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>TrafficGuard Citizen</span>
        </div>
        <span style={{ fontSize: '0.6rem', color: 'var(--amber)', fontWeight: 700, background: 'var(--amber-dim)', padding: '2px 8px', borderRadius: 4 }}>DEMO</span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)'
      }}>
        {(['home', 'contributions', 'camera', 'privacy'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '12px', border: 'none', background: 'none',
              cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, textTransform: 'capitalize',
              color: activeTab === tab ? 'var(--brand-bright)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--brand)' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {tab === 'contributions' ? 'My Contributions' : tab}
          </button>
        ))}
      </div>

      <div className="citizen-content">
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            {/* Status Card */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', margin: '0 auto 12px',
                  background: 'var(--emerald-dim)', border: '2px solid var(--emerald)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'pulse-green 2s ease infinite'
                }}>
                  <Activity size={28} color="var(--emerald)" />
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--emerald)', marginBottom: 4 }}>AI Monitoring Active</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TrafficGuard AI runs passively in the background while driving</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: <Camera size={16} />, label: 'Camera', value: 'CONNECTED', color: 'var(--emerald)' },
                  { icon: <MapPin size={16} />, label: 'GPS', value: 'ACTIVE', color: 'var(--emerald)' },
                  { icon: <Activity size={16} />, label: 'AI Monitoring', value: 'ACTIVE', color: 'var(--emerald)' },
                  { icon: <Wifi size={16} />, label: 'Network', value: 'CONNECTED', color: 'var(--emerald)' },
                ].map(item => (
                  <div key={item.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius)', border: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)' }}>
                      {item.icon}
                      <span style={{ fontSize: '0.8rem' }}>{item.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, animation: 'pulse-green 2s ease infinite' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: item.color }}>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contribution Summary */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>Your Contribution</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                {[
                  { label: 'Incidents Captured', value: 12, color: 'var(--brand)' },
                  { label: 'Submitted',           value: 8,  color: 'var(--cyan)' },
                  { label: 'Under Review',        value: 3,  color: 'var(--amber)' },
                  { label: 'Verified',            value: 5,  color: 'var(--emerald)' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* CONTRIBUTIONS TAB */}
        {activeTab === 'contributions' && (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <span className="card-title">My Submissions</span>
              <span style={{ fontSize: '0.62rem', color: 'var(--amber)', background: 'var(--amber-dim)', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>DEMO DATA</span>
            </div>
            {CITIZEN_INCIDENTS.map(inc => (
              <div key={inc.id} style={{
                padding: '12px 16px', borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 10
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{inc.type}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {inc.id} · {inc.location} · {inc.date}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span style={{
                    fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                    background: inc.status === 'Verified' ? 'var(--emerald-dim)' : 'var(--amber-dim)',
                    color: statusColor(inc.status),
                    border: `1px solid ${statusColor(inc.status)}44`
                  }}>{inc.status}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{inc.evidenceStatus}</span>
                </div>
              </div>
            ))}
            <div style={{ padding: '10px 16px', fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Personal identifying information is redacted from submitted evidence.
            </div>
          </div>
        )}

        {/* CAMERA TAB */}
        {activeTab === 'camera' && (
          <>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <span className="card-title">Camera Preview</span>
              </div>
              <div style={{ aspectRatio: '16/9', background: '#000', position: 'relative' }}>
                {cameraMode === 'preview' ? (
                  <>
                    <img
                      src="/assets/evidence/cam1.jpg"
                      alt="Dashcam preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                    />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 12 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)' }}>
                        <div style={{ color: '#60A5FA', fontWeight: 700 }}>TRAFFICGUARD AI</div>
                        <div>PREVIEW MODE</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ padding: '3px 8px', background: 'rgba(16,185,129,0.8)', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700, color: 'white' }}>● AI ACTIVE</div>
                        <div style={{ padding: '3px 8px', background: 'rgba(6,182,212,0.8)', borderRadius: 4, fontSize: '0.6rem', fontWeight: 700, color: 'white' }}>GPS</div>
                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', padding: '3px 0' }}>DEMO PREVIEW</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Camera size={40} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Camera preview off</span>
                  </div>
                )}
              </div>
              <div style={{ padding: '12px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn btn-success btn-sm" onClick={() => setCameraMode(cameraMode === 'preview' ? 'off' : 'preview')}>
                  <Camera size={13} /> {cameraMode === 'preview' ? 'Stop Preview' : 'Camera Preview'}
                </button>
                <button className="btn btn-secondary btn-sm">Camera Settings</button>
                <button className="btn btn-secondary btn-sm">Privacy Settings</button>
              </div>
            </div>

            <div style={{
              padding: '12px 16px', background: 'var(--brand-dim)',
              borderRadius: 'var(--radius)', border: '1px solid rgba(59,130,246,0.3)'
            }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                🚗 <strong>TrafficGuard AI runs passively in the background while driving.</strong>
                Do not use this app while the vehicle is in motion. Preview is for setup and testing only.
              </p>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 10 }}>System Status</div>
              {[
                { label: 'Camera Connected', ok: true },
                { label: 'AI Detection Engine', ok: true },
                { label: 'GPS Lock', ok: true },
                { label: 'Evidence Upload', ok: true },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.label}</span>
                  <CheckCircle size={14} color={s.ok ? 'var(--emerald)' : 'var(--crimson)'} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* PRIVACY TAB */}
        {activeTab === 'privacy' && (
          <>
            <div className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', margin: '0 auto 12px',
                background: 'var(--emerald-dim)', border: '2px solid var(--emerald)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Eye size={26} color="var(--emerald)" />
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 8 }}>Your Privacy is Protected</div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                TrafficGuard AI is designed to minimize unnecessary personal information and restrict sensitive evidence to authorized personnel only.
              </p>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              {[
                { icon: <Eye size={14} />, label: 'Face Protection', sub: 'Faces blurred in submitted evidence', ok: true },
                { icon: <Camera size={14} />, label: 'Personal Data Minimization', sub: 'Only violation data is transmitted', ok: true },
                { icon: <Activity size={14} />, label: 'Secure Evidence Transfer', sub: 'End-to-end encrypted submissions', ok: true },
                { icon: <CheckCircle size={14} />, label: 'Authorized Access Only', sub: 'Only verified officers can view evidence', ok: true },
              ].map(f => (
                <div key={f.label} className="privacy-feature-card" style={{ margin: '0 0 0 0', borderRadius: 0, border: 'none', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--emerald-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)' }}>
                    {f.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{f.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{f.sub}</div>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--emerald)', background: 'var(--emerald-dim)', padding: '2px 8px', borderRadius: 10 }}>ACTIVE</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
