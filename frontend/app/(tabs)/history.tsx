import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing, useTheme } from "@/src/theme";
import { AppText } from "@/src/components/AppText";
import { StickyHeader, HEADER_BAR_HEIGHT } from "@/src/components/StickyHeader";
import { FLOATING_TAB_HEIGHT } from "@/src/components/BottomTabBar";
import { useHistory } from "@/src/hooks/useData";
import { HistoryItem } from "@/src/api/types";

function Row({ item, last }: { item: HistoryItem; last: boolean }) {
  const { colors } = useTheme();
  const isVoice = item.type === "voice";
  return (
    <View
      testID={`history-${item.id}`}
      style={[styles.row, { borderBottomColor: colors.divider, borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth }]}
    >
      <View style={[styles.icon, { backgroundColor: colors.surfaceTertiary }]}>
        <Ionicons name={isVoice ? "mic" : "chatbubble-ellipses"} size={18} color={colors.brandPrimary} />
      </View>
      <View style={styles.rowBody}>
        <AppText variant="bodyStrong">{item.title}</AppText>
        <AppText variant="caption" color={colors.onSurfaceTertiary} style={{ marginTop: 2 }}>
          {item.company} · {item.date}
        </AppText>
        <AppText variant="subhead" color={colors.onSurfaceSecondary} style={{ marginTop: spacing.sm }}>
          {item.summary}
        </AppText>
      </View>
    </View>
  );
}

export default function History() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: history, loading } = useHistory();

  const topPad = insets.top + HEADER_BAR_HEIGHT + spacing.lg;
  const bottomPad = FLOATING_TAB_HEIGHT + insets.bottom + spacing.xxxl;

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <StickyHeader title="History" />
      <ScrollView
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad, paddingHorizontal: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="hero" style={styles.title}>
          Completed
        </AppText>
        <AppText variant="body" color={colors.onSurfaceSecondary} style={styles.sub}>
          A quiet record of the work you've done.
        </AppText>

        {loading && !history ? (
          <View style={styles.state}>
            <AppText variant="body" color={colors.onSurfaceTertiary}>Loading…</AppText>
          </View>
        ) : history && history.length > 0 ? (
          <View style={[styles.card, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
            {history.map((item, i) => (
              <Row key={item.id} item={item} last={i === history.length - 1} />
            ))}
          </View>
        ) : (
          <View style={styles.state}>
            <AppText variant="body" color={colors.onSurfaceSecondary}>No completed missions yet.</AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  title: { marginBottom: spacing.xs },
  sub: { marginBottom: spacing.xl },
  card: {
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: "row",
    paddingVertical: spacing.lg,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  rowBody: {
    flex: 1,
  },
  state: {
    alignItems: "center",
    paddingVertical: spacing.xxxl,
  },
});
