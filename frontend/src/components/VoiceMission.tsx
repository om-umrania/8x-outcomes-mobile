import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { radius, spacing } from "@/src/theme";
import { AppText } from "./AppText";
import { RecordingIndicator } from "./RecordingIndicator";
import { Waveform } from "./Waveform";
import { haptic } from "@/src/utils/haptics";

// Immersive voice screen uses a fixed warm-dark palette (mode shift), not the
// app theme — this is intentional per the design blueprint.
const V = {
  text: "#F6EFEA",
  textDim: "rgba(246,239,234,0.66)",
  accent: "#E3A89A",
  recording: "#FF5A52",
  glass: "rgba(20,15,13,0.5)",
  surface: "rgba(255,255,255,0.1)",
  border: "rgba(255,255,255,0.14)",
};

export type AgentState = "connecting" | "speaking" | "listening" | "completed";

interface VoiceMissionProps {
  missionTitle: string;
  company: string;
  agentName: string;
  scenario?: string | null;
  bgImage?: string | null;
  agentState: AgentState;
  recording: boolean;
  paused: boolean;
  durationSeconds: number;
  finishing: boolean;
  onTogglePause: () => void;
  onFinish: () => void;
  onClose: () => void;
}

const STATE_COPY: Record<AgentState, { label: string; hint: string }> = {
  connecting: { label: "Connecting…", hint: "Setting up your voice mission" },
  speaking: { label: "8x is speaking", hint: "Listen to the situation" },
  listening: { label: "Listening", hint: "Your turn — talk it through" },
  completed: { label: "Wrapping up", hint: "Saving your response" },
};

function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function VoiceMission({
  missionTitle,
  company,
  agentName,
  scenario,
  bgImage,
  agentState,
  recording,
  paused,
  durationSeconds,
  finishing,
  onTogglePause,
  onFinish,
  onClose,
}: VoiceMissionProps) {
  const insets = useSafeAreaInsets();
  const waveActive = recording && !paused && agentState !== "connecting";
  const copy = STATE_COPY[agentState];

  return (
    <View style={styles.root}>
      {/* Background */}
      {bgImage ? (
        <Image source={{ uri: bgImage }} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={30} />
      ) : null}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#171210" }]} />
      <LinearGradient
        colors={["rgba(23,18,16,0.55)", "rgba(23,18,16,0.9)", "#120D0B"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable testID="voice-close-button" hitSlop={12} onPress={() => { haptic("light"); onClose(); }} style={styles.closeBtn}>
          <Ionicons name="chevron-down" size={26} color={V.text} />
        </Pressable>
        <RecordingIndicator active={recording && !paused} color={V.recording} compact />
      </View>

      {/* Mission context */}
      <View style={styles.header}>
        <AppText variant="caption" color={V.textDim}>
          {company} · {agentName}
        </AppText>
        <AppText variant="title" color={V.text} style={styles.missionTitle}>
          {missionTitle}
        </AppText>
      </View>

      {/* Center stage */}
      <View style={styles.center}>
        <View style={[styles.statePill, { backgroundColor: V.surface, borderColor: V.border }]}>
          <View style={[styles.stateDot, { backgroundColor: waveActive ? V.recording : V.accent }]} />
          <AppText variant="micro" color={V.text} style={{ letterSpacing: 1 }}>
            {copy.label.toUpperCase()}
          </AppText>
        </View>

        {scenario ? (
          <AppText variant="headline" color={V.text} center style={styles.scenario}>
            “{scenario}”
          </AppText>
        ) : null}

        <View testID="voice-waveform" style={styles.waveWrap}>
          <Waveform active={waveActive} color={V.accent} />
        </View>

        <AppText variant="hero" color={V.text} style={styles.timer} testID="voice-timer">
          {formatDuration(durationSeconds)}
        </AppText>
        <AppText variant="subhead" color={V.textDim}>
          {copy.hint}
        </AppText>
      </View>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + spacing.xl }]}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: V.glass }]} />

        <View style={styles.controlsRow}>
          <View style={styles.controlSlot}>
            <Pressable
              testID="voice-pause-button"
              disabled={agentState === "connecting" || finishing}
              onPress={() => { haptic("medium"); onTogglePause(); }}
              style={[styles.secondaryBtn, { borderColor: V.border, backgroundColor: V.surface, opacity: agentState === "connecting" ? 0.4 : 1 }]}
            >
              <Ionicons name={paused ? "mic" : "pause"} size={26} color={V.text} />
            </Pressable>
            <AppText variant="caption" color={V.textDim} style={styles.controlLabel}>
              {paused ? "Resume" : "Pause"}
            </AppText>
          </View>

          <View style={styles.controlSlot}>
            <Pressable
              testID="voice-finish-button"
              disabled={finishing}
              onPress={() => { haptic("heavy"); onFinish(); }}
              style={[styles.finishBtn, { backgroundColor: V.recording, opacity: finishing ? 0.6 : 1 }]}
            >
              <Ionicons name="stop" size={30} color="#FFFFFF" />
            </Pressable>
            <AppText variant="caption" color={V.text} style={styles.controlLabel}>
              {finishing ? "Submitting…" : "Finish"}
            </AppText>
          </View>

          <View style={styles.controlSlot} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#120D0B",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  missionTitle: {
    marginTop: spacing.xs,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  statePill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.xl,
  },
  stateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  scenario: {
    marginBottom: spacing.xl,
    lineHeight: 26,
  },
  waveWrap: {
    width: "100%",
    marginBottom: spacing.xl,
  },
  timer: {
    fontVariant: ["tabular-nums"],
    fontSize: 52,
    lineHeight: 58,
  },
  controls: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: "hidden",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  controlSlot: {
    alignItems: "center",
    width: 90,
  },
  secondaryBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  finishBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  controlLabel: {
    marginTop: spacing.sm,
  },
});
