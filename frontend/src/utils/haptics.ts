// Haptics helper — safe no-op on web, respects the design's haptic map.

import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

type Feel = "light" | "medium" | "heavy" | "success" | "warning" | "selection";

export function haptic(feel: Feel = "light") {
  if (Platform.OS === "web") return;
  try {
    switch (feel) {
      case "light":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case "medium":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case "heavy":
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case "success":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case "warning":
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case "selection":
        Haptics.selectionAsync();
        break;
    }
  } catch {
    // ignore
  }
}
