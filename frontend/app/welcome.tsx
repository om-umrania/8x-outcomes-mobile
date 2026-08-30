import React, { useState } from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAwareScrollView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import Animated, { FadeInDown } from "react-native-reanimated";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "@/src/components/AppText";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { saveUserName } from "@/src/hooks/useData";

export default function Welcome() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");

  const handleContinue = async () => {
    await saveUserName(name.trim());
    router.replace("/(tabs)/missions");
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + spacing.xxxl,
          paddingHorizontal: spacing.xl,
          paddingBottom: 120,
        }}
        bottomOffset={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(500)}>
          <View style={[styles.mark, { backgroundColor: colors.brandPrimary }]}>
            <AppText variant="title" color={colors.onBrandPrimary}>
              8x
            </AppText>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <AppText variant="hero" style={styles.title}>
            Show how you work.
          </AppText>
          <AppText variant="body" color={colors.onSurfaceSecondary} style={styles.subtitle}>
            Complete short, real-world missions. Your capability profile grows from
            how you approach the work — not a résumé.
          </AppText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.field}>
          <AppText variant="micro" color={colors.brandPrimary} style={styles.fieldLabel}>
            WHAT SHOULD WE CALL YOU?
          </AppText>
          <TextInput
            testID="name-input"
            value={name}
            onChangeText={setName}
            placeholder="Your first name"
            placeholderTextColor={colors.onSurfaceTertiary}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleContinue}
            style={[
              styles.input,
              { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, color: colors.onSurface },
            ]}
          />
        </Animated.View>
      </KeyboardAwareScrollView>

      <KeyboardStickyView offset={{ closed: 0, opened: insets.bottom }}>
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PrimaryButton
            testID="welcome-continue-button"
            label="Get started"
            icon="arrow-forward"
            onPress={handleContinue}
          />
        </View>
      </KeyboardStickyView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  mark: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxl,
  },
  title: {
    marginBottom: spacing.md,
  },
  subtitle: {
    marginBottom: spacing.xxxl,
  },
  field: {
    marginTop: spacing.sm,
  },
  fieldLabel: {
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  input: {
    height: 56,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
    fontSize: 17,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as object) : null),
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
});
