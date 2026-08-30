import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useWorker } from '@/worker/WorkerProvider';

export function RecordingIndicator() {
  const { activeCaptureMission } = useWorker();

  if (!activeCaptureMission) return null;

  const label =
    activeCaptureMission.captureKind === 'screen' ? 'Screen recording' : 'Voice recording';

  return (
    <View pointerEvents="none" style={styles.bar}>
      <View style={styles.labelRow}>
        <View style={styles.dot} />
        <ThemedText type="smallBold" style={styles.text}>
          {label} · On
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#2A0C0C',
    paddingHorizontal: Spacing.four,
    paddingVertical: 9,
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Signal.red },
  text: { color: '#FFFFFF', fontSize: 12, lineHeight: 16 },
});
