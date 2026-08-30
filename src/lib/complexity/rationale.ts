import type { ArchitectureTier, ComplexityBreakdown } from '@/state/types';
import { tierLabel } from '@/lib/complexity/tier';

const DIMENSION_COPY: Record<keyof ComplexityBreakdown, string> = {
  ambiguity: 'the outcome itself is ambiguous enough that reasonable people would interpret it differently',
  humanNecessity: 'the answer depends on real human reaction, not something inferable from data alone',
  evidenceRequirement: 'a credible answer needs a meaningful body of evidence, not a single data point',
  dependencyDepth: 'the outcome depends on several sub-questions resolving in sequence',
  contextDiversity: 'the target population spans distinct sub-groups whose reactions may differ',
  risk: 'a wrong answer here has real consequences',
  toolComplexity: 'answering this requires coordinating multiple distinct capabilities',
  uncertainty: 'there is little existing signal to anchor a confident answer on',
};

/**
 * Deterministic, template-based — picks the dimensions with the largest weighted
 * contribution to the score and renders a canned "why humans are required" sentence.
 * No LLM call needed, even for a later live version. AI_SYSTEM.md §1.
 */
export function buildRationale(
  breakdown: ComplexityBreakdown,
  weights: Record<keyof ComplexityBreakdown, number>,
  tier: ArchitectureTier,
): string {
  const contributions = (Object.keys(breakdown) as (keyof ComplexityBreakdown)[])
    .map((key) => ({ key, contribution: breakdown[key] * weights[key] }))
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 2);

  const reasons = contributions.map(({ key }) => DIMENSION_COPY[key]).join(', and ');

  return `${tierLabel(tier)} route: ${reasons}.`;
}
