import { Terminal, Code2, Layers, Download, Zap, Shield, BookOpen, ExternalLink, GitBranch, Sparkles, Bot } from "lucide-react";
import styles from "@/app/docs/page.module.css";
import CodeSnippet from "@/components/CodeSnippet";
import GitHubStarCard from "@/components/GitHubStarCard";
import Link from "next/link";
import { getDictionary, Locale, getCanonicalUrl, SITE_URL } from "@/lib/i18n";

const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";
const GITHUB_REPO = "https://github.com/stormsia/proxy-list";
const HYDRA_URL = "https://github.com/stormsia/hydra";

const README_URLS: Record<Locale, string> = {
  en: `${GITHUB_REPO}#readme`,
  ru: `${GITHUB_REPO}/blob/main/README.ru.md`,
  zh: `${GITHUB_REPO}/blob/main/README.zh.md`,
  es: `${GITHUB_REPO}#readme`,
  hi: `${GITHUB_REPO}#readme`,
  ar: `${GITHUB_REPO}#readme`,
  pt: `${GITHUB_REPO}#readme`,
  fr: `${GITHUB_REPO}#readme`,
  bn: `${GITHUB_REPO}#readme`,
  id: `${GITHUB_REPO}#readme`,
};

function GitHubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default async function DocsView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  const pageUrl = getCanonicalUrl("/docs", lang);
  const homeUrl = getCanonicalUrl("/", lang);

  const readmeBaseUrl = README_URLS[lang] ?? README_URLS.en;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    headline: dict.docs.headline,
    description: dict.docs.description,
    image: `${SITE_URL}/og-image.png`,
    inLanguage: lang,
    mainEntityOfPage: pageUrl,
    author: {
      "@type": "Organization",
      name: "stormsia",
      url: "https://github.com/stormsia",
    },
    publisher: {
      "@type": "Organization",
      name: "stormsia/proxy-list",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.svg`,
      },
    },
    about: {
      "@type": "SoftwareApplication",
      name: "stormsia/proxy-list",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
    },
    url: pageUrl,
    datePublished: "2024-01-01T00:00:00Z",
    dateModified: new Date().toISOString(),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: dict.docs.breadcrumbHome,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.docs.breadcrumbDocs,
        item: pageUrl,
      },
    ],
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className={styles.header}>
        <div className={styles.iconWrapper}>
          <Terminal size={32} style={{ color: "var(--accent)" }} />
        </div>
        <h1 className={styles.title}>{dict.docs.title}</h1>
        <p className={styles.subtitle}>
          {dict.docs.subtitle}
        </p>

        {/* Motivating header action buttons */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
          <a
            href={readmeBaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.readmePill}
            title={dict.docs.btnReadmeTitle}
          >
            <GitHubIcon size={14} />
            <span>{dict.docs.btnReadmeText}</span>
            <ExternalLink size={12} style={{ opacity: 0.7 }} />
          </a>

          <a
            href={HYDRA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.readmePill}
            style={{ background: "rgba(139, 92, 246, 0.1)", borderColor: "rgba(139, 92, 246, 0.3)", color: "#c4b5fd" }}
            title={dict.docs.btnHydraTitle}
          >
            <Zap size={13} style={{ color: "var(--accent)" }} />
            <span>{dict.docs.btnHydraText}</span>
            <ExternalLink size={12} style={{ opacity: 0.7 }} />
          </a>
        </div>
      </header>

      <div className={styles.content}>
        {/* Endpoints */}
        <section className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionHeading} style={{ marginBottom: 0 }}>
              <Download size={20} style={{ color: "var(--primary)" }} />
              <h2>{dict.docs.rawTitle}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-direct-raw-endpoints`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
              title={dict.docs.rawReadmeTitle}
            >
              <BookOpen size={13} />
              <span>{dict.docs.rawReadmeText}</span>
            </a>
          </div>

          <p>
            {dict.docs.rawDesc}
          </p>

          <div className={styles.endpointGrid}>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="json">JSON</span>
              <div className={styles.endpointPath}>data/proxies.json</div>
              <div className={styles.endpointDesc}>
                {dict.docs.rawDatasetDesc}
              </div>
              <a href={`${REPO_RAW}/data/proxies.json`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>{dict.docs.openRawJson}</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>working_proxies.txt</div>
              <div className={styles.endpointDesc}>
                {dict.docs.rawWorkingDesc}
              </div>
              <a href={`${REPO_RAW}/working_proxies.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>{dict.docs.openRawTxt}</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>socks5.txt</div>
              <div className={styles.endpointDesc}>
                {dict.docs.rawSocks5Desc}
              </div>
              <a href={`${REPO_RAW}/socks5.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>{dict.docs.openRawSocks5}</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>http.txt</div>
              <div className={styles.endpointDesc}>
                {dict.docs.rawHttpDesc}
              </div>
              <a href={`${REPO_RAW}/http.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>{dict.docs.openRawHttp}</a>
            </div>
          </div>
        </section>

        {/* Machine-Readable Endpoints for AI Agents & LLMs */}
        <section className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionHeading} style={{ marginBottom: 0 }}>
              <Bot size={20} style={{ color: "var(--primary)" }} />
              <h2>{dict.docs.aiTitle}</h2>
            </div>
            <span className={styles.agentReadyBadge}>AgentReady ARD 1.0</span>
          </div>

          <p>
            {dict.docs.aiDesc}
          </p>

          <div className={styles.endpointGrid}>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>llms.txt</div>
              <div className={styles.endpointDesc}>
                {dict.docs.aiLlmsTxtDesc}
              </div>
              <a href={`${SITE_URL}/llms.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>{dict.docs.openLlmsTxt}</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>llms-full.txt</div>
              <div className={styles.endpointDesc}>
                {dict.docs.aiLlmsFullDesc}
              </div>
              <a href={`${SITE_URL}/llms-full.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>{dict.docs.openLlmsFull}</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="json">JSON</span>
              <div className={styles.endpointPath}>.well-known/ai-catalog.json</div>
              <div className={styles.endpointDesc}>
                {dict.docs.aiCatalogDesc}
              </div>
              <a href={`${SITE_URL}/.well-known/ai-catalog.json`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>{dict.docs.openAiCatalog}</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="md">MD</span>
              <div className={styles.endpointPath}>pricing.md & AGENTS.md</div>
              <div className={styles.endpointDesc}>
                {dict.docs.aiPricingDesc}
              </div>
              <a href={`${SITE_URL}/pricing.md`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>{dict.docs.openPricing}</a>
            </div>
          </div>
        </section>

        {/* JSON Schema */}
        <section className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionHeading} style={{ marginBottom: 0 }}>
              <Layers size={20} style={{ color: "var(--accent)" }} />
              <h2>{dict.docs.jsonSchemaTitle}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-json-dataset-schema-dataproxiesjson`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
              title={dict.docs.jsonSchemaReadmeTitle}
            >
              <GitHubIcon size={13} />
              <span>{dict.docs.jsonSchemaReadmeText}</span>
            </a>
          </div>

          <p>
            {dict.docs.jsonSchemaDesc}
          </p>
          <CodeSnippet
            language="json"
            code={`[
  {
    "id": "1.10.248.240:80",             // Unique node identifier
    "ip": "1.10.248.240",                // Proxy server IP address
    "port": 80,                          // Proxy connection port
    "url": "http://1.10.248.240:80",     // Complete connection URL
    "protocol": "http",                  // "http" | "socks4" | "socks5"
    "has_auth": false,                   // True if authentication is required
    "auth_user": null,                   // Username if authenticated
    "auth_pass": null,                   // Password if authenticated
    "state": "alive",                    // Lifecycle state: "alive" | "cold_queue" | "cooldown"
    "supports_https": true,              // True if HTTPS / SSL handshake succeeded
    "out_ip": "1.10.248.240",            // External IP detected through proxy
    "country": "TH",                     // ISO-3166-1 alpha-2 2-letter country code
    "asn": 23969,                        // Autonomous System Number
    "asn_org": "TOT Public Company Ltd", // ISP / Datacenter organization name
    "anon": "anonymous",                 // Anonymity: "transparent" | "anonymous" | "elite"
    "rtt_tcp_ms": 227,                   // TCP socket connect time in milliseconds
    "rtt_handshake_ms": 313,             // Protocol handshake latency in milliseconds
    "rtt_total_ms": 540,                 // Total end-to-end response time in milliseconds
    "uptime_pct": 98.5,                  // Historical uptime percentage (0.0 - 100.0)
    "stability_pct": 100.0,              // Short-term consistency score
    "stability_window_min": 5,           // Window size in minutes for stability score
    "checks_total": 45,                  // Total verification passes
    "checks_success": 44,                // Total successful validation passes
    "dead_strikes": 0,                   // Consecutive failures count
    "last_error": null,                  // Last error message if failed
    "first_seen_at": 1795224444,         // Unix epoch timestamp when first discovered
    "last_checked_at": 1795248007,       // Unix epoch timestamp of last Hydra check
    "next_check_at": 1795248067          // Scheduled next audit timestamp
  }
]`}
          />

          {/* Motivation card for schema details */}
          <div className={styles.readmeCardBanner}>
            <div className={styles.readmeCardContent}>
              <Sparkles size={20} style={{ color: "var(--accent)" }} />
              <div className={styles.readmeCardText}>
                <strong>{dict.docs.tsTypesTitle}</strong>
                <span>
                  {dict.docs.tsTypesDesc}
                </span>
              </div>
            </div>
            <a
              href={`${readmeBaseUrl}#-quickstart--download-guides`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeCardBtn}
            >
              <span>{dict.docs.tsTypesBtn}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </section>

        {/* Bash & cURL */}
        <section className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionHeading} style={{ marginBottom: 0 }}>
              <Terminal size={20} style={{ color: "#10b981" }} />
              <h2>{dict.docs.bashTitle}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-bash--curl-one-liners`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
            >
              <GitHubIcon size={13} />
              <span>{dict.docs.bashBtn}</span>
            </a>
          </div>

          <p>
            {dict.docs.bashDesc}
          </p>
          <CodeSnippet
            language="bash"
            code={`# 1. Download all verified active proxies directly to a local file
curl -sSfL "${REPO_RAW}/working_proxies.txt" -o working_proxies.txt

# 2. Pick a random HTTP proxy and route a request through it
RANDOM_HTTP=$(curl -sSfL "${REPO_RAW}/http.txt" | shuf -n 1)
echo "Testing HTTP via: \${RANDOM_HTTP}"
curl -s --connect-timeout 5 -x "\${RANDOM_HTTP}" https://httpbin.org/ip

# 3. Pick a random SOCKS5 proxy and route through it (with remote DNS resolution)
RANDOM_SOCKS5=$(curl -sSfL "${REPO_RAW}/socks5.txt" | shuf -n 1)
echo "Testing SOCKS5 via: \${RANDOM_SOCKS5}"
curl -s --connect-timeout 5 -x "\${RANDOM_SOCKS5}" https://httpbin.org/ip

# 4. Stream and filter JSON dataset using jq (SOCKS5, Elite Anonymity, Latency < 500ms)
curl -sSfL "${REPO_RAW}/data/proxies.json" | \\
  jq -r '.[] | select(.protocol == "socks5" and .anon == "elite" and .rtt_total_ms != null and .rtt_total_ms < 500) | .url'`}
          />
        </section>

        {/* Python */}
        <section className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionHeading} style={{ marginBottom: 0 }}>
              <Code2 size={20} style={{ color: "#3b82f6" }} />
              <h2>{dict.docs.pythonTitle}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-python-requests-httpx-async--json-filtering`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
            >
              <GitHubIcon size={13} />
              <span>{dict.docs.pythonBtn}</span>
            </a>
          </div>

          <p>
            {dict.docs.pythonDesc}
          </p>
          <CodeSnippet
            language="python"
            code={`import requests

JSON_URL = "${REPO_RAW}/data/proxies.json"
dataset = requests.get(JSON_URL, timeout=15).json()

# Filter: SOCKS5, Elite Anonymity, Measured Latency < 600ms, Uptime >= 80%
qualified = [
    p for p in dataset
    if p.get("protocol") == "socks5"
    and p.get("anon") == "elite"
    and p.get("rtt_total_ms") is not None
    and p["rtt_total_ms"] < 600
    and (p.get("uptime_pct") or 0.0) >= 80.0
]

print(f"Discovered {len(qualified)} qualified SOCKS5 nodes:")
for node in qualified[:5]:
    print(f"  {node['url']} | Country: {node['country']} | RTT: {node['rtt_total_ms']}ms | Uptime: {node['uptime_pct']}%")`}
          />
        </section>

        {/* Node.js / TypeScript */}
        <section className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionHeading} style={{ marginBottom: 0 }}>
              <Code2 size={20} style={{ color: "#f59e0b" }} />
              <h2>{dict.docs.nodeTitle}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-javascript--typescript--nodejs-native-fetch-node-18`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
            >
              <GitHubIcon size={13} />
              <span>{dict.docs.nodeBtn}</span>
            </a>
          </div>

          <p>
            {dict.docs.nodeDesc}
          </p>
          <CodeSnippet
            language="javascript"
            code={`const JSON_URL = "${REPO_RAW}/data/proxies.json";

async function fetchHighSlaProxies() {
  const res = await fetch(JSON_URL, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
  const feed = await res.json();

  // Filter high-performance SOCKS5 nodes
  return feed.filter(
    (p) =>
      p.protocol === "socks5" &&
      p.anon === "elite" &&
      p.rtt_total_ms !== null &&
      p.rtt_total_ms < 500 &&
      (p.uptime_pct || 0) >= 90
  );
}

fetchHighSlaProxies().then((proxies) => {
  console.log(\`Found \${proxies.length} high-performance SOCKS5 nodes\`);
});`}
          />
        </section>

        {/* Comprehensive Architecture & Telemetry Banner */}
        <div className={styles.readmeCardBanner} style={{ marginTop: "2.5rem", background: "linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(17, 24, 39, 0.8) 100%)", borderColor: "rgba(139, 92, 246, 0.3)" }}>
          <div className={styles.readmeCardContent}>
            <GitBranch size={24} style={{ color: "#a78bfa" }} />
            <div className={styles.readmeCardText}>
              <strong>{dict.docs.archTitle}</strong>
              <span>
                {dict.docs.archDesc}
              </span>
            </div>
          </div>
          <a
            href={`${readmeBaseUrl}#-system-architecture`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.readmeCardBtn}
          >
            <GitHubIcon size={14} />
            <span>{dict.docs.archBtn}</span>
          </a>
        </div>

        {/* Anonymity Levels Guide */}
        <section className={styles.section} style={{ marginTop: "3.5rem" }}>
          <div className={styles.sectionHeading}>
            <Shield size={20} style={{ color: "#8b5cf6" }} />
            <h2>{dict.docs.anonTitle}</h2>
          </div>
          <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ padding: "1rem", background: "rgba(139, 92, 246, 0.08)", borderRadius: "8px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
              <strong style={{ color: "#c4b5fd" }}>{dict.docs.anonEliteLabel}</strong>
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {dict.docs.anonEliteDesc}
              </p>
            </div>
            <div style={{ padding: "1rem", background: "rgba(56, 189, 248, 0.08)", borderRadius: "8px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
              <strong style={{ color: "#7dd3fc" }}>{dict.docs.anonAnonymousLabel}</strong>
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {dict.docs.anonAnonymousDesc}
              </p>
            </div>
            <div style={{ padding: "1rem", background: "rgba(161, 161, 170, 0.08)", borderRadius: "8px", border: "1px solid rgba(161, 161, 170, 0.2)" }}>
              <strong style={{ color: "#e4e4e7" }}>{dict.docs.anonTransparentLabel}</strong>
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {dict.docs.anonTransparentDesc}
              </p>
            </div>
          </div>
        </section>

        {/* Star CTA Card */}
        <GitHubStarCard lang={lang} />

        {/* Disclaimer */}
        <section className={styles.noticeSection}>
          <div className={styles.noticeIcon}>⚡</div>
          <div>
            <h3 className={styles.noticeTitle}>
              {dict.docs.guaranteeTitle}
            </h3>
            <p className={styles.noticeText}>
              {dict.docs.guaranteeDesc}
              <a href={HYDRA_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", fontWeight: "bold", textDecoration: "underline" }}>
                GitHub (stormsia/hydra)
              </a>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
