export type ArchitectureTier = 'ai-native' | 'hybrid' | 'human-heavy' | 'high-stakes';

export interface ComplexityBreakdown {
  ambiguity: number;
  humanNecessity: number;
  evidenceRequirement: number;
  dependencyDepth: number;
  contextDiversity: number;
  risk: number;
  toolComplexity: number;
  uncertainty: number;
}

export interface ComplexityResult {
  breakdown: ComplexityBreakdown;
  score: number; // 0-100, rounded weighted composite
  tier: ArchitectureTier;
  humanNecessityScore: number;
  rationale: string;
}

export type ConceptualComponent =
  | 'complexity-engine'
  | 'outcome-planner'
  | 'ai-executor'
  | 'human-router'
  | 'evaluator';

export type MissionKind = 'ai_task' | 'human_mission';
export type MissionStatus = 'pending' | 'matched' | 'in_progress' | 'submitted' | 'evaluated';

export interface Mission {
  id: string;
  kind: MissionKind;
  title: string;
  description: string;
  cohortTag?: string;
  status: MissionStatus;
  spawnedBy: 'initial' | 'adaptive';
  createdAtIteration: number;
}

export interface HumanMatch {
  id: string;
  cohortTag: string;
  matchScore: number; // 0-100
}

export interface EvidenceEvent {
  id: string;
  missionId: string;
  type: 'execution_started' | 'execution_progress' | 'evidence_submitted' | 'evidence_evaluated';
  message: string;
  timestamp: number;
}

export interface ConfidencePoint {
  iteration: number;
  confidence: number; // 0-1
  label: string;
  timestamp: number;
}

export interface Gap {
  id: string;
  label: string;
  detectedAtIteration: number;
}

export interface Decision {
  recommendation: string;
  confidence: number;
  evidenceSummary: string[];
  nextExperiment: string;
}

export type RunStatus =
  | 'idle'
  | 'analyzing'
  | 'planned'
  | 'matching'
  | 'executing'
  | 'adapting'
  | 'resolved';

export interface RunState {
  outcomeText: string;
  status: RunStatus;
  complexity: ComplexityResult | null;
  missions: Mission[];
  humanMatches: HumanMatch[];
  events: EvidenceEvent[];
  confidenceHistory: ConfidencePoint[];
  gaps: Gap[];
  iteration: number;
  decision: Decision | null;
}

export const initialRunState: RunState = {
  outcomeText: '',
  status: 'idle',
  complexity: null,
  missions: [],
  humanMatches: [],
  events: [],
  confidenceHistory: [],
  gaps: [],
  iteration: 0,
  decision: null,
};

export type RunAction =
  | { type: 'SET_OUTCOME'; text: string }
  | { type: 'SET_STATUS'; status: RunStatus }
  | { type: 'SET_COMPLEXITY'; result: ComplexityResult }
  | { type: 'SET_PLAN'; missions: Mission[] }
  | { type: 'SET_MATCHES'; matches: HumanMatch[] }
  | { type: 'APPEND_EVENT'; event: EvidenceEvent }
  | { type: 'UPDATE_MISSION_STATUS'; missionId: string; status: MissionStatus }
  | { type: 'RECORD_CONFIDENCE'; point: ConfidencePoint }
  | { type: 'ADD_GAP'; gap: Gap }
  | { type: 'SPAWN_ADAPTIVE_MISSIONS'; missions: Mission[] }
  | { type: 'SET_ITERATION'; iteration: number }
  | { type: 'SET_DECISION'; decision: Decision }
  | { type: 'RESET' };
