import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Stage = 1 | 2 | 3 | 4;

const STAGES = ['Request', 'Route', 'Evidence', 'Decision'] as const;

export function FlowHeader({ stage, label }: { stage: Stage; label: string }) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <ThemedText type="smallBold" style={styles.brand}>
          8x / OUTCOMES
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
          {label.toUpperCase()}
        </ThemedText>
      </View>
      <View style={styles.route} accessibilityLabel={`Stage ${stage} of 4: ${STAGES[stage - 1]}`}>
        {STAGES.map((item, index) => {
          const isComplete = index < stage;
          return (
            <View key={item} style={styles.segmentWrap}>
              <View
                style={[
                  styles.segment,
                  { backgroundColor: isComplete ? theme.primary : theme.border },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two, marginBottom: Spacing.one },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { letterSpacing: 0.4 },
  label: { fontSize: 11, letterSpacing: 1.2 },
  route: { flexDirection: 'row', gap: Spacing.one },
  segmentWrap: { flex: 1 },
  segment: { height: 3, borderRadius: 999 },
});
