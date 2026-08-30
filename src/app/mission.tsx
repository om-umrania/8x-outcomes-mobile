import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { EventLogLine } from '@/components/EventLogLine';
import { FlowHeader } from '@/components/FlowHeader';
import { GlassSurface } from '@/components/GlassSurface';
import { MissionCard } from '@/components/MissionCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { AUTO_RECOVERY_DELAY_MS, CONFIDENCE_THRESHOLD } from '@/config/constants';
import { Signal, Spacing } from '@/constants/theme';
import { useRunner } from '@/runner/RunnerContext';
import { useRun } from '@/state/useRun';

/** Screen 5 — status first, details second. A failed confidence gate recovers automatically. */
export default function MissionScreen() {
  const { missions, events, confidenceHistory, gaps } = useRun();
  const runner = useRunner();
  const started = useRef(false);
  const navigating = useRef(false);
  const [running, setRunning] = useState(true);
  const [autoAdvancing, setAutoAdvancing] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    runner.startMissionExecution().then(() => setRunning(false));
  }, [runner]);

  const latestConfidence = confidenceHistory[confidenceHistory.length - 1];
  const latestGap = gaps[gaps.length - 1];
  const initialMissions = missions.filter((mission) => mission.spawnedBy === 'initial');
  const completedCount = initialMissions.filter((mission) => mission.status === 'submitted').length;
  const recentEvents = events.slice(-3);

  useEffect(() => {
    if (
      running ||
      !latestConfidence ||
      latestConfidence.confidence >= CONFIDENCE_THRESHOLD ||
      navigating.current
    ) {
      return;
    }

    navigating.current = true;
    setAutoAdvancing(true);
    const timeout = setTimeout(() => router.replace('/adaptive'), AUTO_RECOVERY_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [latestConfidence, running]);

  async function openDecision() {
    await runner.resolveDecision();
    router.push('/decision');
  }

  const footer = latestConfidence ? (
    latestConfidence.confidence < CONFIDENCE_THRESHOLD ? (
      <PrimaryButton label="Recovering automatically…" onPress={() => {}} disabled />
    ) : (
      <PrimaryButton label="View decision" onPress={openDecision} />
    )
  ) : undefined;

  return (
    <ScreenContainer footer={footer} footerGlass>
      <FlowHeader stage={3} label="Evidence" />

      <View style={styles.headingBlock}>
        <ThemedText type="title" style={styles.heading}>
          Evidence in motion
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          8x is running the route. You only step back in when there is a decision.
        </ThemedText>
      </View>

      {latestConfidence ? (
        <View style={styles.resultBlock}>
          <ConfidenceMeter confidence={latestConfidence.confidence} label={latestConfidence.label} />
          {latestGap ? (
            <GlassSurface tint="amber" contentStyle={styles.gapCard}>
              <ThemedText type="small" style={styles.gapLabel}>
                EVIDENCE GAP
              </ThemedText>
              <ThemedText type="smallBold">{latestGap.label}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {autoAdvancing ? '8x is rerouting now.' : 'Preparing an automatic recovery route.'}
              </ThemedText>
            </GlassSurface>
          ) : null}
        </View>
      ) : (
        <GlassSurface contentStyle={styles.progressCard}>
          <ThemedText type="small" themeColor="textSecondary">
            EVIDENCE RECEIVED
          </ThemedText>
          <ThemedText style={styles.progressValue}>
            {completedCount}/{initialMissions.length}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Evaluating as submissions arrive
          </ThemedText>
        </GlassSurface>
      )}

      <View style={styles.grid}>
        {initialMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} compact />
        ))}
      </View>

      {recentEvents.length ? (
        <View style={styles.log}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.sectionLabel}>
            LATEST ACTIVITY
          </ThemedText>
          {recentEvents.map((event) => (
            <EventLogLine key={event.id} event={event} />
          ))}
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headingBlock: { gap: Spacing.two, marginTop: Spacing.two },
  heading: { fontSize: 34, lineHeight: 38 },
  resultBlock: { gap: Spacing.three },
  progressCard: { padding: Spacing.three, gap: Spacing.one },
  progressValue: { fontSize: 48, lineHeight: 52, fontWeight: '800' },
  gapCard: { padding: Spacing.three, gap: Spacing.one },
  gapLabel: { color: Signal.amber, fontSize: 11, letterSpacing: 1.2 },
  grid: { gap: Spacing.two },
  log: { gap: Spacing.one },
  sectionLabel: { fontSize: 11, letterSpacing: 1.2, marginBottom: Spacing.one },
});
