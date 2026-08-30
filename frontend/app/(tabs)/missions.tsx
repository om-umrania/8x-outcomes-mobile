import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { spacing, radius, useTheme } from "@/src/theme";
import { AppText } from "@/src/components/AppText";
import { StickyHeader, HEADER_BAR_HEIGHT } from "@/src/components/StickyHeader";
import { MissionCard } from "@/src/components/MissionCard";
import { FLOATING_TAB_HEIGHT } from "@/src/components/BottomTabBar";
import { useMissions, useUserName } from "@/src/hooks/useData";

function greetingForNow(name: string): string {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name}` : `${part}`;
}

function CardSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[styles.skeleton, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
      <View style={[styles.skelLine, { width: "35%", backgroundColor: colors.surfaceTertiary }]} />
      <View style={[styles.skelLine, { width: "80%", height: 22, backgroundColor: colors.surfaceTertiary }]} />
      <View style={[styles.skelLine, { width: "60%", backgroundColor: colors.surfaceTertiary }]} />
    </View>
  );
}

export default function Missions() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { name } = useUserName();
  const { data: missions, loading, error, refetch } = useMissions();

  const topPad = insets.top + HEADER_BAR_HEIGHT + spacing.lg;
  const bottomPad = FLOATING_TAB_HEIGHT + insets.bottom + spacing.xxxl;

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <StickyHeader title="Missions" />

      <ScrollView
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad, paddingHorizontal: spacing.xl }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading && !!missions} onRefresh={refetch} tintColor={colors.brandPrimary} />
        }
      >
        {/* Greeting */}
        <AppText variant="hero" style={styles.greeting}>
          {greetingForNow(name)}
        </AppText>
        <AppText variant="body" color={colors.onSurfaceSecondary} style={styles.sub}>
          Here's what's waiting for you.
        </AppText>

        <AppText variant="micro" color={colors.onSurfaceTertiary} style={styles.section}>
          NEW MISSIONS
        </AppText>

        {loading && !missions ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : error && !missions ? (
          <View style={styles.state}>
            <AppText variant="body" color={colors.onSurfaceSecondary} center>
              We couldn't load your missions.
            </AppText>
            <AppText
              testID="missions-retry"
              variant="bodyStrong"
              color={colors.brandPrimary}
              onPress={refetch}
              style={{ marginTop: spacing.md }}
            >
              Try again
            </AppText>
          </View>
        ) : missions && missions.length === 0 ? (
          <View style={styles.state}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.surfaceTertiary }]}>
              <Ionicons name="checkmark-done" size={28} color={colors.brandPrimary} />
            </View>
            <AppText variant="headline" center style={{ marginTop: spacing.lg }}>
              You're all caught up
            </AppText>
            <AppText variant="body" color={colors.onSurfaceSecondary} center style={{ marginTop: spacing.sm }}>
              We'll let you know when a new mission matches you.
            </AppText>
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(300)}>
            {missions?.map((m, i) => (
              <MissionCard
                key={m.id}
                mission={m}
                index={i}
                onPress={() => router.push(`/mission/${m.id}`)}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  greeting: { marginBottom: spacing.xs },
  sub: { marginBottom: spacing.xxl },
  section: { marginBottom: spacing.lg, letterSpacing: 1 },
  state: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  skeleton: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  skelLine: {
    height: 14,
    borderRadius: 7,
    marginBottom: spacing.md,
  },
});
