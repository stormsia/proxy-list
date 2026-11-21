import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Activity, Zap, Globe2, Star } from "lucide-react";
import MapClient from "@/components/MapClient";
import FAQ, { FAQItem } from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
import { getDictionary, Locale } from "@/lib/i18n";
import { getProxies, getProxyStats } from "@/lib/proxies";
import { getDatasetSchema, getFaqSchema } from "@/lib/seo";

export default async function HomeView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const proxies = await getProxies();
  const stats = getProxyStats(proxies);

  const schemaMarkup = getDatasetSchema();
  const faqData = dict.faq as unknown as { items?: FAQItem[] };
  const homeFaq: FAQItem[] = faqData?.items || [];

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <header className={styles.header}>
        <div className={styles.heroBadgeRow}>
          <a
            href="https://github.com/stormsia/hydra"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hydraHeroBadge}
          >
            <span>⚡</span>
            <span>
              {lang === "ru"
                ? "Проверено 24/7 движком Hydra (Rust) • Обновление каждую минуту"
                : "Audited 24/7 by Hydra (Rust Engine) • Updated Every Minute"}
            </span>
            <span style={{ opacity: 0.7 }}>→</span>
          </a>

          <a
            href="https://github.com/stormsia/proxy-list"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.starHeroBadge}
            title={lang === "ru" ? "Поставьте звезду репозиторию на GitHub" : "Star our repository on GitHub"}
          >
            <Star size={13} className={styles.heroStarIcon} fill="#eab308" color="#eab308" />
            <span>{lang === "ru" ? "Поставить звезду на GitHub" : "Star on GitHub"}</span>
            <span style={{ opacity: 0.75 }}>★</span>
          </a>
        </div>
        <h1 className={styles.title}>
          {dict.home.heroPrefix}{" "}
          <span className="text-gradient">{dict.home.heroHighlight}</span>{" "}
          {dict.home.heroSuffix}
        </h1>
        <p className={styles.subtitle}>{dict.home.subtitle}</p>
      </header>

      <section className={styles.statsSection} aria-label="Live statistics">
        <div className="glass-panel">
          <div className={styles.statCard}>
            <Activity
              className={styles.statIcon}
              style={{ color: "var(--primary)" }}
            />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {stats.totalCount.toLocaleString("en-US")}
              </div>
              <div className={styles.statLabel}>{dict.home.verifiedProxies}</div>
            </div>
          </div>
        </div>
        <div className="glass-panel">
          <div className={styles.statCard}>
            <Zap className={styles.statIcon} style={{ color: "#eab308" }} />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {stats.avgLatencyMs > 0 ? `${stats.avgLatencyMs}ms` : "≤ 500ms"}
              </div>
              <div className={styles.statLabel}>{dict.home.avgResponseTime}</div>
            </div>
          </div>
        </div>
        <div className="glass-panel">
          <div className={styles.statCard}>
            <Globe2
              className={styles.statIcon}
              style={{ color: "var(--accent)" }}
            />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {Object.keys(stats.protocolCounts).length}
              </div>
              <div className={styles.statLabel}>{dict.home.protocolsCovered}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection} aria-label="Network topology map">
        <h2 className={styles.sectionTitle}>{dict.home.networkTopology}</h2>
        <MapClient proxies={proxies} lang={lang} />
      </section>

      <section className={styles.seoArticle} aria-label="About stormsia/proxy-list infrastructure">
        <h2>{dict.home.seoTitle}</h2>
        <p>{dict.footer.seoText}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", margin: "1.5rem 0" }}>
          <div style={{ padding: "1rem", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
              ⚡ {lang === "ru" ? "Аудит Каждые 60 Секунд" : "Continuous 60s Audits"}
            </h3>
            <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)" }}>
              {lang === "ru"
                ? "Движок Hydra на Rust циклически тестирует сокеты, RTT-задержку и TLS-рукопожатия. Мертвые и нестабильные узлы исключаются немедленно."
                : "The Hydra Rust engine re-tests sockets, RTT latency, and TLS handshakes every minute. Dead or sluggish nodes are pruned with zero delay."}
            </p>
          </div>
          <div style={{ padding: "1rem", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
              🌐 {lang === "ru" ? "Протоколы SOCKS5 & HTTP" : "SOCKS5 & HTTP Agility"}
            </h3>
            <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)" }}>
              {lang === "ru"
                ? "Маршрутизация произвольного TCP/UDP трафика через SOCKS5 с защитой от DNS-утечек (socks5h://) или веб-скрейпинг через HTTPS CONNECT туннели."
                : "Arbitrary TCP/UDP routing via SOCKS5 with remote DNS resolution (socks5h://) or high-speed web scraping via HTTPS CONNECT tunnels."}
            </p>
          </div>
          <div style={{ padding: "1rem", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
              🤖 {lang === "ru" ? "Готовность для AI и Ботов" : "AI Agent & Scraper Ready"}
            </h3>
            <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)" }}>
              {lang === "ru"
                ? "Плоский JSON-датасет data/proxies.json и plain-text списки host:port для прямой загрузки в Python, Node.js, Go или cURL без ключей и авторизации."
                : "Flat JSON telemetry and plain-text host:port feeds ready for direct ingestion in Python, Node.js, Go, or cURL without keys or rate limits."}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--foreground)", marginBottom: "0.75rem" }}>
            💻 {lang === "ru" ? "Быстрая интеграция в 1 строку (cURL & Python)" : "Quick One-Line Integration (cURL & Python)"}
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            {lang === "ru"
              ? "Используйте живые прокси напрямую через протоколы HTTP CONNECT или SOCKS5h:"
              : "Route live traffic directly through HTTP CONNECT or remote-DNS SOCKS5h:"}
          </p>
          <pre className={styles.codeBlock}>
            <code>curl -x socks5h://IP:PORT https://api.ipify.org?format=json</code>
          </pre>
          <pre className={styles.codeBlock}>
            <code>python -c &quot;import httpx; print(httpx.get(&apos;https://api.ipify.org&apos;, proxy=&apos;http://IP:PORT&apos;).text)&quot;</code>
          </pre>
        </div>

        <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--foreground)", marginBottom: "0.75rem" }}>
            📊 {lang === "ru" ? "Сравнительная матрица протоколов" : "Protocol Architecture Comparison Matrix"}
          </h3>
          <div className={styles.matrixTableWrapper}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th>{lang === "ru" ? "Протокол" : "Protocol"}</th>
                  <th>{lang === "ru" ? "Уровень OSI" : "OSI Layer"}</th>
                  <th>{lang === "ru" ? "UDP / DNS" : "UDP / Remote DNS"}</th>
                  <th>{lang === "ru" ? "Анонимность заголовков" : "Header Stripping"}</th>
                  <th>{lang === "ru" ? "Оптимальный сценарий" : "Best Use Case"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>SOCKS5</td>
                  <td>Layer 5 (Session)</td>
                  <td>TCP + UDP / Remote (socks5h)</td>
                  <td>Elite (No headers added)</td>
                  <td>{lang === "ru" ? "AI-агенты, парсеры, Telegram, торренты" : "AI agents, scrapers, bots, streaming"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: "var(--accent)" }}>HTTP / HTTPS</td>
                  <td>Layer 7 (Application)</td>
                  <td>TCP only / Local DNS</td>
                  <td>Elite / Anonymous / Transparent</td>
                  <td>{lang === "ru" ? "REST API, браузерные расширения, cURL" : "REST APIs, browser extensions, cURL"}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: "#9ca3af" }}>SOCKS4</td>
                  <td>Layer 5 (Session)</td>
                  <td>TCP only / IPv4 only</td>
                  <td>No authentication</td>
                  <td>{lang === "ru" ? "Устаревшее ПО и легковесные туннели" : "Legacy clients, lightweight TCP relays"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <GitHubStarCard lang={lang} />
      </section>

      <section className={styles.tableSection} aria-label="Proxy directory">
        <h2 className={styles.sectionTitle}>{dict.home.proxyDirectory}</h2>
        <ProxyTable proxies={proxies} dict={dict.table} />
      </section>

      <FAQ items={homeFaq} title={dict.faq.title} />
    </div>
  );
}
