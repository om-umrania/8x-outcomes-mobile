import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useReducedMotion } from "react-native-reanimated";

const BAR_COUNT = 27;

function Bar({
  active,
  index,
  color,
  reduceMotion,
}: {
  active: boolean;
  index: number;
  color: string;
  reduceMotion: boolean;
}) {
  const h = useSharedValue(0.18);

  // Symmetrical envelope — taller in the middle for a VU-meter feel.
  const center = (BAR_COUNT - 1) / 2;
  const envelope = 1 - Math.abs(index - center) / center; // 0..1
  const peak = 0.28 + envelope * 0.72;

  useEffect(() => {
    if (active && !reduceMotion) {
      const duration = 380 + ((index * 53) % 260);
      h.value = withDelay(
        (index % 6) * 60,
        withRepeat(
          withTiming(peak, { duration, easing: Easing.inOut(Easing.ease) }),
          -1,
          true,
        ),
      );
    } else {
      h.value = withTiming(active ? 0.4 : 0.14, { duration: 240 });
    }
  }, [active, reduceMotion, h, index, peak]);

  const style = useAnimatedStyle(() => ({
    height: `${h.value * 100}%`,
  }));

  return <Animated.View style={[styles.bar, { backgroundColor: color }, style]} />;
}

interface WaveformProps {
  active: boolean;
  color: string;
}

export function Waveform({ active, color }: WaveformProps) {
  const reduceMotion = useReducedMotion();
  return (
    <View style={styles.wrap} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: BAR_COUNT }).map((_, i) => (
        <Bar key={i} index={i} active={active} color={color} reduceMotion={reduceMotion} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 96,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bar: {
    width: 5,
    marginHorizontal: 3,
    borderRadius: 3,
    minHeight: 6,
  },
});
