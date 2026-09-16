import React, { useState, useEffect } from 'react';
import { Camera, Cpu, Shield, Layers, Send, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import type { Incident } from '../types';

interface Props {
  incident: Incident;
  onClose: () => void;
  onVerify: (id: string) => void;
}

function getIncidentCameras(incident: Incident) {
  if (incident.type.includes('Overspeeding')) {
    return [
      { id: 1, label: 'Camera 01', sub: 'Speed Radar Dashcam (ORR-402)', img: '/assets/evidence/overspeeding.jpg', camId: 'CAM-ORR-402' },
      { id: 2, label: 'Camera 02', sub: 'Overhead Speed Gantry', img: '/assets/evidence/overspeeding.jpg', camId: 'NODE-GANTRY-12' },
      { id: 3, label: 'Camera 03', sub: 'Corridor Flow Cam', img: '/assets/evidence/inc3_angle_b.jpg', camId: 'CAM-ORR-114' },
    ];
  }
  if (incident.type.includes('Triple')) {
    return [
      { id: 1, label: 'Camera 01', sub: 'Front Mobile Cam (V-1042)', img: '/assets/evidence/triple_riding.jpg', camId: 'CAM-TR-04' },
      { id: 2, label: 'Camera 02', sub: 'Street CCTV (Ameerpet-02)', img: '/assets/evidence/triple_riding.jpg', camId: 'NODE-AMP-02' },
      { id: 3, label: 'Camera 03', sub: 'Rear ANPR Feed', img: '/assets/evidence/inc2_angle_b.jpg', camId: 'CAM-ANPR-089' },
    ];
  }
  if (incident.type.includes('Wrong-Side')) {
    return [
      { id: 1, label: 'Camera 01', sub: 'Patrol Dashcam (V-2031)', img: '/assets/evidence/wrong_side.jpg', camId: 'CAM-PATROL-114' },
      { id: 2, label: 'Camera 02', sub: 'High-Mast Gantry CCTV', img: '/assets/evidence/wrong_side.jpg', camId: 'NODE-ORR-09' },
      { id: 3, label: 'Camera 03', sub: 'Corridor Rear Cam', img: '/assets/evidence/inc3_angle_b.jpg', camId: 'CAM-042' },
    ];
  }
  if (incident.type.includes('Parking')) {
    return [
      { id: 1, label: 'Camera 01', sub: 'Enforcement Cam (BJ-12)', img: '/assets/evidence/illegal_parking.jpg', camId: 'CAM-BJ-12' },
      { id: 2, label: 'Camera 02', sub: 'Street Surveillance', img: '/assets/evidence/illegal_parking.jpg', camId: 'NODE-BJ-08' },
      { id: 3, label: 'Camera 03', sub: 'Patrol Vehicle Angle', img: '/assets/evidence/cam2.jpg', camId: 'CAM-089' },
    ];
  }
  if (incident.type.includes('Red-Light')) {
    return [
      { id: 1, label: 'Camera 01', sub: 'Junction Cam (KBR-14)', img: '/assets/evidence/red_light.jpg', camId: 'CAM-KBR-14' },
      { id: 2, label: 'Camera 02', sub: 'Overhead CCTV (PJG-04)', img: '/assets/evidence/inc1_angle_b.jpg', camId: 'NODE-PJG-04' },
      { id: 3, label: 'Camera 03', sub: 'Stop Line Zoom Feed', img: '/assets/evidence/red_light.jpg', camId: 'CAM-113' },
    ];
  }
  if (incident.type.includes('Helmet')) {
    return [
      { id: 1, label: 'Camera 01', sub: 'Front Dashcam (V-1042)', img: '/assets/evidence/triple_riding.jpg', camId: 'CAM-208' },
      { id: 2, label: 'Camera 02', sub: 'Overhead CCTV (CYB-02)', img: '/assets/evidence/inc2_angle_b.jpg', camId: 'NODE-CYB-02' },
      { id: 3, label: 'Camera 03', sub: 'Rear Camera', img: '/assets/evidence/case_solo_helmet.jpg', camId: 'CAM-089' },
    ];
  }
  if (incident.type.includes('Seat Belt')) {
    return [
      { id: 1, label: 'Camera 01', sub: 'Windshield Cam (HD)', img: '/assets/evidence/case_seatbelt.jpg', camId: 'CAM-SB-01' },
      { id: 2, label: 'Camera 02', sub: 'Driver Profiler', img: '/assets/evidence/case_seatbelt.jpg', camId: 'NODE-SB-02' },
      { id: 3, label: 'Camera 03', sub: 'Context Gantry', img: '/assets/evidence/cam2.jpg', camId: 'CAM-089' },
    ];
  }
  return [
    { id: 1, label: 'Camera 01', sub: 'Highway Radar Cam', img: '/assets/evidence/overspeeding.jpg', camId: 'CAM-042' },
    { id: 2, label: 'Camera 02', sub: 'Cross-Angle Dashcam', img: '/assets/evidence/inc3_angle_b.jpg', camId: 'CAM-089' },
    { id: 3, label: 'Camera 03', sub: 'Rear Camera', img: '/assets/evidence/cam3.jpg', camId: 'CAM-113' },
  ];
}

function getIncidentAiDetections(incident: Incident) {
  if (incident.type.includes('Overspeeding')) {
    return [
      { label: 'SEDAN TS 09 UB 7842', confidence: '99.4%', class: 'motorcycle',
        style: { left: '36%', top: '53%', width: '27%', height: '28%' } },
      { label: 'RADAR: 92 KM/H (LIMIT: 50 KM/H)', confidence: '99.9%', class: 'signal',
        style: { left: '57%', top: '15%', width: '25%', height: '14%' } },
      { label: 'PLATE: TS 09 UB 7842', confidence: '99.8%', class: 'helmet-missing',
        style: { left: '40%', top: '72%', width: '7%', height: '4%' } },
    ];
  }
  if (incident.type.includes('Triple')) {
    return [
      { label: 'MOTORCYCLE TS 07 EA 9012', confidence: '98.9%', class: 'motorcycle',
        style: { left: '36%', top: '39%', width: '23%', height: '55%' } },
      { label: 'TRIPLE RIDING (3 RIDERS DETECTED)', confidence: '99.2%', class: 'person',
        style: { left: '42%', top: '30%', width: '18%', height: '36%' } },
      { label: 'NO HELMETS DETECTED (3/3)', confidence: '97.5%', class: 'helmet-missing',
        style: { left: '46%', top: '30%', width: '14%', height: '12%' } },
      { label: 'ANPR CROP: TS 07 EA 9012', confidence: '99.8%', class: 'signal',
        style: { left: '83%', top: '72%', width: '16%', height: '18%' } },
    ];
  }
  if (incident.type.includes('Wrong-Side')) {
    return [
      { label: 'CONTRAFLOW TS 08 FK 3319', confidence: '99.6%', class: 'helmet-missing',
        style: { left: '44%', top: '47%', width: '18%', height: '26%' } },
      { label: 'ONE WAY - NO ENTRY / WRONG DIRECTION', confidence: '99.9%', class: 'signal',
        style: { left: '36%', top: '4%', width: '23%', height: '13%' } },
      { label: 'PLATE ANPR: TS 08 FK 3319', confidence: '99.5%', class: 'motorcycle',
        style: { left: '50%', top: '65%', width: '6%', height: '4%' } },
    ];
  }
  if (incident.type.includes('Parking')) {
    return [
      { label: 'ILLEGALLY PARKED: TS 10 EV 5521', confidence: '98.8%', class: 'motorcycle',
        style: { left: '38%', top: '34%', width: '46%', height: '55%' } },
      { label: 'NO PARKING TOW AWAY ZONE', confidence: '99.7%', class: 'signal',
        style: { left: '20%', top: '15%', width: '16%', height: '40%' } },
      { label: 'PLATE: TS 10 EV 5521', confidence: '99.6%', class: 'helmet-missing',
        style: { left: '64%', top: '59%', width: '12%', height: '7%' } },
    ];
  }
  if (incident.type.includes('Red-Light')) {
    return [
      { label: 'SEDAN TS 09 UB 7642', confidence: '99.2%', class: 'motorcycle',
        style: { left: '39%', top: '44%', width: '24%', height: '31%' } },
      { label: 'SIGNAL — RED 99.8%', confidence: '99.8%', class: 'signal',
        style: { left: '72%', top: '5%', width: '6%', height: '25%' } },
      { label: 'JUNCTION BOX BREACHED', confidence: '98.5%', class: 'helmet-missing',
        style: { left: '35%', top: '60%', width: '32%', height: '22%' } },
    ];
  }
  return [
    { label: 'VEHICLE DETECTED', confidence: '98%', class: 'motorcycle',
      style: { left: '36%', top: '40%', width: '28%', height: '40%' } },
    { label: 'VIOLATION FLAGGED', confidence: '96%', class: 'helmet-missing',
      style: { left: '40%', top: '25%', width: '20%', height: '20%' } },
    { label: 'ACTIVE SURVEILLANCE', confidence: '99%', class: 'signal',
      style: { left: '5%', top: '5%', width: '15%', height: '10%' } },
  ];
}

const iconComponents: Record<string, React.ReactNode> = {
  camera:       <Camera size={13} />,
  cpu:          <Cpu size={13} />,
  shield:       <Shield size={13} />,
  layers:       <Layers size={13} />,
  send:         <Send size={13} />,
  checkCircle:  <CheckCircle size={13} />,
  xCircle:      <XCircle size={13} />,
  alertTriangle:<AlertTriangle size={13} />,
};

const trustColor = (v: number) => v >= 90 ? 'var(--emerald)' : v >= 75 ? 'var(--amber)' : 'var(--crimson)';

export default function EvidenceViewer({ incident, onClose, onVerify }: Props) {
  const [activeCam, setActiveCam] = useState(1);
  const [aiOn, setAiOn] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false); // eslint-disable-line react/set-state-in-effect -- intentional: reset loading state when camera changes before async timer
    const t = setTimeout(() => setImgLoaded(true), 200);
    return () => clearTimeout(t);
  }, [activeCam]);

  const cameras = getIncidentCameras(incident);
  const aiDetections = getIncidentAiDetections(incident);
  const cam = cameras.find(c => c.id === activeCam) || cameras[0];

  const handleAction = (action: string) => {
    setActionDone(action);
    if (action === 'verify') onVerify(incident.id);
  };

  const severityColor = {
    CRITICAL: 'var(--crimson)',
    HIGH: 'var(--orange)',
    MEDIUM: 'var(--amber)',
    LOW: 'var(--cyan)',
  }[incident.severity];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 1120, padding: 0 }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-card)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{incident.id}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{incident.type}</span>
            <span className={`badge ${incident.severity.toLowerCase()}`}>{incident.severity}</span>
            <span style={{ padding: '2px 8px', 
              background: 'var(--amber-dim)', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--amber)', fontWeight: 700, fontSize: '0.6rem' }}>
              ⚠ SIMULATED DEMO DATA
            </span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
            color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px 12px', fontSize: '0.78rem'
          }}>✕ Close</button>
        </div>

        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', height: '620px' }}>
          {/* LEFT — Evidence */}
          <div style={{ padding: '16px', borderRight: '1px solid var(--border)', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Camera tabs + AI toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div className="cam-tabs">
                {cameras.map(c => (
                  <button
                    key={c.id}
                    className={`cam-tab ${activeCam === c.id ? 'active' : ''}`}
                    onClick={() => setActiveCam(c.id)}
                  >
                    {c.label} <span style={{ opacity: 0.6, fontSize: '0.6rem', marginLeft: 4 }}>{c.sub}</span>
                  </button>
                ))}
              </div>

              <div className="ai-toggle" onClick={() => setAiOn(!aiOn)}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: aiOn ? 'var(--brand-bright)' : 'var(--text-muted)' }}>
                  AI Analysis {aiOn ? 'ON' : 'OFF'}
                </span>
                <div className={`toggle-switch ${aiOn ? 'on' : ''}`}>
                  <div className="toggle-knob" />
                </div>
              </div>
            </div>

            {/* Evidence Viewer */}
            <div className="evidence-viewer" style={{ flex: 1 }}>
              <img
                src={cam.img}
                alt={`Camera ${activeCam} evidence`}
                className="evidence-img"
                onLoad={() => setImgLoaded(true)}
                style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
              />

              {/* HUD overlay */}
              <div className="evidence-hud">
                <div className="hud-top-left">
                  <div className="hud-brand">TRAFFICGUARD AI</div>
                  <div>{cam.camId}</div>
                  <div>13 SEP 2026</div>
                  <div className="mono">{incident.time.replace(' ', ' · ')}</div>
                </div>
                <div className="hud-top-right">
                  <div>HYDERABAD</div>
                  <div style={{ color: 'var(--emerald)', fontWeight: 600 }}>● GPS ACTIVE</div>
                  <div>{incident.area.toUpperCase()}</div>
                </div>
                <div className="hud-bottom-left">
                  <div style={{ color: 'var(--amber)', fontWeight: 700 }}>● RECORDING</div>
                  <div style={{ color: 'var(--crimson)', fontWeight: 600, fontSize: '0.6rem', marginTop: 2 }}>SIMULATED DEMO DATA</div>
                </div>
                <div className="hud-bottom-right">
                  <div>REC 00:00:07</div>
                  <div>4K · H.265</div>
                </div>

                {/* AI Detection Overlays */}
                {aiOn && aiDetections.map((d, i) => (
                  <div
                    key={i}
                    className={`ai-box ${d.class}`}
                    style={{ ...d.style, position: 'absolute' }}
                  >
                    <div className="ai-box-label">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-source info */}
            <div style={{
              display: 'flex', gap: 12, padding: '10px 14px',
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--emerald)', fontWeight: 700, fontSize: '0.78rem' }}>
                  ✓ {incident.cameraCount} Independent Sources
                </span>
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Evidence Consistency: <strong style={{ color: 'var(--emerald)' }}>HIGH</strong>
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                AI Confidence: <strong style={{ color: 'var(--cyan)' }}>{incident.aiConfidence}%</strong>
              </div>
            </div>
          </div>

          {/* RIGHT — Details & Actions */}
          <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Incident Summary */}
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>
                Incident Summary
              </h3>
              {[
                ['Violation',           incident.type],
                ['Location',           incident.location],
                ['Time',               incident.timestamp],
                ['AI Confidence',      `${incident.aiConfidence}%`],
                ['Evidence Quality',   `${incident.trustBreakdown.imageQuality}%`],
                ['Trust Score',        `${incident.trustScore}/100`],
                ['Supporting Cameras', `${incident.cameraCount}`],
                ['Priority',           incident.severity],
              ].map(([k, v]) => (
                <div key={k} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 0', borderBottom: '1px solid var(--border)', gap: 8
                }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{k}</span>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600, textAlign: 'right',
                    color: k === 'Priority' ? severityColor : 'var(--text-primary)'
                  }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Trust Score */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Evidence Trust Score
                </h3>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--emerald)', lineHeight: 1 }}>
                    {incident.trustScore}
                  </div>
                  <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>/ 100 — HIGH</div>
                </div>
              </div>

              <div className="trust-breakdown">
                {[
                  ['Image Quality',             incident.trustBreakdown.imageQuality],
                  ['AI Confidence',             incident.trustBreakdown.aiConfidence],
                  ['Location Consistency',      incident.trustBreakdown.locationConsistency],
                  ['Timestamp Integrity',       incident.trustBreakdown.timestampIntegrity],
                  ['Multi-Camera Confirmation', incident.trustBreakdown.multiCameraConfirmation],
                ].map(([label, value]) => (
                  <div key={label as string} className="trust-row">
                    <div className="trust-row-header">
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: trustColor(value as number) }}>
                        {value}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${value}%`,
                          background: trustColor(value as number),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', flex: 1 }}>
              <h3 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
                Incident Timeline
              </h3>
              <div className="timeline">
                {incident.timeline.map((evt, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot">{iconComponents[evt.icon] || <Clock size={13} />}</div>
                    <div className="timeline-content">
                      <div className="timeline-time">{evt.time}</div>
                      <div className="timeline-label">{evt.label}</div>
                      <div className="timeline-desc">{evt.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Panel */}
            <div style={{ padding: '14px 16px' }}>
              <h3 style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 12 }}>
                Officer Action
              </h3>

              {actionDone ? (
                <div style={{
                  padding: '14px', background: 'var(--emerald-dim)', borderRadius: 'var(--radius)',
                  border: '1px solid rgba(16,185,129,0.4)', textAlign: 'center'
                }}>
                  <CheckCircle size={20} color="var(--emerald)" style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald)' }}>
                    Action Recorded
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {actionDone === 'verify' ? 'Violation verified. Record updated.' :
                     actionDone === 'reject' ? 'Evidence rejected. Marked as insufficient.' :
                     actionDone === 'more'   ? 'Additional evidence requested from field.' :
                     'Flagged for senior officer investigation.'}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button className="btn btn-success" style={{ justifyContent: 'center' }}
                    onClick={() => handleAction('verify')}>
                    <CheckCircle size={14} /> Verify Violation
                  </button>
                  <button className="btn btn-danger" style={{ justifyContent: 'center' }}
                    onClick={() => handleAction('reject')}>
                    <XCircle size={14} /> Reject Evidence
                  </button>
                  <button className="btn btn-warning" style={{ justifyContent: 'center' }}
                    onClick={() => handleAction('more')}>
                    <Camera size={14} /> Request More Evidence
                  </button>
                  <button className="btn btn-violet" style={{ justifyContent: 'center' }}
                    onClick={() => handleAction('investigate')}>
                    <AlertTriangle size={14} /> Mark for Investigation
                  </button>
                </div>
              )}

              <p style={{
                fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 10,
                lineHeight: 1.6, padding: '8px', background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)'
              }}>
                🛡️ AI assists the officer. Final decisions are made by authorized personnel only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
