import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { FlowHeader } from '@/components/FlowHeader';
import { GlassSurface } from '@/components/GlassSurface';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useRunDispatch, useRun } from '@/state/useRun';

/**
 * Screen 7 — Your Decision. A recommendation sentence, foregrounded — evidence
 * secondary/collapsed. A decision, not a report (PRODUCT.md Product Principle #3).
 */
export default function DecisionScreen() {
  const { decision } = useRun();
  const dispatch = useRunDispatch();

  if (!decision) {
    return (
      <ScreenContainer>
        <ThemedText>No decision yet.</ThemedText>
      </ScreenContainer>
    );
  }

  function startNew() {
    dispatch({ type: 'RESET' });
    router.replace('/');
  }

  return (
    <ScreenContainer footerGlass footer={<PrimaryButton label="Run another outcome" onPress={startNew} />}>
      <FlowHeader stage={4} label="Decision" />
      <ThemedText type="small" themeColor="textSecondary" style={styles.eyebrow}>
        ROUTE COMPLETE · YOUR DECISION
      </ThemedText>
      <ThemedText type="title" style={styles.recommendation}>
        {decision.recommendation}
      </ThemedText>
      <View style={styles.confidenceRow}>
        <ThemedText type="smallBold" style={{ color: Signal.green }}>
          {Math.round(decision.confidence * 100)}% confidence
        </ThemedText>
      </View>

      <GlassSurface style={styles.section} contentStyle={styles.sectionContent}>
        <ThemedText type="smallBold">Evidence</ThemedText>
        {decision.evidenceSummary.map((line, index) => (
          <ThemedText key={index} type="small" themeColor="textSecondary">
            · {line}
          </ThemedText>
        ))}
      </GlassSurface>

      <GlassSurface style={styles.section} contentStyle={styles.sectionContent}>
        <ThemedText type="smallBold">Next experiment</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {decision.nextExperiment}
        </ThemedText>
      </GlassSurface>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  eyebrow: { letterSpacing: 1.5 },
  recommendation: { fontSize: 30, lineHeight: 36 },
  confidenceRow: { marginTop: Spacing.one },
  section: { marginTop: Spacing.three },
  sectionContent: { gap: Spacing.one, padding: Spacing.three },
});
