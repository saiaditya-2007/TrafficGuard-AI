import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, CheckCircle2, AlertTriangle, KeyRound, Building2 } from 'lucide-react';

interface Props {
  onSuccess: (officer: { name: string; division: string }) => void;
  onBackToLanding: () => void;
  onGoToCitizen: () => void;
}

export default function SignInPage({ onSuccess, onBackToLanding, onGoToCitizen }: Props) {
  const [officerId, setOfficerId] = useState('HYD-POL-4029');
  const [password, setPassword] = useState('••••••••••••');
  const [division, setDivision] = useState('Madhapur Division');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!officerId.trim()) {
      setError('Please provide an Officer ID or Service Number.');
      return;
    }

    setError(null);
    setIsLoading(true);

    // Brief simulated verification transition
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: officerId.includes('4029') ? 'Officer S. Ravi' : `Officer (${officerId})`,
        division: division || 'Madhapur Division',
      });
    }, 450);
  };

  const handleQuickDemoFill = () => {
    setOfficerId('HYD-POL-4029');
    setPassword('tg-police-2026');
    setDivision('Madhapur Division');
    setError(null);
    // Instant submission for smooth pitch flow
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        name: 'Officer S. Ravi',
        division: 'Madhapur Division',
      });
    }, 350);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), rgba(5, 8, 17, 1))',
      color: 'var(--text-primary)',
      padding: '24px 16px',
    }}>
      {/* Top Bar */}
      <div style={{
        maxWidth: 1100, width: '100%', margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 24, borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg, var(--brand), var(--cyan))',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, letterSpacing: '0.4px' }}>TrafficGuard AI</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Telangana Road Safety Command Portal</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onBackToLanding}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            ← Public Portal
          </button>
          <button
            onClick={onGoToCitizen}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            Citizen Services
          </button>
        </div>
      </div>

      {/* Main Sign-In Card Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 0',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 440,
          background: 'rgba(10, 17, 32, 0.92)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: 12,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.1)',
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
        }}>
          {/* Card Header */}
          <div style={{
            padding: '24px 28px 18px',
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.08) 0%, transparent 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{
                fontSize: '0.62rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                background: 'rgba(59, 130, 246, 0.15)', color: 'var(--brand-bright)',
                border: '1px solid rgba(59, 130, 246, 0.3)', letterSpacing: '0.6px'
              }}>
                SECURE OFFICER TERMINAL
              </span>
              <span style={{ fontSize: '0.62rem', color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                ● SYSTEM ACTIVE
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 4 }}>Command Center Sign In</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Authorized Hyderabad Police personnel access for violation review, ANPR validation, and evidence processing.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
            {error && (
              <div style={{
                padding: '10px 12px',
                marginBottom: 16,
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: 6,
                color: 'var(--crimson)',
                fontSize: '0.74rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* Officer ID Field */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Officer Service Number / Badge ID
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={officerId}
                  onChange={e => setOfficerId(e.target.value)}
                  placeholder="e.g. HYD-POL-4029"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Division Selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Assigned Command Division
              </label>
              <div style={{ position: 'relative' }}>
                <Building2 size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <select
                  value={division}
                  onChange={e => setDivision(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Madhapur Division">Madhapur Division (Cyberabad)</option>
                  <option value="Outer Ring Road Unit">Outer Ring Road (ORR Gantry Unit)</option>
                  <option value="Begumpet Traffic Division">Begumpet Traffic Division</option>
                  <option value="Banjara Hills Command">Banjara Hills Command Unit</option>
                  <option value="Hyderabad Central Command">Hyderabad Central Traffic Police HQ</option>
                </select>
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Security Access PIN
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', color: 'var(--cyan)', fontSize: '0.65rem', cursor: 'pointer', padding: 0 }}
                >
                  {showPassword ? 'Hide PIN' : 'Show PIN'}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Security Access PIN"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    background: 'var(--bg-base)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    color: 'var(--text-primary)',
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                fontSize: '0.84rem',
                fontWeight: 700,
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #ffffff', borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite'
                  }} />
                  <span>Verifying Officer Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound size={15} />
                  <span>Sign In to Command Center</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {/* Quick Demo Access Divider & Button */}
            <div style={{
              marginTop: 20, paddingTop: 18,
              borderTop: '1px dashed var(--border)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 10, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                Hackathon Evaluation & Quick Access
              </div>

              <button
                type="button"
                onClick={handleQuickDemoFill}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: 6,
                  color: 'var(--emerald)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <CheckCircle2 size={14} />
                <span>1-Click Demo Sign In (Officer S. Ravi)</span>
              </button>

              <div style={{
                fontSize: '0.62rem',
                color: 'var(--text-muted)',
                marginTop: 10,
                lineHeight: 1.4,
              }}>
                <span style={{ color: 'var(--amber)', fontWeight: 600 }}>Demo Notice:</span> This is a prototype officer access demonstration for hackathon judging. In full deployment, integration connects to state police SSO.
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        paddingTop: 12,
      }}>
        TrafficGuard AI · Hyderabad Road Safety Command Center Prototype · Human-in-the-Loop Law Enforcement
      </div>
    </div>
  );
}
