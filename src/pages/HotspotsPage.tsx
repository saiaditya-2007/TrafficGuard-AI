import React, { useState } from 'react';
import { Flame, TrendingUp, TrendingDown, Clock, AlertTriangle, MapPin } from 'lucide-react';
import { HOTSPOTS } from '../data/mockData';
import HyderabadMap from '../components/HyderabadMap';
import type { Incident } from '../types';

// Convert hotspots to incident-like objects for map rendering
const hotspotAsIncidents: Incident[] = HOTSPOTS.map(h => ({
  id: `HS-${h.rank}`,
  type: h.violationTypes[0] as any,
  severity: h.risk === 'HIGH' ? 'CRITICAL' : h.risk === 'MEDIUM' ? 'HIGH' : 'MEDIUM',
  location: h.name,
  area: h.area,
  coordinates: h.coordinates,
  time: h.peakHours,
  timestamp: h.peakHours,
  aiConfidence: 95,
  trustScore: 90,
  cameraCount: 3,
  status: 'Pending Review',
  description: `${h.incidents} incidents recorded`,
  trustBreakdown: {
    imageQuality: 92, aiConfidence: 95, locationConsistency: 97,
    timestampIntegrity: 99, multiCameraConfirmation: 90
  },
  timeline: [],
}));

export default function HotspotsPage() {
  const [selected, setSelected] = useState<typeof HOTSPOTS[0] | null>(null);

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="page-header">
          <div>
            <h2>Road Safety Hotspots</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: 4 }}>
              High-risk areas identified from AI analysis of incident patterns · Hyderabad
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              padding: '6px 12px', background: 'var(--crimson-dim)',
              border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Clock size={12} color="var(--crimson)" />
              <span style={{ fontSize: '0.7rem', color: 'var(--crimson)', fontWeight: 600 }}>
                Peak violation period: 6 PM – 9 PM
              </span>
            </div>
            <span style={{ fontSize: '0.6rem', color: 'var(--amber)', fontWeight: 700,
              background: 'var(--amber-dim)', padding: '4px 10px', borderRadius: 4 }}>
              ⚠ SIMULATED DATA
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 16, minHeight: 480 }}>
          {/* Map */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <span className="card-title"><MapPin size={12} style={{ display: 'inline', marginRight: 6 }} />Hotspot Map — Hyderabad</span>
            </div>
            <div style={{ height: 420 }}>
              <HyderabadMap
                incidents={hotspotAsIncidents}
                onSelect={() => {}}
                height="100%"
              />
            </div>
            <div style={{
              padding: '8px 12px', background: 'var(--bg-card)',
              borderTop: '1px solid var(--border)',
              fontSize: '0.68rem', color: 'var(--text-muted)'
            }}>
              Marker size indicates relative incident density. Click markers for area details.
            </div>
          </div>

          {/* Hotspot ranking */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {HOTSPOTS.map(h => (
              <div
                key={h.rank}
                className="hotspot-card"
                style={{ border: selected?.rank === h.rank ? '1px solid var(--brand)' : undefined }}
                onClick={() => setSelected(selected?.rank === h.rank ? null : h)}
              >
                <div className={`hotspot-rank ${h.rank <= 3 ? `rank-${h.rank}` : 'rank-other'}`}>
                  #{h.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{h.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    {h.area} · {h.incidents} incidents
                  </div>
                  {selected?.rank === h.rank && (
                    <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {h.violationTypes.map(vt => (
                        <span key={vt} style={{
                          fontSize: '0.6rem', padding: '2px 7px',
                          background: 'var(--bg-elevated)', borderRadius: 10,
                          border: '1px solid var(--border)', color: 'var(--text-secondary)'
                        }}>{vt}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <span className={`badge ${h.risk === 'HIGH' ? 'critical' : h.risk === 'MEDIUM' ? 'medium' : 'low'}`}>
                    {h.risk} RISK
                  </span>
                  <div style={{ fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: 3 }}>
                    {h.trend > 0 ? (
                      <><TrendingUp size={10} color="var(--crimson)" /><span style={{ color: 'var(--crimson)' }}>+{h.trend}</span></>
                    ) : (
                      <><TrendingDown size={10} color="var(--emerald)" /><span style={{ color: 'var(--emerald)' }}>{h.trend}</span></>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'High Risk Zones', value: HOTSPOTS.filter(h => h.risk === 'HIGH').length, color: 'var(--crimson)', icon: <Flame size={16} /> },
            { label: 'Medium Risk Zones', value: HOTSPOTS.filter(h => h.risk === 'MEDIUM').length, color: 'var(--amber)', icon: <AlertTriangle size={16} /> },
            { label: 'Total Hotspot Incidents', value: HOTSPOTS.reduce((s, h) => s + h.incidents, 0), color: 'var(--brand)', icon: <MapPin size={16} /> },
            { label: 'Peak Hours', value: '6–9 PM', color: 'var(--violet)', icon: <Clock size={16} /> },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
