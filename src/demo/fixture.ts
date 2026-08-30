import { calculateComplexity } from '@/lib/complexity/calculateComplexity';
import type {
  ComplexityBreakdown,
  Decision,
  Gap,
  HumanMatch,
  Mission,
} from '@/state/types';

export const DEMO_OUTCOME =
  'Should I quit my stable job to go full-time on my side-hustle?';

/**
 * Hand-authored inputs for the known demo outcome — chosen so the REAL weighted
 * formula produces score 68 / tier "human-heavy". Verified by hand (AI_SYSTEM.md §1):
 * 0.20·75 + 0.15·85 + 0.15·80 + 0.15·55 + 0.10·60 + 0.10·70 + 0.10·40 + 0.05·50 = 67.5 → 68.
 */
const DEMO_COMPLEXITY_INPUTS: ComplexityBreakdown = {
  ambiguity: 75,
  humanNecessity: 85,
  evidenceRequirement: 80,
  dependencyDepth: 55,
  contextDiversity: 60,
  risk: 70,
  toolComplexity: 40,
  uncertainty: 50,
};

export const DEMO_COMPLEXITY = calculateComplexity(DEMO_COMPLEXITY_INPUTS);

export const DEMO_INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm-ai-market-scan',
    kind: 'ai_task',
    title: 'Side-hustle market-viability scan',
    description: 'Survey realistic demand and revenue ceiling for the specific venture, not just the category.',
    status: 'pending',
    spawnedBy: 'initial',
    createdAtIteration: 0,
  },
  {
    id: 'm-ai-runway-calc',
    kind: 'ai_task',
    title: 'Runway calculator',
    description: 'Model months of financial runway from current savings, expenses, and expected ramp-up income.',
    status: 'pending',
    spawnedBy: 'initial',
    createdAtIteration: 0,
  },
  {
    id: 'm-human-peer-reaction',
    kind: 'human_mission',
    title: 'People who’ve made this leap react',
    description: 'Five people who left stable jobs for their own venture share what actually happened.',
    cohortTag: 'Ex-corporate, now full-time founder, 2–5 yrs in',
    status: 'pending',
    spawnedBy: 'initial',
    createdAtIteration: 0,
  },
  {
    id: 'm-human-financial-risk',
    kind: 'human_mission',
    title: 'Independent financial-risk assessment',
    description: 'Three independent financial planners assess the runway and downside risk.',
    cohortTag: 'Independent financial planner',
    status: 'pending',
    spawnedBy: 'initial',
    createdAtIteration: 0,
  },
];

export const DEMO_HUMAN_MATCHES: HumanMatch[] = [
  { id: 'h-1', cohortTag: 'Ex-corporate, now full-time founder, 2–5 yrs in', matchScore: 94 },
  { id: 'h-2', cohortTag: 'Ex-corporate, now full-time founder, 2–5 yrs in', matchScore: 91 },
  { id: 'h-3', cohortTag: 'Ex-corporate, now full-time founder, <2 yrs in', matchScore: 88 },
  { id: 'h-4', cohortTag: 'Independent financial planner', matchScore: 90 },
  { id: 'h-5', cohortTag: 'Independent financial planner', matchScore: 85 },
  { id: 'h-6', cohortTag: 'Quit, and went back to a job within a year', matchScore: 82 },
];

export const DEMO_INITIAL_CONFIDENCE = 0.63;
export const DEMO_ADAPTIVE_CONFIDENCE = 0.87;

export const DEMO_GAP: Gap = {
  id: 'g-downside-risk',
  label: 'Downside risk tolerance insufficiently validated',
  detectedAtIteration: 0,
};

const RISK_MISSION_ANGLES = [
  'What’s your monthly burn rate without a salary, and how many months could you actually survive?',
  'Have you told your family or partner the real numbers, not just the plan?',
  'What’s your fallback if this doesn’t work out in year one?',
  'Would you regret trying and failing more than never trying at all?',
  'What’s the first expense you’d cut if revenue comes in slower than expected?',
  'Does your partner or family actually support this, or are they just not objecting?',
  'What’s your realistic worst-case timeline before you’d need to go back to a job?',
  'Who in your life has done this, and what do they wish they’d known going in?',
];

export const DEMO_ADAPTIVE_MISSIONS: Mission[] = RISK_MISSION_ANGLES.map((angle, index) => ({
  id: `m-adaptive-${index + 1}`,
  kind: 'human_mission',
  title: `Risk probe ${index + 1}`,
  description: angle,
  cohortTag: 'Ex-corporate, now full-time founder, 2–5 yrs in',
  status: 'pending',
  spawnedBy: 'adaptive',
  createdAtIteration: 1,
}));

export const DEMO_DECISION: Decision = {
  recommendation: 'Take the leap — an 8-month runway and real family buy-in make the downside recoverable, not fatal.',
  confidence: DEMO_ADAPTIVE_CONFIDENCE,
  evidenceSummary: [
    'Peers who made similar leaps found the first six months harder than expected but survivable with a written fallback plan.',
    'The risk traced to unclear family buy-in, not the venture’s underlying numbers.',
    'Explicit fallback conversations with family measurably raised stated confidence across the follow-up cohort.',
  ],
  nextExperiment: 'Set a hard 8-month runway checkpoint with a pre-agreed fallback trigger, and revisit the decision there — not open-ended.',
};
