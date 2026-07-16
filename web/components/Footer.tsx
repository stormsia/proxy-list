import Link from "next/link";
import { promises as fs } from "fs";
import path from "path";
import styles from "./Footer.module.css";

export default async function Footer() {
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
  const sortedCountries = Object.entries(countryCounts).sort((a, b) => {
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
                className={styles.titleLink} // Если захотите стилизовать отдельно через CSS-модуль
                style={{ transition: 'color 0.2s ease' }} // Плавный ховер, если нужен
              >
                stormsia/proxy-list
              </a>
            </h3>
            <p className={styles.description}>
              Open-source, auto-updated free proxy list. SOCKS5, SOCKS4, HTTP and HTTPS proxies
              verified every 15 minutes by a validator daemon.
              View the data on{" "}
              <a href="https://github.com/stormsia/proxy-list" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>GitHub (proxy-list)</a>{" "}

            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Proxy Protocols</h4>
            <ul className={styles.list}>
              {sortedProtocols.map(([proto, count]) => (
                <li key={proto}>
                  <Link href={`/${proto}`}>Free {proto.toUpperCase()} Proxies ({count})</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Locations</h4>
            <ul className={styles.locationsList}>
              {sortedCountries.map(([code, { count, name }]) => (
                <li key={code}>
                  <Link href={`/country/${code}`}>{name} ({count})</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Proxy Types</h4>
            <ul className={styles.list}>
              <li><Link href="/residential">Residential Proxies ({residentialCount})</Link></li>
              <li><Link href="/datacenter">Datacenter Proxies ({datacenterCount})</Link></li>
              <li><Link href="/docs">Developer API & Docs</Link></li>
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
            . Open-source. Free to use.
          </p>
          <div className={styles.seoText}>
            Free public proxy list: SOCKS5, SOCKS4, HTTP and HTTPS proxy servers sourced globally, verified by a validator every 15 minutes. Includes residential and datacenter proxies with geolocation and ASN data.
          </div>
        </div>
      </div>
    </footer>
  );
}
