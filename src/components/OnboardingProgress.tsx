import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** The four Resume-to-Mission Bridge stages (WORKER_APP.md steps 1-4). */
export const ONBOARDING_STEPS = ['Sign in', 'Your background', 'Calibrating', 'First mission'] as const;

function Segment({
  active,
  current,
  trackColor,
}: {
  active: boolean;
  current: boolean;
  trackColor: string;
}) {
  const fill = useSharedValue(active ? 1 : 0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    fill.value = withTiming(active ? 1 : 0, { duration: 380 });
  }, [active, fill]);

  useEffect(() => {
    if (current) {
      pulse.value = withRepeat(
        withSequence(withTiming(0.5, { duration: 650 }), withTiming(1, { duration: 650 })),
        -1,
        true,
      );
    } else {
      pulse.value = withTiming(1, { duration: 200 });
    }
  }, [current, pulse]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(fill.value, [0, 1], [trackColor, Signal.blue]),
    opacity: current ? pulse.value : 1,
    transform: [{ scaleY: 0.55 + fill.value * 0.45 }],
  }));

  return <Animated.View style={[styles.segment, style]} />;
}

export function OnboardingProgress({ step }: { step: number }) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        {ONBOARDING_STEPS.map((_, index) => (
          <Segment key={index} active={index <= step} current={index === step} trackColor={theme.border} />
        ))}
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        Step {step + 1} of {ONBOARDING_STEPS.length} · {ONBOARDING_STEPS[step]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.two, marginTop: Spacing.two, marginBottom: Spacing.one },
  track: { flexDirection: 'row', gap: Spacing.one },
  segment: { flex: 1, height: 4, borderRadius: 2 },
});
