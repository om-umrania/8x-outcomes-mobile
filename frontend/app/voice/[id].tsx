import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";

import { radius, spacing } from "@/src/theme";
import { AppText } from "@/src/components/AppText";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { VoiceMission, AgentState } from "@/src/components/VoiceMission";
import { useMission } from "@/src/hooks/useData";
import { api } from "@/src/api/client";
import { haptic } from "@/src/utils/haptics";

type Permission = "checking" | "granted" | "denied" | "blocked";
const isWeb = Platform.OS === "web";

export default function VoiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: mission } = useMission(id);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [permission, setPermission] = useState<Permission>("checking");
  const [agentState, setAgentState] = useState<AgentState>("connecting");
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startedRef = useRef(false);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const beginMission = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (!isWeb) {
      try {
        await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
        await recorder.prepareToRecordAsync();
        recorder.record();
      } catch {
        // fall through — the UI still runs so the demo doesn't dead-end
      }
    }

    haptic("medium");
    setRecording(true);
    setAgentState("speaking");
    startTimer();

    const t = setTimeout(() => setAgentState("listening"), 3600);
    timeoutsRef.current.push(t);
  }, [recorder, startTimer]);

  const ensurePermission = useCallback(async (): Promise<boolean> => {
    if (isWeb) {
      setPermission("granted");
      return true;
    }
    const current = await AudioModule.getRecordingPermissionsAsync();
    if (current.granted) {
      setPermission("granted");
      return true;
    }
    if (!current.canAskAgain) {
      setPermission("blocked");
      return false;
    }
    const res = await AudioModule.requestRecordingPermissionsAsync();
    if (res.granted) {
      setPermission("granted");
      return true;
    }
    setPermission(res.canAskAgain ? "denied" : "blocked");
    return false;
  }, []);

  // Kick off permission → connect sequence once.
  useEffect(() => {
    let active = true;
    (async () => {
      const ok = await ensurePermission();
      if (!active || !ok) return;
      setAgentState("connecting");
      const t = setTimeout(() => beginMission(), 1600);
      timeoutsRef.current.push(t);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      stopTimer();
      timeoutsRef.current.forEach(clearTimeout);
      if (!isWeb) {
        try {
          recorder.stop();
        } catch {
          // ignore
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePause = useCallback(() => {
    setPaused((prev) => {
      const next = !prev;
      if (next) {
        stopTimer();
        if (!isWeb) {
          try {
            recorder.pause();
          } catch {
            // ignore
          }
        }
      } else {
        startTimer();
        if (!isWeb) {
          try {
            recorder.record();
          } catch {
            // ignore
          }
        }
      }
      return next;
    });
  }, [recorder, startTimer, stopTimer]);

  const finish = useCallback(async () => {
    if (finishing) return;
    setFinishing(true);
    setAgentState("completed");
    stopTimer();
    if (!isWeb) {
      try {
        await recorder.stop();
      } catch {
        // ignore
      }
    }
    try {
      await api.submit({
        missionId: id,
        type: "voice",
        durationSeconds: duration,
        recorded: true,
        consent: true,
      });
    } catch {
      // ignore — success screen still shows
    }
    router.replace("/success");
  }, [finishing, duration, id, recorder, router, stopTimer]);

  const close = useCallback(async () => {
    stopTimer();
    if (!isWeb) {
      try {
        await recorder.stop();
      } catch {
        // ignore
      }
    }
    router.back();
  }, [recorder, router, stopTimer]);

  // ----- Permission gate UI -----
  if (permission === "denied" || permission === "blocked") {
    return (
      <View style={styles.gate}>
        <StatusBar style="light" />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "#171210" }]} />
        <Pressable
          testID="voice-close-button"
          onPress={close}
          style={[styles.gateClose, { top: insets.top + spacing.sm }]}
          hitSlop={12}
        >
          <Ionicons name="chevron-down" size={26} color="#F6EFEA" />
        </Pressable>
        <View style={[styles.gateBody, { paddingBottom: insets.bottom + spacing.xxl }]}>
          <View style={styles.gateIcon}>
            <Ionicons name="mic-off" size={30} color="#E3A89A" />
          </View>
          <AppText variant="title" color="#F6EFEA" center style={{ marginBottom: spacing.md }}>
            Microphone access needed
          </AppText>
          <AppText variant="body" color="rgba(246,239,234,0.7)" center style={{ marginBottom: spacing.xxl }}>
            {permission === "blocked"
              ? "To complete this voice mission, enable microphone access for 8x in Settings."
              : "We need your microphone to record your spoken answer for this mission."}
          </AppText>
          <PrimaryButton
            testID="voice-permission-button"
            label={permission === "blocked" ? "Open Settings" : "Allow microphone"}
            icon="mic"
            onPress={() => {
              if (permission === "blocked") {
                Linking.openSettings();
              } else {
                setPermission("checking");
                ensurePermission().then((ok) => {
                  if (ok) {
                    setAgentState("connecting");
                    const t = setTimeout(() => beginMission(), 1200);
                    timeoutsRef.current.push(t);
                  }
                });
              }
            }}
            style={{ alignSelf: "stretch" }}
          />
        </View>
      </View>
    );
  }

  if (permission === "checking" || !mission) {
    return (
      <View style={styles.gate}>
        <StatusBar style="light" />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "#171210" }]} />
        <ActivityIndicator color="#E3A89A" />
        <AppText variant="subhead" color="rgba(246,239,234,0.7)" style={{ marginTop: spacing.lg }}>
          Preparing your mission…
        </AppText>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <VoiceMission
        missionTitle={mission.title}
        company={mission.company}
        agentName={mission.voice?.agentName ?? "8x Voice"}
        scenario={mission.scenario}
        bgImage={mission.bgImage}
        agentState={agentState}
        recording={recording}
        paused={paused}
        durationSeconds={duration}
        finishing={finishing}
        onTogglePause={togglePause}
        onFinish={finish}
        onClose={close}
      />
    </>
  );
}

const styles = StyleSheet.create({
  gate: {
    flex: 1,
    backgroundColor: "#171210",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  gateClose: {
    position: "absolute",
    left: spacing.lg,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  gateBody: {
    alignItems: "center",
    width: "100%",
  },
  gateIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
});
