import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, type Href } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CALIBRATION_PARSING_STEPS } from '@/worker/fixture';

const STEP_MS = 650;

export default function CalibratingScreen() {
  const theme = useTheme();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (stepIndex >= CALIBRATION_PARSING_STEPS.length - 1) {
      const finish = setTimeout(() => router.replace('/calibration-mission' as Href), STEP_MS);
      return () => clearTimeout(finish);
    }
    const advance = setTimeout(() => setStepIndex((current) => current + 1), STEP_MS);
    return () => clearTimeout(advance);
  }, [stepIndex]);

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.shell} edges={['top', 'bottom']}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip ahead to your calibration mission"
          style={styles.flex}
          onPress={() => router.replace('/calibration-mission' as Href)}
        >
          <View style={styles.content}>
            <View style={[styles.ring, { borderColor: Signal.violet }]}>
              <ThemedText type="subtitle" style={{ color: Signal.violet }}>
                ◎
              </ThemedText>
            </View>

            <ThemedText type="title" style={styles.title}>
              Tailoring your first mission.
            </ThemedText>
            <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
              We are preparing a task that matches your background, not scoring you against one.
            </ThemedText>

            <View
              style={[styles.statusCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
            >
              <View style={[styles.statusDot, { backgroundColor: Signal.violet }]} />
              <ThemedText type="smallBold" style={styles.statusText}>
                {CALIBRATION_PARSING_STEPS[stepIndex]}
              </ThemedText>
            </View>

            <ThemedText type="small" themeColor="textSecondary" style={styles.tapHint}>
              Tap anywhere to continue
            </ThemedText>
          </View>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  shell: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  ring: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  title: { fontSize: 32, lineHeight: 37, fontWeight: '700', textAlign: 'center' },
  body: { textAlign: 'center', maxWidth: 320 },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginTop: Spacing.four,
    minWidth: 260,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { flex: 1 },
  tapHint: { marginTop: Spacing.two },
});
