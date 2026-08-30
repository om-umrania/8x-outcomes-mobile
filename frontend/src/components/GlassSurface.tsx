import React from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

import { radius as radiusTokens, useTheme } from "@/src/theme";

interface GlassSurfaceProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  radius?: number;
  bordered?: boolean;
  testID?: string;
}

/**
 * Liquid-Glass functional surface: translucent blur with a readable tint
 * behind it. Used for the tab bar, sticky headers and floating controls.
 * Never nest a GlassSurface inside another GlassSurface.
 */
export function GlassSurface({
  children,
  style,
  intensity = 40,
  radius = radiusTokens.lg,
  bordered = true,
  testID,
}: GlassSurfaceProps) {
  const { colors, blurTint, isDark } = useTheme();

  // Web BlurView is weak; lean on a solid-ish tint so content stays legible.
  const webFallback = Platform.OS === "web";

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          borderRadius: radius,
          borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
          borderColor: colors.border,
          backgroundColor: webFallback ? colors.surfaceSecondary : colors.glassTint,
        },
        style,
      ]}
    >
      {!webFallback && (
        <BlurView
          intensity={intensity}
          tint={blurTint}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.glassTint, opacity: isDark ? 0.5 : 0.55 },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  content: {
    position: "relative",
  },
});
