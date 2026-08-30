import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { spacing, useTheme } from "@/src/theme";
import { AppText } from "./AppText";
import { haptic } from "@/src/utils/haptics";

interface StickyHeaderProps {
  title: string;
  right?: React.ReactNode;
  onBack?: () => void;
}

export const HEADER_BAR_HEIGHT = 52;

/** Translucent sticky top bar that floats over scrolling content. */
export function StickyHeader({ title, right, onBack }: StickyHeaderProps) {
  const { colors, blurTint, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top,
          height: insets.top + HEADER_BAR_HEIGHT,
          borderBottomColor: colors.border,
          backgroundColor: isWeb ? colors.surfaceSecondary : colors.glassTint,
        },
      ]}
    >
      {!isWeb && (
        <BlurView intensity={50} tint={blurTint} style={StyleSheet.absoluteFill} />
      )}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: colors.glassTint, opacity: isDark ? 0.55 : 0.6 },
        ]}
      />
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            testID="header-back-button"
            hitSlop={12}
            onPress={() => {
              haptic("light");
              onBack();
            }}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color={colors.brandPrimary} />
          </Pressable>
        ) : (
          <View style={styles.side} />
        )}
        <AppText variant="headline" numberOfLines={1} style={styles.title}>
          {title}
        </AppText>
        <View style={styles.side}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    height: HEADER_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  side: {
    minWidth: 44,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});
