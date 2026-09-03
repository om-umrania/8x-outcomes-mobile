import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/Icon';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function PrimaryButton({
  label,
  onPress,
  disabled,
  icon,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  /** Rendered after the label — most useful on forward-progressing CTAs. */
  icon?: IconName;
}) {
  const theme = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.04 }],
    opacity: 1 - pressed.value * 0.15,
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 90 });
      }}
      onPressOut={() => {
        pressed.value = withSpring(0, { damping: 14, stiffness: 260 });
      }}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.button,
          animatedStyle,
          { backgroundColor: theme.primary },
          disabled && styles.disabled,
        ]}
      >
        <View style={styles.content}>
          <ThemedText type="smallBold" style={[styles.label, { color: theme.primaryText }]}>
            {label}
          </ThemedText>
          {icon ? <Icon name={icon} size={18} color={theme.primaryText} /> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56, // thumb-reachable target size
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  disabled: { opacity: 0.4 },
  label: { fontSize: 17 },
});
