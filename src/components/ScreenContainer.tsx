import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassSurface } from '@/components/GlassSurface';
import { RecordingIndicator } from '@/components/RecordingIndicator';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function ScreenContainer({
  children,
  footer,
  footerGlass = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  /** Frosted, floating dock instead of the flat opaque bar. Requester flow only (BRAND.md). */
  footerGlass?: boolean;
}) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.shell} edges={['top', 'bottom']}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
        <RecordingIndicator />
        {footer ? (
          footerGlass ? (
            <GlassSurface style={styles.footerGlassWrap} contentStyle={styles.footerGlass} borderRadius={0}>
              {footer}
            </GlassSurface>
          ) : (
            <View
              style={[
                styles.footer,
                { backgroundColor: theme.background, borderTopColor: theme.border },
              ]}
            >
              {footer}
            </View>
          )
        ) : null}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  shell: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  footerGlassWrap: { boxShadow: 'none' },
  footerGlass: {
    paddingTop: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
});
