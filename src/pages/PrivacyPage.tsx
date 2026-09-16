import React, { useState } from 'react';
import { Shield, Eye, Camera, Lock, Server, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PrivacyPage() {
  const [showBlurDemo, setShowBlurDemo] = useState(false);

  const features = [
    {
      icon: <Eye size={18} />, color: 'var(--emerald)', bg: 'var(--emerald-dim)',
      title: 'Face Protection', status: 'ACTIVE',
      desc: 'All faces in submitted camera evidence are automatically blurred before transmission and storage. AI detection works on movement and object patterns, not facial recognition.',
    },
    {
      icon: <Camera size={18} />, color: 'var(--cyan)', bg: 'var(--cyan-dim)',
      title: 'Personal Data Minimization', status: 'ACTIVE',
      desc: 'Only data relevant to the identified potential violation is extracted and transmitted. No continuous location tracking, no personal driving behavior profiling.',
    },
    {
      icon: <Lock size={18} />, color: 'var(--brand)', bg: 'var(--brand-dim)',
      title: 'Secure Evidence Chain', status: 'ACTIVE',
      desc: 'All evidence is encrypted end-to-end with tamper-evident cryptographic hashing. Evidence integrity scores are provided with each submission.',
    },
    {
      icon: <Shield size={18} />, color: 'var(--violet)', bg: 'var(--violet-dim)',
      title: 'Authorized Access Control', status: 'ACTIVE',
      desc: 'Sensitive camera evidence is accessible only to verified officers with active authorization. All access events are logged and auditable.',
    },
    {
      icon: <Server size={18} />, color: 'var(--amber)', bg: 'var(--amber-dim)',
      title: 'Data Retention Policy', status: 'ACTIVE',
      desc: 'Rejected or unverified evidence is deleted within 72 hours. Verified evidence follows official records retention under applicable Telangana state regulations.',
    },
    {
      icon: <CheckCircle size={18} />, color: 'var(--orange)', bg: 'var(--orange-dim)',
      title: 'Human-in-the-Loop Enforcement', status: 'ACTIVE',
      desc: 'AI detection alone does not trigger enforcement actions. All violations require officer review and verification before any action is taken. AI assists, humans decide.',
    },
  ];

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
      <div className="page-header">
        <div>
          <h2>Privacy & Security</h2>
          <p>Data protection controls and evidence access management</p>
        </div>
        <div style={{
          padding: '6px 14px', background: 'var(--emerald-dim)',
          border: '1px solid rgba(16,185,129,0.4)', borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <Shield size={13} color="var(--emerald)" />
          <span style={{ fontSize: '0.72rem', color: 'var(--emerald)', fontWeight: 700 }}>All Protections Active</span>
        </div>
      </div>

      {/* Hero statement */}
      <div style={{
        padding: '20px 24px', marginBottom: 20,
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.08) 100%)',
        border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-lg)',
        display: 'flex', gap: 20, alignItems: 'center'
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%', background: 'var(--emerald-dim)',
          border: '2px solid var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <Shield size={28} color="var(--emerald)" />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>Privacy-First Design</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 700 }}>
            TrafficGuard AI is designed to minimize unnecessary personal information and restrict sensitive evidence to authorized personnel.
            The system uses AI to detect violation patterns without building profiles of individual citizens, and without enabling
            mass surveillance capabilities.
          </p>
        </div>
      </div>

      {/* Feature grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 14, marginBottom: 20 }}>
        {features.map(f => (
          <div key={f.title} className="privacy-feature-card" style={{ flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{f.title}</div>
                </div>
              </div>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                background: 'var(--emerald-dim)', color: 'var(--emerald)',
                border: '1px solid rgba(16,185,129,0.3)'
              }}>
                ✓ {f.status}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Face blur demo */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h3 style={{ fontSize: '0.95rem' }}>Face Protection Demonstration</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              See how evidence is processed before submission (simulated demo)
            </p>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowBlurDemo(!showBlurDemo)}
          >
            <Eye size={13} /> {showBlurDemo ? 'Hide Demo' : 'Show Demo'}
          </button>
        </div>

        {showBlurDemo && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <div style={{
                background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 'var(--radius-sm)', padding: '6px 10px', marginBottom: 8,
                display: 'flex', gap: 6, alignItems: 'center'
              }}>
                <AlertTriangle size={12} color="var(--amber)" />
                <span style={{ fontSize: '0.65rem', color: 'var(--amber)', fontWeight: 600 }}>
                  Original — NOT transmitted
                </span>
              </div>
              <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src="/assets/evidence/cam1.jpg" alt="Original evidence" style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} />
              </div>
            </div>
            <div>
              <div style={{
                background: 'var(--emerald-dim)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 'var(--radius-sm)', padding: '6px 10px', marginBottom: 8,
                display: 'flex', gap: 6, alignItems: 'center'
              }}>
                <CheckCircle size={12} color="var(--emerald)" />
                <span style={{ fontSize: '0.65rem', color: 'var(--emerald)', fontWeight: 600 }}>
                  Processed — Faces blurred before transmission
                </span>
              </div>
              <div style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img
                  src="/assets/evidence/cam1.jpg"
                  alt="Blurred evidence"
                  style={{
                    width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover',
                    filter: 'blur(4px)'
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(16,185,129,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6
                }}>
                  <div style={{
                    background: 'rgba(16,185,129,0.9)', color: 'white', fontSize: '0.7rem',
                    fontWeight: 700, padding: '4px 12px', borderRadius: 4
                  }}>
                    ✓ Faces Protected
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 10 }}>
                    Demo: actual AI blur would preserve violation evidence
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compliance notice */}
      <div style={{
        marginTop: 16, padding: '12px 16px',
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.7
      }}>
        ⚠ This is a prototype demonstration system. Production implementation would require formal privacy impact assessment,
        compliance review under applicable data protection regulations, and authorization by relevant state and central government
        authorities before deployment.
        <span style={{ color: 'var(--amber)', fontWeight: 600 }}> All data shown is simulated for demonstration purposes only.</span>
      </div>
    </div>
  );
}
