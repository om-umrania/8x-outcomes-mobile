import type { ComplexityBreakdown, ComplexityResult } from '@/state/types';
import { buildRationale } from '@/lib/complexity/rationale';
import { tierForScore } from '@/lib/complexity/tier';

export { tierForScore, tierLabel } from '@/lib/complexity/tier';

const WEIGHTS: Record<keyof ComplexityBreakdown, number> = {
  ambiguity: 0.2,
  humanNecessity: 0.15,
  evidenceRequirement: 0.15,
  dependencyDepth: 0.15,
  contextDiversity: 0.1,
  risk: 0.1,
  toolComplexity: 0.1,
  uncertainty: 0.05,
};

const DIMENSION_KEYS = Object.keys(WEIGHTS) as (keyof ComplexityBreakdown)[];

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function clampInputs(inputs: ComplexityBreakdown): ComplexityBreakdown {
  const clamped = {} as ComplexityBreakdown;
  for (const key of DIMENSION_KEYS) {
    clamped[key] = clamp(inputs[key]);
  }
  return clamped;
}

/**
 * Pure, deterministic weighted-composite scorer. Same function serves DEMO_MODE
 * (hand-authored inputs) and a future LiveRunner (LLM-scored inputs) identically —
 * see AI_SYSTEM.md §1 / DECISIONS.md D-013.
 */
export function calculateComplexity(inputs: ComplexityBreakdown): ComplexityResult {
  const breakdown = clampInputs(inputs);
  const score = Math.round(
    DIMENSION_KEYS.reduce((sum, key) => sum + breakdown[key] * WEIGHTS[key], 0),
  );
  const tier = tierForScore(score);

  return {
    breakdown,
    score,
    tier,
    humanNecessityScore: breakdown.humanNecessity,
    rationale: buildRationale(breakdown, WEIGHTS, tier),
  };
}
