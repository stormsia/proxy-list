"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import styles from "./Footer.module.css";
import { getCountryDisplayName } from "@/lib/countries";
import type { ProxyStats } from "@/lib/types";
import { useDictionary } from "./I18nProvider";

export default function FooterClient({ stats }: { stats: ProxyStats }) {
  const { dict, locale, getPath } = useDictionary();

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
      name: getCountryDisplayName(code, code.toUpperCase(), locale),
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
              {dict.footer.desc}
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
                ⚡ {dict.footer.hydraBadge} ↗
              </a>
              <a
                href="https://github.com/stormsia/proxy-list"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerStarBadge}
                title={dict.footer.starBadgeTitle}
              >
                <Star size={13} fill="#eab308" color="#eab308" />
                <span>{dict.footer.starBadgeText}</span>
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>{dict.footer.proxyProtocols}</h4>
            <ul className={styles.list}>
              {sortedProtocols.map(([proto, count]) => (
                <li key={proto}>
                  <Link href={getPath(`/${proto}`)}>
                    {dict.footer.protocolLink.replace("{protocol}", proto.toUpperCase())} ({count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>{dict.footer.locations}</h4>
            <ul className={styles.locationsList}>
              {sortedCountries.slice(0, 20).map(({ code, count, name }) => (
                <li key={code}>
                  <Link href={getPath(`/country/${code}`)} suppressHydrationWarning>
                    {name} ({count})
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.heading}>{dict.footer.proxyTypes}</h4>
            <ul className={styles.list}>
              <li>
                <Link href={getPath("/residential")}>
                  {dict.footer.residential} ({stats.residentialCount})
                </Link>
              </li>
              <li>
                <Link href={getPath("/datacenter")}>
                  {dict.footer.datacenter} ({stats.datacenterCount})
                </Link>
              </li>
              <li>
                <Link href={getPath("/docs")}>
                  {dict.footer.docs}
                </Link>
              </li>
              <li>
                <Link href={getPath("/about")}>
                  {dict.footer.about}
                </Link>
              </li>
              <li>
                <Link href={getPath("/privacy")}>
                  {dict.footer.privacy}
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
                  {dict.footer.hydraEngine} ↗
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
            . {dict.footer.openSource}{" "}
            <a
              href="https://github.com/stormsia/proxy-list"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bottomStarPill}
              title={dict.footer.bottomStarTitle}
            >
              <Star size={11} fill="#eab308" color="#eab308" />
              <span>{dict.footer.bottomStarText}</span>
            </a>
          </p>
          <div className={styles.seoText}>
            {dict.footer.bottomSeo}
          </div>
        </div>
      </div>
    </footer>
  );
}
