export type UserRole =
  | 'Investigator'
  | 'Senior Officer'
  | 'Forensic Officer'
  | 'System Administrator';

export type ModuleId =
  | 'command-centre'
  | 'cases'
  | 'workspace'
  | 'mobile-intelligence'
  | 'location-intelligence'
  | 'cctv-intelligence'
  | 'vehicle-intelligence'
  | 'ai-engine'
  | 'relationship-explorer'
  | 'digital-evidence'
  | 'reports'
  | 'collaboration'
  | 'admin-audit';

export type VerificationStatus =
  | 'Verified'
  | 'Pending Verification'
  | 'Requires Clarification'
  | 'Inconclusive'
  | 'Contradicted'
  | 'Unverified AI Lead'
  | 'Rejected';

export interface CaseRecord {
  id: string;
  title: string;
  category: string;
  status: 'Active — Priority Verification' | 'Under Review' | 'Evidence Preservation' | 'Closed';
  incidentDate: string;
  lastConfirmedSightingTime: string;
  complaintReceivedTime: string;
  incidentLocation: string;
  coordinates: [number, number];
  victimAlias: string;
  victimDescription: string;
  assignedInvestigator: string;
  supervisingOfficer: string;
  forensicLead: string;
  summary: string;
  authorisationRef: string;
  jurisdiction: string;
  evidenceCount: number;
  leadsCount: number;
  pendingRequestsCount: number;
}

export interface DeviceRecord {
  id: string; // DEV-001 through DEV-030
  label: string;
  category: 'Victim Device' | 'Contextual Field Device' | 'Resident / Commuter Device' | 'Unattributed Device' | 'Service / Delivery Device';
  ownerNote: string;
  imeiMask: string;
  firstObserved: string;
  lastObserved: string;
  sectorIds: string[];
  observationsCount: number;
  relevanceStatus: 'Primary Subject Device' | 'Co-located Observation' | 'Routine Background Traffic' | 'Contradictory / Alibi Supported' | 'Inactive After Window';
  confidenceNote: string;
  limitations: string;
  alternativeExplanation: string;
  observations: DeviceObservation[];
}

export interface DeviceObservation {
  obsId: string;
  deviceId: string;
  timestamp: string;
  timeMinutes: number; // minutes from 00:00 (e.g., 18:30 = 1110)
  cellSectorId: string;
  cellSectorName: string;
  approxCoordinates: [number, number];
  sectorRadiusMeters: number;
  azimuthDeg: number;
  eventType: 'Periodic Network Registration' | 'Voice Call Setup' | 'Packet Data Session' | 'Handover Event' | 'Signal Loss / Last Seen';
  sourceRecordRef: string;
  authorisationRef: string;
  signalQuality: 'High (Urban Micro-cell)' | 'Medium (Macro Sector)' | 'Low (Boundary Overlap)';
  isRelevantWindow: boolean;
  notes: string;
}

export type CameraStatus =
  | 'Footage received'
  | 'Footage available'
  | 'Request pending'
  | 'Awaiting response'
  | 'Footage unavailable'
  | 'Retention period expired';

export interface CctvCamera {
  id: string; // CAM-001 through CAM-020
  name: string;
  ownerEstablishment: string;
  category: 'Municipal Traffic Grid' | 'Commercial Establishment' | 'Residential Association' | 'Transit Corridor';
  locationName: string;
  coordinates: [number, number];
  directionDeg: number;
  directionLabel: string;
  coverageRadiusMeters: number;
  fovDeg: number;
  cameraType: 'Fixed IP 4K' | 'PTZ Dome HD' | 'ANPR LPR Lane Camera' | 'Entry Gate IR Camera';
  recordingPeriod: string;
  retentionPeriod: string;
  footageStatus: CameraStatus;
  requestStatus: 'Not Requested' | 'Request Submitted' | 'Pending Custodian Action' | 'Received & Hashed' | 'Unavailable / Expired';
  distanceFromIncidentMeters: number;
  isRelevantToCorridor: boolean;
  evidenceRef?: string;
  sha256?: string;
  videoReviewStatus?: 'Reviewed — Observation Logged' | 'Reviewed — No Relevant Activity' | 'Pending Review' | 'N/A';
  reviewerNotes?: string;
  extractedObservations: VideoObservation[];
}

export interface VideoObservation {
  id: string;
  cameraId: string;
  timestamp: string;
  videoTimecode: string;
  description: string;
  objectType: 'Vehicle' | 'Pedestrian Activity' | 'Lighting / Obstruction' | 'No Relevant Activity';
  linkedVehicleId?: string;
  reviewClassification: 'Relevant — Requires Verification' | 'Inconclusive' | 'Not Relevant / Rejected';
  reviewer: string;
  evidenceRef: string;
  notes: string;
}

export interface CctvFootageRequest {
  requestId: string;
  cameraId: string;
  cameraName: string;
  ownerEstablishment: string;
  requestedDate: string;
  requestedTimeRange: string;
  priority: 'Critical Preservation' | 'High' | 'Standard';
  status: 'Submitted' | 'Pending' | 'Received' | 'Unavailable';
  preservationDeadline: string;
  requestedBy: string;
  createdAt: string;
  authorisationRef: string;
}

export type VehicleVerificationComparison =
  | 'Confirmed same vehicle'
  | 'Possibly related vehicle'
  | 'Not the same vehicle'
  | 'Inconclusive';

export interface VehicleRecord {
  id: string; // VEH-001 through VEH-008
  label: string;
  vehicleType: 'Compact White SUV' | 'Silver Hatchback' | 'White Commercial Van' | 'Dark Grey Sedan' | 'White SUV (Fleet Cab)' | 'Two-Wheeler Delivery' | 'Blue Crossover SUV' | 'White SUV (Resident)';
  color: string;
  syntheticRegObservation: string;
  regConfidence: 'Partial Characters Observed' | 'Full Read (Verified Fleet)' | 'Obscured / Glare' | 'Standard Resident Pass';
  verificationStatus: VehicleVerificationComparison;
  summaryNotes: string;
  limitations: string;
  sightings: VehicleSighting[];
}

export interface VehicleSighting {
  sightingId: string;
  vehicleId: string;
  cameraId: string;
  cameraName: string;
  locationName: string;
  coordinates: [number, number];
  timestamp: string;
  timeMinutes: number;
  direction: string;
  evidenceRef: string;
  observationNote: string;
  visualMatchNote: string;
}

export interface InvestigativeLead {
  id: string; // LEAD-001 through LEAD-006
  title: string;
  caseId: string;
  priority: 'Priority 1 — Immediate Verification' | 'Priority 2 — High Analytical Value' | 'Priority 3 — Routine Clarification';
  category: 'Device Correlation' | 'Vehicle Corridor' | 'Witness Discrepancy' | 'Timeline Anomaly' | 'Coverage Gap' | 'Cross-Case Pattern';
  observationSummary: string;
  relatedEntities: string[];
  supportingEvidence: string[];
  contradictoryEvidence: string[];
  alternativeExplanations: string[];
  limitations: string;
  evidenceReferences: string[];
  recommendedVerification: string;
  reviewStatus: 'Awaiting Investigator Review' | 'Marked for Further Verification' | 'Clarification Requested' | 'Rejected by Investigator';
  rejectionReason?: string;
  investigatorNotes: string[];
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeMinutes: number; // for slider synchronization
  date: string;
  title: string;
  description: string;
  sourceType: 'Incident Report' | 'Mobile Intelligence' | 'CCTV Observation' | 'Vehicle Sighting' | 'Witness Statement' | 'Evidence Ingestion' | 'Investigator Action' | 'AI Lead Generated';
  categoryType: 'Fact (Verified)' | 'Observation (Source Recorded)' | 'Hypothesis / Lead (Unverified)' | 'Contradictory / Exculpatory';
  entityIds: string[];
  locationName: string;
  coordinates?: [number, number];
  evidenceRef: string;
  provenance: string;
  authorisationRef: string;
  verificationStatus: VerificationStatus;
  limitationsNote: string;
}

export interface DigitalEvidenceItem {
  id: string; // EVD-001 onwards
  caseId: string;
  title: string;
  evidenceType: 'Telecom CDR / Tower Dump' | 'CCTV Video Container (.MP4)' | 'Witness Audio / Transcript (.PDF)' | 'ANPR Corridor Log (.CSV)' | 'Forensic Field Extraction (.UFED-SYN)' | 'Case Registration FIR-SYN';
  source: string;
  originalFilename: string;
  fileSize: string;
  collectionDateTime: string;
  uploadDateTime: string;
  collector: string;
  sha256Hash: string;
  originalFileRef: string;
  workingCopyRef: string;
  artifactClassification: 'Original Evidence (Immutable)' | 'Working Copy' | 'Derived Observation' | 'AI-Generated Interpretation' | 'Investigator Conclusion';
  reviewStatus: 'Integrity Verified' | 'Pending Forensic Check' | 'Preservation Hold Active';
  authorisationRef: string;
  notes: string;
  chainOfCustody: CustodyEvent[];
  accessHistory: AccessEvent[];
}

export interface CustodyEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  role: string;
  hashVerified: boolean;
  notes: string;
}

export interface AccessEvent {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  operation: 'Viewed Metadata' | 'Verified SHA-256' | 'Exported Working Copy' | 'Linked to Timeline';
}

export interface GraphNode {
  id: string;
  label: string;
  subLabel: string;
  type: 'Case' | 'Person' | 'Device' | 'Vehicle' | 'Location' | 'Camera' | 'Evidence' | 'Witness' | 'Organisation';
  x: number;
  y: number;
  status: string;
  details: string;
  limitations: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationshipType: 'Observed at' | 'Referenced in' | 'Recorded by' | 'Associated with' | 'Linked to evidence' | 'Investigative lead' | 'Contradicted by';
  classification: 'Verified relationship' | 'Observed association' | 'AI-suggested relationship' | 'Rejected relationship';
  sourceEvidence: string;
  observationTime: string;
  reliability: 'High (Direct Documentary)' | 'Moderate (Approximate Spatial/Visual)' | 'Requires Verification (Analytical Lead)';
  limitations: string;
}

export interface CollaborationTask {
  id: string;
  title: string;
  caseId: string;
  requestType: 'CCTV Preservation Order' | 'Forensic Hash Verification' | 'Lead Verification Sign-off' | 'Cross-Unit Query Approval';
  requestedBy: string;
  assignedRole: UserRole;
  priority: 'Urgent' | 'High' | 'Routine';
  status: 'Pending Approval' | 'Approved' | 'Completed' | 'Clarification Needed';
  createdAt: string;
  notes: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  module: string;
  action: string;
  targetRef: string;
  details: string;
  ipSimulated: string;
}

