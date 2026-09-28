import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const [phase, setPhase] = useState<'init' | 'scanning' | 'detected' | 'ready'>('init');
  const [progress, setProgress] = useState(12);
  const [isExiting, setIsExiting] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleSkip = () => {
    timeoutsRef.current.forEach(clearTimeout);
    setIsExiting(true);
    setTimeout(() => {
      onCompleteRef.current();
    }, 220);
  };

  useEffect(() => {
    // Timeline sequence (total duration: ~3.4s)
    // 0.0s - 0.7s: Initial background, road and logo appear (init)
    const t1 = setTimeout(() => {
      setPhase('scanning');
      setProgress(48);
    }, 800);

    // 1.8s: Vehicle centered, AI bounding reticle locks on (detected)
    const t2 = setTimeout(() => {
      setPhase('detected');
      setProgress(82);
    }, 1850);

    // 2.8s: System verified and ready (ready)
    const t3 = setTimeout(() => {
      setPhase('ready');
      setProgress(100);
    }, 2800);

    // 3.15s: Trigger smooth fade/scale exit
    const tExit = setTimeout(() => {
      setIsExiting(true);
    }, 3150);

    // 3.55s: Complete and unmount cleanly into the dashboard
    const tEnd = setTimeout(() => {
      onCompleteRef.current();
    }, 3550);

    timeoutsRef.current = [t1, t2, t3, tExit, tEnd];

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const content = (
    <div
      className={`opening-overlay ${isExiting ? 'opening-exit' : ''}`}
      role="dialog"
      aria-label="TrafficGuard AI Initializing"
      aria-modal="true"
    >
      {/* Background moving cyber road/grid effect */}
      <div className="opening-bg-perspective" aria-hidden="true">
        <div className="opening-grid-floor" />
        <div className="opening-radial-glow" />
      </div>

      {/* Background ambient radar scan ring */}
      <div className="opening-radar-wrap" aria-hidden="true">
        <svg className="opening-radar-svg" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="120" stroke="rgba(6, 182, 212, 0.07)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="300" cy="300" r="210" stroke="rgba(59, 130, 246, 0.08)" strokeWidth="1" />
          <circle cx="300" cy="300" r="290" stroke="rgba(6, 182, 212, 0.05)" strokeWidth="1" strokeDasharray="6 8" />
          <line x1="300" y1="20" x2="300" y2="580" stroke="rgba(6, 182, 212, 0.04)" strokeWidth="1" />
          <line x1="20" y1="300" x2="580" y2="300" stroke="rgba(6, 182, 212, 0.04)" strokeWidth="1" />
          <g className="opening-radar-arm">
            <line x1="300" y1="300" x2="300" y2="60" stroke="url(#radarArmGrad)" strokeWidth="1.8" />
            <path d="M300 300 L240 60 A240 240 0 0 1 300 52 Z" fill="url(#radarSweepGrad)" opacity="0.4" />
          </g>
          <defs>
            <linearGradient id="radarArmGrad" x1="300" y1="300" x2="300" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="radarSweepGrad" x1="300" y1="300" x2="260" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.16)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Center Command Card */}
      <div className="opening-card">
        {/* Brand Shield Logo */}
        <div className="opening-logo-badge">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
              fill="rgba(255, 255, 255, 0.95)"
              stroke="url(#shieldBorder)"
              strokeWidth="1.2"
            />
            <circle cx="12" cy="12" r="3.2" fill="#0284C7" />
            <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
            <defs>
              <linearGradient id="shieldBorder" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Text Headers */}
        <div className="opening-title-group">
          <h1 className="opening-title">TRAFFICGUARD AI</h1>
          <div className="opening-subtitle">HYDERABAD ROAD SAFETY COMMAND CENTER</div>
        </div>

        {/* Road + Vehicle Animation Area */}
        <div className="opening-road-container">
          <div className="opening-corridor-bar">
            <span className="opening-live-dot" />
            <span className="opening-corridor-text">HYD CORRIDOR 07 · HITEC CITY TO GACHIBOWLI</span>
            <span className="opening-radar-status">
              {phase === 'init' && 'SYSTEM INITIALIZING'}
              {phase === 'scanning' && 'AI SCAN ACTIVE'}
              {(phase === 'detected' || phase === 'ready') && 'VEHICLE DETECTED'}
            </span>
          </div>

          <svg
            className="opening-road-svg"
            viewBox="0 0 400 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Asphalt Road Canvas */}
            <rect x="0" y="20" width="400" height="56" rx="4" fill="#0C1424" />
            <rect x="0" y="20" width="400" height="56" rx="4" stroke="rgba(59, 130, 246, 0.28)" strokeWidth="1" />

            {/* Glowing Road Shoulders */}
            <line x1="0" y1="22" x2="400" y2="22" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="1.5" />
            <line x1="0" y1="74" x2="400" y2="74" stroke="rgba(6, 182, 212, 0.6)" strokeWidth="1.5" />

            {/* Animated Dashed Lane Divider */}
            <line
              x1="0"
              y1="48"
              x2="400"
              y2="48"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeDasharray="16 12"
              opacity="0.75"
              className="opening-lane-scroll"
            />

            {/* Vehicle Group */}
            <g className={`opening-vehicle-motion ${phase}`}>
              {/* Headlight Volumetric Beam */}
              <polygon
                points="72,43 148,27 148,59 72,51"
                fill="url(#openingHeadlightBeam)"
                opacity="0.36"
              />

              {/* Rear Red Brake Light Trail */}
              <circle cx="8" cy="47" r="6" fill="#EF4444" opacity="0.45" />

              {/* Vehicle Underbody Shadow */}
              <ellipse cx="40" cy="54" rx="34" ry="5.5" fill="rgba(0, 0, 0, 0.75)" />

              {/* Vehicle Main Chassis (Polished Highway Interceptor) */}
              <path
                d="M10 51 L15 42 L26 38 L54 38 L65 42 L76 44 L76 52 L10 52 Z"
                fill="#182234"
                stroke="#38BDF8"
                strokeWidth="1.1"
              />

              {/* Aerodynamic Cabin Glass */}
              <path
                d="M27 38 L35 32 L51 32 L59 38 Z"
                fill="#0D1526"
                stroke="#60A5FA"
                strokeWidth="0.8"
              />
              {/* Specular Windshield Highlight */}
              <line x1="36" y1="33" x2="53" y2="37" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

              {/* Roof Lightbar (Blue & Red LEDs) */}
              <rect x="40" y="30" width="9" height="2.5" rx="1" fill="#06B6D4" />
              <rect x="40" y="30" width="4.5" height="2.5" rx="1" fill="#EF4444" />

              {/* Alloy Wheels */}
              <circle cx="24" cy="52" r="4.6" fill="#0B132B" stroke="#64748B" strokeWidth="1.2" />
              <circle cx="24" cy="52" r="2" fill="#38BDF8" />
              <circle cx="62" cy="52" r="4.6" fill="#0B132B" stroke="#64748B" strokeWidth="1.2" />
              <circle cx="62" cy="52" r="2" fill="#38BDF8" />

              {/* Headlights and Taillights */}
              <rect x="75" y="44" width="2.2" height="3.5" rx="0.6" fill="#F8FAFC" />
              <rect x="8" y="44" width="2.2" height="3.5" rx="0.6" fill="#EF4444" />

              {/* AI Detection Reticle & Scanning Box */}
              <g className={`opening-ai-reticle ${phase}`}>
                {/* 4 Corner Targeting Brackets */}
                <path d="M4 29 L4 23 L14 23" stroke="#06B6D4" strokeWidth="1.8" fill="none" />
                <path d="M80 23 L90 23 L90 29" stroke="#06B6D4" strokeWidth="1.8" fill="none" />
                <path d="M90 55 L90 61 L80 61" stroke="#06B6D4" strokeWidth="1.8" fill="none" />
                <path d="M14 61 L4 61 L4 55" stroke="#06B6D4" strokeWidth="1.8" fill="none" />

                {/* Vertical Laser Scan Line */}
                <line x1="47" y1="23" x2="47" y2="61" stroke="#22D3EE" strokeWidth="1.6" className="opening-scan-laser" />

                {/* AI Detection Telemetry Badge */}
                <g className="opening-ai-pill">
                  <rect
                    x="12"
                    y="8"
                    width="70"
                    height="12"
                    rx="3"
                    fill={phase === 'detected' || phase === 'ready' ? 'rgba(16, 185, 129, 0.92)' : 'rgba(6, 182, 212, 0.9)'}
                  />
                  <text
                    x="47"
                    y="17"
                    fill="#040D1E"
                    fontSize="6.8"
                    fontWeight="800"
                    textAnchor="middle"
                    letterSpacing="0.05em"
                  >
                    {phase === 'detected' || phase === 'ready' ? 'VEHICLE DETECTED' : 'AI SCAN ACTIVE'}
                  </text>
                </g>
              </g>

              <defs>
                <linearGradient id="openingHeadlightBeam" x1="72" y1="48" x2="148" y2="48" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                </linearGradient>
              </defs>
            </g>
          </svg>
        </div>

        {/* Loading Progress & Telemetry Status */}
        <div className="opening-progress-wrap">
          <div className="opening-progress-track">
            <div
              className="opening-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="opening-meta-bar">
            <span className="opening-status-text">
              {phase === 'init' && 'SYSTEM INITIALIZING · SENSOR NETWORK ONLINE...'}
              {phase === 'scanning' && 'AI SCAN ACTIVE · SCANNING CORRIDOR PATROL...'}
              {phase === 'detected' && 'VEHICLE DETECTED · TS09-FA-8814 · SPEED 64 KM/H'}
              {phase === 'ready' && 'HYDERABAD COMMAND CENTER READY · ENTERING'}
            </span>
            <span className="opening-pct-text">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Skip Button */}
      <button
        type="button"
        className="opening-skip-btn"
        onClick={handleSkip}
        aria-label="Skip intro animation and open dashboard"
      >
        <span>Skip</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
}
