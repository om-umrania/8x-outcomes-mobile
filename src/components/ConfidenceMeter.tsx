import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { CONFIDENCE_THRESHOLD } from '@/config/constants';

export function ConfidenceMeter({ confidence, label }: { confidence: number; label?: string }) {
  const percent = Math.round(confidence * 100);
  const met = confidence >= CONFIDENCE_THRESHOLD;
  const thresholdPercent = Math.round(CONFIDENCE_THRESHOLD * 100);

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <ThemedText type="subtitle">{percent}%</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {met ? 'Threshold met' : `Threshold ${thresholdPercent}%`}
        </ThemedText>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percent}%`, backgroundColor: met ? Signal.green : Signal.violet },
          ]}
        />
        <View style={[styles.thresholdMark, { left: `${thresholdPercent}%` }]} />
      </View>
      {label ? (
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two },
  headerRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(128,128,128,0.2)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 5 },
  thresholdMark: {
    position: 'absolute',
    top: -2,
    width: 2,
    height: 14,
    backgroundColor: 'rgba(128,128,128,0.6)',
  },
});
