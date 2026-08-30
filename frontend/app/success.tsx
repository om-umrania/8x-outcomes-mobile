import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "@/src/components/AppText";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { haptic } from "@/src/utils/haptics";

const AUTO_ADVANCE_MS = 3200;

export default function Success() {
  const { colors, scheme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goProfile = () => {
    if (timer.current) clearTimeout(timer.current);
    router.replace("/(tabs)/profile");
  };
  const goMissions = () => {
    if (timer.current) clearTimeout(timer.current);
    router.replace("/(tabs)/missions");
  };

  useEffect(() => {
    haptic("success");
    timer.current = setTimeout(() => {
      router.replace("/(tabs)/profile");
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <View style={styles.center}>
        <Animated.View
          entering={ZoomIn.springify().damping(14)}
          style={[styles.check, { backgroundColor: colors.success }]}
        >
          <Ionicons name="checkmark" size={52} color={colors.onSuccess} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(500)} style={styles.textWrap}>
          <AppText variant="hero" center style={styles.title}>
            Got it — thank you.
          </AppText>
          <AppText variant="body" color={colors.onSurfaceSecondary} center>
            Your response has been securely submitted.
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(500).duration(500)} style={[styles.hint, { backgroundColor: colors.surfaceTertiary }]}>
          <Ionicons name="sparkles-outline" size={15} color={colors.brandPrimary} />
          <AppText variant="caption" color={colors.onSurfaceSecondary} style={{ marginLeft: spacing.sm }}>
            Your capability profile just grew.
          </AppText>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(650).duration(500)}
        style={[styles.actions, { paddingBottom: insets.bottom + spacing.xl }]}
      >
        <PrimaryButton
          testID="see-capabilities-button"
          label="See your capabilities"
          icon="arrow-forward"
          onPress={goProfile}
        />
        <PrimaryButton
          testID="back-to-missions-button"
          label="Back to missions"
          variant="ghost"
          onPress={goMissions}
          style={{ marginTop: spacing.md }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  check: {
    width: 104,
    height: 104,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  textWrap: {
    alignItems: "center",
  },
  title: {
    marginBottom: spacing.md,
  },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    marginTop: spacing.xxl,
  },
  actions: {
    paddingHorizontal: spacing.xl,
  },
});
