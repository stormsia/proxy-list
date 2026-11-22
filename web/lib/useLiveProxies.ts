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

export function useLiveProxies(initialProxies: ProxyRecord[]): LiveProxiesState {
  const [proxies, setProxies] = useState<ProxyRecord[]>(initialProxies);
  const [secondsLeft, setSecondsLeft] = useState<number>(REFRESH_INTERVAL_SECONDS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isUpdatedFlash, setIsUpdatedFlash] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());

  const lastFetchTimeRef = useRef<number>(Date.now());
  const isFetchingRef = useRef<boolean>(false);
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchFreshProxies = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsSyncing(true);

    try {
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
          const normalized = json.map((item: any) => ({
            ...item,
            host: item.ip || item.host || "",
            timeout:
              typeof item.rtt_total_ms === "number"
                ? item.rtt_total_ms / 1000
                : typeof item.timeout === "number"
                ? item.timeout
                : 0,
          })) as ProxyRecord[];

          setProxies(normalized);
          setLastUpdated(new Date());

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
      isFetchingRef.current = false;
      setSecondsLeft(REFRESH_INTERVAL_SECONDS);
      lastFetchTimeRef.current = Date.now();
    }
  }, []);

  const syncNow = useCallback(() => {
    fetchFreshProxies();
  }, [fetchFreshProxies]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Don't tick down if tab is in background (save power & bandwidth)
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }

      setSecondsLeft((prev) => {
        if (prev <= 1) {
          fetchFreshProxies();
          return REFRESH_INTERVAL_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const elapsed = (Date.now() - lastFetchTimeRef.current) / 1000;
        if (elapsed >= REFRESH_INTERVAL_SECONDS) {
          fetchFreshProxies();
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
  }, [fetchFreshProxies]);

  return {
    proxies,
    secondsLeft,
    isSyncing,
    isUpdatedFlash,
    lastUpdated,
    syncNow,
  };
}
