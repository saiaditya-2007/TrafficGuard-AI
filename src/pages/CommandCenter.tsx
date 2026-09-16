import React, { useState, useEffect } from 'react';
import { AlertTriangle, Camera, MapPin, Clock, Shield, TrendingUp, TrendingDown, Video } from 'lucide-react';
import { INCIDENTS, KPI_DATA } from '../data/mockData';
import HyderabadMap from '../components/HyderabadMap';
import EvidenceViewer from '../components/EvidenceViewer';
import type { Incident } from '../types';

function KPICard({ label, value, trend, color, icon }: {
  label: string; value: number | string; trend: string; color: string; icon: React.ReactNode;
}) {
  const isUp = trend.startsWith('+');
  return (
    <div className={`kpi-card ${color}`}>
      <div className="kpi-label">{icon} {label}</div>
      <div className="kpi-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className={`kpi-trend ${isUp ? 'up' : 'down'}`}>
        {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {' '}{trend} this week
      </div>
    </div>
  );
}

function getSeverityClass(s: string) {
  const map: Record<string, string> = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low' };
  return map[s] || 'low';
}

function getStatusClass(s: string) {
  const map: Record<string, string> = {
    'Pending Review': 'status-pending',
    'Verified': 'status-verified',
    'Rejected': 'status-rejected',
    'Under Investigation': 'status-investigation',
    'Resolved': 'status-resolved',
  };
  return map[s] || 'status-pending';
}

interface Props {
  onNavigate: (page: string) => void;
}

export default function CommandCenter({ onNavigate }: Props) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [incidents, setIncidents] = useState(INCIDENTS);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const handleVerify = (id: string) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id ? { ...inc, status: 'Verified' as const } : inc
    ));
    setSelectedIncident(null);
  };

  const filteredIncidents = incidents.filter(inc =>
    filterSeverity === 'ALL' || inc.severity === filterSeverity
  );

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', flexDirection: 'column', gap: 16
      }}>
        <div style={{
          width: 48, height: 48,
          border: '3px solid var(--border)',
          borderTop: '3px solid var(--brand)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Loading command center feeds...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      {selectedIncident && (
        <EvidenceViewer
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onVerify={handleVerify}
        />
      )}

      <div style={{ height: '100%', overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Live Patrol Unit Interactive Banner */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 8,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="badge-live-pulse">LIVE PATROL</span>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#fff' }}>
                In-Vehicle Mobile AI Patrol & Optical ANPR Unit
              </strong>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Simulate patrol cruiser recording live evidence of violating vehicles, scanning registration plates & issuing E-Challans.
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => onNavigate('live-demo')}
            style={{
              background: '#ef4444', color: '#fff', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6, border: 'none',
              padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)'
            }}
          >
            <Video size={14} /> Open Live Demo Mode
          </button>
        </div>

        {/* KPI Grid */}
        <div className="kpi-grid">
          <KPICard label="Total Incidents"     value={KPI_DATA.totalIncidents}     trend={KPI_DATA.trends.total}    color="blue"   icon={<AlertTriangle size={11} />} />
          <KPICard label="Pending Review"      value={KPI_DATA.pendingReview}      trend={KPI_DATA.trends.pending}  color="amber"  icon={<Clock size={11} />} />
          <KPICard label="Verified Violations" value={KPI_DATA.verifiedViolations} trend={KPI_DATA.trends.verified} color="green"  icon={<Shield size={11} />} />
          <KPICard label="Critical"            value={KPI_DATA.critical}           trend={KPI_DATA.trends.critical} color="red"    icon={<AlertTriangle size={11} />} />
          <KPICard label="Resolved"            value={KPI_DATA.resolved}           trend={KPI_DATA.trends.resolved} color="cyan"   icon={<TrendingUp size={11} />} />
          <KPICard label="Active Camera Network" value={KPI_DATA.activeCameras}   trend={KPI_DATA.trends.cameras}  color="violet" icon={<Camera size={11} />} />
        </div>

        {/* Map + Feed row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: 16,
          flex: 1,
          minHeight: 0
        }}>
          {/* Map */}
          <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header">
              <span className="card-title">
                <MapPin size={12} style={{ display: 'inline', marginRight: 6 }} />
                Hyderabad Incident Map
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--amber)', fontWeight: 600,
                  background: 'var(--amber-dim)', padding: '2px 8px', borderRadius: 10 }}>
                  ⚠ SIMULATED DEMO DATA
                </span>
                <button className="btn btn-sm btn-secondary" onClick={() => onNavigate('map')}>
                  Full Map
                </button>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <HyderabadMap
                incidents={incidents}
                onSelect={setSelectedIncident}
                height="100%"
              />
            </div>

            {/* Area jump buttons */}
            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['Madhapur', 'Gachibowli', 'Kukatpally', 'Banjara Hills', 'Ameerpet', 'Hitech City'].map(area => (
                <button
                  key={area}
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.6rem' }}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Incident Feed */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="card-header">
              <span className="card-title">
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--crimson)', marginRight: 8, animation: 'pulse-green 1.5s ease infinite' }} />
                Live Incident Feed
              </span>
              <select
                className="filter-select"
                style={{ padding: '3px 8px', fontSize: '0.65rem' }}
                value={filterSeverity}
                onChange={e => setFilterSeverity(e.target.value)}
              >
                <option value="ALL">All Severity</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="incident-feed" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              {filteredIncidents.length === 0 ? (
                <div className="empty-state">
                  <AlertTriangle size={32} />
                  <p>No incidents match your filters.</p>
                </div>
              ) : filteredIncidents.map(inc => (
                <div
                  key={inc.id}
                  className={`incident-card ${getSeverityClass(inc.severity)}-card`}
                  onClick={() => setSelectedIncident(inc)}
                >
                  <div className="incident-card-top">
                    <div>
                      <div className="incident-type">{inc.type}</div>
                      <div className="incident-loc">
                        <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />
                        {inc.area}, Hyderabad
                      </div>
                      <div className="incident-time">{inc.timestamp}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span className={`badge ${getSeverityClass(inc.severity)}`}>{inc.severity}</span>
                      <span className={`badge ${getStatusClass(inc.status)}`} style={{ fontSize: '0.58rem' }}>
                        {inc.status}
                      </span>
                    </div>
                  </div>

                  <div className="incident-meta">
                    <span className="meta-chip">
                      <Shield size={9} /> AI: {inc.aiConfidence}%
                    </span>
                    <span className="meta-chip">
                      <Camera size={9} /> {inc.cameraCount} cam{inc.cameraCount > 1 ? 's' : ''}
                    </span>
                    <span className="meta-chip" style={{ color: 'var(--cyan)' }}>
                      Trust: {inc.trustScore}%
                    </span>
                  </div>

                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${inc.aiConfidence}%` }} />
                  </div>

                  <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    {inc.id} · Click to investigate →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
