"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";
import styles from "./Footer.module.css";
import { getCountryDisplayName } from "@/lib/countries";
import type { ProxyStats } from "@/lib/types";

export default function FooterClient({ stats }: { stats: ProxyStats }) {
  const pathname = usePathname() || "";
  const isRu = pathname.startsWith("/ru");
  const prefix = isRu ? "/ru" : "";

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
      name: getCountryDisplayName(code, code.toUpperCase(), isRu ? "ru" : "en"),
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
                className={styles.titleLink}
              >
                stormsia/proxy-list
              </a>
            </h3>
            <p className={styles.description}>
              {isRu
                ? "Бесплатный открытый список прокси SOCKS5, SOCKS4, HTTP и HTTPS, непрерывно проверяемый валидатором Hydra каждую минуту."
                : "Open-source, auto-updated free proxy list. SOCKS5, SOCKS4, HTTP and HTTPS proxies verified continuously every minute by the Hydra engine."}
            </p>
            <div style={{ marginTop: "0.85rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <a
                href="https://github.com/stormsia/hydra"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  background: "rgba(139, 92, 246, 0.1)",
                  padding: "0.35rem 0.65rem",
                  borderRadius: "6px",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                  transition: "all 0.2s ease",
                }}
              >
                ⚡ {isRu ? "Проверено движком Hydra" : "Verified with Hydra Engine"} ↗
              </a>
              <a
                href="https://github.com/stormsia/proxy-list"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerStarBadge}
                title={isRu ? "Поставить звезду stormsia/proxy-list на GitHub" : "Star stormsia/proxy-list on GitHub"}
              >
                <Star size={13} fill="#eab308" color="#eab308" />
                <span>{isRu ? "Поставить звезду" : "Star on GitHub"}</span>
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>{isRu ? "Протоколы" : "Proxy Protocols"}</h4>
            <ul className={styles.list}>
              {sortedProtocols.map(([proto, count]) => (
                <li key={proto}>
                  <Link href={`${prefix}/${proto}`}>
                    {isRu ? `Прокси ${proto.toUpperCase()}` : `Free ${proto.toUpperCase()} Proxies`} ({count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>{isRu ? "Локации" : "Locations"}</h4>
            <ul className={styles.locationsList}>
              {sortedCountries.slice(0, 20).map(({ code, count, name }) => (
                <li key={code}>
                  <Link href={`${prefix}/country/${code}`}>
                    {name} ({count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>{isRu ? "Типы Прокси" : "Proxy Types"}</h4>
            <ul className={styles.list}>
              <li>
                <Link href={`${prefix}/residential`}>
                  {isRu ? "Резидентные прокси" : "Residential Proxies"} ({stats.residentialCount})
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/datacenter`}>
                  {isRu ? "Серверные прокси" : "Datacenter Proxies"} ({stats.datacenterCount})
                </Link>
              </li>
              <li>
                <Link href={`${prefix}/docs`}>
                  {isRu ? "Документация и API" : "Developer API & Docs"}
                </Link>
              </li>
              <li>
                <a
                  href="https://stormsia.github.io/proxy-list/llms.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LLM Context for AI Agents"
                >
                  llms.txt (AI Context) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://stormsia.github.io/proxy-list/llms-full.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Comprehensive Developer and AI Agent Reference"
                >
                  llms-full.txt (Full AI Spec) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://stormsia.github.io/proxy-list/.well-known/ai-catalog.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Agentic Resource Discovery (ARD) Manifest"
                >
                  ai-catalog.json (ARD Manifest) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://stormsia.github.io/proxy-list/pricing.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open Source & Free Tier Pricing Declaration"
                >
                  pricing.md (Free Tier Spec) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://stormsia.github.io/proxy-list/AGENTS.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="AI Agent Interaction Guidelines & Protocols"
                >
                  AGENTS.md (Agent Protocol) ↗
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/stormsia/hydra"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--accent)" }}
                >
                  {isRu ? "Движок валидации Hydra" : "Hydra Validation Engine"} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p suppressHydrationWarning>
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://github.com/stormsia/proxy-list"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--primary)" }}
            >
              stormsia/proxy-list
            </a>
            . {isRu ? "Открытый исходный код. Полностью бесплатно." : "Open-source. Free to use."}{" "}
            <a
              href="https://github.com/stormsia/proxy-list"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bottomStarPill}
              title={isRu ? "Поставить звезду на GitHub" : "Star on GitHub"}
            >
              <Star size={11} fill="#eab308" color="#eab308" />
              <span>{isRu ? "Поставить звезду" : "Star on GitHub"}</span>
            </a>
          </p>
          <div className={styles.seoText}>
            {isRu
              ? "Бесплатные публичные прокси: SOCKS5, SOCKS4, HTTP и HTTPS серверы со всего мира, непрерывно проверяемые высокоскоростным валидатором Hydra. Включает резидентные и серверные прокси с данными геолокации и ASN."
              : "Free public proxy list: SOCKS5, SOCKS4, HTTP and HTTPS proxy servers sourced globally, verified continuously by the high-speed Hydra validator. Includes residential and datacenter proxies with geolocation and ASN data."}
          </div>
        </div>
      </div>
    </footer>
  );
}
