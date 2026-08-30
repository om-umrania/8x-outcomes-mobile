import type {
  CapabilityDimension,
  CapabilityDimensionDetail,
  MissionHistoryItem,
  WorkerMission,
} from '@/worker/types';

/**
 * Fictional, deterministic worker data for the hackathon demo. Nothing in this
 * fixture represents a real tester, live dispatch, or measured capability score.
 *
 * The scenario dramatized here is Eat Eat, a fictional South Indian restaurant
 * hiring a Chef, a Logistics Coordinator, and an Operations Intern — see
 * WORKER_APP.md for how this fixture maps onto the Resume-to-Mission Bridge
 * cold-start flow and the full worker journey.
 */

export const CALIBRATION_MISSION_ID = 'eat-eat-vendor-calibration';

/** Cycled on the parsing screen; the domain name must match the calibration mission below. */
export const CALIBRATION_PARSING_STEPS = [
  'Reading your background…',
  'Domain detected: Hospitality operations',
  'Matching to Eat Eat’s mission library…',
  'Calibrating your first mission…',
];

export const WORKER_MISSIONS: WorkerMission[] = [
  {
    id: CALIBRATION_MISSION_ID,
    outcomeContext: 'Eat Eat · Operations Intern',
    title: 'Untangle Eat Eat’s vendor sheet',
    request:
      'A supplier list came in with three different date formats, two duplicate vendors, and missing payment terms. Show us how you would clean it up.',
    estimatedMinutes: 12,
    channel: 'text',
    captureKind: 'screen',
    isAdaptive: false,
    isCalibration: true,
    resourceLabel: 'raw_suppliers_v2.csv',
    questions: [
      'The sheet lists “Ganga Foods” and “Ganga Foods Pvt Ltd” as separate vendors with different phone numbers. What do you do before merging them?',
      'Two rows have no Payment Terms field at all. How do you fill that gap without guessing?',
      'Describe the structure you would hand back so the ops team can trust it at a glance.',
    ],
    capabilityUnlocked: {
      id: 'data-structuring',
      label: 'Data structuring',
      tags: ['Vendor data accuracy', 'Structuring speed'],
    },
  },
  {
    id: 'eat-eat-vendor-scorecard',
    outcomeContext: 'Eat Eat · Operations Intern',
    title: 'Build next week’s vendor scorecard',
    request:
      'Turn last week’s delivery timestamps into a one-page scorecard the kitchen manager can act on.',
    estimatedMinutes: 10,
    channel: 'text',
    captureKind: 'screen',
    isAdaptive: false,
    questions: [
      'Which single number would you put at the top of the scorecard, and why?',
      'One vendor was late twice but both times for a documented reason. How do you represent that fairly?',
      'What would make this scorecard useless to the kitchen manager?',
    ],
  },
  {
    id: 'eat-eat-dosa-batter',
    outcomeContext: 'Eat Eat · South Indian Chef',
    title: 'Rescue the dosa batter',
    request:
      'Overnight fermentation stalled and a supplier substitution changed your rice-to-urad-dal ratio. Walk through the fix before service starts.',
    estimatedMinutes: 8,
    channel: 'text',
    captureKind: 'screen',
    isAdaptive: false,
    questions: [
      'Your urad dal delivery is short and you only have a coarser semolina substitute on hand. How do you adjust the batter?',
      'The batter hasn’t risen after the usual 8 hours. What’s the first thing you check, and why?',
      'How would you explain the adjusted recipe to a line cook mid-service, in one breath?',
    ],
  },
  {
    id: 'eat-eat-ferment-call',
    outcomeContext: 'Eat Eat · South Indian Chef',
    title: 'Talk through a live fermentation call',
    request: 'Have a short voice call narrating how you troubleshoot a stalled batter in real time.',
    estimatedMinutes: 5,
    channel: 'voice',
    captureKind: 'voice',
    isAdaptive: false,
    questions: [],
  },
  {
    id: 'eat-eat-routing-puzzle',
    outcomeContext: 'Eat Eat · Logistics Coordinator',
    title: 'Reroute around a flooded corridor',
    request:
      'A flooded corridor just closed your fastest path to three delivery zones. Redesign the run before drivers go idle.',
    estimatedMinutes: 9,
    channel: 'text',
    captureKind: 'screen',
    isAdaptive: false,
    questions: [
      'Which of the three zones do you resequence to first, and why?',
      'What’s your fallback if the alternate route also fails?',
      'How do you tell affected customers about the delay?',
    ],
  },
  {
    id: 'eat-eat-second-disruption',
    outcomeContext: 'Eat Eat · Logistics Coordinator',
    title: 'One more disruption',
    request: 'A second, unrelated hold-up lands mid-route. Answer two quick questions about how you handle it.',
    estimatedMinutes: 4,
    channel: 'text',
    captureKind: 'screen',
    isAdaptive: true,
    adaptiveReason: 'Your routing answer left confidence too low on staying calm under stacked pressure.',
    questions: [
      'A driver’s scooter breaks down while the flooded corridor is still closed. What do you do in the next two minutes?',
      'What’s the one thing you would NOT do right now, even though it might feel productive?',
    ],
  },
];

export const CAPABILITY_DIMENSIONS: CapabilityDimension[] = [
  {
    id: 'data-structuring',
    label: 'Data structuring',
    processContribution: 61,
    outcomeContribution: 26,
    signalLabel: 'Verified · vendor sheet',
  },
  {
    id: 'pressure',
    label: 'Problem-solving under pressure',
    processContribution: 47,
    outcomeContribution: 21,
    signalLabel: 'Building signal',
  },
  {
    id: 'communication',
    label: 'Communication clarity',
    processContribution: 52,
    outcomeContribution: 23,
    signalLabel: 'Strong signal',
  },
  {
    id: 'structural-thinking',
    label: 'Structural thinking',
    processContribution: 40,
    outcomeContribution: 18,
    signalLabel: 'Early signal',
  },
  {
    id: 'adaptability',
    label: 'Adaptability',
    processContribution: 33,
    outcomeContribution: 15,
    signalLabel: 'Early signal',
  },
];

/** Per-dimension drill-down: which missions fed it and what was observed. Keyed by CapabilityDimension.id. */
export const CAPABILITY_DIMENSION_DETAILS: Record<string, CapabilityDimensionDetail> = {
  'data-structuring': {
    id: 'data-structuring',
    description:
      'How cleanly you turn messy, real-world data into something someone else can trust and act on without re-checking it.',
    trend: [0, 34, 61, 87],
    evidence: [
      {
        missionId: CALIBRATION_MISSION_ID,
        missionTitle: 'Untangle Eat Eat’s vendor sheet',
        completedLabel: 'Completed just now · calibration',
        signal: 'process',
        contribution: 68,
        note: 'Caught the duplicate “Ganga Foods” entries and asked for a merge rule before touching the data — didn’t just guess.',
      },
      {
        missionId: 'eat-eat-vendor-scorecard',
        missionTitle: 'Build next week’s vendor scorecard',
        completedLabel: 'Completed 2 days ago',
        signal: 'outcome',
        contribution: 19,
        note: 'Scorecard shipped with one clear headline number — the kitchen manager could act on it in under 10 seconds.',
      },
    ],
  },
  pressure: {
    id: 'pressure',
    description:
      'Whether your reasoning stays structured, not just fast, when a plan breaks mid-execution.',
    trend: [0, 22, 47, 68],
    evidence: [
      {
        missionId: 'eat-eat-routing-puzzle',
        missionTitle: 'Reroute around a flooded corridor',
        completedLabel: 'Completed 2 days ago',
        signal: 'process',
        contribution: 40,
        note: 'Resequenced the highest-risk delivery zone first and named a fallback before being asked for one.',
      },
      {
        missionId: 'eat-eat-second-disruption',
        missionTitle: 'One more disruption',
        completedLabel: 'Completed 2 days ago · adaptive',
        signal: 'process',
        contribution: 28,
        note: 'Held the original route’s shape instead of improvising from scratch when a second disruption landed.',
      },
    ],
  },
  communication: {
    id: 'communication',
    description:
      'Whether someone downstream can act on what you handed them without asking a follow-up question.',
    trend: [0, 30, 52, 75],
    evidence: [
      {
        missionId: 'eat-eat-vendor-scorecard',
        missionTitle: 'Build next week’s vendor scorecard',
        completedLabel: 'Completed 2 days ago',
        signal: 'outcome',
        contribution: 45,
        note: 'The scorecard’s headline number required zero clarifying questions from the kitchen manager.',
      },
      {
        missionId: 'eat-eat-ferment-call',
        missionTitle: 'Talk through a live fermentation call',
        completedLabel: 'Completed 4 days ago',
        signal: 'process',
        contribution: 30,
        note: 'Narrated the batter fix in one continuous breath a line cook could follow live, mid-service.',
      },
    ],
  },
  'structural-thinking': {
    id: 'structural-thinking',
    description:
      'Whether you build a repeatable shape for a problem instead of solving it once and starting over next time.',
    trend: [0, 20, 40, 58],
    evidence: [
      {
        missionId: CALIBRATION_MISSION_ID,
        missionTitle: 'Untangle Eat Eat’s vendor sheet',
        completedLabel: 'Completed just now · calibration',
        signal: 'process',
        contribution: 35,
        note: 'Proposed a structure the ops team could reuse for future vendor sheets, not just this one.',
      },
      {
        missionId: 'eat-eat-vendor-scorecard',
        missionTitle: 'Build next week’s vendor scorecard',
        completedLabel: 'Completed 2 days ago',
        signal: 'outcome',
        contribution: 23,
        note: 'Scorecard format was built to be refreshed weekly, not redesigned from scratch each time.',
      },
    ],
  },
  adaptability: {
    id: 'adaptability',
    description:
      'How your plan changes shape when the ground truth changes mid-mission, without losing the original goal.',
    trend: [0, 18, 33, 48],
    evidence: [
      {
        missionId: 'eat-eat-dosa-batter',
        missionTitle: 'Rescue the dosa batter',
        completedLabel: 'Completed 4 days ago',
        signal: 'process',
        contribution: 22,
        note: 'Adjusted the rice-to-urad-dal ratio for a coarser substitute instead of waiting for the original ingredient.',
      },
      {
        missionId: 'eat-eat-second-disruption',
        missionTitle: 'One more disruption',
        completedLabel: 'Completed 2 days ago · adaptive',
        signal: 'outcome',
        contribution: 26,
        note: 'Kept drivers moving through a second, unrelated disruption without restarting the whole route.',
      },
    ],
  },
};

export const MISSION_HISTORY: MissionHistoryItem[] = [
  {
    id: 'history-1',
    title: 'Untangle Eat Eat’s vendor sheet',
    completedLabel: 'Completed just now · calibration',
    channel: 'text',
  },
  {
    id: 'history-2',
    title: 'Reroute around a flooded corridor',
    completedLabel: 'Completed 2 days ago',
    channel: 'text',
  },
  {
    id: 'history-3',
    title: 'Talk through a live fermentation call',
    completedLabel: 'Completed 4 days ago',
    channel: 'voice',
  },
];
