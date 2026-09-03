import { Pressable, StyleSheet, View } from 'react-native';
import { router, type Href } from 'expo-router';

import { Icon } from '@/components/Icon';
import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function WorkerHeader({ showProfile = true }: { showProfile?: boolean }) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.brandRow}>
        <View style={styles.mark}>
          <ThemedText type="smallBold" style={styles.markText}>
            8x
          </ThemedText>
        </View>
        <ThemedText type="smallBold">Missions</ThemedText>
      </View>
      {showProfile ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open your capability profile"
          hitSlop={12}
          onPress={() => router.push('/profile' as Href)}
          style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
        >
          <Icon name="person" size={16} color={theme.text} />
          <ThemedText type="smallBold">Your profile</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  mark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: Signal.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { color: '#FFFFFF', fontSize: 15 },
  profileButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  pressed: { opacity: 0.55 },
});
