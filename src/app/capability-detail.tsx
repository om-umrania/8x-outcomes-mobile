import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/Icon';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { WorkerHeader } from '@/components/WorkerHeader';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CAPABILITY_DIMENSIONS, CAPABILITY_DIMENSION_DETAILS } from '@/worker/fixture';
import type { CapabilitySignal } from '@/worker/types';

const SIGNAL_ICON: Record<CapabilitySignal, IconName> = { process: 'chartBar', outcome: 'trendingUp' };

type Filter = 'all' | CapabilitySignal;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All evidence' },
  { key: 'process', label: 'Process' },
  { key: 'outcome', label: 'Outcome' },
];

/** Frame-stepped ease-out count from 0 to target; avoids needing a reanimated-text bridge for a one-shot number. */
function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = Date.now();
    function tick() {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

function TrendBar({
  value,
  delay,
  highlighted,
  trackColor,
}: {
  value: number;
  delay: number;
  highlighted: boolean;
  trackColor: string;
}) {
  const height = useSharedValue(0);

  useEffect(() => {
    height.value = withDelay(delay, withTiming(value, { duration: 500 }));
  }, [value, delay, height]);

  const style = useAnimatedStyle(() => ({ height: `${height.value}%` }));

  return (
    <View style={[styles.trendTrack, { backgroundColor: trackColor }]}>
      <Animated.View style={[styles.trendFill, style, { backgroundColor: highlighted ? Signal.violet : '#B9AEDC' }]} />
    </View>
  );
}

function ContributionFill({
  value,
  color,
  trackColor,
  delay,
}: {
  value: number;
  color: string;
  trackColor: string;
  delay: number;
}) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(delay, withTiming(value, { duration: 450 }));
  }, [value, delay, width]);

  const style = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View style={[styles.contributionTrack, { backgroundColor: trackColor }]}>
      <Animated.View style={[styles.contributionFill, style, { backgroundColor: color }]} />
    </View>
  );
}

export default function CapabilityDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [filter, setFilter] = useState<Filter>('all');
  // The static web export has no route param at build time, so the exported HTML always
  // renders the not-found shell below. Reading `id` only after mount keeps the client's
  // first render identical to that markup and avoids a React hydration mismatch; the real
  // content then appears a tick later, which the existing entrance animations already cover.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dimension = mounted ? CAPABILITY_DIMENSIONS.find((item) => item.id === id) : undefined;
  const detail = mounted && id ? CAPABILITY_DIMENSION_DETAILS[id] : undefined;

  const processValue = useCountUp(dimension?.processContribution ?? 0);
  const outcomeValue = useCountUp(dimension?.outcomeContribution ?? 0);

  const evidence = useMemo(() => {
    if (!detail) return [];
    if (filter === 'all') return detail.evidence;
    return detail.evidence.filter((item) => item.signal === filter);
  }, [detail, filter]);

  if (!dimension || !detail) {
    return (
      <ScreenContainer>
        <View style={styles.backRow}>
          <SecondaryButton label="Your profile" onPress={() => router.back()} icon="arrowLeft" />
        </View>
        {mounted ? (
          <ThemedText type="default" themeColor="textSecondary" style={styles.notFound}>
            This capability dimension isn’t in the demo fixture.
          </ThemedText>
        ) : null}
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <WorkerHeader showProfile={false} />
      <View style={styles.backRow}>
        <SecondaryButton label="← Your profile" onPress={() => router.back()} />
      </View>

      <Animated.View entering={FadeInDown.duration(380)} style={styles.hero}>
        <ThemedText type="small" themeColor="textSecondary">
          {dimension.signalLabel.toUpperCase()}
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          {dimension.label}
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          {detail.description}
        </ThemedText>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(380).delay(80)}
        style={[styles.numberCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter evidence to process signal"
          onPress={() => setFilter((current) => (current === 'process' ? 'all' : 'process'))}
          style={[styles.numberBlock, filter === 'outcome' && styles.dimmed]}
        >
          <View style={styles.numberLabelRow}>
            <Icon name="chartBar" size={13} color={Signal.violet} />
            <ThemedText type="small" style={{ color: Signal.violet }}>
              PROCESS
            </ThemedText>
          </View>
          <ThemedText type="title" style={[styles.bigNumber, { color: Signal.violet }]}>
            {processValue}%
          </ThemedText>
        </Pressable>
        <View style={[styles.numberDivider, { backgroundColor: theme.border }]} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filter evidence to outcome signal"
          onPress={() => setFilter((current) => (current === 'outcome' ? 'all' : 'outcome'))}
          style={[styles.numberBlock, filter === 'process' && styles.dimmed]}
        >
          <View style={styles.numberLabelRow}>
            <Icon name="trendingUp" size={13} color={Signal.blue} />
            <ThemedText type="small" style={{ color: Signal.blue }}>
              OUTCOME
            </ThemedText>
          </View>
          <ThemedText type="title" style={[styles.bigNumber, { color: Signal.blue }]}>
            {outcomeValue}%
          </ThemedText>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(380).delay(140)} style={styles.trendSection}>
        <View style={styles.trendHeaderRow}>
          <Icon name="history" size={15} color={theme.text} />
          <ThemedText type="smallBold">Confidence over time</ThemedText>
        </View>
        <View style={styles.trendRow}>
          {detail.trend.map((point, index) => (
            <TrendBar
              key={index}
              value={point}
              delay={index * 90}
              highlighted={index === detail.trend.length - 1}
              trackColor={theme.backgroundSelected}
            />
          ))}
        </View>
        <View style={styles.trendLabelRow}>
          <ThemedText type="small" themeColor="textSecondary">
            First mission
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Now
          </ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(380).delay(200)} style={styles.filterRow}>
        {FILTERS.map((option) => {
          const active = filter === option.key;
          return (
            <Pressable
              key={option.key}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              onPress={() => setFilter(option.key)}
              style={[
                styles.filterChip,
                { borderColor: active ? theme.text : theme.border },
                active && { backgroundColor: theme.text },
              ]}
            >
              <ThemedText type="smallBold" style={active ? { color: theme.background } : undefined}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </Animated.View>

      <View style={styles.evidenceList}>
        {evidence.map((item, index) => (
          <Animated.View
            key={item.missionId + item.signal}
            entering={FadeInUp.duration(300).delay(index * 70)}
            exiting={FadeOut.duration(150)}
            layout={LinearTransition.duration(220)}
            style={[styles.evidenceCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
          >
            <View style={styles.evidenceHeaderRow}>
              <ThemedText type="smallBold" style={styles.evidenceTitle}>
                {item.missionTitle}
              </ThemedText>
              <View
                style={[
                  styles.signalPill,
                  { backgroundColor: item.signal === 'process' ? Signal.violet : Signal.blue },
                ]}
              >
                <Icon name={SIGNAL_ICON[item.signal]} size={11} color="#FFFFFF" />
                <ThemedText type="small" style={styles.signalPillText}>
                  {item.signal === 'process' ? 'Process' : 'Outcome'}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              {item.completedLabel}
            </ThemedText>
            <ThemedText type="default" style={styles.evidenceNote}>
              {item.note}
            </ThemedText>
            <View style={styles.contributionRow}>
              <ContributionFill
                value={item.contribution}
                color={item.signal === 'process' ? Signal.violet : Signal.blue}
                trackColor={theme.backgroundSelected}
                delay={index * 70 + 150}
              />
              <ThemedText type="small" themeColor="textSecondary">
                +{item.contribution} to this dimension
              </ThemedText>
            </View>
          </Animated.View>
        ))}
        {evidence.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary" style={styles.emptyState}>
            No {filter} evidence recorded for this dimension yet.
          </ThemedText>
        ) : null}
      </View>

      <ThemedText type="small" themeColor="textSecondary" style={styles.disclosure}>
        Illustrative evidence · fictional demo data, not a live personal assessment
      </ThemedText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backRow: { alignItems: 'flex-start' },
  notFound: { marginTop: Spacing.four, textAlign: 'center' },
  hero: { gap: Spacing.two, marginTop: Spacing.two, marginBottom: Spacing.three },
  title: { fontSize: 34, lineHeight: 38, fontWeight: '700' },
  numberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: Spacing.three,
  },
  numberBlock: { flex: 1, alignItems: 'center', gap: Spacing.one, paddingVertical: Spacing.one },
  numberLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dimmed: { opacity: 0.35 },
  numberDivider: { width: StyleSheet.hairlineWidth, alignSelf: 'stretch' },
  bigNumber: { fontSize: 40, lineHeight: 44, fontWeight: '700' },
  trendSection: { gap: Spacing.two, marginTop: Spacing.four },
  trendHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  trendRow: { flexDirection: 'row', gap: Spacing.two, height: 64, alignItems: 'flex-end' },
  trendTrack: { flex: 1, height: '100%', borderRadius: 6, overflow: 'hidden', justifyContent: 'flex-end' },
  trendFill: { width: '100%', borderRadius: 6 },
  trendLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  filterRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.four },
  filterChip: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 4,
  },
  evidenceList: { gap: Spacing.three, marginTop: Spacing.three },
  evidenceCard: { borderWidth: 1, borderRadius: 18, padding: Spacing.three, gap: Spacing.two },
  evidenceHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.two },
  evidenceTitle: { flex: 1, fontSize: 17 },
  signalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  signalPillText: { color: '#FFFFFF', fontSize: 11, lineHeight: 15 },
  evidenceNote: { lineHeight: 22 },
  contributionRow: { gap: Spacing.one, marginTop: Spacing.one },
  contributionTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  contributionFill: { height: '100%', borderRadius: 3 },
  emptyState: { textAlign: 'center', paddingVertical: Spacing.four },
  disclosure: { textAlign: 'center', marginTop: Spacing.four },
});
