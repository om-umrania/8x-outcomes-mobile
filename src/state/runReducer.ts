import { initialRunState, type RunAction, type RunState } from '@/state/types';

export function runReducer(state: RunState, action: RunAction): RunState {
  switch (action.type) {
    case 'SET_OUTCOME':
      return { ...state, outcomeText: action.text };
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'SET_COMPLEXITY':
      return { ...state, complexity: action.result };
    case 'SET_PLAN':
      return { ...state, missions: action.missions, status: 'planned' };
    case 'SET_MATCHES':
      return { ...state, humanMatches: action.matches, status: 'matching' };
    case 'APPEND_EVENT':
      return { ...state, events: [...state.events, action.event] };
    case 'UPDATE_MISSION_STATUS':
      return {
        ...state,
        missions: state.missions.map((m) =>
          m.id === action.missionId ? { ...m, status: action.status } : m,
        ),
      };
    case 'RECORD_CONFIDENCE':
      return { ...state, confidenceHistory: [...state.confidenceHistory, action.point] };
    case 'ADD_GAP':
      return { ...state, gaps: [...state.gaps, action.gap] };
    case 'SPAWN_ADAPTIVE_MISSIONS':
      return { ...state, missions: [...state.missions, ...action.missions] };
    case 'SET_ITERATION':
      return { ...state, iteration: action.iteration };
    case 'SET_DECISION':
      return { ...state, decision: action.decision, status: 'resolved' };
    case 'RESET':
      return initialRunState;
    default:
      return state;
  }
}
