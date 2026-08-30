import { StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CALIBRATION_MISSION_ID, WORKER_MISSIONS } from '@/worker/fixture';

export default function FirstNodeVerifiedScreen() {
  const theme = useTheme();
  const mission = WORKER_MISSIONS.find((item) => item.id === CALIBRATION_MISSION_ID)!;
  const capability = mission.capabilityUnlocked;

  return (
    <ScreenContainer
      footer={
        <PrimaryButton
          label="View your capability profile"
          onPress={() =>
            router.replace({ pathname: '/profile', params: { highlight: capability?.id ?? '' } } as Href)
          }
        />
      }
    >
      <View style={styles.hero}>
        <View style={[styles.node, { borderColor: Signal.violet }]}>
          <View style={[styles.nodeCore, { backgroundColor: Signal.violet }]}>
            <ThemedText style={styles.nodeGlyph}>●</ThemedText>
          </View>
        </View>
        <ThemedText type="title" style={styles.title}>
          First node verified.
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
          Your process on “{mission.title}” is now part of your Capability Profile. No resume
          score — just observed work.
        </ThemedText>
      </View>

      {capability ? (
        <View
          style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
        >
          <View style={styles.cardTopRow}>
            <View style={styles.cardHeading}>
              <ThemedText style={styles.cardTitle}>{capability.label}</ThemedText>
              <ThemedText type="smallBold" style={{ color: Signal.violet }}>
                NEW CAPABILITY
              </ThemedText>
            </View>
            <ThemedText style={{ color: Signal.green, fontSize: 20 }}>✓</ThemedText>
          </View>
          <View style={styles.tagRow}>
            {capability.tags.map((tag) => (
              <View key={tag} style={[styles.tag, { backgroundColor: theme.backgroundSelected }]}>
                <ThemedText type="small">{tag}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <SecondaryButton label="See your Eat Eat missions" onPress={() => router.replace('/inbox' as Href)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: Spacing.three, paddingTop: Spacing.five },
  node: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCore: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  nodeGlyph: { color: '#FFFFFF', fontSize: 18 },
  title: { fontSize: 38, lineHeight: 42, textAlign: 'center', fontWeight: '700' },
  body: { textAlign: 'center', maxWidth: 340 },
  card: { borderWidth: 1, borderRadius: 20, padding: Spacing.three, gap: Spacing.three, marginTop: Spacing.four },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.two },
  cardHeading: { gap: Spacing.one },
  cardTitle: { fontSize: 20, lineHeight: 25, fontWeight: '700' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  tag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
});
