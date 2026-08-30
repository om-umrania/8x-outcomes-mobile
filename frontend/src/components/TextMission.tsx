import React, { useMemo, useState } from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { Image } from "expo-image";

import { radius, spacing, useTheme } from "@/src/theme";
import { MissionDetail } from "@/src/api/types";
import { AppText } from "./AppText";
import { PrimaryButton } from "./PrimaryButton";

interface TextMissionProps {
  mission: MissionDetail;
  submitting: boolean;
  contentPaddingTop: number;
  onSubmit: (answers: { questionId: string; answer: string }[]) => void;
}

const STICKY_HEIGHT = 88;

export function TextMission({
  mission,
  submitting,
  contentPaddingTop,
  onSubmit,
}: TextMissionProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const answered = useMemo(
    () => mission.questions.filter((q) => (answers[q.id] ?? "").trim().length > 0).length,
    [answers, mission.questions],
  );
  const canSubmit = answered > 0;

  const handleSubmit = () => {
    const payload = mission.questions.map((q) => ({
      questionId: q.id,
      answer: (answers[q.id] ?? "").trim(),
    }));
    onSubmit(payload);
  };

  return (
    <View style={styles.flex}>
      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={{
          paddingTop: contentPaddingTop,
          paddingHorizontal: spacing.xl,
          paddingBottom: STICKY_HEIGHT + insets.bottom + spacing.xl,
        }}
        bottomOffset={STICKY_HEIGHT + spacing.lg}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Company + type */}
        <View style={styles.metaRow}>
          {mission.companyLogo ? (
            <Image source={{ uri: mission.companyLogo }} style={styles.logo} contentFit="cover" />
          ) : null}
          <AppText variant="subhead" color={colors.onSurfaceSecondary}>
            {mission.company} · {mission.durationLabel}
          </AppText>
        </View>

        <AppText variant="hero" style={styles.title}>
          {mission.title}
        </AppText>

        {/* Context block first */}
        <View style={[styles.context, { backgroundColor: colors.surfaceTertiary }]}>
          <AppText variant="micro" color={colors.brandPrimary} style={styles.contextLabel}>
            THE SITUATION
          </AppText>
          <AppText variant="body" color={colors.onSurface}>
            {mission.context}
          </AppText>
        </View>

        {/* Questions */}
        {mission.questions.map((q, i) => (
          <View key={q.id} style={styles.question}>
            <AppText variant="headline" style={styles.prompt}>
              {i + 1}. {q.prompt}
            </AppText>
            <TextInput
              testID={`text-answer-${q.id}`}
              multiline
              value={answers[q.id] ?? ""}
              onChangeText={(t) => setAnswers((prev) => ({ ...prev, [q.id]: t }))}
              placeholder={q.placeholder}
              placeholderTextColor={colors.onSurfaceTertiary}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderColor: colors.border,
                  color: colors.onSurface,
                },
              ]}
            />
          </View>
        ))}
      </KeyboardAwareScrollView>

      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View
          style={[
            styles.sticky,
            {
              paddingBottom: insets.bottom + spacing.md,
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
          ]}
        >
          <PrimaryButton
            testID="submit-response-button"
            label={canSubmit ? "Submit response" : "Answer to continue"}
            icon={canSubmit ? "checkmark" : undefined}
            disabled={!canSubmit}
            loading={submitting}
            onPress={handleSubmit}
          />
        </View>
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logo: {
    width: 22,
    height: 22,
    borderRadius: 7,
    marginRight: spacing.sm,
  },
  title: {
    marginBottom: spacing.lg,
  },
  context: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  contextLabel: {
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  question: {
    marginBottom: spacing.xl,
  },
  prompt: {
    marginBottom: spacing.md,
  },
  input: {
    minHeight: 96,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: "top",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null),
  },
  sticky: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
