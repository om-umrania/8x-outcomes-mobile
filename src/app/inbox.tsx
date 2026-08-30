import { StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { WorkerHeader } from '@/components/WorkerHeader';
import { WorkerMissionCard } from '@/components/WorkerMissionCard';
import { Spacing } from '@/constants/theme';
import { WORKER_MISSIONS } from '@/worker/fixture';
import { useWorker } from '@/worker/WorkerProvider';

export default function MissionInboxScreen() {
  const { state, selectMission } = useWorker();
  const availableCount = WORKER_MISSIONS.filter((mission) => {
    const status = state.missionStatuses[mission.id];
    return status === 'available' || status === 'in_progress';
  }).length;

  function openMission(missionId: string) {
    selectMission(missionId);
    router.push('/worker-mission' as Href);
  }

  return (
    <ScreenContainer>
      <WorkerHeader />

      <View style={styles.hero}>
        <ThemedText type="small" themeColor="textSecondary">
          EAT EAT · YOUR MISSIONS
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          A few people need your perspective.
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Choose a mission that fits your time. You will always see what is recorded before
          you begin.
        </ThemedText>
      </View>

      <View style={styles.sectionHeader}>
        <ThemedText type="smallBold">Ready now</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {availableCount} {availableCount === 1 ? 'mission' : 'missions'}
        </ThemedText>
      </View>

      <View style={styles.list}>
        {WORKER_MISSIONS.map((mission) => (
          <WorkerMissionCard
            key={mission.id}
            mission={mission}
            status={state.missionStatuses[mission.id]}
            onPress={() => openMission(mission.id)}
          />
        ))}
      </View>

      <ThemedText type="small" themeColor="textSecondary" style={styles.demoNote}>
        Demo inbox · fictional Eat Eat missions · no live dispatch
      </ThemedText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { gap: Spacing.two, marginTop: Spacing.three, marginBottom: Spacing.three },
  title: { fontSize: 38, lineHeight: 42, fontWeight: '700' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { gap: Spacing.three },
  demoNote: { textAlign: 'center', marginTop: Spacing.two },
});
