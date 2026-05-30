import { promises as fs } from "fs";
import path from "path";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { MapPin } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import { getDictionary, Locale } from "@/lib/i18n";

const SITE_URL = "https://stormsia.github.io/proxy-list";

// Full country names & SEO copy for high-traffic countries (keep metadata in page.tsx)
// We just need it for display name fallback if not found in JSON
export const COUNTRY_META: Record<string, { name: string }> = {
  us: { name: "United States" },
  de: { name: "Germany" },
  gb: { name: "United Kingdom" },
  nl: { name: "Netherlands" },
  fr: { name: "France" },
  ca: { name: "Canada" },
  ru: { name: "Russia" },
  ua: { name: "Ukraine" },
  cn: { name: "China" },
  br: { name: "Brazil" },
  in: { name: "India" },
  jp: { name: "Japan" },
  sg: { name: "Singapore" },
};

export default async function CountryView({ lang, code }: { lang: Locale, code: string }) {
  const dict = await getDictionary(lang);
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

  const protoCounts: Record<string, number> = {};
  filteredProxies.forEach((p: any) => {
    if (p.protocol) {
      const proto = p.protocol.toLowerCase();
      protoCounts[proto] = (protoCounts[proto] || 0) + 1;
    }
  });

  const isRu = lang === "ru";
  const pageUrl = isRu ? `${SITE_URL}/ru/country/${code}` : `${SITE_URL}/country/${code}`;
  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: isRu ? `Бесплатные Прокси в ${countryName}` : `Free ${countryName} Proxy List`,
    description: isRu
      ? `Бесплатный автообновляемый список прокси-серверов, расположенных в ${countryName}. Включает SOCKS5, SOCKS4 и HTTP прокси, проверенные валидатором.`
      : `A free, auto-updated list of proxy servers located in ${countryName}. Includes SOCKS5, SOCKS4, and HTTP proxies verified by a validator.`,
    url: pageUrl,
    inLanguage: isRu ? "ru" : "en",
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isRu ? "Главная" : "Home",
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isRu ? "Прокси по странам" : "Country Proxies",
        item: `${homeUrl}/#countries`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: countryName,
        item: pageUrl,
      },
    ],
  };
  const faqItems = isRu ? [
    { question: `Находятся ли эти прокси физически в ${countryName}?`, answer: `Да, IP-адреса этих прокси геолоцируются в ${countryName}.` },
    { question: `Бесплатны ли прокси ${countryName}?`, answer: `Да, все прокси на этой странице бесплатны и с открытым исходным кодом.` }
  ] : [
    { question: `Are these proxies physically located in ${countryName}?`, answer: `Yes, the exit IP addresses of the proxies listed on this page are geolocated to ${countryName}.` },
    { question: `Are the ${countryName} proxies free?`, answer: `Yes, all proxy servers listed in our directory are completely free and open-source.` }
  ];

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
          {dict.country.titlePrefix} <span className="text-gradient">{countryName}</span> {dict.country.titleSuffix}
        </h1>
        <p className={styles.subtitle}>
          {filteredProxies.length > 0
            ? `${filteredProxies.length.toLocaleString()} ${dict.country.subtitle.replace("{country}", countryName)}`
            : dict.country.subtitleEmpty.replace("{country}", countryName)}
        </p>
      </header>

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
                      {proto.toUpperCase()} {dict.country.proxiesLabel}
                    </div>
                  </div>
                </div>
              </a>
            ))}
        </section>
      )}

      <section className={styles.seoArticle}>
        <h2>
          {dict.country.aboutTitle.replace("{country}", countryName)}
        </h2>
        <p>
          {dict.country.aboutText1}<strong>{countryName}</strong>{dict.country.aboutText2}
          <a
            href="https://github.com/stormsia/proxy-list"
            target="_blank"
            rel="noopener noreferrer"
          >
            stormsia/proxy-list
          </a>
          {isRu ? "." : " repository."}
        </p>
        <p style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(139, 92, 246, 0.1)", borderRadius: "8px", borderLeft: "4px solid var(--accent)" }}>
          ⭐ <strong>{dict.home.starPrefix}</strong> <a href="https://github.com/stormsia/proxy-list" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: "bold", textDecoration: "underline" }}>{dict.home.starLink}</a>{dict.home.starSuffix}
        </p>
      </section>

      <section className={styles.tableSection} aria-label={`${countryName} proxy table`}>
        {filteredProxies.length > 0 ? (
          <ProxyTable proxies={filteredProxies} dict={dict.table} />
        ) : (
          <div className={styles.emptyState}>
            <h3>{dict.country.emptyTitle.replace("{country}", countryName)}</h3>
            <Link href="/" className={styles.primaryButton}>
              {dict.country.viewAll}
            </Link>
          </div>
        )}
      </section>

      <FAQ items={faqItems} title={dict.faq.title} />
    </div>
  );
}
