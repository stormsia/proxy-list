import { promises as fs } from "fs";
import fsSync from "fs";
import path from "path";
import { cache } from "react";
import { ProxyRecord, ProxyStats } from "./types";
import { COUNTRY_META, ALL_ISO_COUNTRY_CODES } from "./countries";
import { DC_KEYWORDS, isDatacenter, isResidential } from "./proxy-utils";

export { DC_KEYWORDS, isDatacenter, isResidential };

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
      // Return lean proxy objects optimized for fast SSR, low HTML payload, and responsive hydration
      return (parsed as any[]).map((item) => ({
        id: item.id || `${item.ip}:${item.port}`,
        ip: item.ip || item.host || "",
        port: item.port,
        protocol: item.protocol,
        anon: item.anon || "anonymous",
        country: item.country || "",
        rtt_total_ms: typeof item.rtt_total_ms === "number" ? item.rtt_total_ms : 0,
        uptime_pct: typeof item.uptime_pct === "number" ? Math.round(item.uptime_pct * 10) / 10 : 0,
        asn_org: item.asn_org || "",
        supports_https: Boolean(item.supports_https),
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

export { getProxyStats } from "./proxyStats";

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
