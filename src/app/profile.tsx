import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams, type Href } from 'expo-router';

import { CapabilityBar } from '@/components/CapabilityBar';
import { Icon } from '@/components/Icon';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { WorkerHeader } from '@/components/WorkerHeader';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CAPABILITY_DIMENSIONS, MISSION_HISTORY } from '@/worker/fixture';

export default function CapabilityProfileScreen() {
  const theme = useTheme();
  const { highlight } = useLocalSearchParams<{ highlight?: string }>();
  // The static web export has no route param at build time, so the exported HTML never
  // shows the NEW badge. Applying `highlight` only after mount keeps the client's first
  // render identical to that markup and avoids a React hydration mismatch.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ScreenContainer>
      <WorkerHeader showProfile={false} />
      <View style={styles.backRow}>
        <SecondaryButton label="Missions" onPress={() => router.back()} icon="arrowLeft" />
      </View>

      <View style={styles.hero}>
        <ThemedText type="small" themeColor="textSecondary">
          YOUR CAPABILITY PROFILE
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          Observed through the work.
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Built from Eat Eat missions you actually completed — how you approached them and what
          you produced — not from a self-reported skills list.
        </ThemedText>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <Icon name="chartBar" size={14} color={Signal.violet} />
          <ThemedText type="small">Process signal</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <Icon name="trendingUp" size={14} color={Signal.blue} />
          <ThemedText type="small">Outcome signal</ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.profileCard,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}
      >
        {CAPABILITY_DIMENSIONS.map((dimension) => (
          <CapabilityBar
            key={dimension.id}
            dimension={dimension}
            isNew={mounted && dimension.id === highlight}
            onPress={() =>
              router.push({ pathname: '/capability-detail', params: { id: dimension.id } } as Href)
            }
          />
        ))}
      </View>

      <ThemedText type="small" themeColor="textSecondary" style={styles.disclosure}>
        Seeded demo profile · fictional history · not a live personal assessment
      </ThemedText>

      <View style={styles.historySection}>
        <ThemedText type="smallBold">Recent missions</ThemedText>
        {MISSION_HISTORY.map((item) => (
          <View key={item.id} style={[styles.historyRow, { borderBottomColor: theme.border }]}>
            <View style={styles.historyCopy}>
              <ThemedText type="smallBold">{item.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {item.completedLabel}
              </ThemedText>
            </View>
            <View style={styles.historyChannel}>
              <Icon name={item.channel === 'voice' ? 'waveform' : 'doc'} size={13} color={theme.textSecondary} />
              <ThemedText type="small" themeColor="textSecondary">
                {item.channel === 'voice' ? 'Voice' : 'Text'}
              </ThemedText>
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backRow: { alignItems: 'flex-start' },
  hero: { gap: Spacing.two, marginTop: Spacing.two },
  title: { fontSize: 38, lineHeight: 42, fontWeight: '700' },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  profileCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: Spacing.three,
    gap: Spacing.four,
  },
  disclosure: { textAlign: 'center' },
  historySection: { gap: Spacing.two, marginTop: Spacing.three },
  historyRow: {
    minHeight: 68,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  historyCopy: { flex: 1, gap: Spacing.one },
  historyChannel: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
