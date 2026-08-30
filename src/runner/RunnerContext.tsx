import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { DEMO_MODE } from '@/config/env';
import { createDemoRunner } from '@/demo/DemoRunner';
import type { Runner } from '@/runner/types';
import { useRunDispatch } from '@/state/useRun';

const RunnerCtx = createContext<Runner | null>(null);

export function RunnerProvider({ children }: { children: ReactNode }) {
  const dispatch = useRunDispatch();

  // DEMO_MODE ? DemoRunner : LiveRunner — the swap point. Screens never see this.
  const runner = useMemo<Runner>(() => {
    if (DEMO_MODE) return createDemoRunner(dispatch);
    throw new Error('LiveRunner is not implemented yet — see ROADMAP.md "Then".');
  }, [dispatch]);

  return <RunnerCtx.Provider value={runner}>{children}</RunnerCtx.Provider>;
}

export function useRunner(): Runner {
  const runner = useContext(RunnerCtx);
  if (!runner) throw new Error('useRunner() must be used within a RunnerProvider');
  return runner;
}
