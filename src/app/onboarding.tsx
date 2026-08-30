import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Selection = 'resume' | 'linkedin' | null;

export default function OnboardingScreen() {
  const theme = useTheme();
  const [selection, setSelection] = useState<Selection>(null);

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
          <PrimaryButton label="Continue" onPress={continueToCalibration} />
        ) : (
          <SecondaryButton label="Skip and start fresh" onPress={skip} />
        )
      }
    >
      <View style={styles.hero}>
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
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Upload resume"
        onPress={() => setSelection('resume')}
        style={({ pressed }) => [
          styles.dropzone,
          { borderColor: selection === 'resume' ? Signal.blue : theme.border, backgroundColor: theme.backgroundElement },
          pressed && styles.pressed,
        ]}
      >
        <ThemedText type="subtitle" style={styles.dropzoneIcon}>
          ↑
        </ThemedText>
        <ThemedText type="smallBold">
          {selection === 'resume' ? 'priya-resume.pdf selected' : 'Upload resume'}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          PDF or DOCX, up to 5MB
        </ThemedText>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <ThemedText type="small" themeColor="textSecondary">
          OR LINK PROFILE
        </ThemedText>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Connect LinkedIn"
        onPress={() => setSelection('linkedin')}
        style={({ pressed }) => [
          styles.linkedinButton,
          { backgroundColor: selection === 'linkedin' ? '#0A66C2' : theme.backgroundElement, borderColor: theme.border },
          pressed && styles.pressed,
        ]}
      >
        <ThemedText
          type="smallBold"
          style={selection === 'linkedin' ? styles.linkedinTextActive : undefined}
        >
          {selection === 'linkedin' ? 'LinkedIn connected' : 'Connect LinkedIn'}
        </ThemedText>
      </Pressable>

      <View style={styles.lockRow}>
        <ThemedText type="small" themeColor="textSecondary">
          Read locally for domain matching only · securely transmitted
        </ThemedText>
      </View>
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
  pressed: { opacity: 0.75 },
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
});
