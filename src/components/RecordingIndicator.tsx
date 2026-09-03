import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useWorker } from '@/worker/WorkerProvider';

export function RecordingIndicator() {
  const { activeCaptureMission } = useWorker();
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (activeCaptureMission) {
      pulse.value = withRepeat(withSequence(withTiming(0.35, { duration: 550 }), withTiming(1, { duration: 550 })), -1, true);
    }
  }, [activeCaptureMission, pulse]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  if (!activeCaptureMission) return null;

  const isVoice = activeCaptureMission.captureKind === 'voice';
  const label = isVoice ? 'Voice recording' : 'Screen recording';

  return (
    <View pointerEvents="none" style={styles.bar}>
      <View style={styles.labelRow}>
        <Animated.View style={[styles.dot, dotStyle]} />
        <Icon name={isVoice ? 'mic' : 'eye'} size={14} color="#FFFFFF" />
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
