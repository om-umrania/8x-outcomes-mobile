import type {
  CapabilityDimension,
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
