import React, { forwardRef, useCallback, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "./AppText";
import { PrimaryButton } from "./PrimaryButton";
import { haptic } from "@/src/utils/haptics";

interface ConsentSheetProps {
  title: string;
  body: string;
  onConsent: () => void;
}

/**
 * Explicit, revocable consent BEFORE any recording starts. Capture never
 * begins silently — the user must toggle consent on and continue.
 */
export const ConsentSheet = forwardRef<BottomSheetModal, ConsentSheetProps>(
  ({ title, body, onConsent }, ref) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [agreed, setAgreed] = useState(false);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.4}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        onDismiss={() => setAgreed(false)}
        handleIndicatorStyle={{ backgroundColor: colors.borderStrong }}
        backgroundStyle={{ backgroundColor: colors.surfaceSecondary }}
      >
        <BottomSheetView
          style={[
            styles.content,
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.brandTertiary }]}>
            <Ionicons name="mic" size={26} color={colors.onBrandTertiary} />
          </View>

          <AppText variant="title" style={styles.title}>
            {title}
          </AppText>
          <AppText variant="body" color={colors.onSurfaceSecondary} style={styles.body}>
            {body}
          </AppText>

          <View style={[styles.toggleRow, { backgroundColor: colors.surfaceTertiary }]}>
            <View style={styles.toggleText}>
              <AppText variant="bodyStrong">Record my voice</AppText>
              <AppText variant="caption" color={colors.onSurfaceTertiary} style={{ marginTop: 2 }}>
                You can stop anytime during the mission.
              </AppText>
            </View>
            <Switch
              testID="consent-toggle"
              value={agreed}
              onValueChange={(v) => {
                haptic("light");
                setAgreed(v);
              }}
              trackColor={{ false: colors.borderStrong, true: colors.brandPrimary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <PrimaryButton
            testID="consent-continue-button"
            label="Start voice mission"
            icon="arrow-forward"
            disabled={!agreed}
            onPress={onConsent}
            style={{ marginTop: spacing.lg }}
          />
          <AppText
            variant="caption"
            color={colors.onSurfaceTertiary}
            center
            style={{ marginTop: spacing.md }}
          >
            Your recording is used only to understand how you work.
          </AppText>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

ConsentSheet.displayName = "ConsentSheet";

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.sm,
  },
  body: {
    marginBottom: spacing.xl,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderRadius: radius.lg,
  },
  toggleText: {
    flex: 1,
    marginRight: spacing.md,
  },
});
