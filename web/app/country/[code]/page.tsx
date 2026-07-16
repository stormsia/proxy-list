import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { MapPin } from "lucide-react";
import Link from "next/link";

const SITE_URL = "https://stormsia.github.io/proxy-list";

// Full country names & SEO copy for high-traffic countries
const COUNTRY_META: Record<
  string,
  { name: string; title: string; description: string; keywords: string[] }
> = {
  us: {
    name: "United States",
    title: "Free USA Proxy List | United States Proxy Servers",
    description:
      "Download a free USA proxy list with SOCKS5, HTTP and HTTPS servers located in the United States. Updated every 15 minutes by an automated validator.",
    keywords: ["usa proxy list", "us proxy server", "united states proxy", "free us socks5"],
  },
  de: {
    name: "Germany",
    title: "Free Germany Proxy List | German Proxy Servers",
    description:
      "Get a free German proxy list. Fast SOCKS5 and HTTP proxy servers physically located in Germany (DE). Updated automatically.",
    keywords: ["germany proxy list", "german proxy server", "de proxy", "free german socks5"],
  },
  gb: {
    name: "United Kingdom",
    title: "Free UK Proxy List | United Kingdom Proxy Servers",
    description:
      "Free proxy servers located in the United Kingdom. SOCKS5, HTTP and HTTPS proxies from the UK. Auto-updated.",
    keywords: ["uk proxy list", "united kingdom proxy", "free uk proxy", "gb proxy server"],
  },
  nl: {
    name: "Netherlands",
    title: "Free Netherlands Proxy List | Dutch Proxy Servers",
    description:
      "Free proxy servers located in the Netherlands (NL). High-speed Dutch SOCKS5 and HTTP proxies. Updated every 15 minutes.",
    keywords: ["netherlands proxy list", "dutch proxy server", "nl proxy", "free netherlands socks5"],
  },
  fr: {
    name: "France",
    title: "Free France Proxy List | French Proxy Servers",
    description:
      "Free French proxy servers (FR). SOCKS5, SOCKS4 and HTTP proxies located in France. Auto-updated list.",
    keywords: ["france proxy list", "french proxy server", "fr proxy", "free france socks5"],
  },
  ca: {
    name: "Canada",
    title: "Free Canada Proxy List | Canadian Proxy Servers",
    description:
      "Free proxy servers located in Canada (CA). SOCKS5, HTTP and HTTPS proxies. Updated automatically every 15 minutes.",
    keywords: ["canada proxy list", "canadian proxy server", "ca proxy", "free canada socks5"],
  },
  ru: {
    name: "Russia",
    title: "Free Russia Proxy List | Russian Proxy Servers",
    description:
      "Free proxy servers located in Russia (RU). SOCKS5, SOCKS4 and HTTP proxies. Auto-updated by validator.",
    keywords: ["russia proxy list", "russian proxy server", "ru proxy", "free russia socks5"],
  },
  ua: {
    name: "Ukraine",
    title: "Free Ukraine Proxy List | Ukrainian Proxy Servers",
    description:
      "Free proxy servers located in Ukraine (UA). SOCKS5, HTTP and SOCKS4 proxies. Verified and updated automatically.",
    keywords: ["ukraine proxy list", "ukrainian proxy server", "ua proxy", "free ukraine socks5"],
  },
  cn: {
    name: "China",
    title: "Free China Proxy List | Chinese Proxy Servers",
    description:
      "Free proxy servers located in China (CN). SOCKS5 and HTTP proxies. Auto-updated list.",
    keywords: ["china proxy list", "chinese proxy server", "cn proxy", "free china socks5"],
  },
  br: {
    name: "Brazil",
    title: "Free Brazil Proxy List | Brazilian Proxy Servers",
    description:
      "Free proxy servers located in Brazil (BR). SOCKS5, HTTP and HTTPS proxies. Updated every 15 minutes.",
    keywords: ["brazil proxy list", "brazilian proxy server", "br proxy"],
  },
  in: {
    name: "India",
    title: "Free India Proxy List | Indian Proxy Servers",
    description:
      "Free proxy servers located in India (IN). SOCKS5 and HTTP proxies. Auto-validated and updated.",
    keywords: ["india proxy list", "indian proxy server", "in proxy"],
  },
  jp: {
    name: "Japan",
    title: "Free Japan Proxy List | Japanese Proxy Servers",
    description:
      "Free proxy servers located in Japan (JP). High-speed SOCKS5 and HTTP proxies. Updated automatically.",
    keywords: ["japan proxy list", "japanese proxy server", "jp proxy"],
  },
  sg: {
    name: "Singapore",
    title: "Free Singapore Proxy List | SG Proxy Servers",
    description:
      "Free proxy servers located in Singapore (SG). Fast SOCKS5 and HTTP proxies in Asia. Updated every 15 minutes.",
    keywords: ["singapore proxy list", "sg proxy server"],
  },
};

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const proxies = JSON.parse(fileContents);

  // Always generate SEO-priority country pages
  const countries = new Set<string>(Object.keys(COUNTRY_META));

  proxies.forEach((p: any) => {
    if (p.geolocation?.country?.iso_code) {
      countries.add(p.geolocation.country.iso_code.toLowerCase());
    }
  });

  return Array.from(countries).map((code) => ({ code }));
}

export async function generateMetadata(
  props: { params: Promise<{ code: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const code = params.code.toLowerCase();
  const meta = COUNTRY_META[code];

  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      alternates: { canonical: `${SITE_URL}/country/${code}` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${SITE_URL}/country/${code}`,
      },
    };
  }

  const countryName = code.toUpperCase();
  return {
    title: `Free ${countryName} Proxy List | Proxy Servers in ${countryName}`,
    description: `Free proxy servers located in ${countryName}. SOCKS5, HTTP and HTTPS proxies. Auto-updated and verified.`,
    alternates: { canonical: `${SITE_URL}/country/${code}` },
    openGraph: {
      title: `Free ${countryName} Proxy List`,
      description: `Free proxy servers located in ${countryName}. Updated every 15 minutes.`,
      url: `${SITE_URL}/country/${code}`,
    },
  };
}

export default async function CountryPage(
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const code = params.code.toLowerCase();

  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const allProxies = JSON.parse(fileContents);

  const filteredProxies = allProxies.filter((p: any) => {
    return p.geolocation?.country?.iso_code?.toLowerCase() === code;
  });

  const countryName =
    COUNTRY_META[code]?.name ||
    filteredProxies[0]?.geolocation?.country?.names?.en ||
    code.toUpperCase();

  // Protocol breakdown for structured data
  const protoCounts: Record<string, number> = {};
  filteredProxies.forEach((p: any) => {
    if (p.protocol) {
      const proto = p.protocol.toLowerCase();
      protoCounts[proto] = (protoCounts[proto] || 0) + 1;
    }
  });

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: `Free ${countryName} Proxy List`,
    description: `A free, auto-updated list of proxy servers located in ${countryName}. Includes SOCKS5, SOCKS4, and HTTP proxies verified by a validator.`,
    url: `${SITE_URL}/country/${code}`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: "stormsia",
      url: "https://github.com/stormsia",
    },
    spatialCoverage: {
      "@type": "Country",
      name: countryName,
    },
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
            background: "rgba(139, 92, 246, 0.1)",
            borderRadius: "50%",
            marginBottom: "1.5rem",
          }}
        >
          <MapPin size={32} style={{ color: "var(--accent)" }} />
        </div>
        <h1 className={styles.title}>
          Free <span className="text-gradient">{countryName}</span> Proxy List
        </h1>
        <p className={styles.subtitle}>
          {filteredProxies.length > 0
            ? `${filteredProxies.length.toLocaleString()} verified proxy servers located in ${countryName}. SOCKS5, SOCKS4 and HTTP — auto-updated every 15 minutes.`
            : `Proxy servers located in ${countryName}. Filter by protocol, download as plain text or JSON.`}
        </p>
      </header>

      {/* Protocol quick-stats */}
      {filteredProxies.length > 0 && Object.keys(protoCounts).length > 0 && (
        <section
          className={styles.statsSection}
          style={{ marginBottom: "2rem" }}
          aria-label="Protocol breakdown"
        >
          {Object.entries(protoCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([proto, count]) => (
              <a
                key={proto}
                href={`/${proto}`}
                className="glass-panel"
                style={{ textDecoration: "none", display: "block" }}
              >
                <div className={styles.statCard}>
                  <div className={styles.statInfo}>
                    <div
                      className={styles.statValue}
                      style={{ fontSize: "1.4rem" }}
                    >
                      {count.toLocaleString()}
                    </div>
                    <div className={styles.statLabel}>
                      {proto.toUpperCase()} proxies
                    </div>
                  </div>
                </div>
              </a>
            ))}
        </section>
      )}

      <section className={styles.seoArticle}>
        <h2>
          About {countryName} Proxies
        </h2>
        <p>
          This page lists all verified proxy servers with an exit IP physically
          located in <strong>{countryName}</strong>. The data is sourced from
          the open-source{" "}
          <a
            href="https://github.com/stormsia/proxy-list"
            target="_blank"
            rel="noopener noreferrer"
          >
            stormsia/proxy-list
          </a>{" "}
          repository, which is automatically updated every 15 minutes by an
          async Python daemon and a validator.
        </p>
        <p>
          Use these proxies for geo-targeted web scraping, bypassing
          geo-restrictions, or testing localised content. Download the full
          plain-text list directly:{" "}
          <a
            href="https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt"
            target="_blank"
            rel="noopener noreferrer"
          >
            working_proxies.txt
          </a>
          . For machine-readable access with geolocation data, use the{" "}
          <Link href="/proxies.json" target="_blank">
            JSON API
          </Link>{" "}
          and filter by <code>geolocation.country.iso_code === &quot;{code.toUpperCase()}&quot;</code>.
          See the <Link href="/docs">docs page</Link> for code examples.
        </p>
      </section>

      <section className={styles.tableSection} aria-label={`${countryName} proxy table`}>
        {filteredProxies.length > 0 ? (
          <ProxyTable proxies={filteredProxies} />
        ) : (
          <div className={styles.emptyState}>
            <h3>No proxies currently available for {countryName}</h3>
            <p>
              Our validator hasn&apos;t found active proxies for this location
              in the latest update cycle. The list refreshes every 15 minutes —
              check back shortly.
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
