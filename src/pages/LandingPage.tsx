import React, { useState } from 'react';
import { ArrowRight, Shield, Camera, Brain, Map, ChevronDown, Network, Zap, Eye, TrendingUp } from 'lucide-react';

interface Props {
  onLaunch: () => void;
  onCitizen: () => void;
  onLiveDemo?: () => void;
}

export default function LandingPage({ onLaunch, onCitizen, onLiveDemo }: Props) {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      num: '01', title: 'Capture', icon: <Camera size={24} />,
      color: 'var(--brand)', bg: 'var(--brand-dim)',
      desc: 'Vehicle cameras passively capture road events while driving — no manual action required.',
    },
    {
      num: '02', title: 'Detect', icon: <Brain size={24} />,
      color: 'var(--violet)', bg: 'var(--violet-dim)',
      desc: 'AI analyses camera feeds in real-time to identify potential traffic violations with high confidence.',
    },
    {
      num: '03', title: 'Verify', icon: <Shield size={24} />,
      color: 'var(--cyan)', bg: 'var(--cyan-dim)',
      desc: 'Evidence is checked for quality and multiple cameras can corroborate the same event for higher confidence.',
    },
    {
      num: '04', title: 'Respond', icon: <Eye size={24} />,
      color: 'var(--emerald)', bg: 'var(--emerald-dim)',
      desc: 'Authorized officers review the evidence and make final enforcement decisions. AI only assists.',
    },
  ];

  const usps = [
    {
      icon: <Network size={22} />, color: 'var(--brand)',
      title: 'Distributed Camera Network',
      desc: 'Existing vehicle cameras become additional eyes on the road, creating a city-wide safety network without additional infrastructure.',
    },
    {
      icon: <Brain size={22} />, color: 'var(--violet)',
      title: 'AI Evidence Intelligence',
      desc: 'AI detects and prioritizes potential violations, providing confidence scores and evidence quality assessments for officer review.',
    },
    {
      icon: <Camera size={22} />, color: 'var(--cyan)',
      title: 'Multi-Camera Confirmation',
      desc: 'Multiple vehicles can corroborate the same event independently, dramatically increasing evidence reliability and trust scores.',
    },
    {
      icon: <TrendingUp size={22} />, color: 'var(--emerald)',
      title: 'Urban Safety Intelligence',
      desc: 'Traffic data helps authorities identify dangerous roads, hotspots, and infrastructure improvements needed across the city.',
    },
  ];

  return (
    <div className="landing-page">
      {/* Nav */}
      <nav className="landing-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, var(--brand), var(--cyan))',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" fill="rgba(255,255,255,0.9)" />
              <circle cx="12" cy="12" r="3" fill="white" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>TrafficGuard AI</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Hyderabad Road Safety</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-sm"
            style={{
              background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6
            }}
            onClick={onLiveDemo || onLaunch}
          >
            <span className="badge-live-pulse">LIVE</span> Live Patrol Demo
          </button>
          <button className="btn btn-secondary btn-sm" onClick={onCitizen}>Citizen Portal</button>
          <button className="btn btn-primary btn-sm" onClick={onLaunch}>
            Command Center <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div>
          <div className="hero-tag">
            <Zap size={11} /> Smart City · Hyderabad Road Safety Initiative
          </div>
          <h1 className="hero-title">
            Every Vehicle Can Help Make Every Road Safer.
          </h1>
          <p className="hero-subtitle">
            TrafficGuard AI transforms existing vehicle cameras into a distributed road-safety network, 
            helping authorities detect, verify and respond to potential traffic violations.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-lg"
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff', border: 'none', boxShadow: '0 4px 18px rgba(239, 68, 68, 0.45)',
                display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, cursor: 'pointer'
              }}
              onClick={onLiveDemo || onLaunch}
            >
              <span className="badge-live-pulse">LIVE</span> Live ANPR Patrol Demo
            </button>
            <button className="btn btn-primary btn-lg" onClick={onLaunch}>
              <Map size={16} /> Launch Command Center
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              See How It Works <ChevronDown size={16} />
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
            {[
              { val: '3,842', label: 'Active Cameras' },
              { val: '1,284', label: 'Incidents This Week' },
              { val: '97%', label: 'Avg AI Confidence' },
              { val: '12', label: 'Hyderabad Areas' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-bright)', fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual — dashcam scene */}
        <div className="hero-visual" style={{ position: 'relative' }}>
          <img
            src="/assets/evidence/overspeeding.jpg"
            alt="TrafficGuard AI - Hyderabad dashcam view"
            style={{ width: '100%', display: 'block', aspectRatio: '16/10', objectFit: 'cover' }}
          />

          {/* Overlaid HUD */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(5,8,17,0.1) 0%, rgba(5,8,17,0.8) 100%)',
          }} />

          {/* AI detection overlay demo */}
          <div style={{
            position: 'absolute', top: '28%', left: '34%',
            border: '2px solid #EF4444', borderRadius: 4, padding: '2px 0'
          }}>
            <div style={{
              position: 'absolute', top: -20, left: 0,
              background: '#EF4444', color: 'black', fontSize: '0.55rem',
              fontWeight: 700, padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap',
              fontFamily: 'monospace'
            }}>HELMET — NOT DETECTED 95%</div>
          </div>

          <div style={{
            position: 'absolute', top: '30%', left: '30%',
            border: '2px solid #60A5FA', borderRadius: 4, width: '24%', height: '42%'
          }}>
            <div style={{
              position: 'absolute', top: -20, left: 0,
              background: '#60A5FA', color: 'black', fontSize: '0.55rem',
              fontWeight: 700, padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap',
              fontFamily: 'monospace'
            }}>MOTORCYCLE 98%</div>
          </div>

          {/* Bottom bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '12px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)' }}>
              <div style={{ color: '#60A5FA', fontWeight: 700 }}>TRAFFICGUARD AI</div>
              <div>CAM-042 · MADHAPUR · 13 SEP 2026 · 10:42:03</div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)' }}>
              <div style={{ color: '#10B981', fontWeight: 600 }}>● GPS ACTIVE</div>
              <div>AI MONITORING</div>
            </div>
          </div>

          {/* Demo label */}
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(245,158,11,0.9)', color: '#000',
            fontSize: '0.55rem', fontWeight: 800, padding: '3px 8px',
            borderRadius: 4, letterSpacing: '0.8px'
          }}>DEMO DATA</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px',
              color: 'var(--brand-bright)', textTransform: 'uppercase'
            }}>How It Works</span>
          </div>
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>
            Four Steps to Safer Roads
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            From camera capture to officer action — a clear, transparent workflow
          </p>

          <div className="flow-steps">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="flow-step"
                style={{ borderColor: activeStep === i ? step.color : undefined }}
                onMouseEnter={() => setActiveStep(i)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {i < steps.length - 1 && (
                  <div className="flow-connector">
                    <ArrowRight size={16} />
                  </div>
                )}
                <div className="flow-step-num">STEP {step.num}</div>
                <div className="flow-step-icon" style={{ background: step.bg }}>
                  <span style={{ color: step.color }}>{step.icon}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="usp-section">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '2px',
            color: 'var(--brand-bright)', textTransform: 'uppercase'
          }}>Why TrafficGuard AI</span>
        </div>
        <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>
          More Than a Camera. An Intelligence Network.
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          From detecting violations to understanding dangerous roads, TrafficGuard AI gives cities more eyes on the road.
        </p>

        <div className="usp-grid">
          {usps.map(usp => (
            <div key={usp.title} className="usp-card">
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `rgba(${usp.color === 'var(--brand)' ? '59,130,246' : usp.color === 'var(--violet)' ? '139,92,246' : usp.color === 'var(--cyan)' ? '6,182,212' : '16,185,129'},0.15)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14, border: `1px solid currentColor`
              }}>
                <span style={{ color: usp.color }}>{usp.icon}</span>
              </div>
              <h3 style={{ marginBottom: 8, fontSize: '1rem' }}>{usp.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{usp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '80px', textAlign: 'center',
        background: 'var(--bg-panel)', borderTop: '1px solid var(--border)'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 12 }}>
          TrafficGuard AI
        </h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
          Every Vehicle Can Help Make Every Road Safer.
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 32, maxWidth: 600, margin: '0 auto 32px' }}>
          From detecting violations to understanding dangerous roads, TrafficGuard AI gives cities more eyes on the road.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onLaunch}>
            <Shield size={16} /> Launch Police Command Center
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onCitizen}>
            <Camera size={16} /> Citizen Portal
          </button>
        </div>

        <div style={{ marginTop: 40, fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Smart City / Urban Development Hackathon Demo · All data shown is simulated for demonstration purposes
        </div>
      </section>
    </div>
  );
}
