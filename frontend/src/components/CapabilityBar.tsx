import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useReducedMotion } from "react-native-reanimated";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "./AppText";
import { CapabilityDimension } from "@/src/api/types";

interface CapabilityBarProps {
  dimension: CapabilityDimension;
  index: number;
}

const BAR_HEIGHT = 14;

/**
 * A single observed capability. One bar split into two inline segments:
 * Process (larger, solid brand) + Outcome (smaller, muted brand). Process is
 * intentionally the dominant contribution.
 */
export function CapabilityBar({ dimension, index }: CapabilityBarProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 1 : 0);
  const enter = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    const delay = index * 90;
    progress.value = withDelay(
      delay + 120,
      withTiming(1, { duration: 750, easing: Easing.out(Easing.cubic) }),
    );
    enter.value = withDelay(delay, withTiming(1, { duration: 400 }));
  }, [index, progress, enter]);

  const processStyle = useAnimatedStyle(() => ({
    width: `${dimension.process * progress.value}%`,
  }));
  const outcomeStyle = useAnimatedStyle(() => ({
    width: `${dimension.outcome * progress.value}%`,
  }));
  const rowStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: (1 - enter.value) * 12 }],
  }));

  return (
    <Animated.View style={[styles.wrap, rowStyle]} testID={`capability-${dimension.key}`}>
      <View style={styles.labelRow}>
        <AppText variant="bodyStrong">{dimension.label}</AppText>
      </View>
      <AppText variant="caption" color={colors.onSurfaceTertiary} style={styles.desc}>
        {dimension.description}
      </AppText>
      <View style={[styles.track, { backgroundColor: colors.surfaceTertiary }]}>
        <Animated.View
          style={[styles.segment, styles.leftCap, { backgroundColor: colors.brandPrimary }, processStyle]}
        />
        <Animated.View
          style={[styles.segment, { backgroundColor: colors.brandSecondary }, outcomeStyle]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xl,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  desc: {
    marginBottom: spacing.sm,
  },
  track: {
    height: BAR_HEIGHT,
    borderRadius: radius.pill,
    flexDirection: "row",
    overflow: "hidden",
  },
  segment: {
    height: BAR_HEIGHT,
  },
  leftCap: {},
});
