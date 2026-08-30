import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { FlowHeader } from '@/components/FlowHeader';
import { GlassSurface } from '@/components/GlassSurface';
import { MissionCard } from '@/components/MissionCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { CONFIDENCE_THRESHOLD } from '@/config/constants';
import { Spacing } from '@/constants/theme';
import { orchestrationEmphasis } from '@/lib/complexity/orchestrationEmphasis';
import { useRunner } from '@/runner/RunnerContext';
import { useRun } from '@/state/useRun';

/** Screen 3 — the system chooses the route; the user only confirms launch. */
export default function PlanScreen() {
  const { missions, complexity } = useRun();
  const runner = useRunner();
  const [loading, setLoading] = useState(false);

  if (!complexity) {
    return (
      <ScreenContainer>
        <ThemedText>No route yet.</ThemedText>
      </ScreenContainer>
    );
  }

  const emphasis = orchestrationEmphasis(complexity.tier);
  const humanLed = emphasis.includes('human-router');
  const aiCount = missions.filter((mission) => mission.kind === 'ai_task').length;
  const humanCount = missions.filter((mission) => mission.kind === 'human_mission').length;
  const orderedMissions = [...missions].sort((a, b) => {
    if (a.kind === b.kind) return 0;
    if (humanLed) return a.kind === 'human_mission' ? -1 : 1;
    return a.kind === 'ai_task' ? -1 : 1;
  });

  async function matchHumans() {
    setLoading(true);
    await runner.runHumanMatching();
    setLoading(false);
    router.push('/matching');
  }

  return (
    <ScreenContainer
      footerGlass
      footer={
        <PrimaryButton
          label={loading ? 'Matching cohort…' : 'Match the cohort'}
          onPress={matchHumans}
          disabled={loading}
        />
      }
    >
      <FlowHeader stage={2} label="Route" />

      <View style={styles.headingBlock}>
        <ThemedText type="title" style={styles.heading}>
          Your route to a decision
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          {humanLed
            ? 'Human evidence leads. AI handles the desk work and synthesis.'
            : 'AI execution leads, with people added where evidence requires judgment.'}
        </ThemedText>
      </View>

      <View style={styles.stats}>
        <GlassSurface
          tint={humanLed ? 'amber' : 'neutral'}
          style={styles.statCardWide}
          contentStyle={styles.statCard}
        >
          <ThemedText type="small" themeColor="textSecondary">
            HUMAN MISSIONS
          </ThemedText>
          <ThemedText style={styles.statValue}>{humanCount}</ThemedText>
          <ThemedText type="small">Real buyer + institutional judgment</ThemedText>
        </GlassSurface>
        <GlassSurface style={styles.statCardNarrow} contentStyle={styles.statCard}>
          <ThemedText type="small" themeColor="textSecondary">
            AI TASKS
          </ThemedText>
          <ThemedText style={styles.statValue}>{aiCount}</ThemedText>
        </GlassSurface>
        <GlassSurface style={styles.statCardNarrow} contentStyle={styles.statCard}>
          <ThemedText type="small" themeColor="textSecondary">
            CONFIDENCE GATE
          </ThemedText>
          <ThemedText style={styles.statValue}>
            {Math.round(CONFIDENCE_THRESHOLD * 100)}%
          </ThemedText>
        </GlassSurface>
      </View>

      <View style={styles.workstreams}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.sectionLabel}>
          WORKSTREAMS
        </ThemedText>
        {orderedMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} compact />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headingBlock: { gap: Spacing.two, marginTop: Spacing.two },
  heading: { fontSize: 34, lineHeight: 38 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  statCard: { padding: Spacing.three, gap: Spacing.one },
  statCardNarrow: { flex: 1, minWidth: '45%' },
  statCardWide: { flexBasis: '100%' },
  statValue: { fontSize: 34, lineHeight: 38, fontWeight: '800' },
  workstreams: { gap: Spacing.two },
  sectionLabel: { fontSize: 11, letterSpacing: 1.2 },
});
