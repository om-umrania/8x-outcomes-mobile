import { StyleSheet, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import type { Mission, MissionStatus } from '@/state/types';

const STATUS_LABEL: Record<MissionStatus, string> = {
  pending: 'Pending',
  matched: 'Matched',
  in_progress: 'Running',
  submitted: 'Submitted',
  evaluated: 'Evaluated',
};

export function MissionCard({
  mission,
  compact = false,
}: {
  mission: Mission;
  compact?: boolean;
}) {
  const isAdaptive = mission.spawnedBy === 'adaptive';
  const kindLabel = mission.kind === 'ai_task' ? 'AI' : 'Human';

  return (
    <GlassSurface tint={isAdaptive ? 'amber' : 'neutral'} contentStyle={styles.card}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.kindPill,
            { backgroundColor: mission.kind === 'ai_task' ? Signal.blue : Signal.violet },
          ]}
        >
          <ThemedText type="small" style={styles.kindPillLabel}>
            {kindLabel}
          </ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {STATUS_LABEL[mission.status]}
        </ThemedText>
      </View>
      <ThemedText type="smallBold">{mission.title}</ThemedText>
      {!compact ? (
        <>
          <ThemedText type="small" themeColor="textSecondary">
            {mission.description}
          </ThemedText>
          {mission.cohortTag ? (
            <ThemedText type="small" themeColor="textSecondary">
              {mission.cohortTag}
            </ThemedText>
          ) : null}
        </>
      ) : null}
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kindPill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 999,
  },
  kindPillLabel: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
});
