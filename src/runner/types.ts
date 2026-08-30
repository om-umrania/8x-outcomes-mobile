/**
 * The fixture/live seam (DECISIONS.md D-014). Screens only ever call useRunner()/useRun()
 * — never know whether DemoRunner (built now) or a future LiveRunner is behind it.
 */
export interface Runner {
  runComplexityAnalysis(outcome: string): Promise<void>;
  runPlanGeneration(): Promise<void>;
  runHumanMatching(): Promise<void>;
  startMissionExecution(): Promise<void>;
  triggerAdaptiveRound(): Promise<void>;
  resolveDecision(): Promise<void>;
}
