import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Icon, type IconName } from '@/components/Icon';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function SecondaryButton({
  label,
  onPress,
  destructive = false,
  icon,
  iconPosition = 'leading',
}: {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  icon?: IconName;
  iconPosition?: 'leading' | 'trailing';
}) {
  const theme = useTheme();
  const pressed = useSharedValue(0);
  const iconColor = destructive ? '#C4382A' : theme.text;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.03 }],
    opacity: 1 - pressed.value * 0.35,
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
    >
      <Animated.View style={[styles.button, animatedStyle, { borderColor: theme.border }]}>
        <View style={styles.content}>
          {icon && iconPosition === 'leading' ? <Icon name={icon} size={16} color={iconColor} /> : null}
          <ThemedText type="smallBold" style={destructive ? styles.destructive : undefined}>
            {label}
          </ThemedText>
          {icon && iconPosition === 'trailing' ? <Icon name={icon} size={16} color={iconColor} /> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  destructive: { color: '#C4382A' },
});
