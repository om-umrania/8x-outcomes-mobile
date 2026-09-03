import type { AndroidSymbol, SFSymbol } from 'expo-symbols';
import { SymbolView } from 'expo-symbols';
import type { ColorValue } from 'react-native';

/**
 * Curated cross-platform icon set: SF Symbols on iOS, Material Symbols on Android/web
 * (expo-symbols bundles the Material Symbols font locally, so this renders in the
 * `expo start --web` verification path too, not just on-device).
 */
const ICONS = {
  mail: { ios: 'envelope.fill', android: 'mail' },
  shield: { ios: 'shield.fill', android: 'shield' },
  handRaised: { ios: 'hand.raised.fill', android: 'front_hand' },
  upload: { ios: 'icloud.and.arrow.up', android: 'upload_file' },
  check: { ios: 'checkmark', android: 'check' },
  checkCircle: { ios: 'checkmark.circle.fill', android: 'check_circle' },
  verified: { ios: 'checkmark.seal.fill', android: 'verified' },
  lock: { ios: 'lock.fill', android: 'lock' },
  wand: { ios: 'wand.and.stars', android: 'auto_awesome' },
  arrowRight: { ios: 'arrow.right', android: 'arrow_forward' },
  arrowLeft: { ios: 'arrow.left', android: 'arrow_back' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right' },
  clock: { ios: 'clock.fill', android: 'schedule' },
  history: { ios: 'clock.arrow.circlepath', android: 'history' },
  bolt: { ios: 'bolt.fill', android: 'bolt' },
  doc: { ios: 'doc.text.fill', android: 'description' },
  paperclip: { ios: 'paperclip', android: 'attach_file' },
  checklist: { ios: 'checklist', android: 'checklist' },
  build: { ios: 'wrench.and.screwdriver.fill', android: 'build' },
  waveform: { ios: 'waveform', android: 'graphic_eq' },
  mic: { ios: 'mic.fill', android: 'mic' },
  eye: { ios: 'eye.fill', android: 'visibility' },
  person: { ios: 'person.crop.circle.fill', android: 'person' },
  chartBar: { ios: 'chart.bar.fill', android: 'bar_chart' },
  trendingUp: { ios: 'chart.line.uptrend.xyaxis', android: 'trending_up' },
  warning: { ios: 'exclamationmark.triangle.fill', android: 'warning' },
  info: { ios: 'info.circle.fill', android: 'info' },
  celebration: { ios: 'party.popper.fill', android: 'celebration' },
  xmark: { ios: 'xmark', android: 'close' },
  phone: { ios: 'phone.fill', android: 'call' },
} as const satisfies Record<string, { ios: SFSymbol; android: AndroidSymbol }>;

export type IconName = keyof typeof ICONS;

export function Icon({
  name,
  size = 20,
  color,
}: {
  name: IconName;
  size?: number;
  color?: ColorValue;
}) {
  const spec = ICONS[name];
  return (
    <SymbolView
      name={{ ios: spec.ios, android: spec.android, web: spec.android }}
      size={size}
      tintColor={color}
      fallback={null}
    />
  );
}
