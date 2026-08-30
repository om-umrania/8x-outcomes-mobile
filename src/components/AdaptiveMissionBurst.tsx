import { StyleSheet, View } from 'react-native';

import { GlassSurface } from '@/components/GlassSurface';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import type { Gap, Mission } from '@/state/types';

/**
 * WOW MOMENT #2 — the center of the demo (PRODUCT.md, DEMO.md). The system decided,
 * unprompted, that evidence was insufficient and spawned these missions itself.
 * Tracer-bullet version: renders correctly, exactly 8 cards. Staggered reveal /
 * haptic burst is a later-pass hook (ROADMAP.md "Next").
 */
export function AdaptiveMissionBurst({ gap, missions }: { gap: Gap; missions: Mission[] }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.gapBanner}>
        <ThemedText type="small" style={styles.gapEyebrow}>
          GAP DETECTED
        </ThemedText>
        <ThemedText type="smallBold" style={styles.gapLabel}>
          {gap.label}
        </ThemedText>
        <ThemedText type="small" style={styles.gapAction}>
          Launching {missions.length} additional missions — no user action taken.
        </ThemedText>
      </View>
      <View style={styles.grid}>
        {missions.map((mission, index) => (
          <GlassSurface
            key={mission.id}
            tint="amber"
            borderRadius={16}
            style={styles.missionWrap}
            contentStyle={styles.mission}
            accessible
            accessibilityLabel={`${mission.title}: ${mission.description}. ${mission.status}`}
          >
            <View style={styles.missionTop}>
              <ThemedText type="small" style={styles.missionNumber}>
                {String(index + 1).padStart(2, '0')}
              </ThemedText>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: mission.status === 'submitted' ? Signal.green : Signal.amber },
                ]}
              />
            </View>
            <ThemedText type="smallBold" numberOfLines={1}>
              Probe
            </ThemedText>
          </GlassSurface>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.three },
  gapBanner: {
    backgroundColor: Signal.amber,
    borderRadius: 14,
    padding: Spacing.three,
    gap: 2,
  },
  gapEyebrow: { color: '#1A1200', letterSpacing: 1, opacity: 0.75 },
  gapLabel: { color: '#1A1200', fontSize: 17 },
  gapAction: { color: '#1A1200', opacity: 0.85 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  missionWrap: { flexBasis: '22%', flexGrow: 1, minHeight: 68 },
  mission: { padding: Spacing.two, gap: 2 },
  missionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  missionNumber: { color: Signal.amber, fontSize: 11, letterSpacing: 1.2 },
  statusDot: { width: 8, height: 8, borderRadius: 999 },
});
