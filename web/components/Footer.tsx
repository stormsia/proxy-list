import Link from "next/link";
import styles from "./Footer.module.css";
import { getProxies, getProxyStats } from "@/lib/proxies";
import { getCountryDisplayName } from "@/lib/countries";

export default async function Footer() {
  const allProxies = await getProxies();
  const stats = getProxyStats(allProxies);

  // Protocols sorted by count descending
  const sortedProtocols = Object.entries(stats.protocolCounts).sort(
    (a, b) => b[1] - a[1]
  );

  // Countries sorted by count descending
  const sortedCountries = Object.entries(stats.countryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([code, count]) => ({
      code,
      count,
      name: getCountryDisplayName(code, code.toUpperCase(), "en"),
    }));

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
              {sortedCountries.map(({ code, count, name }) => (
                <li key={code}>
                  <Link href={`/country/${code}`}>{name} ({count})</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>Proxy Types</h4>
            <ul className={styles.list}>
              <li><Link href="/residential">Residential Proxies ({stats.residentialCount})</Link></li>
              <li><Link href="/datacenter">Datacenter Proxies ({stats.datacenterCount})</Link></li>
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
