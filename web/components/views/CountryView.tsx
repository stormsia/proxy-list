import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { MapPin } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import { getDictionary, Locale } from "@/lib/i18n";
import { getProxies, getProxiesByCountry } from "@/lib/proxies";
import { COUNTRY_META, getCountryDisplayName } from "@/lib/countries";
import { getFaqSchema } from "@/lib/seo";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export { COUNTRY_META };

export default async function CountryView({
  lang,
  code,
}: {
  lang: Locale;
  code: string;
}) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";
  const normalizedCode = code.toLowerCase();

  const allProxies = await getProxies();
  const filteredProxies = getProxiesByCountry(allProxies, normalizedCode);

  const fallbackName = code.toUpperCase();

  const countryName = getCountryDisplayName(
    normalizedCode,
    fallbackName,
    isRu ? "ru" : "en"
  );

  const protoCounts: Record<string, number> = {};
  filteredProxies.forEach((p) => {
    if (p.protocol) {
      const proto = p.protocol.toLowerCase();
      protoCounts[proto] = (protoCounts[proto] || 0) + 1;
    }
  });

  const pageUrl = isRu
    ? `${SITE_URL}/ru/country/${normalizedCode}`
    : `${SITE_URL}/country/${normalizedCode}`;
  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: isRu
      ? `Бесплатные Прокси в ${countryName}`
      : `Free ${countryName} Proxy List`,
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
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/data/proxies.json`,
      },
    ],
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
        name: isRu ? `Прокси в ${countryName}` : `${countryName} Proxies`,
        item: pageUrl,
      },
    ],
  };

  const faqItems = isRu
    ? [
        {
          question: `Бесплатны ли прокси из региона ${countryName}?`,
          answer: `Да, все прокси в ${countryName} на этой странице полностью бесплатны для использования.`,
        },
        {
          question: `Как часто обновляются прокси в ${countryName}?`,
          answer: `Наш автоматический чекер проверяет работоспособность каждого прокси-сервера каждые 15 минут.`,
        },
        {
          question: `Подходят ли эти прокси для парсинга сайтов в ${countryName}?`,
          answer: `Да, локальные IP-адреса помогают получать гео-специфичные данные и страницы для региона ${countryName}.`,
        },
      ]
    : [
        {
          question: `Are the proxies in ${countryName} free to use?`,
          answer: `Yes, all ${countryName} proxy servers listed on this page are completely free and open-source.`,
        },
        {
          question: `How often is the ${countryName} proxy list updated?`,
          answer: `Our automated validator checks every proxy server in ${countryName} for availability and latency every 15 minutes.`,
        },
        {
          question: `Can I use these proxies for geo-targeted scraping in ${countryName}?`,
          answer: `Yes, physically located proxy servers in ${countryName} provide accurate local IP addresses for location-dependent web scraping.`,
        },
      ];

  const faqSchema = getFaqSchema(faqItems);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <header className={styles.header}>
        <div
          style={{
            display: "inline-flex",
            padding: "1rem",
            background: "rgba(16, 185, 129, 0.1)",
            borderRadius: "50%",
            marginBottom: "1.5rem",
          }}
        >
          <MapPin size={32} style={{ color: "var(--primary)" }} />
        </div>
        <h1 className={styles.title}>
          {dict.country.titlePrefix}{" "}
          <span className="text-gradient">{countryName}</span>{" "}
          {dict.country.titleSuffix}
        </h1>
        <p className={styles.subtitle}>
          {filteredProxies.length > 0
            ? `${filteredProxies.length.toLocaleString()} ${dict.country.subtitle.replace(
                "{country}",
                countryName
              )}`
            : dict.country.subtitleEmpty.replace("{country}", countryName)}
        </p>
      </header>

      <section
        className={styles.seoArticle}
        aria-label={`About proxies in ${countryName}`}
      >
        <h2>
          {dict.country.aboutTitle.replace("{country}", countryName)}
        </h2>
        <p>
          {dict.country.aboutText1}
          <strong>{countryName}</strong>
          {dict.country.aboutText2}
        </p>
        <p
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "rgba(139, 92, 246, 0.1)",
            borderRadius: "8px",
            borderLeft: "4px solid var(--accent)",
          }}
        >
          ⭐ <strong>{dict.home.starPrefix}</strong>{" "}
          <a
            href="https://github.com/stormsia/proxy-list"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--accent)",
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            {dict.home.starLink}
          </a>
          {dict.home.starSuffix}
        </p>
      </section>

      <section
        className={styles.tableSection}
        aria-label={`${countryName} proxy table`}
      >
        {filteredProxies.length > 0 ? (
          <ProxyTable proxies={filteredProxies} dict={dict.table} />
        ) : (
          <div className={styles.emptyState}>
            <h3>
              {dict.country.emptyTitle.replace("{country}", countryName)}
            </h3>
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0.5rem auto 1.5rem" }}>
              {isRu
                ? `В данный момент в регионе ${countryName} нет активных прокси. Валидатор Hydra проверяет сокеты каждую минуту — новые рабочие серверы появятся здесь автоматически сразу после подтверждения. Вы можете использовать альтернативные проверенные серверы ниже:`
                : `No active proxies in ${countryName} at the moment. Our Hydra engine verifies socket health every minute — new nodes will appear here automatically once confirmed. In the meantime, explore the global pool below:`}
            </p>
            <div style={{ marginBottom: "2rem" }}>
              <Link href={isRu ? "/ru" : "/"} className={styles.primaryButton}>
                {dict.country.viewAll}
              </Link>
            </div>
            <div style={{ textAlign: "left", marginTop: "1rem" }}>
              <h4 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
                {isRu ? "Альтернативные быстрые прокси со всего мира:" : "Fast Alternative Global Proxies:"}
              </h4>
              <ProxyTable proxies={allProxies.slice(0, 20)} dict={dict.table} />
            </div>
          </div>
        )}
      </section>

      <FAQ items={faqItems} title={dict.faq.title} />
    </div>
  );
}
