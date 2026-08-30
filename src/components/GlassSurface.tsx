import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { Glass, Signal } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type GlassTint = 'neutral' | 'amber';

const ACCENT_BORDER: Record<GlassTint, { light: string; dark: string }> = {
  neutral: { light: Glass.light.border, dark: Glass.dark.border },
  amber: { light: 'rgba(245,166,35,0.5)', dark: 'rgba(245,166,35,0.55)' },
};

/**
 * Frosted-glass panel for the requester "outcome command center" flow (BRAND.md).
 * Not used in the worker flow, which keeps its own warm/opaque card language.
 */
export function GlassSurface({
  children,
  style,
  contentStyle,
  tint = 'neutral',
  borderRadius = 18,
  ...viewProps
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  tint?: GlassTint;
  borderRadius?: number;
} & ViewProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const palette = isDark ? Glass.dark : Glass.light;
  const borderColor = isDark ? ACCENT_BORDER[tint].dark : ACCENT_BORDER[tint].light;

  return (
    <View
      style={[{ borderRadius, boxShadow: `0px 8px 20px ${palette.shadow}` }, style]}
      {...viewProps}
    >
      <View style={[styles.clip, { borderRadius, borderColor }]}>
        <BlurView
          intensity={isDark ? 46 : 32}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: palette.tint }]} />
        {tint === 'amber' ? (
          <View
            style={[StyleSheet.absoluteFill, { backgroundColor: Signal.amber, opacity: isDark ? 0.08 : 0.06 }]}
          />
        ) : null}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { borderWidth: 1, overflow: 'hidden' },
  content: {},
});
