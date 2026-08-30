import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CapabilityDimension } from '@/worker/types';

export function CapabilityBar({
  dimension,
  isNew = false,
  onPress,
}: {
  dimension: CapabilityDimension;
  isNew?: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const pressed = useSharedValue(0);
  const remaining = Math.max(
    0,
    100 - dimension.processContribution - dimension.outcomeContribution,
  );

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.015 }],
    opacity: 1 - pressed.value * 0.1,
  }));

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={onPress ? `${dimension.label}, see contributing missions` : undefined}
      disabled={!onPress}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 90 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 14, stiffness: 260 });
      }}
    >
      <Animated.View style={[styles.block, pressStyle]}>
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
          <View style={styles.signalGroup}>
            <ThemedText type="small" themeColor="textSecondary">
              {dimension.signalLabel}
            </ThemedText>
            {onPress ? (
              <ThemedText type="small" themeColor="textSecondary">
                ›
              </ThemedText>
            ) : null}
          </View>
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
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.two },
  labelGroup: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  signalGroup: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
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
