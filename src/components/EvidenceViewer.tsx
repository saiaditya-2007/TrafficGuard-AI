import React, { useState, useEffect } from 'react';
import { Camera, Cpu, Shield, Layers, Send, CheckCircle, XCircle, AlertTriangle, Clock, Car, ScanLine, MapPin, FileText } from 'lucide-react';
import type { Incident, IncidentStatus } from '../types';
import { BACKEND_URL } from '../data/api';

interface Props {
  incident: Incident;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onStatusUpdate?: (id: string, status: IncidentStatus) => Promise<void> | void;
}

const ACTION_STATUS_MAP: Record<string, IncidentStatus> = {
  verify: 'Verified',
  reject: 'Rejected',
  more: 'More Evidence Requested',
  investigate: 'Under Investigation',
};

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
      { id: 1, label: 'Camera 01', sub: 'School Zone Cam (JH-36)', img: '/assets/evidence/case_solo_helmet.jpg', camId: 'CAM-TB-01' },
      { id: 2, label: 'Camera 02', sub: 'Street CCTV (Tank Bund-02)', img: '/assets/evidence/case_solo_helmet.jpg', camId: 'NODE-TB-02' },
      { id: 3, label: 'Camera 03', sub: 'Rear Camera Feed', img: '/assets/evidence/cam2.jpg', camId: 'CAM-089' },
    ];
  }
  if (incident.type.includes('Mobile') || incident.type.includes('Phone')) {
    return [
      { id: 1, label: 'Camera 01', sub: 'Cabin Dashcam (V-1042)', img: '/assets/evidence/case_mobile_check.jpg', camId: 'CAM-MOB-01' },
      { id: 2, label: 'Camera 02', sub: 'Junction Cam (HITEC-02)', img: '/assets/evidence/case_mobile_check.jpg', camId: 'NODE-HITEC-02' },
      { id: 3, label: 'Camera 03', sub: 'Corridor CCTV Feed', img: '/assets/evidence/cam1.jpg', camId: 'CAM-089' },
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
  if (incident.type.includes('Helmet')) {
    return [
      { label: 'RIDER WITHOUT HELMET', confidence: 98.5, class: 'helmet-missing',
        style: { left: '49%', top: '38%', width: '13%', height: '22%' } },
      { label: 'MOTORCYCLE DETECTED', confidence: 99.1, class: 'motorcycle',
        style: { left: '47%', top: '56%', width: '17%', height: '36%' } },
      { label: 'ANPR: TS 09 AB 1234', confidence: 99.4, class: 'signal',
        style: { left: '56%', top: '69%', width: '6%', height: '3%' } },
    ];
  }
  if (incident.type.includes('Mobile') || incident.type.includes('Phone')) {
    return [
      { label: 'MOBILE DEVICE IN USE WHILE DRIVING', confidence: 98.8, class: 'helmet-missing',
        style: { left: '46%', top: '58%', width: '10%', height: '30%' } },
      { label: 'DRIVER DISTRACTION DETECTED', confidence: 97.2, class: 'signal',
        style: { left: '68%', top: '65%', width: '18%', height: '25%' } },
      { label: 'CABIN SENSOR ACTIVE', confidence: 99.0, class: 'motorcycle',
        style: { left: '38%', top: '22%', width: '25%', height: '24%' } },
    ];
  }
  if (incident.type.includes('Overspeeding')) {
    return [
      { label: 'SEDAN TS 09 UB 7842', confidence: 99.4, class: 'motorcycle',
        style: { left: '36%', top: '53%', width: '27%', height: '28%' } },
      { label: 'RADAR: 92 KM/H (LIMIT: 50 KM/H)', confidence: 99.9, class: 'signal',
        style: { left: '57%', top: '15%', width: '25%', height: '14%' } },
      { label: 'PLATE: TS 09 UB 7842', confidence: 99.8, class: 'helmet-missing',
        style: { left: '40%', top: '72%', width: '7%', height: '4%' } },
    ];
  }
  if (incident.type.includes('Triple')) {
    return [
      { label: 'MOTORCYCLE TS 07 EA 9012', confidence: 98.9, class: 'motorcycle',
        style: { left: '36%', top: '39%', width: '23%', height: '55%' } },
      { label: 'TRIPLE RIDING (3 RIDERS DETECTED)', confidence: 99.2, class: 'person',
        style: { left: '42%', top: '30%', width: '18%', height: '36%' } },
      { label: 'NO HELMETS DETECTED (3/3)', confidence: 97.5, class: 'helmet-missing',
        style: { left: '46%', top: '30%', width: '14%', height: '12%' } },
      { label: 'ANPR CROP: TS 07 EA 9012', confidence: 99.8, class: 'signal',
        style: { left: '83%', top: '72%', width: '16%', height: '18%' } },
    ];
  }
  if (incident.type.includes('Wrong-Side')) {
    return [
      { label: 'CONTRAFLOW TS 08 FK 3319', confidence: 99.6, class: 'helmet-missing',
        style: { left: '44%', top: '47%', width: '18%', height: '26%' } },
      { label: 'ONE WAY - NO ENTRY / WRONG DIRECTION', confidence: 99.9, class: 'signal',
        style: { left: '36%', top: '4%', width: '23%', height: '13%' } },
      { label: 'PLATE ANPR: TS 08 FK 3319', confidence: 99.5, class: 'motorcycle',
        style: { left: '50%', top: '65%', width: '6%', height: '4%' } },
    ];
  }
  if (incident.type.includes('Parking')) {
    return [
      { label: 'ILLEGALLY PARKED: TS 10 EV 5521', confidence: 98.8, class: 'motorcycle',
        style: { left: '38%', top: '34%', width: '46%', height: '55%' } },
      { label: 'NO PARKING TOW AWAY ZONE', confidence: 99.7, class: 'signal',
        style: { left: '20%', top: '15%', width: '16%', height: '40%' } },
      { label: 'PLATE: TS 10 EV 5521', confidence: 99.6, class: 'helmet-missing',
        style: { left: '64%', top: '59%', width: '12%', height: '7%' } },
    ];
  }
  if (incident.type.includes('Red-Light')) {
    return [
      { label: 'SEDAN TS 09 UB 7642', confidence: 99.2, class: 'motorcycle',
        style: { left: '39%', top: '44%', width: '24%', height: '31%' } },
      { label: 'SIGNAL — RED (99.8% STATE)', confidence: 99.8, class: 'signal',
        style: { left: '72%', top: '5%', width: '6%', height: '25%' } },
      { label: 'JUNCTION BOX BREACHED', confidence: 98.5, class: 'helmet-missing',
        style: { left: '35%', top: '60%', width: '32%', height: '22%' } },
    ];
  }
  return [
    { label: 'VEHICLE DETECTED', confidence: 98, class: 'motorcycle',
      style: { left: '36%', top: '40%', width: '28%', height: '40%' } },
    { label: 'VIOLATION FLAGGED', confidence: 96, class: 'helmet-missing',
      style: { left: '40%', top: '25%', width: '20%', height: '20%' } },
    { label: 'ACTIVE SURVEILLANCE', confidence: 99, class: 'signal',
      style: { left: '5%', top: '5%', width: '15%', height: '10%' } },
  ];
}

// ── Detection chain: explains WHY this incident was flagged ──────────────────
interface DetectionStep {
  icon: React.ReactNode;
  title: string;
  detail: string;
  confidence: number | null; // null = structural detection (no ML score)
  color: string;
}

function getDetectionChain(incident: Incident): DetectionStep[] {
  const t = incident.type;

  // Step 1 — vehicle / subject detected (always present)
  const vehicleStep: DetectionStep = {
    icon: <Car size={13} />,
    title: 'Vehicle / Subject Detected',
    detail: t.includes('Helmet') || t.includes('Triple')
      ? 'Two-wheeler and rider(s) identified in frame'
      : t.includes('Parking')
      ? 'Stationary vehicle identified in restricted zone'
      : 'Motor vehicle identified and tracked across frames',
    confidence: incident.trustBreakdown.imageQuality,
    color: 'var(--cyan)',
  };

  // Step 2 — specific violation logic
  const violationSteps: DetectionStep[] = [];
  if (t.includes('Helmet')) {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'No Helmet Detected',
      detail: 'Head region classified as unprotected — no approved helmet shape present',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--crimson)',
    });
  } else if (t.includes('Triple')) {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'Triple Riding Detected',
      detail: 'Person-count model detected 3 occupants on a 2-wheeler (max permitted: 2)',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--crimson)',
    });
  } else if (t.includes('Wrong-Side')) {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'Contraflow / Wrong-Side Driving',
      detail: 'Vehicle trajectory vector opposite to legal traffic direction; No-Entry sign confirmed',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--crimson)',
    });
  } else if (t.includes('Overspeeding')) {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'Speed Limit Exceeded',
      detail: 'Optical-flow speed estimate exceeded posted limit; cross-referenced with radar gantry reading',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--crimson)',
    });
  } else if (t.includes('Red-Light')) {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'Red-Light Signal Breached',
      detail: 'Traffic light state classified RED; vehicle crossed stop-line while signal was active',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--crimson)',
    });
  } else if (t.includes('Parking')) {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'Illegal Parking Detected',
      detail: 'Stationary vehicle parked adjacent to No-Parking / Tow-Away Zone signage',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--amber)',
    });
  } else if (t.includes('Mobile') || t.includes('Phone')) {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'Mobile Phone Use While Driving',
      detail: 'Hand-held device detected at ear/eye level during vehicle motion',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--crimson)',
    });
  } else if (t.includes('Seat Belt')) {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'Seat Belt Absent',
      detail: 'Driver silhouette model detected no diagonal shoulder belt present',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--amber)',
    });
  } else if (t.includes('Lane')) {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'Lane Discipline Violation',
      detail: 'Vehicle trajectory crossed multiple lane markings without indicated intention',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--amber)',
    });
  } else {
    violationSteps.push({
      icon: <Shield size={13} />,
      title: 'Violation Pattern Detected',
      detail: 'Behavioural anomaly classified as a likely traffic violation',
      confidence: incident.trustBreakdown.aiConfidence,
      color: 'var(--crimson)',
    });
  }

  // Step 3 — ANPR (if multi-camera or high trust)
  const anprStep: DetectionStep | null = incident.trustBreakdown.multiCameraConfirmation > 0 ? {
    icon: <ScanLine size={13} />,
    title: 'ANPR Plate Acquired',
    detail: `License plate extracted and matched. Confidence: ${incident.trustBreakdown.locationConsistency}%`,
    confidence: incident.trustBreakdown.locationConsistency,
    color: 'var(--cyan)',
  } : null;

  // Step 4 — evidence captured
  const evidenceStep: DetectionStep = {
    icon: <FileText size={13} />,
    title: `Evidence Captured (${incident.cameraCount} source${incident.cameraCount > 1 ? 's' : ''})`,
    detail: `${incident.cameraCount} independent camera feed${incident.cameraCount > 1 ? 's' : ''} archived. Timestamp & GPS cryptographically sealed.`,
    confidence: incident.trustBreakdown.timestampIntegrity,
    color: 'var(--emerald)',
  };

  return [vehicleStep, ...violationSteps, ...(anprStep ? [anprStep] : []), evidenceStep];
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

export default function EvidenceViewer({ incident, onClose, onVerify, onStatusUpdate }: Props) {
  const [activeCam, setActiveCam] = useState(1);
  const [aiOn, setAiOn] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    setImgLoaded(false); // eslint-disable-line react/set-state-in-effect -- intentional: reset loading state when camera changes before async timer
    const t = setTimeout(() => setImgLoaded(true), 200);
    return () => clearTimeout(t);
  }, [activeCam]);

  const cameras = getIncidentCameras(incident);
  const aiDetections = getIncidentAiDetections(incident);
  const cam = cameras.find(c => c.id === activeCam) || cameras[0];

  const handleAction = async (action: string) => {
    const nextStatus = ACTION_STATUS_MAP[action];
    if (!nextStatus) return;

    setIsSubmitting(true);
    setActionError(null);

    try {
      if (onStatusUpdate) {
        await onStatusUpdate(incident.id, nextStatus);
      } else {
        const res = await fetch(`${BACKEND_URL}/api/incidents/${incident.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: nextStatus }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || `Failed to update status to ${nextStatus}`);
        }
        if (action === 'verify' && onVerify) {
          onVerify(incident.id);
        }
      }

      setActionDone(action);
    } catch (err: any) {
      console.error('Failed to persist incident action:', err);
      setActionError(err?.message || 'Failed to update incident status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityColor = {
    CRITICAL: 'var(--crimson)',
    HIGH: 'var(--crimson)',
    MEDIUM: 'var(--amber)',
    LOW: 'var(--cyan)',
  }[incident.severity];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal evidence-modal">
        {/* Modal Header */}
        <div className="evidence-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{incident.id}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{incident.type}</span>
            <span className={`badge ${incident.severity.toLowerCase()}`}>{incident.severity}</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
            color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px 12px', fontSize: '0.78rem',
            whiteSpace: 'nowrap'
          }}>✕ Close</button>
        </div>

        {/* Body */}
        <div className="evidence-modal-grid">
          {/* LEFT — Evidence */}
          <div className="evidence-modal-left">
            {/* Camera tabs + AI toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div className="cam-tabs" style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: 2 }}>
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
                    <div style={{
                      fontSize: '0.58rem', fontWeight: 700, marginTop: 2,
                      background: 'rgba(0,0,0,0.75)', padding: '1px 5px', borderRadius: 3,
                      color: '#10b981', letterSpacing: '0.04em'
                    }}>
                      {d.confidence}% <span style={{ color: '#f59e0b', fontWeight: 600 }}>[DEMO]</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-source info */}
            <div style={{
              display: 'flex', gap: 10, padding: '10px 14px', flexWrap: 'wrap', alignItems: 'center',
              background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: 'var(--emerald)', fontWeight: 700, fontSize: '0.78rem' }}>
                  ✓ {incident.cameraCount} Independent Sources
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Evidence Consistency: <strong style={{ color: 'var(--emerald)' }}>HIGH</strong>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                AI Confidence: <strong style={{ color: 'var(--cyan)' }}>{incident.aiConfidence}%</strong>
              </div>
            </div>
          </div>

          {/* RIGHT — Details & Actions */}
          <div className="evidence-modal-right">

            {/* ── WHY WAS THIS FLAGGED? ── */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(59,130,246,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <h3 style={{ fontSize: '0.78rem', color: 'var(--brand-bright)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Why was this flagged?
                </h3>
                <span style={{
                  fontSize: '0.6rem', fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                  background: 'var(--amber-dim)', color: 'var(--amber)',
                  border: '1px solid rgba(245,158,11,0.35)'
                }}>⚠ PROTOTYPE / DEMO VALUES</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {getDetectionChain(incident).map((step, idx, arr) => (
                  <div key={idx} style={{ display: 'flex', gap: 10 }}>
                    {/* Connector line + icon */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: '50%',
                        background: `${step.color}22`,
                        border: `1.5px solid ${step.color}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: step.color, flexShrink: 0
                      }}>
                        {step.icon}
                      </div>
                      {idx < arr.length - 1 && (
                        <div style={{ width: 1.5, flex: 1, background: 'var(--border)', marginTop: 2, marginBottom: 2 }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ paddingBottom: idx < arr.length - 1 ? 10 : 0, flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {step.title}
                        </span>
                        {step.confidence !== null && (
                          <span style={{
                            fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                            background: step.confidence >= 95
                              ? 'rgba(16,185,129,0.15)'
                              : step.confidence >= 85
                              ? 'rgba(245,158,11,0.15)'
                              : 'rgba(239,68,68,0.15)',
                            color: step.confidence >= 95
                              ? 'var(--emerald)'
                              : step.confidence >= 85
                              ? 'var(--amber)'
                              : 'var(--crimson)',
                          }}>
                            {step.confidence}%
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Detection factors legend */}
              <div style={{
                marginTop: 10, padding: '8px 10px',
                background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)', fontSize: '0.67rem', color: 'var(--text-muted)', lineHeight: 1.6
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <MapPin size={11} color="var(--brand)" />
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Detection factors for this incident:</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Violation type', value: incident.type },
                    { label: 'AI confidence', value: `${incident.aiConfidence}%` },
                    { label: 'Location', value: incident.area },
                    { label: 'Timestamp', value: incident.time },
                    { label: 'Camera sources', value: `${incident.cameraCount}` },
                  ].map(f => (
                    <span key={f.label} style={{
                      display: 'inline-flex', gap: 3, alignItems: 'center',
                      background: 'var(--bg-card)', padding: '2px 6px', borderRadius: 4,
                      border: '1px solid var(--border)'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>{f.label}:</span>
                      <strong style={{ color: 'var(--text-secondary)' }}>{f.value}</strong>
                    </span>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
                ⚠ Confidence values are simulated for this prototype demonstration. A production system would derive these from a validated, calibrated computer-vision model.
              </p>
            </div>

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
                    color: k === 'Priority' ? severityColor : 'var(--text-primary)',
                    wordBreak: 'break-word', minWidth: 0
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

              {actionError && (
                <div style={{
                  padding: '8px 12px',
                  marginBottom: 10,
                  background: 'var(--crimson-dim)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--crimson)',
                  fontSize: '0.72rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                  <span>{actionError}</span>
                </div>
              )}

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
                    disabled={isSubmitting}
                    onClick={() => handleAction('verify')}>
                    <CheckCircle size={14} /> Verify Violation
                  </button>
                  <button className="btn btn-danger" style={{ justifyContent: 'center' }}
                    disabled={isSubmitting}
                    onClick={() => handleAction('reject')}>
                    <XCircle size={14} /> Reject Evidence
                  </button>
                  <button className="btn btn-warning" style={{ justifyContent: 'center' }}
                    disabled={isSubmitting}
                    onClick={() => handleAction('more')}>
                    <Camera size={14} /> Request More Evidence
                  </button>
                  <button className="btn btn-violet" style={{ justifyContent: 'center' }}
                    disabled={isSubmitting}
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
