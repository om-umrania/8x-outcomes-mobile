import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { EvidenceEvent } from '@/state/types';

export function EventLogLine({ event }: { event: EvidenceEvent }) {
  return (
    <View style={styles.row}>
      <View style={styles.dot} />
      <ThemedText type="small" themeColor="textSecondary" style={styles.message}>
        {event.message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(128,128,128,0.5)',
    marginTop: 7,
  },
  message: { flex: 1 },
});
