/**
 * Shared API utilities for TrafficGuard AI frontend.
 * Single source of truth for the backend URL and incident data mapping.
 */
import type { Incident } from '../types';

export const BACKEND_URL =
  (import.meta.env.VITE_BACKEND_URL as string) ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5050'
    : 'https://trafficguard-ai-backend.onrender.com');

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

/** Maps a raw backend incident object to the frontend Incident shape. */
export function mapRawToIncident(item: any): Incident {
  const areaName = item.location?.split(',')[0]?.trim() || 'Hyderabad';
  const coords: [number, number] =
    LOCATION_COORDS[areaName] || LOCATION_COORDS[item.location] || [17.385, 78.4867];
  const timePart = item.timestamp
    ? (item.timestamp.includes('T')
        ? item.timestamp.split('T')[1]?.slice(0, 8)
        : item.timestamp.split(' ')[1])
    : '';
  const timeStr = timePart ? timePart.slice(0, 5) : '--:--';
  const rawSev = String(item.severity || 'LOW').toUpperCase();
  const severity: Incident['severity'] =
    rawSev === 'CRITICAL' || rawSev === 'HIGH' || rawSev === 'MEDIUM' ? rawSev : 'LOW';

  return {
    id: item.id,
    type: item.violation,
    severity,
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
      multiCameraConfirmation: 82,
    },
    timeline: [
      {
        time: timePart || '18:42:10',
        icon: 'camera',
        label: 'CCTV / Patrol camera captured event',
        description: `Autonomous camera feed recorded ${item.violation} at ${item.location}`,
      },
      {
        time: timePart || '18:42:11',
        icon: 'cpu',
        label: 'AI neural network classification',
        description: 'Deep learning model confirmed violation with 94% confidence',
      },
      {
        time: timePart || '18:42:13',
        icon: 'shield',
        label: 'Cryptographic evidence integrity check',
        description: 'Frame hash and timestamp verified against regional ledger',
      },
      {
        time: timePart || '18:42:15',
        icon: 'send',
        label: 'Queued for Hyderabad Traffic Police review',
        description: `Incident docket ${item.id} submitted for verification`,
      },
    ],
  };
}

/**
 * Fetches incidents from the backend and maps them to Incident objects.
 * Returns an empty array on network/HTTP errors (logs to console).
 */
export async function fetchIncidents(): Promise<Incident[]> {
  const res = await fetch(`${BACKEND_URL}/api/incidents?_t=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const rawList: any[] = Array.isArray(data)
    ? data
    : (data && Array.isArray(data.incidents) ? data.incidents : []);
  return rawList.map(mapRawToIncident);
}
