import dynamic from "next/dynamic";
import { promises as fs } from "fs";
import path from "path";
import ProxyTable from "@/components/ProxyTable";
import styles from "./page.module.css";
import { Activity, Zap, Globe2 } from "lucide-react";
import MapClient from "@/components/MapClient";
import { Metadata } from "next";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  title: "Free Proxy List | SOCKS5 · HTTP · HTTPS · SOCKS4",
  description:
    "Download a free, auto-updated proxy list with SOCKS5, HTTP, HTTPS and SOCKS4 proxies. Verified by a high-speed validator. Machine-readable JSON API available — no registration required.",
  keywords: [
    "free proxy list",
    "socks5 proxy list",
    "http proxy list",
    "public proxies",
    "free socks5 proxy",
    "anonymous proxy server",
    "proxy checker",
    "free proxy download",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Free Proxy List | SOCKS5 · HTTP · HTTPS · SOCKS4",
    description:
      "Auto-updated free proxy list. SOCKS5, HTTP, HTTPS, SOCKS4. JSON API available.",
    url: SITE_URL,
  },
};

async function getProxies() {
  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents);
}

export default async function Home() {
  const proxies = await getProxies();

  const protocolCounts: Record<string, number> = {};
  let totalCount = proxies.length;
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
    description:
      "A continuously auto-updated dataset of free public proxy servers including SOCKS5, SOCKS4, HTTP and HTTPS. Sourced globally from public repositories.",
    url: SITE_URL,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: "stormsia",
      url: "https://github.com/stormsia",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/proxies.json`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl:
          "https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt",
        name: "All Working Proxies (TXT)",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl:
          "https://raw.githubusercontent.com/stormsia/proxy-list/main/socks5.txt",
        name: "SOCKS5 Proxies (TXT)",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How often is the proxy list updated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The proxy list is updated automatically every 15 minutes by an async Python daemon that scrapes public sources, validates each proxy with a checker, and publishes the results to GitHub.",
        },
      },
      {
        "@type": "Question",
        name: "Are these proxies completely anonymous?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Anonymity levels vary. This list contains a mix of transparent, anonymous, and elite proxies. The anonymity level of each proxy is not guaranteed and depends on the proxy server's configuration. Always test proxies for your specific use-case.",
        },
      },
      {
        "@type": "Question",
        name: "How do I download the proxy list programmatically?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can fetch the full list as JSON from /proxies.json, or download plain-text files from the GitHub repository: https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt. See the /docs page for code examples in Python, Node.js, Go, and cURL.",
        },
      },
      {
        "@type": "Question",
        name: "What protocols are available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The list includes SOCKS5, SOCKS4, HTTP, and HTTPS proxy servers sourced globally.",
        },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <header className={styles.header}>
        <h1 className={styles.title}>
          Global <span className="text-gradient">Proxy</span> Network
        </h1>
        <p className={styles.subtitle}>
          Free, open-source proxy infrastructure for scraping, AI agents, and
          automation. Auto-updated every 15 minutes.
        </p>
      </header>

      <section className={styles.statsSection} aria-label="Live statistics">
        <div className="glass-panel">
          <div className={styles.statCard}>
            <Activity
              className={styles.statIcon}
              style={{ color: "var(--primary)" }}
            />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{proxies.length.toLocaleString()}</div>
              <div className={styles.statLabel}>Verified Proxies</div>
            </div>
          </div>
        </div>
        <div className="glass-panel">
          <div className={styles.statCard}>
            <Zap
              className={styles.statIcon}
              style={{ color: "#eab308" }}
            />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{"≤ 500ms"}</div>
              <div className={styles.statLabel}>Avg Response Time</div>
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
                {Object.keys(protocolCounts).length}
              </div>
              <div className={styles.statLabel}>Protocols Covered</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection} aria-label="Network topology map">
        <h2 className={styles.sectionTitle}>Network Topology</h2>
        <MapClient proxies={proxies} />
      </section>

      <section className={styles.seoArticle}>
        <h2>Free Proxy List for Developers, Scrapers & AI Agents</h2>
        <p>
          The <strong>stormsia/proxy-list</strong> project is an open-source
          daemon that automatically collects, validates and publishes free proxy
          servers. It uses an async Python orchestrator backed by a
          high-performance <strong>validator</strong> to test each proxy for
          connectivity and response time. Results are re-published every 15
          minutes directly to GitHub, making the data always fresh.
        </p>
        <p>
          The list contains <strong>SOCKS5, SOCKS4, HTTP and HTTPS</strong> proxy
          servers sourced globally from public repositories. You can consume the
          data as a plain-text file or via the{" "}
          <a href="/proxies.json">machine-readable JSON API</a> — no
          registration, no API keys, no rate limits.
        </p>
        <p>
          Browse targeted sub-lists by protocol (
          <a href="/socks5">SOCKS5</a>, <a href="/http">HTTP</a>,{" "}
          <a href="/https">HTTPS</a>), by proxy type (
          <a href="/datacenter">Datacenter</a>,{" "}
          <a href="/residential">Residential</a>), or filter by country in the
          table below. Full integration guides are available on the{" "}
          <a href="/docs">documentation page</a>.
        </p>
      </section>

      <section className={styles.tableSection} aria-label="Proxy directory">
        <h2 className={styles.sectionTitle}>Proxy Directory</h2>
        <ProxyTable proxies={proxies} />
      </section>
    </div>
  );
}
