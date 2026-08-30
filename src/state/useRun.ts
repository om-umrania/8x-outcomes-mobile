import { useContext } from 'react';

import { RunDispatchContext, RunStateContext } from '@/state/RunProvider';

export function useRun() {
  return useContext(RunStateContext);
}

export function useRunDispatch() {
  return useContext(RunDispatchContext);
}
