import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useReducedMotion } from "react-native-reanimated";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "./AppText";

interface RecordingIndicatorProps {
  active: boolean;
  label?: string;
  color?: string;
  compact?: boolean;
}

/**
 * Unmistakable, persistent recording indicator: a pulsing red dot + label.
 * Recording state must NEVER be hidden — this stays visible while capturing.
 */
export function RecordingIndicator({
  active,
  label = "Recording",
  color,
  compact,
}: RecordingIndicatorProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(1);
  const dotColor = color ?? colors.error;

  useEffect(() => {
    if (active && !reduceMotion) {
      pulse.value = withRepeat(
        withTiming(0.35, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    } else {
      pulse.value = withTiming(active ? 1 : 0.4, { duration: 200 });
    }
  }, [active, reduceMotion, pulse]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={active ? "Recording in progress" : "Not recording"}
      style={[
        styles.wrap,
        compact ? styles.compact : styles.full,
        {
          backgroundColor: active
            ? "rgba(180,84,84,0.16)"
            : colors.surfaceTertiary,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.dot,
          { backgroundColor: active ? dotColor : colors.onSurfaceTertiary },
          dotStyle,
        ]}
      />
      <AppText
        variant="micro"
        color={active ? dotColor : colors.onSurfaceTertiary}
        style={styles.label}
      >
        {active ? label.toUpperCase() : "PAUSED"}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.pill,
  },
  full: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  compact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  label: {
    letterSpacing: 1,
  },
});
