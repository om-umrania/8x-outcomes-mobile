import React, { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "@/src/components/AppText";
import { StickyHeader } from "@/src/components/StickyHeader";
import { ProfileSummary } from "@/src/components/ProfileSummary";
import { CapabilityBar } from "@/src/components/CapabilityBar";
import { FLOATING_TAB_HEIGHT } from "@/src/components/BottomTabBar";
import { useProfile, useUserName } from "@/src/hooks/useData";

function BarSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: spacing.xl }}>
      <View style={[styles.skel, { width: "40%", height: 16, backgroundColor: colors.surfaceTertiary }]} />
      <View style={[styles.skel, { width: "70%", height: 12, backgroundColor: colors.surfaceTertiary }]} />
      <View style={[styles.skel, { width: "100%", height: 14, borderRadius: 7, backgroundColor: colors.surfaceTertiary }]} />
    </View>
  );
}

export default function Profile() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { name } = useUserName();
  const { data: profile, loading, error, refetch } = useProfile();

  // Refresh whenever the tab regains focus so completed missions show up.
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const bottomPad = FLOATING_TAB_HEIGHT + insets.bottom + spacing.xxxl;

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <StickyHeader title="Profile" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        {loading && !profile ? (
          <View style={{ paddingTop: insets.top + 80, paddingHorizontal: spacing.xl }}>
            <View style={[styles.skel, { width: "50%", height: 28, backgroundColor: colors.surfaceTertiary }]} />
            <View style={[styles.skel, { width: "90%", height: 16, marginBottom: spacing.xxl, backgroundColor: colors.surfaceTertiary }]} />
            <BarSkeleton />
            <BarSkeleton />
            <BarSkeleton />
          </View>
        ) : error && !profile ? (
          <View style={[styles.state, { paddingTop: insets.top + 120 }]}>
            <AppText variant="body" color={colors.onSurfaceSecondary} center>
              We couldn't load your profile.
            </AppText>
            <AppText
              testID="profile-retry"
              variant="bodyStrong"
              color={colors.brandPrimary}
              onPress={refetch}
              style={{ marginTop: spacing.md }}
            >
              Try again
            </AppText>
          </View>
        ) : profile ? (
          <>
            <ProfileSummary profile={profile} name={name} />

            <View style={styles.bars}>
              {profile.dimensions.map((d, i) => (
                <CapabilityBar key={d.key} dimension={d} index={i} />
              ))}
            </View>

            <View style={[styles.note, { backgroundColor: colors.surfaceTertiary }]}>
              <AppText variant="caption" color={colors.onSurfaceSecondary} center>
                Process shows how you approach the work. It carries more weight than
                outcome — because how you think is what lasts.
              </AppText>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bars: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  note: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  state: {
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  skel: {
    borderRadius: 8,
    marginBottom: spacing.md,
  },
});
