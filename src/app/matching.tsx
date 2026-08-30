import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { FlowHeader } from '@/components/FlowHeader';
import { GlassSurface } from '@/components/GlassSurface';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useRun } from '@/state/useRun';

/** Screen 4 — a compact cohort receipt, not a people marketplace. */
export default function MatchingScreen() {
  const { humanMatches } = useRun();

  const groups = Array.from(
    humanMatches.reduce((result, match) => {
      const current = result.get(match.cohortTag) ?? { count: 0, bestScore: 0 };
      result.set(match.cohortTag, {
        count: current.count + 1,
        bestScore: Math.max(current.bestScore, match.matchScore),
      });
      return result;
    }, new Map<string, { count: number; bestScore: number }>()),
  );

  return (
    <ScreenContainer
      footerGlass
      footer={<PrimaryButton label="Launch route" onPress={() => router.push('/mission')} />}
    >
      <FlowHeader stage={2} label="Cohort" />

      <View style={styles.hero}>
        <View style={[styles.readyDot, { backgroundColor: Signal.green }]} />
        <ThemedText type="small" themeColor="textSecondary">
          COHORT READY
        </ThemedText>
        <ThemedText style={styles.count}>{humanMatches.length}</ThemedText>
        <ThemedText type="title" style={styles.heading}>
          matched people
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Selected by capability and context — no profiles to browse, no manual recruiting.
        </ThemedText>
      </View>

      <View style={styles.groups}>
        {groups.map(([cohortTag, group]) => (
          <GlassSurface key={cohortTag} contentStyle={styles.groupCard}>
            <View style={styles.groupCopy}>
              <ThemedText type="smallBold">{cohortTag}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Best fit {group.bestScore}%
              </ThemedText>
            </View>
            <ThemedText style={styles.groupCount}>×{group.count}</ThemedText>
          </GlassSurface>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { gap: Spacing.one, marginTop: Spacing.three },
  readyDot: { width: 9, height: 9, borderRadius: 999, marginBottom: Spacing.one },
  count: { fontSize: 72, lineHeight: 76, fontWeight: '800' },
  heading: { fontSize: 34, lineHeight: 38 },
  groups: { gap: Spacing.two },
  groupCard: {
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  groupCopy: { flex: 1, gap: 2 },
  groupCount: { fontSize: 24, lineHeight: 28, fontWeight: '800' },
});
