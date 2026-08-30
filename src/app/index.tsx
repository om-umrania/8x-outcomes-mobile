import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { router, type Href } from 'expo-router';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

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
        <PrimaryButton
          label={sending ? 'Sending magic link…' : 'Get magic link'}
          onPress={requestMagicLink}
          disabled={!contact.trim() || sending}
        />
      }
    >
      <View style={styles.hero}>
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
      </View>

      <View style={styles.field}>
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
      </View>

      <View
        style={[styles.notice, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
      >
        <ThemedText type="small" themeColor="textSecondary">
          No resume score up front — just a quick calibration mission once you’re in, matched
          to your background.
        </ThemedText>
      </View>
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
});
