import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

import { TypographyVariant, useTheme } from "@/src/theme";

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  center?: boolean;
  children: React.ReactNode;
}

/** Themed text primitive. Defaults to onSurface color + system font. */
export function AppText({
  variant = "body",
  color,
  center,
  style,
  children,
  ...rest
}: AppTextProps) {
  const { colors, typography } = useTheme();
  const base: TextStyle = {
    ...typography[variant],
    color: color ?? colors.onSurface,
    ...(center ? { textAlign: "center" } : null),
  };
  return (
    <Text style={[base, style]} {...rest}>
      {children}
    </Text>
  );
}
