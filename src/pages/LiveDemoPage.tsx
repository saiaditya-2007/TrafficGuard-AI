import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera, Play, Pause, RefreshCw, ShieldAlert,
  Car, CheckCircle2, Send, Download, Volume2, VolumeX, Eye,
  Compass, Radio, Sparkles, AlertOctagon, Video
} from 'lucide-react';
import type { LivePatrolScenario, LiveEvidencePacket } from '../types';

interface Props {
  onNavigate?: (page: string) => void;
  onRecordIncident?: (packet: LiveEvidencePacket) => void;
}

const SCENARIOS: LivePatrolScenario[] = [
  {
    id: 'scen-1',
    name: 'Overspeeding Detection',
    location: 'Outer Ring Road (ORR Gantry #12), Hyderabad',
    area: 'Outer Ring Road',
    speedLimit: 50,
    patrolSpeed: 92,
    violationType: 'Overspeeding',
    violatorVehicle: 'White Maruti Ciaz (Sedan)',
    numberPlate: 'TS 09 UB 7842',
    plateConfidence: 99.8,
    aiConfidence: 99.4,
    fineAmount: 2000,
    challanCode: 'TS-MV-2026-OS-402',
    contextImage: '/assets/evidence/overspeeding.jpg',
    vehicleImage: '/assets/evidence/overspeeding.jpg',
    vehicleCoordinates: { x: 36, y: 53, width: 27, height: 28 },
    plateCoordinates: { x: 40, y: 72, width: 7, height: 4 },
    description: 'Vehicle clocked by speed radar gantry at 92 km/h in a 50 km/h merger safety zone on Hyderabad ORR.'
  },
  {
    id: 'scen-2',
    name: 'Triple Riding (3 Riders)',
    location: 'Ameerpet Commercial Corridor, Hyderabad',
    area: 'Ameerpet',
    speedLimit: 40,
    patrolSpeed: 32,
    violationType: 'Triple Riding',
    violatorVehicle: 'Black Hero Splendor Motorcycle',
    numberPlate: 'TS 07 EA 9012',
    plateConfidence: 99.6,
    aiConfidence: 99.2,
    fineAmount: 2000,
    challanCode: 'TS-MV-2026-TR-108',
    contextImage: '/assets/evidence/triple_riding.jpg',
    vehicleImage: '/assets/evidence/triple_riding.jpg',
    vehicleCoordinates: { x: 36, y: 32, width: 23, height: 60 },
    plateCoordinates: { x: 38, y: 65, width: 7, height: 4 },
    description: 'Three young passengers detected riding on a single commuter motorcycle with all three riding without mandatory safety helmets.'
  },
  {
    id: 'scen-3',
    name: 'Wrong-Side Contraflow',
    location: 'Begumpet Expressway Flyover Ramp, Hyderabad',
    area: 'Begumpet',
    speedLimit: 60,
    patrolSpeed: 48,
    violationType: 'Wrong-Side Driving',
    violatorVehicle: 'Silver Maruti Swift Hatchback',
    numberPlate: 'TS 08 FK 3319',
    plateConfidence: 99.7,
    aiConfidence: 99.6,
    fineAmount: 2500,
    challanCode: 'TS-MV-2026-WS-801',
    contextImage: '/assets/evidence/wrong_side.jpg',
    vehicleImage: '/assets/evidence/wrong_side.jpg',
    vehicleCoordinates: { x: 44, y: 47, width: 18, height: 26 },
    plateCoordinates: { x: 50, y: 65, width: 6, height: 3 },
    description: 'Vehicle driving head-on the wrong way past One-Way No Entry overhead signs opposing legal traffic stream.'
  },
  {
    id: 'scen-4',
    name: 'Red-Light Signal Breach',
    location: 'KBR Park Junction Signal, Hyderabad',
    area: 'Banjara Hills',
    speedLimit: 40,
    patrolSpeed: 28,
    violationType: 'Red-Light Violation',
    violatorVehicle: 'Silver Sedan',
    numberPlate: 'TS 09 UB 7642',
    plateConfidence: 99.5,
    aiConfidence: 99.2,
    fineAmount: 1500,
    challanCode: 'TS-MV-2026-RL-119',
    contextImage: '/assets/evidence/red_light.jpg',
    vehicleImage: '/assets/evidence/red_light.jpg',
    vehicleCoordinates: { x: 39, y: 44, width: 24, height: 31 },
    plateCoordinates: { x: 42, y: 68, width: 7, height: 4 },
    description: 'Sedan drove across the solid white stop line and yellow junction grid while the traffic light displayed a steady red signal.'
  },
  {
    id: 'scen-5',
    name: 'Illegal Parking Zone',
    location: 'Road No. 12, Banjara Hills, Hyderabad',
    area: 'Banjara Hills',
    speedLimit: 30,
    patrolSpeed: 0,
    violationType: 'Illegal Parking',
    violatorVehicle: 'Silver Maruti Ciaz',
    numberPlate: 'TS 10 EV 5521',
    plateConfidence: 99.8,
    aiConfidence: 99.0,
    fineAmount: 1000,
    challanCode: 'TS-MV-2026-PK-331',
    contextImage: '/assets/evidence/illegal_parking.jpg',
    vehicleImage: '/assets/evidence/illegal_parking.jpg',
    vehicleCoordinates: { x: 38, y: 34, width: 46, height: 55 },
    plateCoordinates: { x: 64, y: 59, width: 12, height: 7 },
    description: 'Vehicle parked directly adjacent to No Parking Tow Away Zone sign blocking lane flow on busy shopping corridor.'
  }
];

// Audio feedback synthesizers using Web Audio API
class SoundFx {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playShutter() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      // White noise click
      const bufferSize = this.ctx.sampleRate * 0.04;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.04);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(t);

      // Mechanical beep
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, t + 0.05);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.12);
      oscGain.gain.setValueAtTime(0.15, t + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(t + 0.05);
      osc.stop(t + 0.16);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }

  playLockOn() {
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.setValueAtTime(1800, t + 0.06);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    } catch {
      // Audio context error ignored
    }
  }
}

const sfx = new SoundFx();

export default function LiveDemoPage({ onNavigate }: Props) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('scen-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [stage, setStage] = useState<'searching' | 'vehicle_detected' | 'anpr_reading' | 'violation_confirmed'>('searching');
  const [anprScanned, setAnprScanned] = useState<boolean>(false);
  const [ocrText, setOcrText] = useState<string>('TS 09 -- ----');
  const [shutterFlash, setShutterFlash] = useState<boolean>(false);
  const [evidencePacket, setEvidencePacket] = useState<LiveEvidencePacket | null>(null);
  const [autoPatrol, setAutoPatrol] = useState<boolean>(false);
  const [autoCountdown, setAutoCountdown] = useState<number>(5);
  const [dispatched, setDispatched] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'patrol' | 'webcam'>('patrol');
  const [speedVariation, setSpeedVariation] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];

  const handleSelectScenario = (id: string) => {
    setActiveScenarioId(id);
    setStage('searching');
    setAnprScanned(false);
    setOcrText('TS 09 -- ----');
    setEvidencePacket(null);
    setDispatched(false);
  };

  const handleToggleCameraMode = () => {
    const nextMode = cameraMode === 'patrol' ? 'webcam' : 'patrol';
    setCameraMode(nextMode);
    setStage('searching');
    setAnprScanned(false);
    setOcrText(nextMode === 'webcam' ? 'AWAITING TARGET' : 'TS 09 -- ----');
    setEvidencePacket(null);
    setDispatched(false);
  };

  // Dynamic speed oscillation to simulate patrol vehicle driving
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSpeedVariation(prev => {
        const delta = (Math.random() - 0.5) * 3;
        const next = prev + delta;
        return Math.max(-5, Math.min(5, next));
      });
    }, 800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Realistic Simulation Lifecycle:
  // 1. Searching (camera shows open road, awaiting vehicle detection)
  // 2. Vehicle appears in camera frame & AI acquires target
  // 3. ANPR scanner locks onto plate & deciphers registration characters
  // 4. Violation confirmed (telemetry/challan/fine calculated)
  useEffect(() => {
    if (!isPlaying || cameraMode === 'webcam') {
      return;
    }

    if (stage === 'searching') {
      const t = setTimeout(() => {
        setStage('vehicle_detected');
      }, 2200);
      return () => clearTimeout(t);
    }

    if (stage === 'vehicle_detected') {
      const t = setTimeout(() => {
        setStage('anpr_reading');
      }, 1600);
      return () => clearTimeout(t);
    }

    if (stage === 'anpr_reading') {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const target = activeScenario.numberPlate;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step < 6) {
          const scrambled = target.split('').map((c, i) => {
            if (c === ' ' || i < 2) return c;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          setOcrText(scrambled);
          setAnprScanned(false);
        } else {
          setOcrText(target);
          setAnprScanned(true);
          if (soundEnabled) sfx.playLockOn();
          clearInterval(interval);
          setStage('violation_confirmed');
        }
      }, 220);

      return () => clearInterval(interval);
    }
  }, [stage, isPlaying, cameraMode, activeScenario, soundEnabled]);

  // Webcam handling
  useEffect(() => {
    if (cameraMode === 'webcam') {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          webcamStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(() => {
          setCameraMode('patrol');
        });
    } else {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(t => t.stop());
        webcamStreamRef.current = null;
      }
    }
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [cameraMode]);

  // Action: Capture Live Evidence
  const handleCaptureEvidence = useCallback(() => {
    if (isCapturing) return;
    setIsCapturing(true);
    setShutterFlash(true);
    if (soundEnabled) sfx.playShutter();

    setTimeout(() => {
      setShutterFlash(false);
    }, 150);

    const now = new Date();

    const packet: LiveEvidencePacket = {
      id: `EV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: now.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }),
      location: activeScenario.location,
      patrolUnit: 'HYD-PATROL-UNIT-042 (Cyberabad)',
      officerId: 'AP-TS-0498 (S. Ravi)',
      violation: activeScenario.violationType,
      severity: activeScenario.violationType.includes('Wrong-Side') ? 'CRITICAL' : 'HIGH',
      targetVehicle: activeScenario.violatorVehicle,
      licensePlate: activeScenario.numberPlate,
      plateConfidence: activeScenario.plateConfidence,
      aiConfidence: activeScenario.aiConfidence,
      fineAmount: activeScenario.fineAmount,
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      wideImage: activeScenario.contextImage,
      cropImage: activeScenario.vehicleImage,
      plateImage: activeScenario.vehicleImage, // high-res plate extracted
      status: 'CAPTURED'
    };

    setEvidencePacket(packet);
    setIsCapturing(false);
    setDispatched(false);
  }, [activeScenario, isCapturing, soundEnabled]);

  // Auto patrol progression
  useEffect(() => {
    if (!autoPatrol) return;
    if (stage !== 'violation_confirmed') return;

    const interval = setInterval(() => {
      setAutoCountdown(prev => {
        if (prev <= 1) {
          handleCaptureEvidence();
          setTimeout(() => {
            const currentIdx = SCENARIOS.findIndex(s => s.id === activeScenarioId);
            const nextIdx = (currentIdx + 1) % SCENARIOS.length;
            setActiveScenarioId(SCENARIOS[nextIdx].id);
          }, 3500);
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoPatrol, stage, handleCaptureEvidence, activeScenarioId]);

  const handleDispatch = () => {
    setDispatched(true);
    if (evidencePacket) {
      setEvidencePacket({
        ...evidencePacket,
        status: 'DISPATCHED_TO_COMMAND'
      });
    }
  };

  const cruisingSpeed = Math.round(activeScenario.speedLimit * 0.8 + speedVariation);
  const violationSpeed = Math.round(activeScenario.patrolSpeed + speedVariation);
  const currentSpeed = (stage === 'violation_confirmed' && cameraMode !== 'webcam')
    ? violationSpeed
    : cruisingSpeed;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', background: 'var(--bg-base)' }}>
      {/* Shutter flash overlay */}
      {shutterFlash && (
        <div style={{
          position: 'fixed', inset: 0, background: '#ffffff',
          zIndex: 9999, pointerEvents: 'none',
          animation: 'flashFade 0.2s ease-out forwards'
        }} />
      )}

      {/* Top Banner / Mode Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 38, height: 38, borderRadius: 8,
            background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#ef4444'
          }}>
            <Radio size={20} className="pulse-slow" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.02em' }}>
                AI Patrol Unit — Live Dashcam & ANPR Evidence Capture
              </span>
              <span style={{
                background: '#ef4444', color: '#fff', fontSize: '0.65rem',
                fontWeight: 800, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.05em'
              }}>
                LIVE FEED
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Vehicle-mounted mobile sensor suite capturing real-time traffic infractions and automatic registration plate decodes.
            </p>
          </div>
        </div>

        {/* Controls & Scenario Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Audio toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="icon-btn"
            title={soundEnabled ? 'Mute camera shutter audio' : 'Enable audio feedback'}
            style={{ color: soundEnabled ? 'var(--cyan)' : 'var(--text-muted)' }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Auto Patrol Mode */}
          <button
            onClick={() => setAutoPatrol(!autoPatrol)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: autoPatrol ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface)',
              border: `1px solid ${autoPatrol ? 'var(--emerald)' : 'var(--border)'}`,
              color: autoPatrol ? 'var(--emerald)' : 'var(--text-secondary)',
              padding: '6px 12px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={14} />
            {autoPatrol ? `Auto-Patrol (${autoCountdown}s)` : 'Auto-Patrol Mode'}
          </button>

          {/* Camera feed mode */}
          <button
            onClick={handleToggleCameraMode}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: cameraMode === 'webcam' ? 'rgba(59, 130, 246, 0.2)' : 'var(--bg-surface)',
              border: `1px solid ${cameraMode === 'webcam' ? 'var(--blue)' : 'var(--border)'}`,
              color: cameraMode === 'webcam' ? 'var(--blue)' : 'var(--text-secondary)',
              padding: '6px 12px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Toggle between simulated patrol car dashcam or your physical webcam"
          >
            <Video size={14} />
            {cameraMode === 'webcam' ? 'Webcam Active' : 'Switch to WebCam'}
          </button>
        </div>
      </div>

      {/* Main Grid: Viewfinder (Left) & Evidence Docket (Right) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.45fr) minmax(360px, 0.95fr)',
        gap: 16, padding: 18, flex: 1
      }}>
        {/* LEFT COLUMN: Vehicle Dashcam Viewfinder & HUD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Scenario selector bar */}
          <div style={{
            display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
            borderBottom: '1px solid var(--border)'
          }}>
            {SCENARIOS.map(scen => (
              <button
                key={scen.id}
                onClick={() => handleSelectScenario(scen.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 6,
                  border: activeScenarioId === scen.id ? '1px solid var(--cyan)' : '1px solid var(--border)',
                  background: activeScenarioId === scen.id ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-card)',
                  color: activeScenarioId === scen.id ? 'var(--cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap'
                }}
              >
                <AlertOctagon size={14} color={activeScenarioId === scen.id ? 'var(--cyan)' : 'var(--text-muted)'} />
                <span>{scen.name}</span>
                <span style={{
                  fontSize: '0.7rem', padding: '2px 6px', borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.07)', color: 'var(--text-muted)'
                }}>
                  {scen.violationType}
                </span>
              </button>
            ))}
          </div>

          {/* VIEWPORT CONTAINER */}
          <div style={{
            position: 'relative', borderRadius: 12, overflow: 'hidden',
            border: '2px solid rgba(6, 182, 212, 0.35)', background: '#020617',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 40px rgba(6, 182, 212, 0.05)',
            aspectRatio: '16 / 9.6', minHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {/* Camera feed (Image or WebCam) */}
            {cameraMode === 'webcam' ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img
                src={stage === 'searching' ? '/assets/evidence/empty_patrol_road.jpg' : activeScenario.vehicleImage}
                alt="Front Dashcam Patrol Feed"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: isPlaying ? 'contrast(1.05) brightness(0.95)' : 'grayscale(0.4) contrast(0.9)',
                  transition: 'filter 0.3s ease, opacity 0.3s ease'
                }}
              />
            )}

            {/* Status indicator when awaiting vehicle detection */}
            {(stage === 'searching' || cameraMode === 'webcam') && (
              <div style={{
                position: 'absolute', top: 54, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(2, 6, 23, 0.88)', border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8', padding: '6px 18px', borderRadius: 20,
                fontFamily: 'var(--font-mono)', fontSize: '0.74rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(6px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.6)', pointerEvents: 'none', zIndex: 10
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', animation: 'pulse-slow 1.5s infinite' }} />
                <span>
                  {cameraMode === 'webcam'
                    ? 'WEBCAM ACTIVE — AWAITING VEHICLE DETECTION'
                    : 'PATROL RADAR: SCANNING SECTOR — AWAITING VEHICLE DETECTION'}
                </span>
              </div>
            )}

            {/* Ambient Dashcam Windshield Horizon & Grid Overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(180deg, rgba(2,6,23,0.35) 0%, rgba(2,6,23,0.05) 50%, rgba(2,6,23,0.45) 100%)'
            }} />

            {/* HUD Top-Bar: Patrol Cruiser Telemetry */}
            <div style={{
              position: 'absolute', top: 12, left: 14, right: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#38bdf8',
              textShadow: '0 1px 3px rgba(0,0,0,0.9)', pointerEvents: 'none',
              background: 'rgba(2, 6, 23, 0.75)', padding: '6px 14px', borderRadius: 6,
              border: '1px solid rgba(56, 189, 248, 0.25)', backdropFilter: 'blur(4px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  <span style={{ color: '#fff', fontWeight: 700 }}>REC [HDR-60]</span>
                </span>
                <span>PATROL: <strong style={{ color: '#fff' }}>CRUISER-402</strong></span>
                <span>ZONE: <strong style={{ color: '#fff' }}>{activeScenario.area.toUpperCase()}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span>GPS: <strong>17.4325° N, 78.3872° E</strong></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Compass size={13} /> NW 318°
                </span>
                <span>SPEED: <strong style={{ color: currentSpeed > activeScenario.speedLimit ? '#ef4444' : '#10b981' }}>{currentSpeed} KM/H</strong></span>
              </div>
            </div>

            {/* Center Artificial Horizon & Target Reticle */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: 140, height: 140, pointerEvents: 'none', opacity: 0.6
            }}>
              <div style={{
                position: 'absolute', top: 70, left: 0, right: 0, height: 1,
                background: 'rgba(56, 189, 248, 0.4)'
              }} />
              <div style={{
                position: 'absolute', left: 70, top: 0, bottom: 0, width: 1,
                background: 'rgba(56, 189, 248, 0.4)'
              }} />
              <div style={{
                position: 'absolute', top: 40, left: 40, width: 60, height: 60,
                border: '1px dashed rgba(56, 189, 248, 0.35)', borderRadius: '50%'
              }} />
            </div>

            {/* DYNAMIC AI TARGET VEHICLE BOUNDING BOX — ONLY WHEN VEHICLE VISIBLE IN FRAME */}
            {cameraMode !== 'webcam' && stage !== 'searching' && (
              <div style={{
                position: 'absolute',
                left: `${activeScenario.vehicleCoordinates.x}%`,
                top: `${activeScenario.vehicleCoordinates.y}%`,
                width: `${activeScenario.vehicleCoordinates.width}%`,
                height: `${activeScenario.vehicleCoordinates.height}%`,
                border: stage === 'violation_confirmed' ? '2px solid #ef4444' : '2px solid #06b6d4',
                borderRadius: 6,
                boxShadow: stage === 'violation_confirmed'
                  ? '0 0 15px rgba(239, 68, 68, 0.4), inset 0 0 15px rgba(239, 68, 68, 0.1)'
                  : '0 0 15px rgba(6, 182, 212, 0.4), inset 0 0 15px rgba(6, 182, 212, 0.1)',
                pointerEvents: 'none',
                transition: 'all 0.3s ease'
              }}>
                {/* Corner brackets */}
                <div style={{ position: 'absolute', top: -3, left: -3, width: 12, height: 12, borderTop: '3px solid #fff', borderLeft: '3px solid #fff' }} />
                <div style={{ position: 'absolute', top: -3, right: -3, width: 12, height: 12, borderTop: '3px solid #fff', borderRight: '3px solid #fff' }} />
                <div style={{ position: 'absolute', bottom: -3, left: -3, width: 12, height: 12, borderBottom: '3px solid #fff', borderLeft: '3px solid #fff' }} />
                <div style={{ position: 'absolute', bottom: -3, right: -3, width: 12, height: 12, borderBottom: '3px solid #fff', borderRight: '3px solid #fff' }} />

                {/* Target Label */}
                <div style={{
                  position: 'absolute', top: -26, left: 0,
                  background: stage === 'violation_confirmed' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(6, 182, 212, 0.9)',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700,
                  padding: '2px 8px', borderRadius: 4, letterSpacing: '0.04em',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}>
                  {stage === 'violation_confirmed' ? (
                    <>
                      <ShieldAlert size={12} />
                      <span>{activeScenario.violationType.toUpperCase()} — {activeScenario.aiConfidence}%</span>
                    </>
                  ) : (
                    <>
                      <Car size={12} />
                      <span>TARGET ACQUIRED: {activeScenario.violatorVehicle.toUpperCase()}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* HIGH-PRECISION ANPR LICENSE PLATE TARGET SCANNER — ONLY WHEN SCANNING OR CONFIRMED */}
            {cameraMode !== 'webcam' && (stage === 'anpr_reading' || stage === 'violation_confirmed') && (
              <div style={{
                position: 'absolute',
                left: `${activeScenario.plateCoordinates.x}%`,
                top: `${activeScenario.plateCoordinates.y}%`,
                width: `${activeScenario.plateCoordinates.width}%`,
                height: `${activeScenario.plateCoordinates.height}%`,
                border: '2px solid #06b6d4',
                borderRadius: 4,
                boxShadow: '0 0 12px rgba(6, 182, 212, 0.7)',
                background: 'rgba(6, 182, 212, 0.15)',
                pointerEvents: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {/* Animated laser scanline traversing plate */}
                {isPlaying && (
                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: 'linear-gradient(90deg, transparent, #38bdf8, #fff, #38bdf8, transparent)',
                    boxShadow: '0 0 8px #38bdf8',
                    animation: 'scannerMove 1.4s ease-in-out infinite alternate'
                  }} />
                )}

                {/* ANPR decoded label hanging underneath plate */}
                <div style={{
                  position: 'absolute', bottom: -28,
                  background: 'rgba(2, 6, 23, 0.95)', border: '1px solid #06b6d4',
                  color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  fontWeight: 800, padding: '2px 8px', borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.8)', letterSpacing: '0.08em',
                  display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: anprScanned ? '#10b981' : '#f59e0b',
                    boxShadow: anprScanned ? '0 0 6px #10b981' : '0 0 6px #f59e0b'
                  }} />
                  <span>ANPR: {ocrText}</span>
                  <span style={{ fontSize: '0.62rem', color: '#06b6d4' }}>({activeScenario.plateConfidence}%)</span>
                </div>
              </div>
            )}

            {/* Bottom HUD: Telemetry readouts */}
            <div style={{
              position: 'absolute', bottom: 12, left: 14, right: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)',
              background: 'rgba(2, 6, 23, 0.75)', padding: '6px 14px', borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(4px)',
              pointerEvents: 'none'
            }}>
              <div style={{ display: 'flex', gap: 14 }}>
                <span>LIDAR DIST: <strong style={{ color: '#38bdf8' }}>{stage === 'searching' || cameraMode === 'webcam' ? '--' : '14.2m'}</strong></span>
                <span>FRAME RATE: <strong style={{ color: '#10b981' }}>59.94 FPS</strong></span>
                <span>OPTICAL ZOOM: <strong style={{ color: '#fff' }}>2.4X</strong></span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {stage === 'violation_confirmed' && cameraMode !== 'webcam' ? (
                  <>
                    <span>CHALLAN: <strong style={{ color: '#f59e0b' }}>{activeScenario.challanCode}</strong></span>
                    <span>FINE: <strong style={{ color: '#ef4444' }}>₹{activeScenario.fineAmount}</strong></span>
                  </>
                ) : (
                  <span>STATUS: <strong style={{ color: stage === 'searching' || cameraMode === 'webcam' ? '#38bdf8' : '#f59e0b' }}>
                    {cameraMode === 'webcam' ? 'NO VEHICLE DETECTED' :
                     stage === 'searching' ? 'AWAITING VEHICLE DETECTION' :
                     stage === 'vehicle_detected' ? 'PROFILING VEHICLE...' : 'READING ANPR PLATE...'}
                  </strong></span>
                )}
              </div>
            </div>
          </div>

          {/* Action Toolbar Below Viewfinder */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--bg-card)', padding: '12px 16px', borderRadius: 8,
            border: '1px solid var(--border)', flexWrap: 'wrap', gap: 10
          }}>
            {/* Play/Pause & Speed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', padding: '8px 14px', borderRadius: 6,
                  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
                }}
              >
                {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                <span>{isPlaying ? 'Pause Feed' : 'Resume Feed'}</span>
              </button>

              <button
                onClick={() => {
                  setStage('searching');
                  setAnprScanned(false);
                  setOcrText('TS 09 -- ----');
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: 6,
                  cursor: 'pointer', fontSize: '0.82rem'
                }}
                title="Restart patrol detection cycle"
              >
                <RefreshCw size={14} />
                <span>Re-scan Sector</span>
              </button>
            </div>

            {/* BIG PRIMARY EVIDENCE CAPTURE BUTTON */}
            <button
              onClick={handleCaptureEvidence}
              disabled={isCapturing || stage !== 'violation_confirmed' || cameraMode === 'webcam'}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: (stage === 'violation_confirmed' && cameraMode !== 'webcam')
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'rgba(255, 255, 255, 0.08)',
                color: (stage === 'violation_confirmed' && cameraMode !== 'webcam') ? '#fff' : 'var(--text-muted)',
                border: (stage === 'violation_confirmed' && cameraMode !== 'webcam') ? 'none' : '1px solid var(--border)',
                padding: '10px 22px', borderRadius: 8,
                fontSize: '0.86rem', fontWeight: 700,
                cursor: (stage === 'violation_confirmed' && cameraMode !== 'webcam') ? 'pointer' : 'not-allowed',
                boxShadow: (stage === 'violation_confirmed' && cameraMode !== 'webcam') ? '0 4px 18px rgba(239, 68, 68, 0.45)' : 'none',
                transform: isCapturing ? 'scale(0.98)' : 'scale(1)',
                transition: 'all 0.15s ease'
              }}
            >
              <Camera size={18} />
              <span>
                {isCapturing ? 'CAPTURING EVIDENCE...' :
                 cameraMode === 'webcam' ? 'NO VEHICLE DETECTED' :
                 stage === 'searching' ? 'AWAITING VEHICLE DETECTION' :
                 stage === 'vehicle_detected' ? 'VEHICLE ACQUIRED — SCANNING...' :
                 stage === 'anpr_reading' ? 'READING REGISTRATION PLATE...' :
                 'RECORD LIVE EVIDENCE SNAPSHOT'}
              </span>
            </button>
          </div>

          {/* Scenario Info Box */}
          <div style={{
            padding: 14, borderRadius: 8, background: 'var(--bg-card)',
            border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-secondary)',
            display: 'flex', flexDirection: 'column', gap: 6
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Sector Context & Incident Synopsis</span>
              <span className="badge badge-critical">{activeScenario.violationType}</span>
            </div>
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              {activeScenario.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: RECORDED EVIDENCE PACKET & E-CHALLAN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {evidencePacket ? (
            <div style={{
              background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border)',
              padding: 18, display: 'flex', flexDirection: 'column', gap: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.25)'
            }}>
              {/* Evidence Packet Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingBottom: 12, borderBottom: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                      Evidence Packet #{evidencePacket.id}
                    </span>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                      background: dispatched ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: dispatched ? 'var(--emerald)' : '#ef4444',
                      border: `1px solid ${dispatched ? 'var(--emerald)' : 'rgba(239,68,68,0.4)'}`
                    }}>
                      {dispatched ? 'DISPATCHED' : 'READY FOR DISPATCH'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Timestamp: {evidencePacket.timestamp}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ef4444' }}>
                    ₹{evidencePacket.fineAmount}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Fine Penalty</span>
                </div>
              </div>

              {/* THREE-POINT SYNCHRONIZED EVIDENCE PHOTOS */}
              <div>
                <div style={{
                  fontSize: '0.74rem', fontWeight: 700, color: 'var(--cyan)',
                  marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase'
                }}>
                  3-Point Synchronized Evidence Captures
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {/* Photo 1: Patrol Cruiser Perspective */}
                  <div style={{
                    borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)',
                    background: '#000', position: 'relative'
                  }}>
                    <img
                      src={evidencePacket.wideImage}
                      alt="Wide Angle Context"
                      style={{ width: '100%', height: 80, objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(0,0,0,0.85)', padding: '2px 4px',
                      fontSize: '0.62rem', color: '#fff', textAlign: 'center',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      1. Patrol Context
                    </div>
                  </div>

                  {/* Photo 2: Violating Vehicle In-Act */}
                  <div style={{
                    borderRadius: 6, overflow: 'hidden', border: '1px solid #ef4444',
                    background: '#000', position: 'relative'
                  }}>
                    <img
                      src={evidencePacket.cropImage}
                      alt="Vehicle Close-up"
                      style={{ width: '100%', height: 80, objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(239, 68, 68, 0.85)', padding: '2px 4px',
                      fontSize: '0.62rem', color: '#fff', textAlign: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 700
                    }}>
                      2. Violation Act
                    </div>
                  </div>

                  {/* Photo 3: ANPR High-Contrast License Plate */}
                  <div style={{
                    borderRadius: 6, overflow: 'hidden', border: '1px solid #06b6d4',
                    background: '#0f172a', position: 'relative', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: 80, padding: 4
                  }}>
                    {/* Authentic Indian High-Security Plate Graphical Graphic */}
                    <div style={{
                      background: '#ffffff', color: '#111', borderRadius: 4,
                      border: '2px solid #000', width: '95%', padding: '4px 6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                    }}>
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        borderRight: '1px solid #0044ff', paddingRight: 4, marginRight: 4
                      }}>
                        <span style={{ fontSize: '0.5rem', fontWeight: 900, color: '#0044ff' }}>IND</span>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#ff9933' }} />
                      </div>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: '0.8rem',
                        letterSpacing: '0.08em', color: '#000'
                      }}>
                        {evidencePacket.licensePlate}
                      </span>
                    </div>
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(6, 182, 212, 0.9)', padding: '1px 4px',
                      fontSize: '0.58rem', color: '#fff', textAlign: 'center',
                      fontFamily: 'var(--font-mono)', fontWeight: 700
                    }}>
                      3. ANPR Plate OCR
                    </div>
                  </div>
                </div>
              </div>

              {/* ANPR Verification Badge */}
              <div style={{
                background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: 8, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Car size={20} color="var(--cyan)" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                      {evidencePacket.licensePlate}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {evidencePacket.targetVehicle}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--emerald)' }}>
                    OCR {evidencePacket.plateConfidence}%
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Telangana RTA Matched</span>
                </div>
              </div>

              {/* Telemetry & Cryptographic Verification */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
                fontSize: '0.74rem', color: 'var(--text-secondary)'
              }}>
                <div style={{ background: 'var(--bg-surface)', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Patrol Officer</span>
                  <strong style={{ color: '#fff' }}>{evidencePacket.officerId}</strong>
                </div>
                <div style={{ background: 'var(--bg-surface)', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Unit Call-Sign</span>
                  <strong style={{ color: '#fff' }}>{evidencePacket.patrolUnit}</strong>
                </div>
                <div style={{ gridColumn: 'span 2', background: 'var(--bg-surface)', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>SHA-256 Tamper-Proof Seal</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--cyan)', wordBreak: 'break-all' }}>
                    {evidencePacket.sha256Hash}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {!dispatched ? (
                  <button
                    onClick={handleDispatch}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      background: 'var(--emerald)', color: '#fff', border: 'none',
                      padding: '11px', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem',
                      cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Send size={16} />
                    <span>Dispatch E-Challan to Command Center & Parivahan</span>
                  </button>
                ) : (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--emerald)',
                    color: 'var(--emerald)', padding: '10px', borderRadius: 8,
                    fontSize: '0.82rem', fontWeight: 700
                  }}>
                    <CheckCircle2 size={16} />
                    <span>E-Challan Filed & Synchronized with Hyderabad Police HQ</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onNavigate?.('incidents')}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      color: 'var(--text-primary)', padding: '8px', borderRadius: 6,
                      fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600
                    }}
                  >
                    <Eye size={14} />
                    <span>View in Incident Feed</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: 6,
                      fontSize: '0.78rem', cursor: 'pointer'
                    }}
                    title="Export / Print Evidence Docket"
                  >
                    <Download size={14} />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Placeholder before recording snapshot */
            <div style={{
              background: 'var(--bg-card)', borderRadius: 12, border: '1px dashed var(--border)',
              padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', textAlign: 'center', flex: 1, gap: 14
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan)'
              }}>
                <Camera size={28} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 6px 0', color: '#fff', fontSize: '1rem' }}>
                  Awaiting Evidence Capture
                </h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 300 }}>
                  Click the red <strong>&ldquo;RECORD LIVE EVIDENCE SNAPSHOT&rdquo;</strong> button or enable <strong>Auto-Patrol Mode</strong> to trigger synchronized multi-angle capture and plate deciphering.
                </p>
              </div>

              <div style={{
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '10px 14px', fontSize: '0.75rem', color: 'var(--text-secondary)',
                display: 'flex', flexDirection: 'column', gap: 4, width: '100%', textAlign: 'left'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={13} /> Synchronized Pipeline Workflow:
                </div>
                <span>1. Patrol Unit scans sector — awaits vehicle detection</span>
                <span>2. Vehicle enters frame — AI acquires target bounding box</span>
                <span>3. Optical ANPR scanner deciphers number plate</span>
                <span>4. Violation flagged & Live Evidence Snapshot captured</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
