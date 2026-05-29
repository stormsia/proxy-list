import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Globe } from "lucide-react";
import Link from "next/link";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

const PROTOCOL_META: Record<
  string,
  {
    title: string;
    description: string;
    keywords: string[];
    about: string;
    color: string;
    file: string;
  }
> = {
  socks5: {
    title: "Free SOCKS5 Proxy List | Fast SOCKS5 Proxies",
    description:
      "Download a free SOCKS5 proxy list. High-speed SOCKS5 proxies from around the world, validated by a checker. Updated automatically every 15 minutes. No registration required.",
    keywords: [
      "free socks5 proxy list",
      "socks5 proxy download",
      "socks5 proxy server",
      "fast socks5 proxies",
      "socks5 proxy list txt",
    ],
    about:
      "SOCKS5 is the most versatile proxy protocol — it supports TCP and UDP traffic, handles any type of data (HTTP, FTP, email, torrents), and does not alter your request headers, making it the hardest to detect. Ideal for web scraping, P2P, and applications that need full network-layer proxying.",
    color: "var(--primary)",
    file: "socks5.txt",
  },
  socks4: {
    title: "Free SOCKS4 Proxy List | SOCKS4 Proxy Servers",
    description:
      "Free SOCKS4 proxy list with servers verified by a validator. Updated every 15 minutes. Download as plain text or JSON.",
    keywords: [
      "free socks4 proxy list",
      "socks4 proxy download",
      "socks4 proxy server",
    ],
    about:
      "SOCKS4 is an older proxy protocol that supports TCP connections only (no UDP). It does not require authentication and is widely supported by legacy applications. Use SOCKS5 when possible for broader compatibility.",
    color: "#f59e0b",
    file: "socks4.txt",
  },
  http: {
    title: "Free HTTP Proxy List | Fast HTTP Proxy Servers",
    description:
      "Free HTTP proxy list with servers worldwide. Verified by a validator and auto-updated every 15 minutes. Download as plain text or consume via JSON API.",
    keywords: [
      "free http proxy list",
      "http proxy download",
      "http proxy server list",
      "fast http proxies",
    ],
    about:
      "HTTP proxies operate at the application layer and are designed for web traffic. They can forward HTTP requests and some support HTTPS via the CONNECT tunnel method. Widely supported by browsers, scrapers and automation tools.",
    color: "#38bdf8",
    file: "http.txt",
  },
  https: {
    title: "Free HTTPS Proxy List | SSL Proxy Servers",
    description:
      "Free HTTPS (SSL) proxy list. Secure proxy servers that support encrypted traffic. Verified automatically and updated every 15 minutes.",
    keywords: [
      "free https proxy list",
      "ssl proxy list",
      "https proxy server",
      "secure proxy",
    ],
    about:
      "HTTPS proxies support the HTTP CONNECT method, allowing them to tunnel encrypted TLS traffic. They are ideal for scraping HTTPS websites while keeping your requests secure in transit between your client and the proxy server.",
    color: "#a78bfa",
    file: "http.txt",
  },
};

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const proxies = JSON.parse(fileContents);

  const protocols = new Set<string>(Object.keys(PROTOCOL_META));

  proxies.forEach((p: any) => {
    if (p.protocol) {
      protocols.add(p.protocol.toLowerCase());
    }
  });

  return Array.from(protocols).map((protocol) => ({ protocol }));
}

export async function generateMetadata(
  props: { params: Promise<{ protocol: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const protocol = params.protocol.toLowerCase();
  const meta = PROTOCOL_META[protocol];

  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      alternates: { canonical: `${SITE_URL}/${protocol}` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${SITE_URL}/${protocol}`,
      },
    };
  }

  return {
    title: `Free ${protocol.toUpperCase()} Proxy List`,
    description: `Free ${protocol.toUpperCase()} proxies verified by a validator. Updated every 15 minutes.`,
    alternates: { canonical: `${SITE_URL}/${protocol}` },
  };
}

export default async function ProtocolPage(
  props: { params: Promise<{ protocol: string }> }
) {
  const params = await props.params;
  const protocol = params.protocol.toLowerCase();

  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const allProxies = JSON.parse(fileContents);

  const filteredProxies = allProxies.filter((p: any) => {
    return p.protocol.toLowerCase() === protocol;
  });

  const meta = PROTOCOL_META[protocol];
  const color = meta?.color ?? "var(--primary)";
  const about = meta?.about;
  const txtFile = meta?.file ?? `${protocol}.txt`;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: `Free ${protocol.toUpperCase()} Proxy List`,
    description: `Auto-updated list of free ${protocol.toUpperCase()} proxy servers. Verified by a validator every 15 minutes.`,
    url: `${SITE_URL}/${protocol}`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: "stormsia",
      url: "https://github.com/stormsia",
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl: `${REPO_RAW}/${txtFile}`,
        name: `${protocol.toUpperCase()} Proxies (TXT)`,
      },
    ],
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <header className={styles.header}>
        <div
          style={{
            display: "inline-flex",
            padding: "1rem",
            background: `rgba(16, 185, 129, 0.1)`,
            borderRadius: "50%",
            marginBottom: "1.5rem",
          }}
        >
          <Globe size={32} style={{ color }} />
        </div>
        <h1 className={styles.title}>
          Free{" "}
          <span className="text-gradient">{protocol.toUpperCase()}</span> Proxy
          List
        </h1>
        <p className={styles.subtitle}>
          {filteredProxies.length > 0
            ? `${filteredProxies.length.toLocaleString()} verified ${protocol.toUpperCase()} proxy servers — updated every 15 minutes.`
            : `Continuously updated list of ${protocol.toUpperCase()} proxy servers verified by a validator.`}
        </p>
      </header>

      {about && (
        <section className={styles.seoArticle}>
          <h2>What is a {protocol.toUpperCase()} Proxy?</h2>
          <p>{about}</p>
          <p>
            Download this list directly as a plain-text file:{" "}
            <a
              href={`${REPO_RAW}/${txtFile}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txtFile}
            </a>
            , or use the <Link href="/proxies.json">JSON API</Link> to filter by
            protocol, country, and latency. See the{" "}
            <Link href="/docs">documentation page</Link> for code examples in Python,
            Node.js, Go, and cURL.
          </p>
        </section>
      )}

      <section className={styles.tableSection} aria-label={`${protocol.toUpperCase()} proxy table`}>
        {filteredProxies.length > 0 ? (
          <ProxyTable proxies={filteredProxies} />
        ) : (
          <div className={styles.emptyState}>
            <h3>No {protocol.toUpperCase()} proxies currently available</h3>
            <p>
              Our validator hasn&apos;t found active {protocol.toUpperCase()}{" "}
              proxies in the latest update cycle. The list refreshes every 15
              minutes — check back shortly.
            </p>
            <Link href="/" className={styles.primaryButton}>
              View All Proxies
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
