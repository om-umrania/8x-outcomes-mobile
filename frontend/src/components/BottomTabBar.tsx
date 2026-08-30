import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "./AppText";
import { haptic } from "@/src/utils/haptics";

const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  missions: { on: "flag", off: "flag-outline" },
  profile: { on: "person", off: "person-outline" },
  history: { on: "time", off: "time-outline" },
};

export const FLOATING_TAB_HEIGHT = 62;

/** Translucent floating tab bar (Missions · Profile · History). */
export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, blurTint, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const bottomGap = Math.max(insets.bottom, spacing.md);

  return (
    <View
      style={[
        styles.wrap,
        { bottom: bottomGap, height: FLOATING_TAB_HEIGHT },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.bar,
          {
            borderColor: colors.border,
            backgroundColor: isWeb ? colors.surfaceSecondary : colors.glassTint,
          },
        ]}
      >
        {!isWeb && <BlurView intensity={60} tint={blurTint} style={StyleSheet.absoluteFill} />}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.glassTint, opacity: isDark ? 0.6 : 0.7 },
          ]}
        />

        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const label = (descriptors[route.key].options.title ?? route.name) as string;
          const icon = ICONS[route.name] ?? ICONS.missions;
          const tint = focused ? colors.brandPrimary : colors.onSurfaceTertiary;

          return (
            <Pressable
              key={route.key}
              testID={`tab-${route.name}`}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              onPress={() => {
                haptic("light");
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={styles.item}
            >
              <Ionicons name={focused ? icon.on : icon.off} size={23} color={tint} />
              <AppText variant="micro" color={tint} style={styles.label}>
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: spacing.xl,
    right: spacing.xl,
  },
  bar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    paddingHorizontal: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  label: {
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
