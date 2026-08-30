import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { AdaptiveMissionBurst } from '@/components/AdaptiveMissionBurst';
import { ConfidenceLift } from '@/components/ConfidenceLift';
import { FlowHeader } from '@/components/FlowHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useRunner } from '@/runner/RunnerContext';
import { useRun } from '@/state/useRun';

/**
 * Screen 6 — Adaptive Follow-up. WOW MOMENT #2 — the center of the demo. On mount,
 * spawns exactly 8 new missions and re-evaluates, unprompted (BUILD.md F9).
 */
export default function AdaptiveScreen() {
  const { missions, gaps, confidenceHistory } = useRun();
  const runner = useRunner();
  const started = useRef(false);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    runner.triggerAdaptiveRound().then(() => setRunning(false));
  }, [runner]);

  const gap = gaps[gaps.length - 1];
  const adaptiveMissions = missions.filter((m) => m.spawnedBy === 'adaptive');
  const latestConfidence = confidenceHistory[confidenceHistory.length - 1];
  const initialConfidence = confidenceHistory[0];

  async function seeDecision() {
    await runner.resolveDecision();
    router.push('/decision');
  }

  return (
    <ScreenContainer
      footerGlass
      footer={
        !running && latestConfidence ? (
          <PrimaryButton label="See your decision" onPress={seeDecision} />
        ) : undefined
      }
    >
      <FlowHeader stage={3} label="Recovery" />
      <View style={styles.headingBlock}>
        <ThemedText type="title" style={styles.heading}>
          8x found the gap
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          The route changed automatically. No user action triggered this recovery.
        </ThemedText>
      </View>

      {initialConfidence && latestConfidence ? (
        <ConfidenceLift
          from={initialConfidence.confidence}
          to={latestConfidence.confidence}
          running={running}
        />
      ) : null}

      {gap ? <AdaptiveMissionBurst gap={gap} missions={adaptiveMissions} /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headingBlock: { gap: Spacing.two, marginTop: Spacing.two },
  heading: { fontSize: 34, lineHeight: 38 },
});
