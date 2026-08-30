import { DEMO_STEP_DELAY_MS } from '@/config/constants';
import {
  DEMO_ADAPTIVE_CONFIDENCE,
  DEMO_ADAPTIVE_MISSIONS,
  DEMO_COMPLEXITY,
  DEMO_DECISION,
  DEMO_GAP,
  DEMO_HUMAN_MATCHES,
  DEMO_INITIAL_CONFIDENCE,
  DEMO_INITIAL_MISSIONS,
} from '@/demo/fixture';
import type { Runner } from '@/runner/types';
import type { EvidenceEvent, RunAction } from '@/state/types';

let eventCounter = 0;
function nextEventId() {
  eventCounter += 1;
  return `evt-${eventCounter}`;
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function emitEvent(
  dispatch: (action: RunAction) => void,
  missionId: string,
  type: EvidenceEvent['type'],
  message: string,
) {
  dispatch({
    type: 'APPEND_EVENT',
    event: { id: nextEventId(), missionId, type, message, timestamp: Date.now() },
  });
}

/**
 * Implements Runner by dispatching fixture.ts data through the same RunActions a
 * live system would use, staggered for a streaming feel. Fully offline, deterministic.
 * A future LiveRunner implements the identical interface — screens never know the
 * difference (DECISIONS.md D-014).
 */
export function createDemoRunner(dispatch: (action: RunAction) => void): Runner {
  return {
    async runComplexityAnalysis(outcome: string) {
      dispatch({ type: 'SET_OUTCOME', text: outcome });
      dispatch({ type: 'SET_STATUS', status: 'analyzing' });
      await wait(DEMO_STEP_DELAY_MS);
      dispatch({ type: 'SET_COMPLEXITY', result: DEMO_COMPLEXITY });
    },

    async runPlanGeneration() {
      await wait(DEMO_STEP_DELAY_MS);
      dispatch({ type: 'SET_PLAN', missions: DEMO_INITIAL_MISSIONS });
    },

    async runHumanMatching() {
      await wait(DEMO_STEP_DELAY_MS);
      dispatch({ type: 'SET_MATCHES', matches: DEMO_HUMAN_MATCHES });
    },

    async startMissionExecution() {
      dispatch({ type: 'SET_STATUS', status: 'executing' });
      for (const mission of DEMO_INITIAL_MISSIONS) {
        dispatch({ type: 'UPDATE_MISSION_STATUS', missionId: mission.id, status: 'in_progress' });
        emitEvent(dispatch, mission.id, 'execution_started', `${mission.title}: started`);
        await wait(DEMO_STEP_DELAY_MS);
        emitEvent(dispatch, mission.id, 'evidence_submitted', `${mission.title}: evidence received`);
        dispatch({ type: 'UPDATE_MISSION_STATUS', missionId: mission.id, status: 'submitted' });
      }

      await wait(DEMO_STEP_DELAY_MS);
      dispatch({
        type: 'RECORD_CONFIDENCE',
        point: {
          iteration: 0,
          confidence: DEMO_INITIAL_CONFIDENCE,
          label: 'Initial evidence',
          timestamp: Date.now(),
        },
      });
      dispatch({ type: 'ADD_GAP', gap: DEMO_GAP });
      dispatch({ type: 'SET_ITERATION', iteration: 1 });
    },

    async triggerAdaptiveRound() {
      dispatch({ type: 'SET_STATUS', status: 'adapting' });
      dispatch({ type: 'SPAWN_ADAPTIVE_MISSIONS', missions: DEMO_ADAPTIVE_MISSIONS });

      for (const mission of DEMO_ADAPTIVE_MISSIONS) {
        dispatch({ type: 'UPDATE_MISSION_STATUS', missionId: mission.id, status: 'in_progress' });
        emitEvent(dispatch, mission.id, 'execution_started', `${mission.title}: started`);
        await wait(DEMO_STEP_DELAY_MS / 2);
        dispatch({ type: 'UPDATE_MISSION_STATUS', missionId: mission.id, status: 'submitted' });
      }

      await wait(DEMO_STEP_DELAY_MS);
      dispatch({
        type: 'RECORD_CONFIDENCE',
        point: {
          iteration: 1,
          confidence: DEMO_ADAPTIVE_CONFIDENCE,
          label: 'After trust-objection missions',
          timestamp: Date.now(),
        },
      });
    },

    async resolveDecision() {
      await wait(DEMO_STEP_DELAY_MS);
      dispatch({ type: 'SET_DECISION', decision: DEMO_DECISION });
    },
  };
}
