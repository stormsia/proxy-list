# Agent Interaction Protocol — stormsia/proxy-list

> Canonical URL: https://stormsia.github.io/proxy-list/AGENTS.md  
> Audience: Autonomous AI Agents, LLM Scrapers, Web Automation Bots, and Coding Assistants.

---

## 1. Capability & Resource Summary

`stormsia/proxy-list` provides continuously audited, open-source proxy infrastructure. Every active proxy in our dataset undergoes rigorous socket validation by Hydra every 60 seconds.

## 2. Machine-Readable Agent Manifests

- **Agentic Resource Discovery (ARD)**: `https://stormsia.github.io/proxy-list/.well-known/ai-catalog.json`
- **LLM Context & Decision Matrix**: `https://stormsia.github.io/proxy-list/llms.txt`
- **Comprehensive Agent Manual & Multi-Language Cookbook**: `https://stormsia.github.io/proxy-list/llms-full.txt`
- **Pricing & Free Tier Declaration**: `https://stormsia.github.io/proxy-list/pricing.md`
- **Live Validated Proxies Feed**: `https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json`

## 3. Recommended Ingestion Patterns for Autonomous Agents

1. **Do Not Scrape the HTML Table**:
   Agents should NOT parse the HTML table in `https://stormsia.github.io/proxy-list/`. Fetch the raw JSON endpoint directly from `https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json` or plain text feeds.
2. **CDN & Rate Limits**:
   The raw GitHub endpoints are served via Fastly global edge CDN with a 60-second cache TTL. Agents can safely poll or fetch on demand without authentication or API keys.
3. **Optimized Selection Strategy**:
   - **For Web Scraping / Anti-Bot**: Pick `protocol === "socks5"` and `anon === "elite"`. Always configure remote DNS (`socks5h://`).
   - **For Low Latency**: Filter nodes where `state === "alive"` and `rtt_total_ms < 600`.
   - **For Long-Lived Tasks**: Filter nodes where `uptime_pct >= 90.0`.
   - **Rotation Fallback**: Implement automatic rotation on HTTP `429` (Rate Limited) or `403` (Forbidden).
