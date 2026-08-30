import type { ArchitectureTier } from '@/state/types';

export function tierForScore(score: number): ArchitectureTier {
  if (score <= 30) return 'ai-native';
  if (score <= 60) return 'hybrid';
  if (score <= 80) return 'human-heavy';
  return 'high-stakes';
}

export function tierLabel(tier: ArchitectureTier): string {
  switch (tier) {
    case 'ai-native':
      return 'AI-native';
    case 'hybrid':
      return 'Hybrid';
    case 'human-heavy':
      return 'Human-heavy';
    case 'high-stakes':
      return 'High-stakes orchestration';
  }
}
