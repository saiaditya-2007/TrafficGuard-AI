export interface Incident {
  id: string;
  type: ViolationType;
  severity: Severity;
  location: string;
  area: string;
  coordinates: [number, number];
  time: string;
  timestamp: string;
  aiConfidence: number;
  trustScore: number;
  cameraCount: number;
  status: IncidentStatus;
  description: string;
  trustBreakdown: TrustBreakdown;
  timeline: TimelineEvent[];
}

export type ViolationType =
  | 'Red-Light Violation'
  | 'No Helmet'
  | 'Wrong-Side Driving'
  | 'Illegal Parking'
  | 'Triple Riding'
  | 'Seat Belt Violation'
  | 'Lane Violation'
  | 'Overspeeding';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus = 'Pending Review' | 'Verified' | 'Rejected' | 'Under Investigation' | 'Resolved';

export interface TrustBreakdown {
  imageQuality: number;
  aiConfidence: number;
  locationConsistency: number;
  timestampIntegrity: number;
  multiCameraConfirmation: number;
}

export interface TimelineEvent {
  time: string;
  icon: string;
  label: string;
  description: string;
}

export interface Hotspot {
  rank: number;
  name: string;
  area: string;
  coordinates: [number, number];
  incidents: number;
  risk: 'HIGH' | 'MEDIUM' | 'LOW';
  peakHours: string;
  violationTypes: string[];
  trend: number;
}

export interface AnalyticsData {
  violationsByType: { name: string; count: number; color: string }[];
  violationsByHour: { hour: string; count: number }[];
  weeklyTrend: { day: string; incidents: number; verified: number }[];
  areaComparison: { area: string; incidents: number; resolved: number }[];
  resolutionStats: { status: string; count: number; color: string }[];
}

export interface AiInsight {
  id: string;
  area: string;
  title: string;
  observation: string;
  suggestion: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  incidentCount: number;
  trend: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface KPIData {
  totalIncidents: number;
  pendingReview: number;
  verifiedViolations: number;
  critical: number;
  resolved: number;
  activeCameras: number;
  trends: {
    total: string;
    pending: string;
    verified: string;
    critical: string;
    resolved: string;
    cameras: string;
  };
}

export type NavPage =
  | 'landing'
  | 'overview'
  | 'incidents'
  | 'map'
  | 'evidence'
  | 'analytics'
  | 'hotspots'
  | 'insights'
  | 'assistant'
  | 'citizen'
  | 'privacy'
  | 'settings'
  | 'live-demo';

export interface LivePatrolScenario {
  id: string;
  name: string;
  location: string;
  area: string;
  speedLimit: number;
  patrolSpeed: number;
  violationType: ViolationType;
  violatorVehicle: string;
  numberPlate: string;
  plateConfidence: number;
  aiConfidence: number;
  fineAmount: number;
  challanCode: string;
  videoUrl?: string;
  contextImage: string;
  vehicleImage: string;
  plateCoordinates: { x: number; y: number; width: number; height: number };
  vehicleCoordinates: { x: number; y: number; width: number; height: number };
  description: string;
}

export interface LiveEvidencePacket {
  id: string;
  timestamp: string;
  location: string;
  patrolUnit: string;
  officerId: string;
  violation: ViolationType;
  severity: Severity;
  targetVehicle: string;
  licensePlate: string;
  plateConfidence: number;
  aiConfidence: number;
  fineAmount: number;
  sha256Hash: string;
  wideImage: string;
  cropImage: string;
  plateImage: string;
  status: 'CAPTURED' | 'DISPATCHED_TO_COMMAND' | 'VERIFIED';
}

