import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { tierLabel } from '@/lib/complexity/tier';
import { Signal, Spacing } from '@/constants/theme';
import type { ComplexityResult } from '@/state/types';

const TIER_COLOR: Record<ComplexityResult['tier'], string> = {
  'ai-native': Signal.blue,
  hybrid: Signal.violet,
  'human-heavy': Signal.amber,
  'high-stakes': '#FF5C5C',
};

/**
 * WOW MOMENT #1 (BRAND.md, PRODUCT.md). Tracer-bullet version: renders correctly
 * and immediately. The animated reveal / haptic treatment is a later-pass hook —
 * this component boundary is where that pass lands (ROADMAP.md "Next").
 */
export function ComplexityScoreReveal({ result }: { result: ComplexityResult }) {
  const color = TIER_COLOR[result.tier];

  return (
    <View style={styles.wrap}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
        OUTCOME COMPLEXITY
      </ThemedText>
      <ThemedText style={[styles.score, { color }]}>{result.score}</ThemedText>
      <View style={[styles.tierPill, { backgroundColor: color }]}>
        <ThemedText type="smallBold" style={styles.tierLabel}>
          {tierLabel(result.tier).toUpperCase()}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.three },
  eyebrow: { letterSpacing: 1.5 },
  score: { fontSize: 104, fontWeight: '800', lineHeight: 108 },
  tierPill: { paddingHorizontal: Spacing.three, paddingVertical: Spacing.one, borderRadius: 999 },
  tierLabel: { color: '#FFFFFF', letterSpacing: 0.5 },
});
