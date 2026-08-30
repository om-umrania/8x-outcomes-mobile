// Data-fetching hooks with loading / error / refetch, plus the lightweight
// name-only greeting persisted locally.

import { useCallback, useEffect, useState } from "react";

import { storage } from "@/src/utils/storage";
import { api } from "@/src/api/client";
import {
  CapabilityProfile,
  HistoryItem,
  MissionDetail,
  MissionSummary,
} from "@/src/api/types";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await fn();
      setData(result);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}

export const useMissions = () =>
  useAsync<MissionSummary[]>(() => api.getMissions(), []);

export const useMission = (id: string) =>
  useAsync<MissionDetail>(() => api.getMission(id), [id]);

export const useProfile = () =>
  useAsync<CapabilityProfile>(() => api.getProfile(), []);

export const useHistory = () =>
  useAsync<HistoryItem[]>(() => api.getHistory(), []);

// --- Name-only greeting -----------------------------------------------------

const NAME_KEY = "8x.user.name";

export async function saveUserName(name: string): Promise<void> {
  await storage.setItem(NAME_KEY, name.trim());
}

export async function getUserName(): Promise<string> {
  const name = await storage.getItem<string>(NAME_KEY, "");
  return name ?? "";
}

export function useUserName(): { name: string; ready: boolean } {
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    getUserName().then((n) => {
      if (active) {
        setName(n);
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);
  return { name, ready };
}
