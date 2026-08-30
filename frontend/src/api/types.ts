// Shared domain types for the 8x Worker app.

export type MissionType = "voice" | "text";

export interface MissionSummary {
  id: string;
  company: string;
  companyLogo?: string | null;
  title: string;
  purpose: string;
  action: string;
  durationLabel: string;
  durationMinutes: number;
  type: MissionType;
  status: string;
  isExtra: boolean;
  urgency?: string | null;
}

export interface MissionQuestion {
  id: string;
  prompt: string;
  placeholder: string;
}

export interface MissionVoiceMeta {
  agentName: string;
  introLine: string;
  consentTitle: string;
  consentBody: string;
}

export interface MissionDetail extends MissionSummary {
  bgImage?: string | null;
  context: string;
  scenario?: string | null;
  requiresConsent: boolean;
  voice?: MissionVoiceMeta | null;
  questions: MissionQuestion[];
}

export interface CapabilityDimension {
  key: string;
  label: string;
  description: string;
  process: number;
  outcome: number;
}

export interface CapabilityProfile {
  headline: string;
  subtitle: string;
  observedMissions: number;
  processLabel: string;
  outcomeLabel: string;
  dimensions: CapabilityDimension[];
}

export interface HistoryItem {
  id: string;
  title: string;
  company: string;
  date: string;
  type: MissionType;
  summary: string;
}

export interface SubmissionPayload {
  missionId: string;
  type: MissionType;
  answers?: { questionId: string; answer: string }[];
  durationSeconds?: number;
  recorded?: boolean;
  consent?: boolean;
}

export interface SubmissionResult {
  ok: boolean;
  submissionId: string;
  message: string;
}
