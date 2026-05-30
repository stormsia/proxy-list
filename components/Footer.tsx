import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import styles from "./Footer.module.css";
import { getDictionary, Locale } from "@/lib/i18n";

export default async function Footer({ lang = "en" }: { lang?: Locale }) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";
  const base = isRu ? "/ru" : "";

  let allProxies: any[] = [];
  try {
    const filePath = path.join(process.cwd(), "public", "proxies.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    allProxies = JSON.parse(fileContents);
  } catch (e) {
    // Fallback if file doesn't exist during some build step
  }

  // 1. Dynamic Protocols
  const protocolCounts: Record<string, number> = {
    "socks5": 0, "socks4": 0, "http": 0, "https": 0
  };

  // 2. Dynamic Countries
  const countryCounts: Record<string, { count: number; name: string }> = {
    "us": { count: 0, name: "United States" },
    "de": { count: 0, name: "Germany" },
    "gb": { count: 0, name: "United Kingdom" },
    "nl": { count: 0, name: "Netherlands" },
    "fr": { count: 0, name: "France" },
    "ca": { count: 0, name: "Canada" },
    "ru": { count: 0, name: "Russia" },
    "ua": { count: 0, name: "Ukraine" }
  };

  // 3. Types
  const dcKeywords = ["digitalocean", "amazon", "hosting", "ovh", "hetzner", "linode"];
  let residentialCount = 0;
  let datacenterCount = 0;

  // Compute all counts dynamically
  allProxies.forEach(p => {
    // Protocols
    if (p.protocol) {
      const proto = p.protocol.toLowerCase();
      protocolCounts[proto] = (protocolCounts[proto] || 0) + 1;
    }

    // Countries
    if (p.geolocation?.country?.iso_code) {
      const code = p.geolocation.country.iso_code.toLowerCase();
      const name = p.geolocation.country.names?.en || code.toUpperCase();
      if (!countryCounts[code]) {
        countryCounts[code] = { count: 0, name };
      }
      countryCounts[code].count++;
    }

    // Types
    const asnOrg = p.asn?.autonomous_system_organization?.toLowerCase() || "";
    if (dcKeywords.some(keyword => asnOrg.includes(keyword))) {
      datacenterCount++;
    } else {
      residentialCount++;
    }
  });

  // Sort countries by count descending, then alphabetically
  const sortedCountries = Object.entries(countryCounts)
    .filter(([_, data]) => data.count > 0)
    .sort((a, b) => {
      if (b[1].count !== a[1].count) return b[1].count - a[1].count;
      return a[1].name.localeCompare(b[1].name);
    });

  // Sort protocols by count descending
  const sortedProtocols = Object.entries(protocolCounts).sort((a, b) => b[1] - a[1]);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.title}>
              <a
                href="https://github.com/stormsia/proxy-list"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.titleLink}
                style={{ transition: 'color 0.2s ease' }}
              >
                stormsia/proxy-list
              </a>
            </h3>
            <p className={styles.description}>
              {dict.footer.desc}
              <br />
              {dict.footer.viewData}
              <a href="https://github.com/stormsia/proxy-list" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>GitHub (proxy-list)</a>{" "}
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>{dict.footer.proxyProtocols}</h4>
            <ul className={styles.list}>
              {sortedProtocols.map(([proto, count]) => (
                <li key={proto}>
                  <Link href={`${base}/${proto}`}>{lang === 'ru' ? "Бесплатные" : "Free"} {proto.toUpperCase()} {lang === 'ru' ? "Прокси" : "Proxies"} ({count})</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>{dict.footer.locations}</h4>
            <ul className={styles.locationsList}>
              {sortedCountries.map(([code, { count, name }]) => (
                <li key={code}>
                  <Link href={`${base}/country/${code}`}>{name} ({count})</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>{dict.footer.resources}</h4>
            <ul className={styles.list}>
              <li><Link href={`${base}/residential`}>{dict.footer.residential} ({residentialCount})</Link></li>
              <li><Link href={`${base}/datacenter`}>{dict.footer.datacenter} ({datacenterCount})</Link></li>
              <li><Link href={`${base}/docs`}>{dict.footer.docs}</Link></li>
              <li><a href="/proxy-list/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap XML</a></li>
              <li><a href="/proxy-list/robots.txt" target="_blank" rel="noopener noreferrer">robots.txt</a></li>
              <li><a href="/proxy-list/llms.txt" target="_blank" rel="noopener noreferrer">llms.txt</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://github.com/stormsia/proxy-list"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)" }}
            >
              stormsia/proxy-list
            </a>
            . {dict.footer.openSource}
          </p>
          <div className={styles.seoText}>
            {dict.footer.seoText}
          </div>
        </div>
      </div>
    </footer>
  );
}
