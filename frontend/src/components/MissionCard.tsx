import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, useTheme } from "@/src/theme";
import { MissionSummary } from "@/src/api/types";
import { AppText } from "./AppText";
import { haptic } from "@/src/utils/haptics";

interface MissionCardProps {
  mission: MissionSummary;
  onPress: () => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MissionCard({ mission, onPress, index = 0 }: MissionCardProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isVoice = mission.type === "voice";
  const cardBg = mission.isExtra ? colors.brandTertiary : colors.surfaceSecondary;
  const titleColor = mission.isExtra ? colors.onBrandTertiary : colors.onSurface;
  const bodyColor = mission.isExtra ? colors.onBrandTertiary : colors.onSurfaceSecondary;

  return (
    <AnimatedPressable
      testID={`mission-card-${mission.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${mission.title}, ${mission.durationLabel}, ${mission.type} mission`}
      onPressIn={() => {
        scale.value = withSpring(0.975, { damping: 20, stiffness: 240 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 20, stiffness: 240 });
      }}
      onPress={() => {
        haptic("light");
        onPress();
      }}
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: mission.isExtra ? colors.brandSecondary : colors.border,
        },
        animatedStyle,
      ]}
    >
      {/* Top row: company + status */}
      <View style={styles.topRow}>
        <View style={styles.company}>
          {mission.companyLogo ? (
            <Image
              source={{ uri: mission.companyLogo }}
              style={styles.logo}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.logo, { backgroundColor: colors.surfaceTertiary }]} />
          )}
          <AppText variant="subhead" color={bodyColor}>
            {mission.company}
          </AppText>
        </View>

        {mission.isExtra ? (
          <View style={[styles.extraBadge, { backgroundColor: colors.brandPrimary }]}>
            <Ionicons name="sparkles" size={12} color={colors.onBrandPrimary} />
            <AppText variant="micro" color={colors.onBrandPrimary} style={styles.extraBadgeText}>
              EXTRA
            </AppText>
          </View>
        ) : (
          <AppText variant="micro" color={colors.brandPrimary}>
            {mission.status.toUpperCase()}
          </AppText>
        )}
      </View>

      {/* Title + purpose */}
      <AppText variant="title" color={titleColor} style={styles.title}>
        {mission.title}
      </AppText>
      <AppText variant="body" color={bodyColor} style={styles.purpose}>
        {mission.purpose}
      </AppText>

      {/* Footer: type + duration + chevron */}
      <View style={styles.footer}>
        <View style={styles.meta}>
          <View
            style={[
              styles.typePill,
              {
                backgroundColor: mission.isExtra
                  ? colors.surfaceSecondary
                  : colors.surfaceTertiary,
              },
            ]}
          >
            <Ionicons
              name={isVoice ? "mic" : "chatbubble-ellipses"}
              size={14}
              color={colors.brandPrimary}
            />
            <AppText variant="caption" color={colors.onSurface} style={{ marginLeft: 6 }}>
              {mission.durationLabel} · {isVoice ? "Voice" : "Text"}
            </AppText>
          </View>
        </View>
        <View style={styles.cta}>
          <AppText variant="subhead" color={colors.brandPrimary}>
            {mission.urgency ?? mission.action}
          </AppText>
          <Ionicons name="arrow-forward" size={16} color={colors.brandPrimary} style={{ marginLeft: 4 }} />
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  company: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 26,
    height: 26,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  extraBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  extraBadgeText: {
    marginLeft: 4,
  },
  title: {
    marginBottom: spacing.xs,
  },
  purpose: {
    marginBottom: spacing.lg,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginLeft: spacing.sm,
  },
});
