import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ComplexityScoreReveal } from '@/components/ComplexityScoreReveal';
import { FlowHeader } from '@/components/FlowHeader';
import { GlassSurface } from '@/components/GlassSurface';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useRunner } from '@/runner/RunnerContext';
import { useRun } from '@/state/useRun';

/** Screen 2 — Complexity Analysis. WOW MOMENT #1: the score reveal. */
export default function ComplexityScreen() {
  const { complexity, outcomeText } = useRun();
  const runner = useRunner();
  const [loading, setLoading] = useState(false);

  if (!complexity) {
    return (
      <ScreenContainer>
        <ThemedText>No outcome analyzed yet.</ThemedText>
      </ScreenContainer>
    );
  }

  async function seePlan() {
    setLoading(true);
    await runner.runPlanGeneration();
    setLoading(false);
    router.push('/plan');
  }

  return (
    <ScreenContainer
      footerGlass
      footer={
        <PrimaryButton
          label={loading ? 'Building route…' : 'View decision route'}
          onPress={seePlan}
          disabled={loading}
        />
      }
    >
      <FlowHeader stage={1} label="Analysis" />
      <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
        “{outcomeText}”
      </ThemedText>
      <ComplexityScoreReveal result={complexity} />
      <GlassSurface contentStyle={styles.rationale}>
        <ThemedText type="small" themeColor="textSecondary">
          WHY PEOPLE ARE NEEDED
        </ThemedText>
        <ThemedText type="default">{complexity.rationale}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Human necessity score: {complexity.humanNecessityScore}/100
        </ThemedText>
      </GlassSurface>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  rationale: { padding: Spacing.three, gap: Spacing.one },
});
