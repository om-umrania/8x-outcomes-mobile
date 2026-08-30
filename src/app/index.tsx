import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { router, type Href } from 'expo-router';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { OnboardingProgress } from '@/components/OnboardingProgress';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

function SendingDots() {
  const beat = useSharedValue(0);

  useEffect(() => {
    beat.value = withRepeat(withSequence(withTiming(1, { duration: 420 }), withTiming(0, { duration: 420 })), -1, false);
  }, [beat]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: 0.3 + Math.abs(Math.sin(beat.value * Math.PI)) * 0.7,
  }));
  const dot2Style = useAnimatedStyle(() => ({
    opacity: 0.3 + Math.abs(Math.sin(((beat.value + 0.33) % 1) * Math.PI)) * 0.7,
  }));
  const dot3Style = useAnimatedStyle(() => ({
    opacity: 0.3 + Math.abs(Math.sin(((beat.value + 0.66) % 1) * Math.PI)) * 0.7,
  }));

  return (
    <View style={styles.dotsRow}>
      <Animated.View style={[styles.dot, dot1Style]} />
      <Animated.View style={[styles.dot, dot2Style]} />
      <Animated.View style={[styles.dot, dot3Style]} />
    </View>
  );
}

export default function LoginScreen() {
  const theme = useTheme();
  const [contact, setContact] = useState('');
  const [sending, setSending] = useState(false);

  function requestMagicLink() {
    if (!contact.trim() || sending) return;
    setSending(true);
    setTimeout(() => {
      router.replace('/onboarding' as Href);
    }, 900);
  }

  return (
    <ScreenContainer
      footer={
        <View style={styles.footerStack}>
          {sending ? <SendingDots /> : null}
          <PrimaryButton
            label={sending ? 'Sending magic link…' : 'Get magic link'}
            onPress={requestMagicLink}
            disabled={!contact.trim() || sending}
          />
        </View>
      }
    >
      <OnboardingProgress step={0} />

      <Animated.View entering={FadeInDown.duration(420)} style={styles.hero}>
        <ThemedText type="small" themeColor="textSecondary">
          8X WORKER
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          You’re invited to Eat Eat’s talent network.
        </ThemedText>
        <ThemedText type="default" themeColor="textSecondary">
          Eat Eat is hiring across the kitchen, logistics, and ops crew. Verify your phone or
          email to start — no password needed.
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(420).delay(90)} style={styles.field}>
        <ThemedText type="smallBold">Phone or email</ThemedText>
        <TextInput
          accessibilityLabel="Phone or email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={theme.textSecondary}
          value={contact}
          onChangeText={setContact}
          style={[
            styles.input,
            { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(420).delay(160)}
        style={[styles.notice, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
      >
        <ThemedText type="small" themeColor="textSecondary">
          No resume score up front — just a quick calibration mission once you’re in, matched
          to your background.
        </ThemedText>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: { gap: Spacing.two, marginTop: Spacing.four, marginBottom: Spacing.two },
  title: { fontSize: 38, lineHeight: 42, fontWeight: '700' },
  field: { gap: Spacing.two },
  input: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  notice: { borderWidth: 1, borderRadius: 16, padding: Spacing.three },
  footerStack: { gap: Spacing.two },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B5BFF' },
});
