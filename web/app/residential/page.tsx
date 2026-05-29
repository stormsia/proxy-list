import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Home } from "lucide-react";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

export const metadata: Metadata = {
  title: "Free Residential Proxy List | Residential IP Proxies",
  description:
    "Free residential proxies sourced from real ISP-assigned IP addresses. Lower detection rates compared to datacenter proxies. Verified automatically every 15 minutes. No registration required.",
  keywords: [
    "free residential proxies",
    "residential proxy list",
    "residential ip proxy",
    "isp proxy list",
    "real ip proxy",
  ],
  alternates: { canonical: `${SITE_URL}/residential` },
  openGraph: {
    title: "Free Residential Proxy List | stormsia/proxy-list",
    description:
      "Free residential proxies — real ISP-assigned IPs. Lower detection rates. Auto-updated every 15 minutes.",
    url: `${SITE_URL}/residential`,
  },
};

// ASN keywords that indicate datacenter / hosting infrastructure
const DC_KEYWORDS = [
  "digitalocean",
  "amazon",
  "aws",
  "hosting",
  "ovh",
  "hetzner",
  "linode",
  "vultr",
  "contabo",
  "datacamp",
  "cloudflare",
  "google",
  "microsoft",
  "azure",
  "server",
  "datacenter",
  "data center",
  "colocation",
];

export default async function ResidentialPage() {
  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const allProxies = JSON.parse(fileContents);

  const residentialProxies = allProxies.filter((p: any) => {
    const asnOrg = p.asn?.autonomous_system_organization?.toLowerCase() || "";
    return !DC_KEYWORDS.some((kw) => asnOrg.includes(kw));
  });

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: "Free Residential Proxy List",
    description:
      "A list of free proxy servers classified as residential — sourced from ISP-assigned IPs rather than cloud/datacenter providers. Verified by a validator and updated every 15 minutes.",
    url: `${SITE_URL}/residential`,
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
        contentUrl: `${REPO_RAW}/working_proxies.txt`,
        name: "All Working Proxies (TXT)",
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
            background: "rgba(245, 158, 11, 0.1)",
            borderRadius: "50%",
            marginBottom: "1.5rem",
          }}
        >
          <Home size={32} style={{ color: "#f59e0b" }} />
        </div>
        <h1 className={styles.title}>
          Free <span className="text-gradient">Residential</span> Proxies
        </h1>
        <p className={styles.subtitle}>
          {residentialProxies.length > 0
            ? `${residentialProxies.length.toLocaleString()} residential proxies from real ISP-assigned IPs — auto-updated every 15 minutes.`
            : "Proxies from real ISP-assigned IP addresses. Lower detection rates for scraping and automation."}
        </p>
      </header>

      <section className={styles.seoArticle}>
        <h2>What Are Residential Proxies?</h2>
        <p>
          Residential proxies route your traffic through IP addresses assigned
          by Internet Service Providers (ISPs) to real home or mobile devices.
          Unlike datacenter proxies, residential IPs are less likely to be
          flagged or blocked by anti-bot systems such as Cloudflare, Akamai, or
          PerimeterX, because they appear to be ordinary consumer traffic.
        </p>
        <p>
          The proxies on this page are classified as residential using a
          heuristic based on their Autonomous System Number (ASN): any proxy
          whose ASN organisation name does not match known cloud or hosting
          providers (e.g. DigitalOcean, Amazon AWS, OVH, Hetzner) is
          categorised as residential. While this is an approximation, it
          provides a meaningful distinction from purely datacenter-origin
          proxies.
        </p>
        <p>
          Download the full list:{" "}
          <a
            href={`${REPO_RAW}/working_proxies.txt`}
            target="_blank"
            rel="noopener noreferrer"
          >
            working_proxies.txt
          </a>
          . For protocol-specific sub-lists (SOCKS5, HTTP), visit the{" "}
          <a href="/socks5">SOCKS5</a> or <a href="/http">HTTP</a> pages. See
          the <a href="/docs">docs page</a> for integration code.
        </p>
      </section>

      <section
        className={styles.tableSection}
        aria-label="Residential proxy table"
      >
        {residentialProxies.length > 0 ? (
          <ProxyTable proxies={residentialProxies} />
        ) : (
          <div className={styles.emptyState}>
            <h3>No residential proxies currently available</h3>
            <p>
              Our validator hasn&apos;t classified any residential proxies in
              the latest update cycle. The list refreshes every 15 minutes —
              check back shortly.
            </p>
            <a href="/" className={styles.primaryButton}>
              View All Proxies
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
