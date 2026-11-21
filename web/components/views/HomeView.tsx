import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Activity, Zap, Globe2 } from "lucide-react";
import MapClient from "@/components/MapClient";
import FAQ, { FAQItem } from "@/components/FAQ";
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
  const faqSchema = getFaqSchema(homeFaq);

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <header className={styles.header}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <a
            href="https://github.com/stormsia/hydra"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.35rem 0.85rem",
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "9999px",
              color: "#c4b5fd",
              fontSize: "0.82rem",
              fontWeight: 500,
              textDecoration: "none",
              boxShadow: "0 0 16px rgba(139, 92, 246, 0.15)",
              transition: "all 0.2s ease",
            }}
          >
            <span>⚡</span>
            <span>
              {lang === "ru"
                ? "Проверено 24/7 движком Hydra (Rust) • Обновление каждую минуту"
                : "Audited 24/7 by Hydra (Rust Engine) • Updated Every Minute"}
            </span>
            <span style={{ opacity: 0.7 }}>→</span>
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
                {stats.totalCount.toLocaleString()}
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

      <section className={styles.seoArticle}>
        <h2>{dict.home.seoTitle}</h2>
        <p>{dict.footer.seoText}</p>
        <p
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "rgba(139, 92, 246, 0.1)",
            borderRadius: "8px",
            borderLeft: "4px solid var(--accent)",
          }}
        >
          ⭐ <strong>{dict.home.starPrefix}</strong>{" "}
          <a
            href="https://github.com/stormsia/proxy-list"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent)",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            {dict.home.starLink}
          </a>
          {dict.home.starSuffix}
        </p>
      </section>

      <section className={styles.tableSection} aria-label="Proxy directory">
        <h2 className={styles.sectionTitle}>{dict.home.proxyDirectory}</h2>
        <ProxyTable proxies={proxies} dict={dict.table} />
      </section>

      <FAQ items={homeFaq} title={dict.faq.title} />
    </div>
  );
}
