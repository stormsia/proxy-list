"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ProxyRecord } from "./types";

const REFRESH_INTERVAL_SECONDS = 60;
const RAW_URL = "https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json";
const FALLBACK_URL = "/proxy-list/data/proxies.json";

export interface LiveProxiesState {
  proxies: ProxyRecord[];
  secondsLeft: number;
  isSyncing: boolean;
  isUpdatedFlash: boolean;
  lastUpdated: Date;
  syncNow: () => void;
}

// Module-level cache so once loaded in the session, all views immediately share the full dataset
let globalLiveProxies: ProxyRecord[] | null = null;
let lastFetchTimestamp: number = 0;
let inflightPromise: Promise<ProxyRecord[] | null> | null = null;

async function fetchProxiesDataset(): Promise<ProxyRecord[] | null> {
  let res: Response | null = null;

  // 1. Fetch fresh JSON from raw github (updated by Hydra Rust engine every ~60s)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    res = await fetch(`${RAW_URL}?_t=${Date.now()}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeoutId);
  } catch {
    // Network/CORS fallback
  }

  // 2. Fallback to same-origin proxies.json if raw was unreachable
  if (!res || !res.ok) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      res = await fetch(`${FALLBACK_URL}?_t=${Date.now()}`, {
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);
    } catch {
      // Both failed
    }
  }

  if (res && res.ok) {
    const json = await res.json();
    if (Array.isArray(json) && json.length > 0) {
      return json.map((item: any) => ({
        ...item,
        host: item.ip || item.host || "",
        timeout:
          typeof item.rtt_total_ms === "number"
            ? item.rtt_total_ms / 1000
            : typeof item.timeout === "number"
            ? item.timeout
            : 0,
      })) as ProxyRecord[];
    }
  }

  return null;
}

export function useLiveProxies(initialProxies: ProxyRecord[]): LiveProxiesState {
  const [proxies, setProxies] = useState<ProxyRecord[]>(() => globalLiveProxies || initialProxies);
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    if (lastFetchTimestamp > 0) {
      const elapsed = Math.floor((Date.now() - lastFetchTimestamp) / 1000);
      return Math.max(1, REFRESH_INTERVAL_SECONDS - elapsed);
    }
    return REFRESH_INTERVAL_SECONDS;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isUpdatedFlash, setIsUpdatedFlash] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());

  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchFreshProxies = useCallback(async (isSilent = false) => {
    if (!isSilent) {
      setIsSyncing(true);
    }

    try {
      if (!inflightPromise) {
        inflightPromise = fetchProxiesDataset().finally(() => {
          inflightPromise = null;
        });
      }

      const normalized = await inflightPromise;
      if (normalized && normalized.length > 0) {
        globalLiveProxies = normalized;
        lastFetchTimestamp = Date.now();
        setProxies(normalized);
        setLastUpdated(new Date());

        if (!isSilent) {
          if (flashTimerRef.current) {
            clearTimeout(flashTimerRef.current);
          }
          setIsUpdatedFlash(true);
          flashTimerRef.current = setTimeout(() => {
            setIsUpdatedFlash(false);
          }, 3500);
        }
      }
    } catch (err) {
      console.warn("Live proxy sync error:", err);
    } finally {
      setIsSyncing(false);
      setSecondsLeft(REFRESH_INTERVAL_SECONDS);
    }
  }, []);

  const syncNow = useCallback(() => {
    fetchFreshProxies(false);
  }, [fetchFreshProxies]);

  useEffect(() => {
    const now = Date.now();
    // On mount: fetch immediately if we haven't loaded the full dataset or if it is stale (> 60s)
    if (!globalLiveProxies || now - lastFetchTimestamp >= REFRESH_INTERVAL_SECONDS * 1000) {
      fetchFreshProxies(true);
    } else if (globalLiveProxies && proxies !== globalLiveProxies) {
      setProxies(globalLiveProxies);
    }

    const timer = setInterval(() => {
      // Don't tick down if tab is in background (save power & bandwidth)
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }

      setSecondsLeft((prev) => {
        if (prev <= 1) {
          fetchFreshProxies(false);
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const elapsed = (Date.now() - lastFetchTimestamp) / 1000;
        if (elapsed >= REFRESH_INTERVAL_SECONDS) {
          fetchFreshProxies(false);
        } else {
          setSecondsLeft(Math.max(1, Math.round(REFRESH_INTERVAL_SECONDS - elapsed)));
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (flashTimerRef.current) {
        clearTimeout(flashTimerRef.current);
      }
    };
  }, [fetchFreshProxies, proxies]);

  return {
    proxies,
    secondsLeft,
    isSyncing,
    isUpdatedFlash,
    lastUpdated,
    syncNow,
  };
}
