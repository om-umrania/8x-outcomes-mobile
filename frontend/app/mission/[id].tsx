import React, { useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "@/src/components/AppText";
import { StickyHeader, HEADER_BAR_HEIGHT } from "@/src/components/StickyHeader";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ConsentSheet } from "@/src/components/ConsentSheet";
import { TextMission } from "@/src/components/TextMission";
import { useMission } from "@/src/hooks/useData";
import { api } from "@/src/api/client";
import { haptic } from "@/src/utils/haptics";

function Expect({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.expectRow}>
      <View style={[styles.expectIcon, { backgroundColor: colors.surfaceTertiary }]}>
        <Ionicons name={icon} size={16} color={colors.brandPrimary} />
      </View>
      <AppText variant="subhead" color={colors.onSurfaceSecondary} style={{ flex: 1 }}>
        {text}
      </AppText>
    </View>
  );
}

export default function MissionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const consentRef = useRef<BottomSheetModal>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: mission, loading, error, refetch } = useMission(id);

  const topPad = insets.top + HEADER_BAR_HEIGHT;

  if (loading && !mission) {
    return (
      <View style={[styles.root, styles.center, { backgroundColor: colors.surface }]}>
        <StickyHeader title="Mission" onBack={() => router.back()} />
        <ActivityIndicator color={colors.brandPrimary} />
      </View>
    );
  }

  if (error || !mission) {
    return (
      <View style={[styles.root, styles.center, { backgroundColor: colors.surface }]}>
        <StickyHeader title="Mission" onBack={() => router.back()} />
        <AppText variant="body" color={colors.onSurfaceSecondary}>Couldn't load this mission.</AppText>
        <AppText testID="mission-retry" variant="bodyStrong" color={colors.brandPrimary} onPress={refetch} style={{ marginTop: spacing.md }}>
          Try again
        </AppText>
      </View>
    );
  }

  // --- TEXT MISSION ---------------------------------------------------------
  if (mission.type === "text") {
    const handleSubmit = async (answers: { questionId: string; answer: string }[]) => {
      setSubmitting(true);
      haptic("medium");
      await api.submit({ missionId: mission.id, type: "text", answers });
      setSubmitting(false);
      router.replace("/success");
    };
    return (
      <View style={[styles.root, { backgroundColor: colors.surface }]}>
        <StickyHeader title={mission.company} onBack={() => router.back()} />
        <TextMission
          mission={mission}
          submitting={submitting}
          contentPaddingTop={topPad + spacing.lg}
          onSubmit={handleSubmit}
        />
      </View>
    );
  }

  // --- VOICE MISSION (intro + consent) -------------------------------------
  const startVoice = () => {
    consentRef.current?.dismiss();
    router.push(`/voice/${mission.id}`);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <StickyHeader title={mission.company} onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          {mission.bgImage ? (
            <Image source={{ uri: mission.bgImage }} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.brandTertiary }]} />
          )}
          <LinearGradient colors={["rgba(0,0,0,0.15)", "rgba(0,0,0,0.55)"]} style={StyleSheet.absoluteFill} />
          <View style={[styles.heroContent, { paddingTop: topPad }]}>
            <View style={styles.voiceTag}>
              <Ionicons name="mic" size={13} color="#FFFFFF" />
              <AppText variant="micro" color="#FFFFFF" style={{ marginLeft: 6 }}>
                {mission.durationLabel.toUpperCase()} · VOICE
              </AppText>
            </View>
            <AppText variant="display" color="#FFFFFF" style={styles.heroTitle}>
              {mission.title}
            </AppText>
          </View>
        </View>

        <View style={styles.body}>
          <AppText variant="body" color={colors.onSurfaceSecondary}>
            {mission.purpose}
          </AppText>

          <View style={[styles.context, { backgroundColor: colors.surfaceTertiary }]}>
            <AppText variant="micro" color={colors.brandPrimary} style={styles.contextLabel}>
              THE SITUATION
            </AppText>
            <AppText variant="body">{mission.context}</AppText>
          </View>

          {mission.scenario ? (
            <View style={[styles.scenario, { backgroundColor: colors.brandTertiary }]}>
              <Ionicons name="restaurant" size={18} color={colors.onBrandTertiary} />
              <AppText variant="headline" color={colors.onBrandTertiary} style={styles.scenarioText}>
                {mission.scenario}
              </AppText>
            </View>
          ) : null}

          <AppText variant="micro" color={colors.onSurfaceTertiary} style={styles.expectHeader}>
            WHAT TO EXPECT
          </AppText>
          <Expect icon="chatbubbles-outline" text="A short spoken conversation — just talk it through." />
          <Expect icon="mic-outline" text="We'll record your voice, only after you agree." />
          <Expect icon="time-outline" text={`About ${mission.durationLabel}. Stop whenever you like.`} />
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + spacing.md, backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <PrimaryButton
          testID="ready-to-start-button"
          label="Ready to start?"
          icon="mic"
          onPress={() => {
            haptic("light");
            consentRef.current?.present();
          }}
        />
      </View>

      <ConsentSheet
        ref={consentRef}
        title={mission.voice?.consentTitle ?? "We'd like to record your voice"}
        body={mission.voice?.consentBody ?? "Your voice is recorded to understand how you approach the work."}
        onConsent={startVoice}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { alignItems: "center", justifyContent: "center" },
  hero: {
    height: 300,
    justifyContent: "flex-end",
  },
  heroContent: {
    padding: spacing.xl,
  },
  voiceTag: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  heroTitle: {
    marginTop: spacing.xs,
  },
  body: {
    padding: spacing.xl,
  },
  context: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  contextLabel: {
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  scenario: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  scenarioText: {
    marginTop: spacing.sm,
    lineHeight: 24,
  },
  expectHeader: {
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
    letterSpacing: 1,
  },
  expectRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  expectIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  cta: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
