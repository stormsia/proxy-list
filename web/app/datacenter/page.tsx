import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Server } from "lucide-react";
import Link from "next/link";
const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

export const metadata: Metadata = {
  title: "Free Datacenter Proxy List | Fast DC Proxy Servers",
  description:
    "Free datacenter proxy list featuring high-bandwidth, low-latency IPs from cloud providers. Ideal for bulk scraping, API polling, and automated testing. Verified every 15 minutes by a validator.",
  keywords: [
    "free datacenter proxies",
    "datacenter proxy list",
    "cheap datacenter proxy",
    "fast datacenter proxy",
    "cloud proxy server",
  ],
  alternates: { canonical: `${SITE_URL}/datacenter` },
  openGraph: {
    title: "Free Datacenter Proxy List | stormsia/proxy-list",
    description:
      "Fast datacenter proxies — cloud-hosted IPs with high bandwidth. Auto-updated every 15 minutes.",
    url: `${SITE_URL}/datacenter`,
  },
};

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

export default async function DatacenterPage() {
  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const allProxies = JSON.parse(fileContents);

  const dcProxies = allProxies.filter((p: any) => {
    const asnOrg = p.asn?.autonomous_system_organization?.toLowerCase() || "";
    return DC_KEYWORDS.some((kw) => asnOrg.includes(kw));
  });

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: "Free Datacenter Proxy List",
    description:
      "A list of free proxy servers hosted in cloud and datacenter infrastructure (DigitalOcean, AWS, OVH, Hetzner, etc.). Verified by a  validator and updated every 15 minutes.",
    url: `${SITE_URL}/datacenter`,
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
            background: "rgba(56, 189, 248, 0.1)",
            borderRadius: "50%",
            marginBottom: "1.5rem",
          }}
        >
          <Server size={32} style={{ color: "#38bdf8" }} />
        </div>
        <h1 className={styles.title}>
          Free{" "}
          <span
            className="text-gradient"
            style={{
              backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8)",
            }}
          >
            Datacenter
          </span>{" "}
          Proxies
        </h1>
        <p className={styles.subtitle}>
          {dcProxies.length > 0
            ? `${dcProxies.length.toLocaleString()} datacenter proxies hosted in cloud infrastructure — high bandwidth, low latency.`
            : "High-bandwidth, low-latency IPs from cloud providers. Ideal for bulk scraping and automated testing."}
        </p>
      </header>

      <section className={styles.seoArticle}>
        <h2>What Are Datacenter Proxies?</h2>
        <p>
          Datacenter proxies are IP addresses hosted in commercial cloud or
          colocation facilities — from providers such as DigitalOcean, Amazon
          AWS, OVH, Hetzner, or Linode. They typically offer{" "}
          <strong>higher bandwidth and lower latency</strong> than residential
          proxies, making them ideal for high-volume scraping, bulk API polling,
          automated testing, and any task where raw speed matters more than IP
          reputation.
        </p>
        <p>
          The trade-off is that datacenter IPs are more commonly flagged by
          anti-bot systems because their ASN is easily identified as a hosting
          provider. For sites with strict bot detection (Cloudflare, Akamai,
          Imperva), consider using the{" "}
          <Link href="/residential">residential proxies</Link> instead.
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
          . For SOCKS5-only datacenter proxies, cross-reference the{" "}
          <Link href="/socks5">SOCKS5 list</Link>. See the{" "}
          <Link href="/docs">docs page</Link> for Python, Node.js, Go, and cURL
          integration examples.
        </p>
      </section>

      <section
        className={styles.tableSection}
        aria-label="Datacenter proxy table"
      >
        {dcProxies.length > 0 ? (
          <ProxyTable proxies={dcProxies} />
        ) : (
          <div className={styles.emptyState}>
            <h3>No datacenter proxies currently available</h3>
            <p>
              Our validator hasn&apos;t classified any datacenter proxies in the
              latest update cycle. The list refreshes every 15 minutes — check
              back shortly.
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
