import { StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';

import { Icon } from '@/components/Icon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SecondaryButton } from '@/components/SecondaryButton';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useWorker } from '@/worker/WorkerProvider';

export default function SubmissionThanksScreen() {
  const { lastSubmittedMission } = useWorker();

  return (
    <ScreenContainer
      footer={
        <PrimaryButton
          label="Back to missions"
          onPress={() => router.replace('/inbox' as Href)}
          icon="arrowRight"
        />
      }
    >
      <View style={styles.hero}>
        <View style={styles.check}>
          <Icon name="checkCircle" size={34} color="#FFFFFF" />
        </View>
        <ThemedText type="title" style={styles.title}>
          Got it — thank you.
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary" style={styles.body}>
          {lastSubmittedMission
            ? `Your response to “${lastSubmittedMission.title}” was sent.`
            : 'Your response was sent.'}
        </ThemedText>
      </View>

      <View style={styles.note}>
        <ThemedText type="smallBold">What happens next</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          8x combines the process signal and your answer internally. We do not show a mission
          score here, so the next mission stays natural.
        </ThemedText>
      </View>

      <SecondaryButton
        label="See your capability profile"
        onPress={() => router.push('/profile' as Href)}
        icon="arrowRight"
        iconPosition="trailing"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: Spacing.three, paddingTop: Spacing.six },
  check: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Signal.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 38, lineHeight: 43, textAlign: 'center', fontWeight: '700' },
  body: { textAlign: 'center', maxWidth: 360 },
  note: { gap: Spacing.two, marginTop: Spacing.five },
});
