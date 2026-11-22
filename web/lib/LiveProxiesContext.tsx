"use client";

import React, { createContext, useContext } from "react";
import type { LiveProxiesState } from "./useLiveProxies";

const LiveProxiesContext = createContext<LiveProxiesState | null>(null);

export const LiveProxiesProvider = LiveProxiesContext.Provider;

export function useLiveProxiesContext(): LiveProxiesState | null {
  return useContext(LiveProxiesContext);
}
