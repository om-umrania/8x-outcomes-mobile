import React from "react";
import { View } from "react-native";
import { Redirect } from "expo-router";

import { useTheme } from "@/src/theme";
import { useUserName } from "@/src/hooks/useData";

export default function Index() {
  const { colors } = useTheme();
  const { name, ready } = useUserName();

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.surface }} />;
  }

  return <Redirect href={name ? "/(tabs)/missions" : "/welcome"} />;
}
