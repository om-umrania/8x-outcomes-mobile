import { StyleSheet, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ConfidenceLift({ from, to, running }: { from: number; to: number; running: boolean }) {
  const theme = useTheme();
  const fromPercent = Math.round(from * 100);
  const toPercent = Math.round(to * 100);

  return (
    <GlassSurface contentStyle={styles.card}>
      <View style={styles.values}>
        <View>
          <ThemedText type="small" themeColor="textSecondary">
            Evidence confidence
          </ThemedText>
          <ThemedText style={styles.from}>{fromPercent}%</ThemedText>
        </View>
        <ThemedText style={styles.arrow}>→</ThemedText>
        <View style={styles.toBlock}>
          <ThemedText type="small" style={{ color: running ? theme.textSecondary : Signal.green }}>
            {running ? 'Re-checking' : 'Threshold met'}
          </ThemedText>
          <ThemedText style={[styles.to, { color: running ? theme.textSecondary : Signal.green }]}>
            {running ? '…' : `${toPercent}%`}
          </ThemedText>
        </View>
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  card: { padding: Spacing.three },
  values: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  from: { fontSize: 38, lineHeight: 42, fontWeight: '800' },
  arrow: { fontSize: 26, lineHeight: 34, opacity: 0.45, paddingBottom: 2 },
  toBlock: { alignItems: 'flex-end' },
  to: { fontSize: 38, lineHeight: 42, fontWeight: '800' },
});
