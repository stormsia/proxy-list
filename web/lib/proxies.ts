import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";
import { cache } from "react";
import { ProxyRecord, ProxyStats } from "./types";
import { COUNTRY_META, ALL_ISO_COUNTRY_CODES } from "./countries";

export const DC_KEYWORDS = [
  "digitalocean",
  "amazon",
  "aws",
  "hosting",
  "ovh",
  "hetzner",
  "linode",
  "vultr",
  "contabo",
  "datacamp",
  "cloudflare",
  "google",
  "microsoft",
  "azure",
  "server",
  "datacenter",
  "data center",
  "colocation",
  "leaseweb",
  "choopa",
  "fastly",
  "akamai",
];

function resolveDataFilePath(): string {
  const candidates = [
    path.resolve(process.cwd(), "data", "proxies.json"),
    path.resolve(process.cwd(), "..", "data", "proxies.json"),
    path.resolve(process.cwd(), "public", "proxies.json"),
    path.resolve(process.cwd(), "web", "public", "proxies.json"),
  ];

  for (const p of candidates) {
    if (fsSync.existsSync(p)) {
      return p;
    }
  }

  return candidates[0];
}

export const getProxies = cache(async (): Promise<ProxyRecord[]> => {
  try {
    const filePath = resolveDataFilePath();
    const fileContents = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(fileContents);

    if (Array.isArray(parsed)) {
      // Normalize backwards compatibility fields (host, timeout) if needed
      return (parsed as ProxyRecord[]).map((item) => ({
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
    return [];
  } catch (error) {
    console.error("Failed to read proxies dataset:", error);
    return [];
  }
});

export function isDatacenter(asnOrg?: string | null): boolean {
  if (!asnOrg) return false;
  const lower = asnOrg.toLowerCase();
  return DC_KEYWORDS.some((kw) => lower.includes(kw));
}

export function isResidential(asnOrg?: string | null): boolean {
  return !isDatacenter(asnOrg);
}

export function getProxiesByProtocol(
  proxies: ProxyRecord[],
  protocol: string
): ProxyRecord[] {
  const target = protocol.toLowerCase();
  if (target === "https") {
    return proxies.filter(
      (p) => p.supports_https || p.protocol.toLowerCase() === "https"
    );
  }
  return proxies.filter((p) => p.protocol.toLowerCase() === target);
}

export function getProxiesByCountry(
  proxies: ProxyRecord[],
  countryCode: string
): ProxyRecord[] {
  const target = countryCode.toLowerCase();
  return proxies.filter((p) => p.country?.toLowerCase() === target);
}

export function getDatacenterProxies(proxies: ProxyRecord[]): ProxyRecord[] {
  return proxies.filter((p) => isDatacenter(p.asn_org));
}

export function getResidentialProxies(proxies: ProxyRecord[]): ProxyRecord[] {
  return proxies.filter((p) => isResidential(p.asn_org));
}

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

export async function getStaticCountryParams(): Promise<{ code: string }[]> {
  const proxies = await getProxies();
  const countries = new Set<string>(ALL_ISO_COUNTRY_CODES);

  for (const p of proxies) {
    if (p.country) {
      countries.add(p.country.toLowerCase());
    }
  }

  return Array.from(countries).sort().map((code) => ({ code }));
}

export async function getStaticProtocolParams(): Promise<{ protocol: string }[]> {
  const standardProtocols = ["socks5", "socks4", "http", "https"];
  return standardProtocols.map((protocol) => ({ protocol }));
}
