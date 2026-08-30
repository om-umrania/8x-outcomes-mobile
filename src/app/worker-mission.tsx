import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { router, type Href } from 'expo-router';

import { ConsentPanel } from '@/components/ConsentPanel';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWorker } from '@/worker/WorkerProvider';

export default function WorkerMissionScreen() {
  const theme = useTheme();
  const {
    state,
    selectedMission: mission,
    activeCaptureMission,
    setConsent,
    startMission,
    submitMission,
    declineMission,
  } = useWorker();
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    setAnswers(mission?.questions.map(() => '') ?? []);
  }, [mission?.id, mission?.questions]);

  if (!mission) {
    return (
      <ScreenContainer
        footer={<PrimaryButton label="Back to missions" onPress={() => router.replace('/inbox' as Href)} />}
      >
        <ThemedText type="title" style={styles.title}>
          Choose a mission first.
        </ThemedText>
      </ScreenContainer>
    );
  }

  const status = state.missionStatuses[mission.id];
  const consented = state.consentByMission[mission.id] ?? false;
  const captureActive = activeCaptureMission?.id === mission.id;
  const textAnswersComplete = mission.questions.every((_, index) => answers[index]?.trim());
  const missionId = mission.id;
  const missionChannel = mission.channel;
  const isCalibration = mission.isCalibration ?? false;

  function updateAnswer(index: number, value: string) {
    setAnswers((current) =>
      current.map((answer, answerIndex) => (answerIndex === index ? value : answer)),
    );
  }

  function decline() {
    declineMission(missionId);
    router.replace('/inbox' as Href);
  }

  function submit() {
    submitMission(
      missionId,
      missionChannel === 'voice' ? ['Voice call completed'] : answers,
    );
    router.replace((isCalibration ? '/first-node' : '/thanks') as Href);
  }

  let footer;
  if (status === 'completed' || status === 'declined') {
    footer = (
      <PrimaryButton label="Back to missions" onPress={() => router.replace('/inbox' as Href)} />
    );
  } else if (!captureActive) {
    footer = (
      <PrimaryButton
        label={
          status === 'in_progress'
            ? `Resume ${mission.captureKind} recording`
            : mission.channel === 'voice'
              ? 'Accept call'
              : 'Begin mission'
        }
        onPress={() => startMission(mission.id)}
        disabled={!consented}
      />
    );
  } else {
    footer = (
      <PrimaryButton
        label={mission.channel === 'voice' ? 'End call & send' : 'Submit answers'}
        onPress={submit}
        disabled={mission.channel === 'text' && !textAnswersComplete}
      />
    );
  }

  return (
    <ScreenContainer footer={footer}>
      <View style={styles.navRow}>
        <SecondaryButton label="← Missions" onPress={() => router.back()} />
        <ThemedText type="small" themeColor="textSecondary">
          {mission.estimatedMinutes} min
        </ThemedText>
      </View>

      <View style={styles.hero}>
        {mission.isAdaptive ? (
          <ThemedText type="smallBold" style={styles.adaptiveLabel}>
            EXTRA MISSION · ONE MORE PERSPECTIVE
          </ThemedText>
        ) : (
          <ThemedText type="small" themeColor="textSecondary">
            {mission.channel === 'voice' ? 'VOICE MISSION' : 'TEXT MISSION'}
          </ThemedText>
        )}
        <ThemedText type="title" style={styles.title}>
          {mission.title}
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          {mission.outcomeContext}
        </ThemedText>
      </View>

      <View
        style={[
          styles.requestCard,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}
      >
        <ThemedText type="smallBold">What you’ll do</ThemedText>
        <ThemedText>{mission.request}</ThemedText>
        {mission.resourceLabel ? (
          <View style={[styles.resourceRow, { borderColor: theme.border }]}>
            <ThemedText type="small" themeColor="textSecondary">
              RESOURCE
            </ThemedText>
            <ThemedText type="smallBold">{mission.resourceLabel}</ThemedText>
          </View>
        ) : null}
      </View>

      <ConsentPanel
        captureKind={mission.captureKind}
        consented={consented}
        onChange={(next) => setConsent(mission.id, next)}
      />

      {status === 'in_progress' && mission.channel === 'text' ? (
        <View style={styles.questions}>
          <View style={styles.sectionTitleRow}>
            <ThemedText type="smallBold">Your answers</ThemedText>
            {!captureActive ? (
              <ThemedText type="smallBold" style={styles.pausedText}>
                Recording paused
              </ThemedText>
            ) : null}
          </View>
          {mission.questions.map((question, index) => (
            <View key={question} style={styles.questionBlock}>
              <ThemedText type="smallBold">
                {index + 1}. {question}
              </ThemedText>
              <TextInput
                accessibilityLabel={`Answer ${index + 1}`}
                multiline
                placeholder="Write what you really think…"
                placeholderTextColor={theme.textSecondary}
                value={answers[index] ?? ''}
                onChangeText={(value) => updateAnswer(index, value)}
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                  },
                ]}
              />
            </View>
          ))}
        </View>
      ) : null}

      {status === 'in_progress' && mission.channel === 'voice' ? (
        <View style={styles.callCard}>
          <View style={styles.callIcon}>
            <ThemedText style={styles.callIconText}>◉</ThemedText>
          </View>
          <ThemedText type="subtitle" style={styles.callTitle}>
            {captureActive ? 'Call in progress' : 'Call paused'}
          </ThemedText>
          <ThemedText type="small" style={styles.callCopy}>
            {captureActive
              ? 'Speak naturally. Your score is never shown here.'
              : 'Your consent was withdrawn and voice capture stopped.'}
          </ThemedText>
        </View>
      ) : null}

      {status === 'available' ? (
        <SecondaryButton label="Decline this mission" onPress={decline} destructive />
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { gap: Spacing.two, marginTop: Spacing.two },
  title: { fontSize: 36, lineHeight: 41, fontWeight: '700' },
  adaptiveLabel: { color: '#8A5600', fontSize: 11, letterSpacing: 1.1 },
  requestCard: { borderWidth: 1, borderRadius: 18, padding: Spacing.three, gap: Spacing.two },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
    marginTop: Spacing.one,
  },
  questions: { gap: Spacing.three },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.two },
  pausedText: { color: Signal.red },
  questionBlock: { gap: Spacing.two },
  input: {
    minHeight: 112,
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 23,
    textAlignVertical: 'top',
  },
  callCard: {
    borderRadius: 24,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: '#EEF0FF',
  },
  callIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Signal.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIconText: { color: '#FFFFFF', fontSize: 28 },
  callTitle: { fontSize: 28, lineHeight: 34, color: '#111111' },
  callCopy: { textAlign: 'center', color: '#555A72' },
});
