import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "./AppText";
import { haptic } from "@/src/utils/haptics";

type Variant = "primary" | "secondary" | "ghost";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
  hapticFeel?: "light" | "medium" | "heavy";
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({
  label,
  onPress,
  variant = "primary",
  icon,
  disabled,
  loading,
  style,
  testID,
  hapticFeel = "medium",
}: PrimaryButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bg =
    variant === "primary"
      ? colors.brandPrimary
      : variant === "secondary"
        ? colors.surfaceTertiary
        : "transparent";
  const fg =
    variant === "primary"
      ? colors.onBrandPrimary
      : variant === "ghost"
        ? colors.brandPrimary
        : colors.onSurface;

  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled }}
      disabled={isDisabled}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 18, stiffness: 260 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 18, stiffness: 260 });
      }}
      onPress={() => {
        if (isDisabled) return;
        haptic(hapticFeel);
        onPress();
      }}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          opacity: isDisabled ? 0.5 : 1,
          borderWidth: variant === "ghost" ? StyleSheet.hairlineWidth : 0,
          borderColor: colors.border,
        },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.inner}>
          {icon ? (
            <Ionicons name={icon} size={19} color={fg} style={{ marginRight: spacing.sm }} />
          ) : null}
          <AppText variant="bodyStrong" color={fg}>
            {label}
          </AppText>
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
