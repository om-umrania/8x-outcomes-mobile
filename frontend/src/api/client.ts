// Thin API client. Talks to the FastAPI backend and falls back to local mock
// data if the network is unavailable so the demo never dead-ends.

import {
  CapabilityProfile,
  HistoryItem,
  MissionDetail,
  MissionSummary,
  SubmissionPayload,
  SubmissionResult,
} from "./types";
import {
  MOCK_HISTORY,
  MOCK_MISSION_DETAILS,
  MOCK_MISSIONS,
  MOCK_PROFILE,
} from "./mock";

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const API = `${BASE_URL}/api`;
const TIMEOUT_MS = 10000;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  async getMissions(): Promise<MissionSummary[]> {
    try {
      return await request<MissionSummary[]>("/missions");
    } catch {
      return MOCK_MISSIONS;
    }
  },

  async getMission(id: string): Promise<MissionDetail> {
    try {
      return await request<MissionDetail>(`/missions/${id}`);
    } catch {
      const found = MOCK_MISSION_DETAILS.find((m) => m.id === id);
      if (!found) throw new Error("Mission not found");
      return found;
    }
  },

  async getProfile(): Promise<CapabilityProfile> {
    try {
      return await request<CapabilityProfile>("/profile");
    } catch {
      return MOCK_PROFILE;
    }
  },

  async getHistory(): Promise<HistoryItem[]> {
    try {
      return await request<HistoryItem[]>("/history");
    } catch {
      return MOCK_HISTORY;
    }
  },

  async submit(payload: SubmissionPayload): Promise<SubmissionResult> {
    try {
      return await request<SubmissionResult>("/submissions", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch {
      return { ok: true, submissionId: "local", message: "Got it — thank you." };
    }
  },
};
