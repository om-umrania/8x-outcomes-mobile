import type { ArchitectureTier, ConceptualComponent } from '@/state/types';

/**
 * Maps a complexity tier to which conceptual components get visual emphasis on the
 * Orchestration Plan screen — this is what makes the complexity score "meaningfully
 * drive visible orchestration decisions" real rather than decorative. AI_SYSTEM.md §1.
 */
export function orchestrationEmphasis(tier: ArchitectureTier): ConceptualComponent[] {
  switch (tier) {
    case 'ai-native':
      return ['ai-executor', 'evaluator'];
    case 'hybrid':
      return ['outcome-planner', 'ai-executor', 'evaluator'];
    case 'human-heavy':
      return ['outcome-planner', 'human-router', 'ai-executor', 'evaluator'];
    case 'high-stakes':
      return ['complexity-engine', 'outcome-planner', 'human-router', 'ai-executor', 'evaluator'];
  }
}

export const COMPONENT_LABEL: Record<ConceptualComponent, string> = {
  'complexity-engine': 'Complexity Engine',
  'outcome-planner': 'Outcome Planner',
  'ai-executor': 'AI Executor',
  'human-router': 'Human Router',
  evaluator: 'Evaluator / Confidence Gate',
};
