import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { WorkerMission, WorkerMissionStatus } from '@/worker/types';

const STATUS_LABEL: Record<WorkerMissionStatus, string> = {
  available: 'Available',
  in_progress: 'In progress',
  completed: 'Completed',
  declined: 'Declined',
};

export function WorkerMissionCard({
  mission,
  status,
  onPress,
}: {
  mission: WorkerMission;
  status: WorkerMissionStatus;
  onPress: () => void;
}) {
  const theme = useTheme();
  const unavailable = status === 'completed' || status === 'declined';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${mission.title}, ${STATUS_LABEL[status]}`}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        mission.isAdaptive && styles.adaptiveCard,
        pressed && !unavailable && styles.pressed,
        unavailable && styles.unavailable,
      ]}
    >
      <View style={styles.metaRow}>
        {mission.isAdaptive ? (
          <View style={styles.adaptivePill}>
            <Icon name="bolt" size={12} color="#8A5600" />
            <ThemedText type="smallBold" style={styles.adaptiveText}>
              Extra mission
            </ThemedText>
          </View>
        ) : (
          <View style={styles.channelRow}>
            <Icon name={mission.channel === 'voice' ? 'waveform' : 'doc'} size={14} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary">
              {mission.channel === 'voice' ? 'Voice mission' : 'Text mission'}
            </ThemedText>
          </View>
        )}
        <View style={styles.channelRow}>
          <Icon name="clock" size={13} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary">
            {mission.estimatedMinutes} min
          </ThemedText>
        </View>
      </View>

      <View style={styles.copy}>
        <ThemedText type="small" themeColor="textSecondary">
          {mission.outcomeContext}
        </ThemedText>
        <ThemedText style={styles.title}>{mission.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {mission.request}
        </ThemedText>
      </View>

      {mission.isAdaptive && mission.adaptiveReason ? (
        <View style={styles.reasonRow}>
          <Icon name="warning" size={14} color={Signal.amber} />
          <ThemedText type="small" style={styles.reasonText}>
            {mission.adaptiveReason}
          </ThemedText>
        </View>
      ) : null}

      <View style={styles.openRow}>
        <ThemedText
          type="smallBold"
          style={{ color: unavailable ? theme.textSecondary : Signal.blue }}
        >
          {STATUS_LABEL[status]}
        </ThemedText>
        {!unavailable ? <Icon name="chevronRight" size={16} color={Signal.blue} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  adaptiveCard: { borderColor: Signal.amber, borderWidth: 1.5 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  unavailable: { opacity: 0.58 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  channelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  adaptivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFF2D8',
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  adaptiveText: { color: '#8A5600', fontSize: 12, lineHeight: 16 },
  copy: { gap: Spacing.one },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  reasonText: { flex: 1, color: '#8A5600' },
  openRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
