import { StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CALIBRATION_MISSION_ID, WORKER_MISSIONS } from '@/worker/fixture';
import { useWorker } from '@/worker/WorkerProvider';

export default function CalibrationMissionScreen() {
  const theme = useTheme();
  const { selectMission } = useWorker();
  const mission = WORKER_MISSIONS.find((item) => item.id === CALIBRATION_MISSION_ID)!;

  function start() {
    selectMission(mission.id);
    router.push('/worker-mission' as Href);
  }

  return (
    <ScreenContainer
      footer={<PrimaryButton label="Start calibration mission" onPress={start} />}
    >
      <View style={styles.hero}>
        <View style={[styles.badge, { backgroundColor: Signal.violet }]}>
          <ThemedText type="subtitle" style={styles.badgeText}>
            ◎
          </ThemedText>
        </View>
        <ThemedText type="title" style={styles.title}>
          Calibration found: Hospitality operations.
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Eat Eat’s first task for you, matched to your background. This becomes the first
          legitimate node on your Capability Profile — not a self-reported score.
        </ThemedText>
      </View>

      <View
        style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
      >
        <View style={[styles.statusBar, { backgroundColor: Signal.amber }]} />
        <View style={styles.cardBody}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeading}>
              <ThemedText type="small" themeColor="textSecondary">
                {mission.outcomeContext}
              </ThemedText>
              <ThemedText style={styles.cardTitle}>{mission.title}</ThemedText>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              {mission.estimatedMinutes} min
            </ThemedText>
          </View>
          <View style={styles.tagRow}>
            <View style={[styles.tag, { borderColor: theme.border }]}>
              <ThemedText type="small">Data entry</ThemedText>
            </View>
            <View style={[styles.tag, { borderColor: theme.border }]}>
              <ThemedText type="small">Verification</ThemedText>
            </View>
            <View style={[styles.tag, { borderColor: theme.border }]}>
              <ThemedText type="small">Operations</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <ThemedText type="small" themeColor="textSecondary" style={styles.footnote}>
        This session will be recorded for skill verification — you’ll confirm consent next.
      </ThemedText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: Spacing.two, paddingTop: Spacing.four, marginBottom: Spacing.three },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  badgeText: { color: '#FFFFFF', fontSize: 28 },
  title: { fontSize: 32, lineHeight: 37, fontWeight: '700', textAlign: 'center' },
  card: { borderWidth: 1, borderRadius: 20, overflow: 'hidden', flexDirection: 'row' },
  statusBar: { width: 4 },
  cardBody: { flex: 1, padding: Spacing.three, gap: Spacing.three },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.two },
  cardHeading: { gap: Spacing.one, flex: 1 },
  cardTitle: { fontSize: 22, lineHeight: 27, fontWeight: '700' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tag: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 },
  footnote: { textAlign: 'center', marginTop: Spacing.two },
});
