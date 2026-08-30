import { StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Signal, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CaptureKind } from '@/worker/types';

export function ConsentPanel({
  captureKind,
  consented,
  onChange,
}: {
  captureKind: CaptureKind;
  consented: boolean;
  onChange: (consented: boolean) => void;
}) {
  const theme = useTheme();
  const captureLabel = captureKind === 'screen' ? 'screen activity' : 'voice';

  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <ThemedText type="smallBold">Recording consent</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Allow {captureLabel} recording while this mission is active.
          </ThemedText>
        </View>
        <Switch
          accessibilityLabel={`Allow ${captureLabel} recording`}
          value={consented}
          onValueChange={onChange}
          trackColor={{ false: theme.border, true: Signal.green }}
        />
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        8x uses this to understand how work gets done, not just the final answer. You can
        turn it off at any time or decline this mission.
      </ThemedText>
      <View style={styles.demoDisclosure}>
        <ThemedText type="smallBold" style={styles.demoDisclosureText}>
          Demo capture state · no media file is created or uploaded in this build.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { borderWidth: 1, borderRadius: 18, padding: Spacing.three, gap: Spacing.three },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  copy: { flex: 1, gap: Spacing.one },
  demoDisclosure: {
    borderRadius: 12,
    backgroundColor: '#FFF2D8',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  demoDisclosureText: { color: '#8A5600', fontSize: 12, lineHeight: 17 },
});
