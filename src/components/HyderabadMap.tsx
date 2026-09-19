import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Incident } from '../types';

// Fix Leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const SEVERITY_CONFIG = {
  CRITICAL: { color: '#EF4444', size: 14, pulse: '#EF444455' },
  HIGH:     { color: '#F97316', size: 12, pulse: '#F9731655' },
  MEDIUM:   { color: '#F59E0B', size: 10, pulse: '#F59E0B55' },
  LOW:      { color: '#06B6D4', size: 8,  pulse: '#06B6D455' },
};

function createMarkerIcon(severity: string) {
  const cfg = SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.LOW;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="${cfg.pulse}" />
      <circle cx="16" cy="16" r="${cfg.size}" fill="${cfg.color}" />
      <circle cx="16" cy="16" r="${cfg.size - 3}" fill="white" fill-opacity="0.3" />
    </svg>
  `;
  return L.divIcon({
    html: `<div style="animation: marker-pulse 2s ease infinite;">${svg}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    className: 'custom-svg-marker',
  });
}

interface Props {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
}

function MapStyler() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    if (container) {
      container.style.background = '#0A1120';
    }
  }, [map]);
  return null;
}

export default function HyderabadMap({ incidents, onSelect, height = '100%', center = [17.4401, 78.3489], zoom = 12 }: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%', background: '#0A1120', borderRadius: 0 }}
      zoomControl={true}
    >
      <MapStyler />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />

      {incidents.map(incident => (
        <Marker
          key={incident.id}
          position={incident.coordinates}
          icon={createMarkerIcon(incident.severity)}
          eventHandlers={{
            click: () => onSelect(incident),
          }}
        >
          <Popup>
            <div className="map-popup">
              <div style={{ 
                fontSize: '0.6rem', 
                color: SEVERITY_CONFIG[incident.severity as keyof typeof SEVERITY_CONFIG]?.color,
                fontWeight: 800,
                letterSpacing: '0.8px',
                marginBottom: '6px'
              }}>
                {incident.severity}
              </div>
              <div className="map-popup-type">{incident.type}</div>
              <div className="map-popup-loc">{incident.area}, Hyderabad</div>
              <div className="map-popup-loc">{incident.time}</div>
              <div className="map-popup-meta">
                <span style={{ fontSize: '0.68rem', color: 'var(--cyan)' }}>
                  {incident.aiConfidence}% AI Confidence
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {incident.cameraCount} cam{incident.cameraCount > 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={() => onSelect(incident)}
                style={{
                  marginTop: '10px',
                  width: '100%',
                  background: 'var(--brand)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  padding: '6px',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                View Details →
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
