export type Protocol = "socks5" | "socks4" | "http" | "https";
export type ProxyState = "alive" | "cold_queue" | "cooldown" | "dead_permanent";
export type AnonymityLevel = "transparent" | "anonymous" | "elite";

export interface ProxyRecord {
  id: string; // e.g. "1.10.248.240:80"
  ip: string; // "1.10.248.240"
  port: number; // 80
  url: string; // "http://1.10.248.240:80"
  protocol: Protocol | string;
  has_auth: boolean;
  auth_user: string | null;
  auth_pass: string | null;
  state: ProxyState | string;
  supports_https: boolean;
  out_ip: string | null;
  country: string | null; // 2-letter ISO code e.g. "TH", "US", "RU"
  asn: number | null;
  asn_org: string | null;
  anon: AnonymityLevel | null;
  rtt_tcp_ms: number | null;
  rtt_handshake_ms: number | null;
  rtt_total_ms: number | null; // Round-trip latency in ms
  uptime_pct: number | null; // Uptime % (0-100)
  stability_pct: number | null;
  stability_window_min?: number;
  checks_total?: number;
  checks_success?: number;
  dead_strikes?: number;
  last_error?: string | null;
  remark?: string | null;
  first_seen_at?: number;
  last_checked_at?: number;
  next_check_at?: number;

  // Backwards compatibility helpers if needed
  host?: string;
  timeout?: number;
  geolocation?: Record<string, unknown>;
}

export type ProxyItem = ProxyRecord;

export interface ProxyStats {
  totalCount: number;
  avgLatencyMs: number;
  avgUptimePct: number;
  protocolCounts: Record<string, number>;
  countryCounts: Record<string, number>;
  anonymityCounts: Record<string, number>;
  datacenterCount: number;
  residentialCount: number;
}

export interface CountryMetadata {
  code: string;
  name: string;
  nameRu: string;
  titleEn: string;
  titleRu: string;
  descriptionEn: string;
  descriptionRu: string;
  keywordsEn: string[];
  keywordsRu: string[];
}
