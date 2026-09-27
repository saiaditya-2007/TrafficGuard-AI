import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Camera, MapPin, Clock, Shield, TrendingUp, TrendingDown, Video } from 'lucide-react';
import { KPI_DATA } from '../data/mockData';
import { BACKEND_URL, fetchIncidents } from '../data/api';
import HyderabadMap from '../components/HyderabadMap';
import EvidenceViewer from '../components/EvidenceViewer';
import type { Incident, IncidentStatus } from '../types';


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
    'More Evidence Requested': 'status-pending',
  };
  return map[s] || 'status-pending';
}

interface Props {
  onNavigate: (page: string) => void;
}

export default function CommandCenter({ onNavigate }: Props) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [fetchError, setFetchError] = useState(false);

  // Ref-based guard: prevents a new poll from firing while the previous request is still in-flight
  const isFetching = useRef(false);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let unmounted = false;

    const doFetch = () => {
      if (isFetching.current) return;
      isFetching.current = true;

      fetchIncidents()
        .then(next => {
          if (unmounted) return;
          setIncidents(prev => {
            const prevSig = prev.map(i => `${i.id}:${i.status}`).join(',');
            const nextSig = next.map(i => `${i.id}:${i.status}`).join(',');
            return prevSig === nextSig ? prev : next;
          });
          setFetchError(false);
          setIsLoading(false);
          setRetryCount(0);
        })
        .catch(err => {
          if (unmounted) return;
          console.warn('CommandCenter: Backend connecting/standby...', err?.message || err);

          // If no incidents have been loaded yet, initiate a graceful cold-start retry
          setIncidents(currentIncidents => {
            if (currentIncidents.length === 0) {
              setRetryCount(prevCount => {
                const nextCount = prevCount + 1;
                if (nextCount <= 5) {
                  // Safe backoff retry for Render cold start (every 3.5 seconds)
                  retryTimeoutRef.current = setTimeout(() => {
                    if (!unmounted) doFetch();
                  }, 3500);
                  setIsLoading(true);
                } else {
                  // Reached max retries: stop spinning, show explicit retry action
                  setIsLoading(false);
                  setFetchError(true);
                }
                return nextCount;
              });
            } else {
              // We already had data from a prior poll; keep it and don't disrupt the view
              setIsLoading(false);
            }
            return currentIncidents;
          });
        })
        .finally(() => {
          isFetching.current = false;
        });
    };

    // Fire immediately on mount, then poll every 15 seconds
    doFetch();
    const intervalId = setInterval(doFetch, 15_000);

    return () => {
      unmounted = true;
      clearInterval(intervalId);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    };
  }, []);

  // Derive KPI stats from live backend data; fall back gracefully
  const liveKpi = {
    totalIncidents:     incidents.length > 0 ? incidents.length          : KPI_DATA.totalIncidents,
    pendingReview:      incidents.length > 0
                          ? incidents.filter(i => i.status === 'Pending Review').length
                          : KPI_DATA.pendingReview,
    verifiedViolations: incidents.length > 0
                          ? incidents.filter(i => i.status === 'Verified').length
                          : KPI_DATA.verifiedViolations,
    critical:           incidents.length > 0
                          ? incidents.filter(i => i.severity === 'CRITICAL').length
                          : KPI_DATA.critical,
    // Resolved and camera count come from the wider mock dataset; keep as-is
    resolved:           KPI_DATA.resolved,
    activeCameras:      KPI_DATA.activeCameras,
  };

  const handleStatusUpdate = async (id: string, status: IncidentStatus) => {
    const res = await fetch(`${BACKEND_URL}/api/incidents/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `Failed to update status to ${status}`);
    }

    setIncidents(prev => prev.map(i => (i.id === id ? { ...i, status } : i)));
    setSelectedIncident(prev => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  const handleVerify = (id: string) => handleStatusUpdate(id, 'Verified');

  // Sort newest first using ISO timestamp string comparison, then filter
  const filteredIncidents = incidents
    .slice()
    .sort((a, b) => {
      const ta = a.timestamp || '';
      const tb = b.timestamp || '';
      return tb.localeCompare(ta);
    })
    .filter(inc => filterSeverity === 'ALL' || inc.severity === filterSeverity);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', flexDirection: 'column', gap: 16, padding: 24, textAlign: 'center'
      }}>
        <div style={{
          width: 54, height: 54, borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.12)', border: '2px solid var(--brand)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(59, 130, 246, 0.35)',
          animation: 'pulseGlow 2s ease infinite'
        }}>
          <Shield size={26} color="var(--brand-bright)" />
        </div>

        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>
            Connecting to TrafficGuard AI Command Center...
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
            {retryCount === 0
              ? 'Establishing secure link to Hyderabad live incident dispatch database...'
              : `Waking cloud dispatch service from standby (Render cold-start) · Reconnecting attempt ${retryCount} of 5...`}
          </p>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '4px 12px', fontSize: '0.68rem', color: 'var(--cyan)'
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)',
            animation: 'pulseDot 1.2s ease infinite'
          }} />
          <span>{retryCount > 0 ? 'CLOUD INSTANCE RESUMING' : 'CONNECTING TO SUPABASE'}</span>
        </div>

        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', maxWidth: 360, lineHeight: 1.4 }}>
          Free-tier cloud backend instances take ~25s to wake from sleep. Live incident feed will load automatically once connected.
        </span>

        <style>{`
          @keyframes pulseGlow {
            0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(59, 130, 246, 0.6); }
          }
          @keyframes pulseDot {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}</style>
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
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <div className="command-center-container">
        {fetchError && (
          <div style={{
            padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12, flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: 'var(--amber)' }}>
              <AlertTriangle size={15} />
              <span>Cloud dispatch connection in standby mode. Retrying connection to cloud server...</span>
            </div>
            <button
              onClick={() => {
                setFetchError(false);
                setIsLoading(true);
                setRetryCount(0);
                fetchIncidents()
                  .then(next => { setIncidents(next); setIsLoading(false); })
                  .catch(() => { setIsLoading(false); setFetchError(true); });
              }}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '5px 12px', background: 'var(--bg-card)' }}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Live Patrol Unit Interactive Banner */}
        <div className="live-patrol-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="badge-live-pulse">LIVE PATROL</span>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#fff' }}>
                In-Vehicle Mobile AI Patrol &amp; Optical ANPR Unit
              </strong>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Simulate patrol cruiser recording live evidence of violating vehicles, scanning registration plates &amp; issuing E-Challans.
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
              boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            <Video size={14} /> Open Live Demo Mode
          </button>
        </div>

        {/* KPI Grid — live counts from backend, trend labels from mock (no trend API) */}
        <div className="kpi-grid">
          <KPICard label="Total Incidents"     value={liveKpi.totalIncidents}     trend={KPI_DATA.trends.total}    color="blue"   icon={<AlertTriangle size={11} />} />
          <KPICard label="Pending Review"      value={liveKpi.pendingReview}      trend={KPI_DATA.trends.pending}  color="amber"  icon={<Clock size={11} />} />
          <KPICard label="Verified Violations" value={liveKpi.verifiedViolations} trend={KPI_DATA.trends.verified} color="green"  icon={<Shield size={11} />} />
          <KPICard label="Critical"            value={liveKpi.critical}           trend={KPI_DATA.trends.critical} color="red"    icon={<AlertTriangle size={11} />} />
          <KPICard label="Resolved"            value={liveKpi.resolved}           trend={KPI_DATA.trends.resolved} color="cyan"   icon={<TrendingUp size={11} />} />
          <KPICard label="Active Camera Network" value={liveKpi.activeCameras}   trend={KPI_DATA.trends.cameras}  color="violet" icon={<Camera size={11} />} />
        </div>

        {/* Map + Feed row */}
        <div className="command-grid-row">
          {/* Map */}
          <div className="card command-map-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
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
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
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
                <button
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.62rem', whiteSpace: 'nowrap' }}
                  onClick={() => onNavigate('incidents')}
                >
                  View All
                </button>
              </div>
            </div>

            <div className="incident-feed" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              {fetchError ? (
                <div className="empty-state">
                  <AlertTriangle size={32} />
                  <p style={{ fontSize: '0.78rem', marginTop: 8 }}>
                    Unable to load incidents. Please check your connection.
                  </p>
                </div>
              ) : filteredIncidents.length === 0 ? (
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
