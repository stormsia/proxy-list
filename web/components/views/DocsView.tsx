import { Terminal, Code2, Layers, Download, Zap, Shield, BookOpen, ExternalLink, GitBranch, Sparkles, Bot } from "lucide-react";
import styles from "@/app/docs/page.module.css";
import CodeSnippet from "@/components/CodeSnippet";
import GitHubStarCard from "@/components/GitHubStarCard";
import Link from "next/link";
import { getDictionary, Locale } from "@/lib/i18n";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";
const GITHUB_REPO = "https://github.com/stormsia/proxy-list";
const HYDRA_URL = "https://github.com/stormsia/hydra";

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
  const isRu = lang === "ru";

  const pageUrl = isRu ? `${SITE_URL}/ru/docs` : `${SITE_URL}/docs`;
  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;

  const readmeBaseUrl = isRu
    ? `${GITHUB_REPO}/blob/main/README.ru.md`
    : `${GITHUB_REPO}#readme`;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    headline: isRu
      ? "stormsia/proxy-list — Документация API и интеграция Hydra"
      : "stormsia/proxy-list — Developer Documentation & Hydra API Reference",
    description: isRu
      ? "Руководство по программной интеграции списка прокси: загрузка TXT, JSON схемы Hydra Engine, фильтрация по задержке, аптайму и уровню анонимности."
      : "Developer guide for programmatically consuming free proxies: raw plain-text endpoints, rich Hydra JSON telemetry schema, and ready-to-run code snippets in Python, Node.js, Go, and cURL.",
    inLanguage: isRu ? "ru" : "en",
    author: {
      "@type": "Organization",
      name: "stormsia",
      url: "https://github.com/stormsia",
    },
    about: {
      "@type": "SoftwareApplication",
      name: "stormsia/proxy-list",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
    },
    url: pageUrl,
    dateModified: new Date().toISOString().split("T")[0],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isRu ? "Главная" : "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isRu ? "Документация и API" : "Documentation & API",
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
        <h1 className={styles.title}>{isRu ? "Документация Разработчика и API" : "Developer Docs & API"}</h1>
        <p className={styles.subtitle}>
          {isRu
            ? "Интегрируйте прокси в скрейперы, AI-агенты и микросервисы за минуты. Без регистрации, без токенов, прямое скачивание с CDN."
            : "Integrate verified proxies into your scrapers, LLM agents, and automation pipelines in minutes. 100% free, zero authentication, no API keys."}
        </p>

        {/* Motivating header action buttons */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
          <a
            href={readmeBaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.readmePill}
            title={isRu ? "Открыть расширенную документацию в репозитории на GitHub" : "View complete developer manual on GitHub"}
          >
            <GitHubIcon size={14} />
            <span>{isRu ? "Полная документация в README на GitHub" : "Complete Documentation in GitHub README"}</span>
            <ExternalLink size={12} style={{ opacity: 0.7 }} />
          </a>

          <a
            href={HYDRA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.readmePill}
            style={{ background: "rgba(139, 92, 246, 0.1)", borderColor: "rgba(139, 92, 246, 0.3)", color: "#c4b5fd" }}
            title={isRu ? "Движок валидации Hydra на Rust" : "Hydra Rust Engine Repository"}
          >
            <Zap size={13} style={{ color: "var(--accent)" }} />
            <span>{isRu ? "Движок проверки Hydra (Rust)" : "Hydra Validation Engine (Rust)"}</span>
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
              <h2>{isRu ? "Прямые Raw CDN Эндпоинты" : "Direct Raw CDN Endpoints"}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-direct-raw-endpoints`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
              title={isRu ? "Подробная таблица эндпоинтов в README на GitHub" : "View complete endpoints spec in README"}
            >
              <BookOpen size={13} />
              <span>{isRu ? "Спецификация в README →" : "Endpoints in README →"}</span>
            </a>
          </div>

          <p>
            {isRu
              ? "Все эндпоинты ниже доступны напрямую через GET-запросы с глобального CDN GitHub без ограничений скорости (rate limits) и без авторизации:"
              : "All endpoints below support direct HTTP GET requests via GitHub's high-speed global CDN with zero rate limits and zero authentication required:"}
          </p>

          <div className={styles.endpointGrid}>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="json">JSON</span>
              <div className={styles.endpointPath}>data/proxies.json</div>
              <div className={styles.endpointDesc}>
                {isRu
                  ? "Полный обогащенный датасет с телеметрией Hydra: IP, порт, задержка (rtt_total_ms), аптайм, страна, ASN, анонимность."
                  : "Enriched Hydra dataset: IP, port, latency (rtt_total_ms), uptime percentage, country, ASN, and anonymity tier."}
              </div>
              <a href={`${REPO_RAW}/data/proxies.json`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>Open Raw JSON →</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>working_proxies.txt</div>
              <div className={styles.endpointDesc}>
                {isRu
                  ? "Все проверенные активные ноды в формате protocol://host:port (или user:pass@host:port для auth). По одной на строку."
                  : "All verified active nodes in protocol://host:port format (one per line). Ideal for general proxy rotators."}
              </div>
              <a href={`${REPO_RAW}/working_proxies.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>Open Raw TXT →</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>socks5.txt</div>
              <div className={styles.endpointDesc}>
                {isRu
                  ? "Только проверенные SOCKS5 прокси. Максимальная анонимность, поддержка TCP/UDP и удаленного DNS-резолвинга."
                  : "SOCKS5-only verified proxies. High-anonymity tunneling with TCP/UDP and remote DNS resolution."}
              </div>
              <a href={`${REPO_RAW}/socks5.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>Open Raw SOCKS5 →</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>http.txt</div>
              <div className={styles.endpointDesc}>
                {isRu
                  ? "HTTP и HTTPS прокси для стандартных веб-скрейперов (cURL, Requests, Cheerio, Axios)."
                  : "HTTP and HTTPS proxy servers for standard scrapers and cURL automation."}
              </div>
              <a href={`${REPO_RAW}/http.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>Open Raw HTTP →</a>
            </div>
          </div>
        </section>

        {/* Machine-Readable Endpoints for AI Agents & LLMs */}
        <section className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionHeading} style={{ marginBottom: 0 }}>
              <Bot size={20} style={{ color: "var(--primary)" }} />
              <h2>{isRu ? "Манифесты для ИИ-Агентов и LLM" : "Machine-Readable AI Agent Endpoints"}</h2>
            </div>
            <span className={styles.agentReadyBadge}>AgentReady ARD 1.0</span>
          </div>

          <p>
            {isRu
              ? "Стандартизированные документы в открытом текстовом формате для автономных LLM-агентов, парсеров и поисковых ботов (Perplexity, ChatGPT, Claude, Cursor):"
              : "Standardized plain-text discovery manifests for autonomous AI agents, scrapers, and answer engines (ChatGPT, Claude, Perplexity, Cursor):"}
          </p>

          <div className={styles.endpointGrid}>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>llms.txt</div>
              <div className={styles.endpointDesc}>
                {isRu
                  ? "Контекстный файл по спецификации llmstxt.org: архитектура, эндпоинты, схема и правила выбора прокси."
                  : "LLM context according to llmstxt.org: architecture, endpoints, schema, and agent decision matrix."}
              </div>
              <a href={`${SITE_URL}/llms.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>Open llms.txt →</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>llms-full.txt</div>
              <div className={styles.endpointDesc}>
                {isRu
                  ? "Полное техническое руководство с готовыми примерами кода для Python, Node.js, Go, Rust и Playwright."
                  : "Complete developer manual and multi-language code recipes for Python, Node.js, Go, Rust, and Playwright."}
              </div>
              <a href={`${SITE_URL}/llms-full.txt`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>Open llms-full.txt →</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="json">JSON</span>
              <div className={styles.endpointPath}>.well-known/ai-catalog.json</div>
              <div className={styles.endpointDesc}>
                {isRu
                  ? "Официальный манифест возможностей по стандарту Agentic Resource Discovery (ARD 1.0)."
                  : "Official capability manifest adhering to the Agentic Resource Discovery (ARD 1.0) specification."}
              </div>
              <a href={`${SITE_URL}/.well-known/ai-catalog.json`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>Open ai-catalog.json →</a>
            </div>

            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="md">MD</span>
              <div className={styles.endpointPath}>pricing.md & AGENTS.md</div>
              <div className={styles.endpointDesc}>
                {isRu
                  ? "Декларация 100% бесплатного тарифа (zero-auth) и протокол ротации IP без банов для автономных ботов."
                  : "Free tier usage declaration, zero rate limits, and ban-prevention rotation guidelines for agents."}
              </div>
              <a href={`${SITE_URL}/pricing.md`} target="_blank" rel="noopener noreferrer" className={styles.endpointLink}>Open pricing.md →</a>
            </div>
          </div>
        </section>

        {/* JSON Schema */}
        <section className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionHeading} style={{ marginBottom: 0 }}>
              <Layers size={20} style={{ color: "var(--accent)" }} />
              <h2>{isRu ? "Актуальная JSON Схема (Hydra Engine)" : "Accurate JSON Dataset Schema (Hydra Engine)"}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-json-dataset-schema-dataproxiesjson`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
              title={isRu ? "Подробное описание типов и полей в README" : "Detailed type interface in README"}
            >
              <GitHubIcon size={13} />
              <span>{isRu ? "Типы и спецификация в README →" : "Schema Specs in README →"}</span>
            </a>
          </div>

          <p>
            {isRu
              ? "Актуальный файл данных находится в репозитории по пути data/proxies.json. Каждый объект валидируется Rust-движком Hydra и содержит следующую структуру:"
              : "The active dataset is located at data/proxies.json. Generated and validated 24/7 by the Hydra Rust engine:"}
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
                <strong>{isRu ? "Нужны готовые TypeScript интерфейсы и валидаторы?" : "Need Ready-to-Use TypeScript Interfaces & Type Guards?"}</strong>
                <span>
                  {isRu
                    ? "В README на GitHub приведены полные интерфейсы ProxyRecord, примеры строгого парсинга и фильтрации по SLA."
                    : "The GitHub README contains the complete ProxyRecord TypeScript definitions, filter utilities, and quantile benchmarks."}
                </span>
              </div>
            </div>
            <a
              href={`${readmeBaseUrl}#-quickstart--download-guides`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeCardBtn}
            >
              <span>{isRu ? "Открыть в README" : "Read in README"}</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </section>

        {/* Bash & cURL */}
        <section className={styles.section}>
          <div className={styles.sectionHeaderRow}>
            <div className={styles.sectionHeading} style={{ marginBottom: 0 }}>
              <Terminal size={20} style={{ color: "#10b981" }} />
              <h2>{isRu ? "Bash и cURL Однострочники" : "Bash & cURL One-Liners"}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-bash--curl-one-liners`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
            >
              <GitHubIcon size={13} />
              <span>{isRu ? "Больше скриптов в README →" : "More Scripts in README →"}</span>
            </a>
          </div>

          <p>
            {isRu
              ? "Мгновенное использование в терминале или CI/CD скриптах:"
              : "Quick commands for terminal testing, cron jobs, and CI/CD pipelines:"}
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
              <h2>{isRu ? "Python (Requests, Async HTTPX и фильтрация JSON)" : "Python (Requests, Async HTTPX & JSON Ingestion)"}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-python-requests-httpx-async--json-filtering`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
            >
              <GitHubIcon size={13} />
              <span>{isRu ? "Python гайды в README →" : "Python Guides in README →"}</span>
            </a>
          </div>

          <p>
            {isRu
              ? "Пример загрузки датасета с фильтрацией по протоколу, стране, уровню анонимности и задержке:"
              : "Example fetching the rich JSON dataset and filtering by protocol, latency SLA, and elite anonymity tier:"}
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
              <h2>{isRu ? "JavaScript / TypeScript / Node.js" : "JavaScript / TypeScript / Node.js"}</h2>
            </div>
            <a
              href={`${readmeBaseUrl}#-javascript--typescript--nodejs-native-fetch-node-18`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readmeInlineBtn}
            >
              <GitHubIcon size={13} />
              <span>{isRu ? "Node.js примеры в README →" : "Node.js Examples in README →"}</span>
            </a>
          </div>

          <p>
            {isRu
              ? "Работа с типизированным фидом через нативный Fetch (Node.js 18+ без внешних библиотек):"
              : "Consuming and filtering the feed using native Fetch (Node 18+, zero external dependencies):"}
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
              <strong>{isRu ? "Подробная архитектура системы и графики квантилей" : "Complete System Architecture & Quantile Charts"}</strong>
              <span>
                {isRu
                  ? "В официальном README на GitHub представлены распределения RTT (xychart), географические доли стран, схемы жизненного цикла нод и документация интеграции."
                  : "The official GitHub README features RTT latency distribution charts, top geographic source tables, node state machines, and Docker/CLI workflows."}
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
            <span>{isRu ? "Смотреть в README на GitHub →" : "Explore on GitHub README →"}</span>
          </a>
        </div>

        {/* Anonymity Levels Guide */}
        <section className={styles.section} style={{ marginTop: "3.5rem" }}>
          <div className={styles.sectionHeading}>
            <Shield size={20} style={{ color: "#8b5cf6" }} />
            <h2>{isRu ? "Классификация Уровней Анонимности" : "Anonymity Classification Guide"}</h2>
          </div>
          <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ padding: "1rem", background: "rgba(139, 92, 246, 0.08)", borderRadius: "8px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
              <strong style={{ color: "#c4b5fd" }}>🛡️ Elite (Level 1):</strong>
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {isRu
                  ? "Целевой веб-сервер не может обнаружить, что вы используете прокси. Заголовки Forwarded, Via, X-Forwarded-For не отправляются, а ваш реальный IP скрыт."
                  : "The destination web server cannot detect proxy usage. No Forwarded, Via, or X-Forwarded-For headers are transmitted, and your original IP is completely hidden."}
              </p>
            </div>
            <div style={{ padding: "1rem", background: "rgba(56, 189, 248, 0.08)", borderRadius: "8px", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
              <strong style={{ color: "#7dd3fc" }}>🌐 Anonymous (Level 2):</strong>
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {isRu
                  ? "Целевой сервер знает, что вы подключены через прокси, но не знает ваш реальный исходный IP-адрес."
                  : "The server knows a proxy is being used, but cannot identify your true originating IP address."}
              </p>
            </div>
            <div style={{ padding: "1rem", background: "rgba(161, 161, 170, 0.08)", borderRadius: "8px", border: "1px solid rgba(161, 161, 170, 0.2)" }}>
              <strong style={{ color: "#e4e4e7" }}>🔍 Transparent (Level 3):</strong>
              <p style={{ margin: "0.25rem 0 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                {isRu
                  ? "Не скрывает ваш IP-адрес: отправляет заголовок X-Forwarded-For с вашим реальным адресом. Используется только для кэширования или обхода простых ограничений."
                  : "Does not conceal your IP address. Transmits X-Forwarded-For headers with your true IP. Suitable for caching, not privacy."}
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
              {isRu ? "Гарантия Актуальности Hydra" : "Hydra Zero-Stale Guarantee"}
            </h3>
            <p className={styles.noticeText}>
              {isRu
                ? "Каждый прокси в этом пуле подтвержден активным в течение последнего 1-минутного цикла проверки. Мы никогда не раздуваем списки неработающими или зависшими адресами. Подробнее об архитектуре читайте в репозитории "
                : "Every proxy listed here was confirmed active during the last 1-minute verification cycle. We never pad numbers with dead or unresponsive nodes. Learn more about the engine on "}
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
