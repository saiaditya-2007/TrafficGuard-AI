import React, { useEffect, useState } from 'react';

import EvidenceViewer from '../components/EvidenceViewer';
import type { Incident, IncidentStatus } from '../types';
import { Filter, AlertTriangle, Camera, Shield, MapPin, Clock } from 'lucide-react';
import { BACKEND_URL, fetchIncidents } from '../data/api';

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


export default function IncidentsPage() {
  const [selected, setSelected] = useState<Incident | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = () => {
      fetchIncidents()
        .then(list => {
          if (!cancelled) {
            setIncidents(list);
            setIsLoading(false);
            setRetryCount(0);
          }
        })
        .catch(error => {
          console.warn('IncidentsPage: connection standby...', error);
          if (!cancelled) {
            setRetryCount(prev => {
              const next = prev + 1;
              if (next <= 5) {
                setTimeout(() => { if (!cancelled) load(); }, 3500);
              } else {
                setIsLoading(false);
              }
              return next;
            });
          }
        });
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const handleStatusUpdate = async (id: string, status: IncidentStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/incidents/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `Failed to update status to ${status}`);
      }

      setIncidents(prev =>
        prev.map(i => (i.id === id ? { ...i, status } : i))
      );
      setSelected(prev =>
        prev && prev.id === id ? { ...prev, status } : prev
      );
    } catch (error) {
      console.error('Failed to update incident status:', error);
      throw error;
    }
  };

  const handleVerify = (id: string) => {
    return handleStatusUpdate(id, 'Verified');
  };

  const filtered = incidents.filter(inc => {
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && inc.status !== filterStatus) return false;
    if (filterType !== 'ALL' && !inc.type.includes(filterType)) return false;
    if (search && !inc.id.toLowerCase().includes(search.toLowerCase()) &&
      !inc.type.toLowerCase().includes(search.toLowerCase()) &&
      !inc.area.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      {selected && (
        <EvidenceViewer
          incident={selected}
          onClose={() => setSelected(null)}
          onVerify={handleVerify}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

      <div style={{ height: '100%', overflow: 'auto', padding: 20 }}>
        <div className="page-header">
          <div>
            <h2>Live Incident Feed</h2>
            <p>Real-time incoming violations across Hyderabad — <span style={{ color: 'var(--amber)', fontWeight: 600 }}>SIMULATED DEMO DATA</span></p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--crimson)', animation: 'pulse-green 1.5s ease infinite' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--crimson)', fontWeight: 600 }}>LIVE</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{filtered.length} incidents shown</span>
          </div>
        </div>

        {/* Filter Bar */}
        {/* Filter Bar */}
        <div className="incidents-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 200px' }}>
            <Filter size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by ID, type, area..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="incidents-search-input"
            />
          </div>
          <div className="incidents-select-group">
            <select className="filter-select" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
              <option value="ALL">All Severity</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="ALL">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Verified">Verified</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Rejected">Rejected</option>
              <option value="More Evidence Requested">More Evidence Requested</option>
            </select>
            <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="ALL">All Types</option>
              <option value="Red-Light">Red-Light</option>
              <option value="Helmet">No Helmet</option>
              <option value="Wrong-Side">Wrong-Side</option>
              <option value="Parking">Illegal Parking</option>
              <option value="Triple">Triple Riding</option>
              <option value="Mobile">Mobile Phone</option>
            </select>
            {(filterSeverity !== 'ALL' || filterStatus !== 'ALL' || filterType !== 'ALL' || search) && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => { setFilterSeverity('ALL'); setFilterStatus('ALL'); setFilterType('ALL'); setSearch(''); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Incident Table-like list */}
        {isLoading && incidents.length === 0 ? (
          <div className="card" style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)',
              border: '2px solid var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={22} color="var(--brand-bright)" />
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              Connecting to Hyderabad Incident Database...
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', maxWidth: 420 }}>
              {retryCount === 0
                ? 'Retrieving live violation records from backend...'
                : `Waking cloud service from standby (Render cold-start) · Reconnecting attempt ${retryCount} of 5...`}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state card" style={{ padding: 60 }}>
            <AlertTriangle size={36} />
            <p>No incidents match your filters.</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}
              onClick={() => { setFilterSeverity('ALL'); setFilterStatus('ALL'); setFilterType('ALL'); setSearch(''); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filtered.map(inc => (
              <div
                key={inc.id}
                className="card incident-feed-card"
                style={{
                  padding: '14px 16px', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: `3px solid ${inc.severity === 'CRITICAL' || inc.severity === 'HIGH' ? 'var(--crimson)' :
                    inc.severity === 'MEDIUM' ? 'var(--amber)' : 'var(--cyan)'}`,
                }}
                onClick={() => setSelected(inc)}
              >
                {/* Desktop Grid Layout */}
                <div className="incident-row-desktop">
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{inc.id}</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{inc.type}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />{inc.area}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    <Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{inc.time}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--cyan)' }}>
                    <Shield size={10} style={{ display: 'inline', marginRight: 3 }} />
                    AI: {inc.aiConfidence}%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    <Camera size={10} style={{ display: 'inline', marginRight: 3 }} />
                    {inc.cameraCount} cam{inc.cameraCount > 1 ? 's' : ''}
                  </div>
                  <span className={`badge ${getSeverityClass(inc.severity)}`}>{inc.severity}</span>
                  <span className={`badge ${getStatusClass(inc.status)}`}>{inc.status}</span>
                </div>

                {/* Mobile Card Layout */}
                <div className="incident-row-mobile">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{inc.id}</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className={`badge ${getSeverityClass(inc.severity)}`}>{inc.severity}</span>
                      <span className={`badge ${getStatusClass(inc.status)}`}>{inc.status}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>{inc.type}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                      <MapPin size={10} style={{ display: 'inline', marginRight: 3 }} />{inc.area}, Hyderabad
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span><Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{inc.time}</span>
                    <span style={{ color: 'var(--cyan)' }}><Shield size={10} style={{ display: 'inline', marginRight: 3 }} />AI: {inc.aiConfidence}%</span>
                    <span><Camera size={10} style={{ display: 'inline', marginRight: 3 }} />{inc.cameraCount} cam{inc.cameraCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
