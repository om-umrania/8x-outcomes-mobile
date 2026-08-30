export type MissionChannel = 'text' | 'voice';
export type CaptureKind = 'screen' | 'voice';
export type WorkerMissionStatus = 'available' | 'in_progress' | 'completed' | 'declined';

export interface CapabilityUnlock {
  id: string;
  label: string;
  tags: string[];
}

export interface WorkerMission {
  id: string;
  outcomeContext: string;
  title: string;
  request: string;
  estimatedMinutes: number;
  channel: MissionChannel;
  captureKind: CaptureKind;
  isAdaptive: boolean;
  adaptiveReason?: string;
  questions: string[];
  /** True for the one Resume-to-Mission Bridge baseline mission — routes to /first-node on submit. */
  isCalibration?: boolean;
  /** Fictional attached source file shown on the mission detail card; not a real download. */
  resourceLabel?: string;
  /** Only present on the calibration mission — the capability node it seeds on submit. */
  capabilityUnlocked?: CapabilityUnlock;
}

export interface CapabilityDimension {
  id: string;
  label: string;
  processContribution: number;
  outcomeContribution: number;
  signalLabel: string;
}

export interface MissionHistoryItem {
  id: string;
  title: string;
  completedLabel: string;
  channel: MissionChannel;
}

export type CapabilitySignal = 'process' | 'outcome';

export interface CapabilityEvidencePoint {
  missionId: string;
  missionTitle: string;
  completedLabel: string;
  signal: CapabilitySignal;
  /** How much this one mission moved this dimension, 0-100. */
  contribution: number;
  /** Short fictional observation — what was actually seen, not a self-report. */
  note: string;
}

export interface CapabilityDimensionDetail {
  id: string;
  /** Plain-language description of what this dimension actually measures. */
  description: string;
  /** Confidence in this dimension over recent missions, oldest first, 0-100. */
  trend: number[];
  evidence: CapabilityEvidencePoint[];
}

export interface WorkerState {
  selectedMissionId: string | null;
  activeCaptureMissionId: string | null;
  missionStatuses: Record<string, WorkerMissionStatus>;
  consentByMission: Record<string, boolean>;
  submissions: Record<string, string[]>;
  lastSubmittedMissionId: string | null;
}

export type WorkerAction =
  | { type: 'SELECT_MISSION'; missionId: string }
  | { type: 'SET_CONSENT'; missionId: string; consented: boolean }
  | { type: 'START_MISSION'; missionId: string }
  | { type: 'SUBMIT_MISSION'; missionId: string; answers: string[] }
  | { type: 'DECLINE_MISSION'; missionId: string };
