# Pricing & Availability — stormsia/proxy-list

> Last Updated: 2026-11-21  
> Canonical URL: https://stormsia.github.io/proxy-list/pricing.md  
> License: MIT (Code) / Creative Commons Attribution 4.0 International (Dataset)  
> Operational Status: Active 24/7 Automated Validation

---

## Community Tier (100% Free & Open-Source)

- **Price**: $0 / month (Free forever)
- **Billing**: None / No credit card required
- **Authentication**: None required (Zero-auth)
- **API Keys**: Not required
- **Rate Limits**: Zero limits from GitHub CDN (Fastly 60-second cache TTL)
- **Supported Protocols**: SOCKS5, HTTP, HTTPS, SOCKS4
- **Global Coverage**: 239 countries & territories
- **Network Classification**: Residential & Datacenter ASNs
- **Telemetry Enriched**: RTT Latency (`rtt_total_ms`), Uptime Percentage (`uptime_pct`), Anonymity Tier (`anon`), ASN, ISP organization
- **Validation Engine**: Hydra (High-concurrency Rust socket validator)
- **Cycle Cadence**: Every 60 seconds

---

## Direct Consumption Endpoints

| Resource | Protocol | URL | Format |
|---|---|---|---|
| Complete Telemetry Dataset | All | `https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json` | JSON |
| All Active Nodes | All | `https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt` | TXT (`host:port`) |
| SOCKS5 High-Anonymity | SOCKS5 | `https://raw.githubusercontent.com/stormsia/proxy-list/main/socks5.txt` | TXT (`host:port`) |
| HTTP / HTTPS Web Proxies | HTTP(S) | `https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt` | TXT (`host:port`) |
| SOCKS4 Stream Nodes | SOCKS4 | `https://raw.githubusercontent.com/stormsia/proxy-list/main/socks4.txt` | TXT (`host:port`) |

---

## Self-Hosting & Enterprise Usage

- **Price**: $0 (Free and open-source)
- **Engine**: Hydra High-Concurrency Rust Validator
- **Source Code**: https://github.com/stormsia/hydra
- **Architecture**: Single binary or Docker container, asynchronous Tokio runtime, sub-second latency verification across 50,000+ candidate endpoints
