import React, { useEffect, useState } from 'react';

import EvidenceViewer from '../components/EvidenceViewer';
import type { Incident } from '../types';
import { Filter, AlertTriangle, Camera, Shield, MapPin, Clock } from 'lucide-react';

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

const LOCATION_COORDS: Record<string, [number, number]> = {
  'Tank Bund': [17.4239, 78.4738],
  'Hitech City Road': [17.4435, 78.3772],
  'Hitech City': [17.4435, 78.3772],
  'Kukatpally': [17.4849, 78.4138],
  'Outer Ring Road (ORR Gantry #12)': [17.412, 78.324],
  'Outer Ring Road': [17.412, 78.324],
  'Ameerpet Commercial Corridor': [17.4375, 78.4482],
  'Ameerpet': [17.4375, 78.4482],
  'Begumpet Expressway Flyover Ramp': [17.4447, 78.4664],
  'Begumpet': [17.4447, 78.4664],
  'KBR Park Junction Signal': [17.4265, 78.4184],
  'KBR Park': [17.4265, 78.4184],
  'Road No. 12, Banjara Hills': [17.4156, 78.4350],
  'Banjara Hills': [17.4156, 78.4350],
};

function mapRawToIncident(item: any): Incident {
  const areaName = item.location?.split(',')[0]?.trim() || 'Hyderabad';
  const coords = LOCATION_COORDS[areaName] || LOCATION_COORDS[item.location] || [17.385, 78.4867];
  const timePart = item.timestamp
    ? (item.timestamp.includes('T') ? item.timestamp.split('T')[1]?.slice(0, 8) : item.timestamp.split(' ')[1])
    : '';
  const timeStr = timePart ? timePart.slice(0, 5) : '--:--';

  return {
    id: item.id,
    type: item.violation,
    severity: String(item.severity).toUpperCase() as Incident['severity'],
    location: item.location,
    area: areaName,
    coordinates: coords,
    time: timeStr,
    timestamp: item.timestamp,
    aiConfidence: 94,
    trustScore: 90,
    cameraCount: 1,
    status: item.status,
    description: `${item.violation} detected at ${item.location}`,
    trustBreakdown: {
      imageQuality: 87,
      aiConfidence: 94,
      locationConsistency: 91,
      timestampIntegrity: 98,
      multiCameraConfirmation: 82
    },
    timeline: [
      {
        time: timePart || '18:42:10',
        icon: 'camera',
        label: 'CCTV / Patrol camera captured event',
        description: `Autonomous camera feed recorded ${item.violation} at ${item.location}`
      },
      {
        time: timePart || '18:42:11',
        icon: 'cpu',
        label: 'AI neural network classification',
        description: 'Deep learning model confirmed violation with 94% confidence'
      },
      {
        time: timePart || '18:42:13',
        icon: 'shield',
        label: 'Cryptographic evidence integrity check',
        description: 'Frame hash and timestamp verified against regional ledger'
      },
      {
        time: timePart || '18:42:15',
        icon: 'send',
        label: 'Queued for Hyderabad Traffic Police review',
        description: `Incident docket ${item.id} submitted for verification`
      }
    ]
  };
}

export default function IncidentsPage() {
  const [selected, setSelected] = useState<Incident | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    fetch('https://trafficguard-ai-backend.onrender.com/api/incidents')
      .then(res => res.json())
      .then(data => {
        let rawList: any[] = Array.isArray(data.incidents) ? data.incidents : [];
        try {
          const stored = JSON.parse(sessionStorage.getItem('trafficguard_demo_incidents') || '[]');
          if (Array.isArray(stored) && stored.length > 0) {
            const existingIds = new Set(rawList.map((i: any) => i.id));
            const extra = stored.filter((i: any) => !existingIds.has(i.id));
            rawList = [...extra, ...rawList];
          }
        } catch {
          // ignore session storage error
        }

        const backendIncidents: Incident[] = rawList.map(mapRawToIncident);
        setIncidents(backendIncidents);
        console.log('TRAFFICGUARD INCIDENTS:', backendIncidents);
      })
      .catch(error => {
        console.error('Failed to load incidents:', error);
        try {
          const stored = JSON.parse(sessionStorage.getItem('trafficguard_demo_incidents') || '[]');
          const defaultItems = [
            {
              id: 'TG001',
              violation: 'No Helmet',
              vehicleNumber: 'TS09AB1234',
              location: 'Tank Bund, Hyderabad',
              status: 'Pending Review',
              severity: 'Medium',
              timestamp: '2026-09-16 18:42:10'
            },
            {
              id: 'TG002',
              violation: 'Using Mobile Phone',
              vehicleNumber: 'TS10CD5678',
              location: 'Hitech City Road, Hyderabad',
              status: 'Verified',
              severity: 'High',
              timestamp: '2026-09-16 18:35:24'
            },
            {
              id: 'TG003',
              violation: 'Triple Riding',
              vehicleNumber: 'TS08EF9012',
              location: 'Kukatpally, Hyderabad',
              status: 'Pending Review',
              severity: 'High',
              timestamp: '2026-09-16 18:21:45'
            }
          ];
          const existingIds = new Set(defaultItems.map(i => i.id));
          const extra = Array.isArray(stored) ? stored.filter((i: any) => !existingIds.has(i.id)) : [];
          const combined = [...extra, ...defaultItems].map(mapRawToIncident);
          setIncidents(combined);
        } catch {}
      });
  }, []);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch(`https://trafficguard-ai-backend.onrender.com/api/incidents/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Verified' }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to verify incident');
      }

      setIncidents(prev =>
        prev.map(i =>
          i.id === id ? { ...i, status: 'Verified' } : i
        )
      );

      // Also update sessionStorage if present
      try {
        const stored = JSON.parse(sessionStorage.getItem('trafficguard_demo_incidents') || '[]');
        if (Array.isArray(stored)) {
          const updated = stored.map((item: any) => item.id === id ? { ...item, status: 'Verified' } : item);
          sessionStorage.setItem('trafficguard_demo_incidents', JSON.stringify(updated));
        }
      } catch {}

      setSelected(null);
    } catch (error) {
      console.error('Failed to verify incident:', error);
    }
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
        <div style={{
          display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center',
          padding: '12px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)'
        }}>
          <Filter size={13} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by ID, type, area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '6px 12px', color: 'var(--text-primary)',
              fontSize: '0.75rem', outline: 'none', width: 200, fontFamily: 'Inter, sans-serif'
            }}
          />
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
          </select>
          <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="ALL">All Types</option>
            <option value="Red-Light">Red-Light</option>
            <option value="Helmet">No Helmet</option>
            <option value="Wrong-Side">Wrong-Side</option>
            <option value="Parking">Illegal Parking</option>
            <option value="Triple">Triple Riding</option>
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

        {/* Incident Table-like list */}
        {filtered.length === 0 ? (
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
                className="card"
                style={{
                  padding: '14px 16px', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: `3px solid ${inc.severity === 'CRITICAL' ? 'var(--crimson)' :
                    inc.severity === 'HIGH' ? 'var(--orange)' :
                      inc.severity === 'MEDIUM' ? 'var(--amber)' : 'var(--cyan)'}`,
                }}
                onClick={() => setSelected(inc)}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 100px 100px 80px 120px', gap: 12, alignItems: 'center' }}>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
