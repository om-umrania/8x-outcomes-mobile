import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';

import { WORKER_MISSIONS } from '@/worker/fixture';
import type {
  WorkerAction,
  WorkerMission,
  WorkerMissionStatus,
  WorkerState,
} from '@/worker/types';

const initialMissionStatuses = Object.fromEntries(
  WORKER_MISSIONS.map((mission) => [mission.id, 'available']),
) as Record<string, WorkerMissionStatus>;

const initialWorkerState: WorkerState = {
  selectedMissionId: null,
  activeCaptureMissionId: null,
  missionStatuses: initialMissionStatuses,
  consentByMission: {},
  submissions: {},
  lastSubmittedMissionId: null,
};

function workerReducer(state: WorkerState, action: WorkerAction): WorkerState {
  switch (action.type) {
    case 'SELECT_MISSION':
      return { ...state, selectedMissionId: action.missionId };
    case 'SET_CONSENT':
      return {
        ...state,
        consentByMission: {
          ...state.consentByMission,
          [action.missionId]: action.consented,
        },
        activeCaptureMissionId:
          !action.consented && state.activeCaptureMissionId === action.missionId
            ? null
            : state.activeCaptureMissionId,
      };
    case 'START_MISSION':
      if (!state.consentByMission[action.missionId]) return state;
      return {
        ...state,
        activeCaptureMissionId: action.missionId,
        missionStatuses: {
          ...state.missionStatuses,
          [action.missionId]: 'in_progress',
        },
      };
    case 'SUBMIT_MISSION':
      return {
        ...state,
        activeCaptureMissionId: null,
        lastSubmittedMissionId: action.missionId,
        missionStatuses: {
          ...state.missionStatuses,
          [action.missionId]: 'completed',
        },
        submissions: {
          ...state.submissions,
          [action.missionId]: action.answers,
        },
      };
    case 'DECLINE_MISSION':
      return {
        ...state,
        activeCaptureMissionId:
          state.activeCaptureMissionId === action.missionId
            ? null
            : state.activeCaptureMissionId,
        missionStatuses: {
          ...state.missionStatuses,
          [action.missionId]: 'declined',
        },
      };
    default:
      return state;
  }
}

interface WorkerContextValue {
  state: WorkerState;
  selectedMission: WorkerMission | null;
  activeCaptureMission: WorkerMission | null;
  lastSubmittedMission: WorkerMission | null;
  selectMission: (missionId: string) => void;
  setConsent: (missionId: string, consented: boolean) => void;
  startMission: (missionId: string) => void;
  submitMission: (missionId: string, answers: string[]) => void;
  declineMission: (missionId: string) => void;
}

const WorkerContext = createContext<WorkerContextValue | null>(null);

function findMission(missionId: string | null) {
  return WORKER_MISSIONS.find((mission) => mission.id === missionId) ?? null;
}

export function WorkerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workerReducer, initialWorkerState);

  const selectMission = useCallback((missionId: string) => {
    dispatch({ type: 'SELECT_MISSION', missionId });
  }, []);

  const setConsent = useCallback((missionId: string, consented: boolean) => {
    dispatch({ type: 'SET_CONSENT', missionId, consented });
  }, []);

  const startMission = useCallback((missionId: string) => {
    dispatch({ type: 'START_MISSION', missionId });
  }, []);

  const submitMission = useCallback((missionId: string, answers: string[]) => {
    dispatch({ type: 'SUBMIT_MISSION', missionId, answers });
  }, []);

  const declineMission = useCallback((missionId: string) => {
    dispatch({ type: 'DECLINE_MISSION', missionId });
  }, []);

  const value = useMemo<WorkerContextValue>(
    () => ({
      state,
      selectedMission: findMission(state.selectedMissionId),
      activeCaptureMission: findMission(state.activeCaptureMissionId),
      lastSubmittedMission: findMission(state.lastSubmittedMissionId),
      selectMission,
      setConsent,
      startMission,
      submitMission,
      declineMission,
    }),
    [state, selectMission, setConsent, startMission, submitMission, declineMission],
  );

  return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>;
}

export function useWorker() {
  const value = useContext(WorkerContext);
  if (!value) throw new Error('useWorker must be used inside WorkerProvider');
  return value;
}
