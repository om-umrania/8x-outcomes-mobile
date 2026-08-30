import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  ZoomIn,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Selection = 'resume' | 'linkedin' | null;

function CheckBadge() {
  return (
    <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.checkBadge}>
      <ThemedText type="smallBold" style={styles.checkGlyph}>
        ✓
      </ThemedText>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const theme = useTheme();
  const [selection, setSelection] = useState<Selection>(null);

  const resumeSelected = useSharedValue(0);
  const linkedinSelected = useSharedValue(0);

  useEffect(() => {
    resumeSelected.value = withSpring(selection === 'resume' ? 1 : 0, { damping: 16, stiffness: 220 });
    linkedinSelected.value = withTiming(selection === 'linkedin' ? 1 : 0, { duration: 260 });
  }, [selection, resumeSelected, linkedinSelected]);

  const dropzoneStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(resumeSelected.value, [0, 1], [theme.border, Signal.blue]),
    backgroundColor: interpolateColor(
      resumeSelected.value,
      [0, 1],
      [theme.backgroundElement, theme.backgroundSelected],
    ),
    transform: [{ scale: 1 + resumeSelected.value * 0.015 }],
  }));

  const linkedinStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(linkedinSelected.value, [0, 1], [theme.backgroundElement, '#0A66C2']),
    borderColor: interpolateColor(linkedinSelected.value, [0, 1], [theme.border, '#0A66C2']),
    transform: [{ scale: 1 + linkedinSelected.value * 0.01 }],
  }));

  function continueToCalibration() {
    router.push('/calibrating' as Href);
  }

  function skip() {
    router.replace('/inbox' as Href);
  }

  return (
    <ScreenContainer
      footer={
        selection ? (
          <Animated.View key="continue" entering={FadeIn.duration(220)} exiting={FadeOut.duration(120)}>
            <PrimaryButton label="Continue" onPress={continueToCalibration} />
          </Animated.View>
        ) : (
          <Animated.View key="skip" entering={FadeIn.duration(220)} exiting={FadeOut.duration(120)}>
            <SecondaryButton label="Skip and start fresh" onPress={skip} />
          </Animated.View>
        )
      }
    >
      <OnboardingProgress step={1} />

      <Animated.View entering={FadeInDown.duration(400)} style={styles.hero}>
        <ThemedText type="small" themeColor="textSecondary">
          RESUME-TO-MISSION BRIDGE
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          Drop your background.
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          We read this once, only to calibrate your first mission. It never becomes a score —
          your Capability Profile only fills in from work you actually do.
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(80)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Upload resume"
          onPress={() => setSelection('resume')}
        >
          <Animated.View style={[styles.dropzone, dropzoneStyle]}>
            <ThemedText type="subtitle" style={styles.dropzoneIcon}>
              ↑
            </ThemedText>
            <ThemedText type="smallBold">
              {selection === 'resume' ? 'priya-resume.pdf selected' : 'Upload resume'}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              PDF or DOCX, up to 5MB
            </ThemedText>
            {selection === 'resume' ? <CheckBadge /> : null}
          </Animated.View>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(140)} style={styles.dividerRow}>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <ThemedText type="small" themeColor="textSecondary">
          OR LINK PROFILE
        </ThemedText>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(200)}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Connect LinkedIn"
          onPress={() => setSelection('linkedin')}
        >
          <Animated.View style={[styles.linkedinButton, linkedinStyle]}>
            <ThemedText
              type="smallBold"
              style={selection === 'linkedin' ? styles.linkedinTextActive : undefined}
            >
              {selection === 'linkedin' ? 'LinkedIn connected' : 'Connect LinkedIn'}
            </ThemedText>
            {selection === 'linkedin' ? <CheckBadge /> : null}
          </Animated.View>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(260)} style={styles.lockRow}>
        <ThemedText type="small" themeColor="textSecondary">
          Read locally for domain matching only · securely transmitted
        </ThemedText>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { gap: Spacing.two, marginTop: Spacing.three, marginBottom: Spacing.two },
  title: { fontSize: 38, lineHeight: 42, fontWeight: '700' },
  dropzone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  dropzoneIcon: { fontSize: 28, lineHeight: 32 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  divider: { flex: 1, height: StyleSheet.hairlineWidth },
  linkedinButton: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkedinTextActive: { color: '#FFFFFF' },
  lockRow: { alignItems: 'center', marginTop: Spacing.two },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Signal.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkGlyph: { color: '#FFFFFF', fontSize: 13, lineHeight: 15 },
});
