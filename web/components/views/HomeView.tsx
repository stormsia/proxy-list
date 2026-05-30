import { promises as fs } from "fs";
import path from "path";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Activity, Zap, Globe2 } from "lucide-react";
import MapClient from "@/components/MapClient";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import { getDictionary, Locale } from "@/lib/i18n";

const SITE_URL = "https://stormsia.github.io/proxy-list";

async function getProxies() {
  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default async function HomeView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const proxies = await getProxies();

  const protocolCounts: Record<string, number> = {};
  proxies.forEach((p: any) => {
    if (p.protocol) {
      const proto = p.protocol.toLowerCase();
      protocolCounts[proto] = (protocolCounts[proto] || 0) + 1;
    }
  });

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: "Free Public Proxy List — stormsia/proxy-list",
    description: "A continuously auto-updated dataset of free public proxy servers including SOCKS5, SOCKS4, HTTP and HTTPS.",
    url: SITE_URL,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: "stormsia",
      url: "https://github.com/stormsia",
    },
    distribution: [
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${SITE_URL}/proxies.json` },
      { "@type": "DataDownload", encodingFormat: "text/plain", contentUrl: "https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt" }
    ],
  };

  const homeFaq = (dict.faq as any).items || [];

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <header className={styles.header}>
        <h1 className={styles.title}>
          {dict.home.heroPrefix} <span className="text-gradient">{dict.home.heroHighlight}</span> {dict.home.heroSuffix}
        </h1>
        <p className={styles.subtitle}>{dict.home.subtitle}</p>
      </header>

      <section className={styles.statsSection} aria-label="Live statistics">
        <div className="glass-panel">
          <div className={styles.statCard}>
            <Activity className={styles.statIcon} style={{ color: "var(--primary)" }} />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{proxies.length.toLocaleString()}</div>
              <div className={styles.statLabel}>{dict.home.verifiedProxies}</div>
            </div>
          </div>
        </div>
        <div className="glass-panel">
          <div className={styles.statCard}>
            <Zap className={styles.statIcon} style={{ color: "#eab308" }} />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{"≤ 500ms"}</div>
              <div className={styles.statLabel}>{dict.home.avgResponseTime}</div>
            </div>
          </div>
        </div>
        <div className="glass-panel">
          <div className={styles.statCard}>
            <Globe2 className={styles.statIcon} style={{ color: "var(--accent)" }} />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{Object.keys(protocolCounts).length}</div>
              <div className={styles.statLabel}>{dict.home.protocolsCovered}</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection} aria-label="Network topology map">
        <h2 className={styles.sectionTitle}>{dict.home.networkTopology}</h2>
        <MapClient proxies={proxies} />
      </section>

      <section className={styles.seoArticle}>
        <h2>{dict.home.seoTitle}</h2>
        <p>{dict.footer.seoText}</p>
        <p style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(139, 92, 246, 0.1)", borderRadius: "8px", borderLeft: "4px solid var(--accent)" }}>
          ⭐ <strong>{dict.home.starPrefix}</strong> <a href="https://github.com/stormsia/proxy-list" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: "bold", textDecoration: "underline" }}>{dict.home.starLink}</a>{dict.home.starSuffix}
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
