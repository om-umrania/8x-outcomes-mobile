import { createContext, useReducer, type Dispatch, type ReactNode } from 'react';

import { runReducer } from '@/state/runReducer';
import { initialRunState, type RunAction, type RunState } from '@/state/types';

export const RunStateContext = createContext<RunState>(initialRunState);
export const RunDispatchContext = createContext<Dispatch<RunAction>>(() => {});

export function RunProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(runReducer, initialRunState);

  return (
    <RunStateContext.Provider value={state}>
      <RunDispatchContext.Provider value={dispatch}>{children}</RunDispatchContext.Provider>
    </RunStateContext.Provider>
  );
}
