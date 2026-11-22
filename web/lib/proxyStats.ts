import type { ProxyRecord, ProxyStats } from "./types";
import { isDatacenter } from "./proxy-utils";

export function getProxyStats(proxies: ProxyRecord[]): ProxyStats {
  const protocolCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};
  const anonymityCounts: Record<string, number> = {};
  let datacenterCount = 0;
  let residentialCount = 0;
  let totalLatency = 0;
  let latencySampleCount = 0;
  let totalUptime = 0;
  let uptimeSampleCount = 0;

  for (const p of proxies) {
    const proto = (p.protocol || "unknown").toLowerCase();
    protocolCounts[proto] = (protocolCounts[proto] || 0) + 1;

    const country = p.country?.toLowerCase();
    if (country) {
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    }

    const anon = (p.anon || "unknown").toLowerCase();
    anonymityCounts[anon] = (anonymityCounts[anon] || 0) + 1;

    if (isDatacenter(p.asn_org)) {
      datacenterCount++;
    } else {
      residentialCount++;
    }

    if (typeof p.rtt_total_ms === "number" && p.rtt_total_ms > 0) {
      totalLatency += p.rtt_total_ms;
      latencySampleCount++;
    } else if (typeof p.timeout === "number" && p.timeout > 0) {
      totalLatency += p.timeout * 1000;
      latencySampleCount++;
    }

    if (typeof p.uptime_pct === "number") {
      totalUptime += p.uptime_pct;
      uptimeSampleCount++;
    }
  }

  const avgLatencyMs =
    latencySampleCount > 0
      ? Math.round(totalLatency / latencySampleCount)
      : 0;

  const avgUptimePct =
    uptimeSampleCount > 0
      ? Math.round((totalUptime / uptimeSampleCount) * 10) / 10
      : 99.0;

  return {
    totalCount: proxies.length,
    avgLatencyMs,
    avgUptimePct,
    protocolCounts,
    countryCounts,
    anonymityCounts,
    datacenterCount,
    residentialCount,
  };
}
