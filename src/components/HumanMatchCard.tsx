import { StyleSheet } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { HumanMatch } from '@/state/types';

export function HumanMatchCard({ match }: { match: HumanMatch }) {
  return (
    <GlassSurface style={styles.wrap} contentStyle={styles.card}>
      <ThemedText type="smallBold">{match.cohortTag}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {match.matchScore}% match
      </ThemedText>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  wrap: { flexBasis: '48%', flexGrow: 1 },
  card: {
    padding: Spacing.three,
    gap: 2,
  },
});
