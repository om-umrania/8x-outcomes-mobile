/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0A0A0A',
    background: '#F6F5F1',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#ECEAE4',
    textSecondary: '#656565',
    border: '#E1DFD8',
    primary: '#0A0A0A',
    primaryText: '#FFFFFF',
  },
  dark: {
    text: '#F7F6F3',
    background: '#090909',
    backgroundElement: '#171717',
    backgroundSelected: '#242424',
    textSecondary: '#A9A9A9',
    border: '#2B2B2B',
    primary: '#F7F6F3',
    primaryText: '#0A0A0A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Signal tokens (BRAND.md) — same values in light and dark; used for state, not text.
export const Signal = {
  blue: '#3B5BFF', // AI execution / automated steps
  violet: '#8B5CF6', // evaluation / confidence scoring
  amber: '#F5A623', // gap detected / adaptive moment — the money color
  green: '#34C759', // threshold met / decision resolved
  red: '#FF5C5C', // reserved; not used in DEMO_MODE
} as const;

// Glass tokens — frosted-panel treatment for the requester "outcome command center"
// flow only (BRAND.md). Layered over BlurView: tint dims the blur, border catches
// the edge, shadow lifts the panel off the paper/ink ground.
export const Glass = {
  light: {
    tint: 'rgba(255,255,255,0.6)',
    border: 'rgba(20,16,8,0.08)',
    shadow: 'rgba(30,24,12,0.12)',
  },
  dark: {
    tint: 'rgba(23,23,23,0.5)',
    border: 'rgba(255,255,255,0.12)',
    shadow: 'rgba(0,0,0,0.6)',
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
