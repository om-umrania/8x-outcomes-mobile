// Central design tokens for 8x Worker — derived from design_guidelines.json.
// Warm terracotta accent, calm neutrals, Liquid-Glass friendly. No blue/purple.
// Typography uses the system font (San Francisco on iOS) for a native feel.

import { useColorScheme } from "react-native";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

const lightColors = {
  surface: "#F9F8F6",
  onSurface: "#1A1918",
  surfaceSecondary: "#FFFFFF",
  onSurfaceSecondary: "#4A4846",
  surfaceTertiary: "#EFECE7",
  onSurfaceTertiary: "#6A6865",
  surfaceInverse: "#1A1918",
  onSurfaceInverse: "#F9F8F6",
  brand: "#C16E5A",
  brandPrimary: "#C16E5A",
  onBrandPrimary: "#FFFFFF",
  brandSecondary: "#E3A89A",
  brandTertiary: "#F4E1DD",
  onBrandTertiary: "#8C3A27",
  success: "#6B8E7B",
  onSuccess: "#FFFFFF",
  warning: "#D4A373",
  error: "#B45454",
  onError: "#FFFFFF",
  border: "#E5E3DF",
  borderStrong: "#CFCAC2",
  divider: "#E5E3DF",
  glassTint: "rgba(249,248,246,0.72)",
  overlay: "rgba(26,25,24,0.35)",
} as const;

const darkColors: typeof lightColors = {
  surface: "#161514",
  onSurface: "#F9F8F6",
  surfaceSecondary: "#22211F",
  onSurfaceSecondary: "#D4D2CF",
  surfaceTertiary: "#2D2B29",
  onSurfaceTertiary: "#B3B0AC",
  surfaceInverse: "#F9F8F6",
  onSurfaceInverse: "#1A1918",
  brand: "#D48471",
  brandPrimary: "#D48471",
  onBrandPrimary: "#1A1918",
  brandSecondary: "#944937",
  brandTertiary: "#4A251D",
  onBrandTertiary: "#E8B8AE",
  success: "#7FA890",
  onSuccess: "#12130F",
  warning: "#D4A373",
  error: "#D98484",
  onError: "#1A1918",
  border: "#33312E",
  borderStrong: "#4D4945",
  divider: "#33312E",
  glassTint: "rgba(22,21,20,0.68)",
  overlay: "rgba(0,0,0,0.5)",
} as const;

export type ThemeColors = typeof lightColors;

export const typography = {
  hero: { fontSize: 32, fontWeight: "700" as const, letterSpacing: -0.6, lineHeight: 38 },
  display: { fontSize: 28, fontWeight: "700" as const, letterSpacing: -0.4, lineHeight: 34 },
  title: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3, lineHeight: 28 },
  headline: { fontSize: 18, fontWeight: "600" as const, letterSpacing: -0.2, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: "400" as const, lineHeight: 23 },
  bodyStrong: { fontSize: 16, fontWeight: "600" as const, lineHeight: 22 },
  subhead: { fontSize: 14, fontWeight: "500" as const, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: "500" as const, lineHeight: 18 },
  micro: { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.6, lineHeight: 14 },
} as const;

export type TypographyVariant = keyof typeof typography;

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
  scheme: "light" | "dark";
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  blurTint: "light" | "dark";
}

export function useTheme(): Theme {
  const scheme = useColorScheme() === "dark" ? "dark" : "light";
  const isDark = scheme === "dark";
  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
    scheme,
    spacing,
    radius,
    typography,
    blurTint: isDark ? "dark" : "light",
  };
}
