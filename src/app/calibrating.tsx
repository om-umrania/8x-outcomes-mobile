import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, type Href } from 'expo-router';
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { OnboardingProgress } from '@/components/OnboardingProgress';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CALIBRATION_PARSING_STEPS } from '@/worker/fixture';

const STEP_MS = 650;

function SpinningRing() {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1400, easing: Easing.linear }), -1, false);
  }, [rotation]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.ringWrap}>
      <Animated.View style={[styles.ring, ringStyle, { borderTopColor: Signal.violet }]} />
      <ThemedText type="subtitle" style={{ color: Signal.violet }}>
        ◎
      </ThemedText>
    </View>
  );
}

export default function CalibratingScreen() {
  const theme = useTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(stepIndex / (CALIBRATION_PARSING_STEPS.length - 1), { duration: 400 });
  }, [stepIndex, progress]);

  useEffect(() => {
    if (stepIndex >= CALIBRATION_PARSING_STEPS.length - 1) {
      const finish = setTimeout(() => router.replace('/calibration-mission' as Href), STEP_MS);
      return () => clearTimeout(finish);
    }
    const advance = setTimeout(() => setStepIndex((current) => current + 1), STEP_MS);
    return () => clearTimeout(advance);
  }, [stepIndex]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.shell} edges={['top', 'bottom']}>
        <View style={styles.progressWrap}>
          <OnboardingProgress step={2} />
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip ahead to your calibration mission"
          style={styles.flex}
          onPress={() => router.replace('/calibration-mission' as Href)}
        >
          <View style={styles.content}>
            <SpinningRing />

            <ThemedText type="title" style={styles.title}>
              Tailoring your first mission.
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
              We are preparing a task that matches your background, not scoring you against one.
            </ThemedText>

            <View
              style={[styles.statusCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
            >
              <View style={styles.statusTextWrap}>
                <Animated.View
                  key={stepIndex}
                  entering={FadeInUp.duration(220)}
                  exiting={FadeOutUp.duration(150)}
                  style={styles.statusTextRow}
                >
                  <View style={[styles.statusDot, { backgroundColor: Signal.violet }]} />
                  <ThemedText type="smallBold" style={styles.statusText}>
                    {CALIBRATION_PARSING_STEPS[stepIndex]}
                  </ThemedText>
                </Animated.View>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
                <Animated.View style={[styles.progressFill, barStyle]} />
              </View>
            </View>

            <ThemedText type="small" themeColor="textSecondary" style={styles.tapHint}>
              Tap anywhere to continue
            </ThemedText>
          </View>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  shell: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },
  progressWrap: { paddingHorizontal: Spacing.four, paddingTop: Spacing.two },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  ringWrap: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  ring: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  title: { fontSize: 32, lineHeight: 37, fontWeight: '700', textAlign: 'center' },
  body: { textAlign: 'center', maxWidth: 320 },
  statusCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginTop: Spacing.four,
    minWidth: 260,
    gap: Spacing.two,
    overflow: 'hidden',
  },
  statusTextWrap: { minHeight: 20, justifyContent: 'center' },
  statusTextRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { flex: 1 },
  progressTrack: { height: 3, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2, backgroundColor: Signal.violet },
  tapHint: { marginTop: Spacing.two },
});
