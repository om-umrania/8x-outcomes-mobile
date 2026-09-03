import { StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/Icon';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CALIBRATION_MISSION_ID, WORKER_MISSIONS } from '@/worker/fixture';
import { useWorker } from '@/worker/WorkerProvider';

const TAGS: { label: string; icon: IconName }[] = [
  { label: 'Data entry', icon: 'doc' },
  { label: 'Verification', icon: 'checklist' },
  { label: 'Operations', icon: 'build' },
];

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
      footer={<PrimaryButton label="Start calibration mission" onPress={start} icon="arrowRight" />}
    >
      <OnboardingProgress step={3} />

      <View style={styles.hero}>
        <Animated.View entering={ZoomIn.duration(420).springify().damping(13)} style={[styles.badge, { backgroundColor: Signal.violet }]}>
          <Icon name="bolt" size={30} color="#FFFFFF" />
        </Animated.View>
        <Animated.View entering={FadeInUp.duration(380).delay(120)}>
          <ThemedText type="title" style={styles.title}>
            Calibration found: Hospitality operations.
          </ThemedText>
        </Animated.View>
        <Animated.View entering={FadeInUp.duration(380).delay(180)}>
          <ThemedText type="default" themeColor="textSecondary" style={styles.centerText}>
            Eat Eat’s first task for you, matched to your background. This becomes the first
            legitimate node on your Capability Profile — not a self-reported score.
          </ThemedText>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.duration(420).delay(260)}
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
            <View style={styles.minutesRow}>
              <Icon name="clock" size={13} color={theme.textSecondary} />
              <ThemedText type="small" themeColor="textSecondary">
                {mission.estimatedMinutes} min
              </ThemedText>
            </View>
          </View>
          <View style={styles.tagRow}>
            {TAGS.map((tag, index) => (
              <Animated.View
                key={tag.label}
                entering={FadeInUp.duration(320).delay(380 + index * 90)}
                style={[styles.tag, { borderColor: theme.border }]}
              >
                <Icon name={tag.icon} size={13} color={theme.textSecondary} />
                <ThemedText type="small">{tag.label}</ThemedText>
              </Animated.View>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(320).delay(680)} style={styles.footnoteRow}>
        <Icon name="mic" size={13} color={theme.textSecondary} />
        <ThemedText type="small" themeColor="textSecondary" style={styles.footnote}>
          This session will be recorded for skill verification — you’ll confirm consent next.
        </ThemedText>
      </Animated.View>
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
  title: { fontSize: 32, lineHeight: 37, fontWeight: '700', textAlign: 'center' },
  centerText: { textAlign: 'center' },
  card: { borderWidth: 1, borderRadius: 20, overflow: 'hidden', flexDirection: 'row' },
  statusBar: { width: 4 },
  cardBody: { flex: 1, padding: Spacing.three, gap: Spacing.three },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.two },
  cardHeading: { gap: Spacing.one, flex: 1 },
  cardTitle: { fontSize: 22, lineHeight: 27, fontWeight: '700' },
  minutesRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  footnoteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.one },
  footnote: { textAlign: 'center', marginTop: Spacing.two },
});
