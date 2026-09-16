import React, { useState } from 'react';
import HyderabadMap from '../components/HyderabadMap';
import EvidenceViewer from '../components/EvidenceViewer';
import { INCIDENTS } from '../data/mockData';
import type { Incident } from '../types';
import { Filter } from 'lucide-react';

export default function LiveMapPage() {
  const [selected, setSelected] = useState<Incident | null>(null);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filtered = INCIDENTS.filter(inc => {
    if (filterSeverity !== 'ALL' && inc.severity !== filterSeverity) return false;
    if (filterType !== 'ALL' && !inc.type.includes(filterType)) return false;
    if (filterStatus !== 'ALL' && inc.status !== filterStatus) return false;
    return true;
  });

  return (
    <>
      {selected && (
        <EvidenceViewer
          incident={selected}
          onClose={() => setSelected(null)}
          onVerify={() => setSelected(null)}
        />
      )}

      <div className="map-page" style={{ height: '100%' }}>
        {/* Controls bar */}
        <div className="map-controls">
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>

          <select className="filter-select" value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}>
            <option value="ALL">All Severity</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="ALL">All Violations</option>
            <option value="Red-Light">Red-Light</option>
            <option value="Helmet">No Helmet</option>
            <option value="Wrong-Side">Wrong-Side</option>
            <option value="Parking">Illegal Parking</option>
            <option value="Triple">Triple Riding</option>
            <option value="Seat Belt">Seat Belt</option>
            <option value="Lane">Lane Violation</option>
          </select>

          <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Verified">Verified</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Rejected">Rejected</option>
          </select>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {filtered.length} incident{filtered.length !== 1 ? 's' : ''} shown
            </span>
            <span style={{ fontSize: '0.6rem', color: 'var(--amber)', fontWeight: 700,
              background: 'var(--amber-dim)', padding: '2px 8px', borderRadius: 4 }}>
              ⚠ SIMULATED DEMO DATA
            </span>
          </div>
        </div>

        {/* Severity Legend */}
        <div style={{
          display: 'flex', gap: 16, padding: '6px 16px',
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600 }}>LEGEND:</span>
          {[
            { label: 'Critical', color: '#EF4444' },
            { label: 'High',     color: '#F97316' },
            { label: 'Medium',   color: '#F59E0B' },
            { label: 'Low',      color: '#06B6D4' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Full-screen Map */}
        <div className="map-full">
          <HyderabadMap
            incidents={filtered}
            onSelect={setSelected}
            height="100%"
            zoom={12}
          />
        </div>
      </div>
    </>
  );
}
