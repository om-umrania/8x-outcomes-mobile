import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CapabilityDimension } from '@/worker/types';

export function CapabilityBar({
  dimension,
  isNew = false,
}: {
  dimension: CapabilityDimension;
  isNew?: boolean;
}) {
  const theme = useTheme();
  const remaining = Math.max(
    0,
    100 - dimension.processContribution - dimension.outcomeContribution,
  );

  return (
    <View style={styles.block}>
      <View style={styles.labelRow}>
        <View style={styles.labelGroup}>
          <ThemedText type="smallBold">{dimension.label}</ThemedText>
          {isNew ? (
            <View style={styles.newPill}>
              <ThemedText type="smallBold" style={styles.newPillText}>
                NEW
              </ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {dimension.signalLabel}
        </ThemedText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View
          style={[
            styles.segment,
            { backgroundColor: Signal.violet, flex: dimension.processContribution },
          ]}
        />
        <View
          style={[
            styles.segment,
            { backgroundColor: Signal.blue, flex: dimension.outcomeContribution },
          ]}
        />
        <View style={{ flex: remaining }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  labelGroup: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  newPill: {
    backgroundColor: Signal.violet,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  newPillText: { color: '#FFFFFF', fontSize: 10, lineHeight: 14 },
  track: { height: 11, borderRadius: 99, overflow: 'hidden', flexDirection: 'row' },
  segment: { height: '100%' },
});
