import React from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "./AppText";
import { CapabilityProfile } from "@/src/api/types";

interface ProfileSummaryProps {
  profile: CapabilityProfile;
  name: string;
}

const HEADER_BG =
  "https://images.unsplash.com/photo-1671716784499-a3d26826d844?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHdhcm0lMjB0ZXJyYWNvdHRhJTIwbW9kZXJuJTIwZmx1aWQlMjBiYWNrZ3JvdW5kfGVufDB8fHx8MTc4ODA4MDY2NXww&ixlib=rb-4.1.0&q=85";

/** Header for the Capability Profile — avatar over a warm fluid backdrop,
 * the observed-work explanation, and the Process / Outcome legend. */
export function ProfileSummary({ profile, name }: ProfileSummaryProps) {
  const { colors } = useTheme();
  const initial = (name || "You").trim().charAt(0).toUpperCase() || "Y";

  return (
    <View style={styles.wrap}>
      <View style={styles.hero}>
        <Image source={{ uri: HEADER_BG }} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        <LinearGradient
          colors={["transparent", colors.surface]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.avatarWrap}>
          <View style={[styles.avatar, { backgroundColor: colors.brandPrimary }]}>
            <AppText variant="display" color={colors.onBrandPrimary}>
              {initial}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        <AppText variant="hero">{profile.headline}</AppText>
        <AppText variant="body" color={colors.onSurfaceSecondary} style={styles.subtitle}>
          {profile.subtitle}
        </AppText>

        <View style={[styles.observed, { backgroundColor: colors.surfaceTertiary }]}>
          <Ionicons name="eye-outline" size={16} color={colors.onSurfaceTertiary} />
          <AppText variant="caption" color={colors.onSurfaceTertiary} style={{ marginLeft: spacing.sm }}>
            Observed from {profile.observedMissions} completed missions
          </AppText>
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: colors.brandPrimary }]} />
            <AppText variant="caption" color={colors.onSurfaceSecondary}>
              {profile.processLabel} — how you work
            </AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: colors.brandSecondary }]} />
            <AppText variant="caption" color={colors.onSurfaceSecondary}>
              {profile.outcomeLabel} — the result
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  hero: {
    height: 180,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  avatarWrap: {
    marginBottom: -36,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.35)",
  },
  body: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + spacing.md,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  observed: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    marginTop: spacing.lg,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
});
