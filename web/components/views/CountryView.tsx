import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { MapPin } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
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

  const pageUrl = isRu
    ? `${SITE_URL}/ru/country/${normalizedCode}`
    : `${SITE_URL}/country/${normalizedCode}`;
  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: isRu
      ? `Бесплатные Прокси в ${countryName} — Рабочие Серверы`
      : `Free ${countryName} Proxy List — Verified Live Endpoints`,
    description: isRu
      ? `Актуальный список проверенных прокси-серверов в ${countryName} (SOCKS5, SOCKS4, HTTP). Непрерывный аудит каждые 60 секунд движком Hydra с замером RTT и ASN.`
      : `Continuously audited list of free proxy servers located in ${countryName}. SOCKS5, SOCKS4, and HTTP protocols verified every 60 seconds by the Hydra Rust engine.`,
    url: pageUrl,
    inLanguage: isRu ? "ru" : "en",
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
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
        name: "Full Hydra JSON Dataset",
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
          question: `Как подтверждается геолокация серверов в ${countryName}?`,
          answer: `При каждой валидации движок Hydra сверяет IP-адрес с базами MaxMind GeoIP и BGP routing tables. Мы сохраняем двухбуквенный ISO-код страны и номер автономной системы (ASN), чтобы вы могли быть уверены в реальном географическом выходе трафика.`,
        },
        {
          question: `Как часто обновляется список прокси для ${countryName}?`,
          answer: `Валидация выполняется непрерывно каждые 60 секунд. Серверы, переставшие отвечать на TCP-запросы или показавшие нестабильное соединение, автоматически помечаются как неактивные.`,
        },
        {
          question: `Подходят ли эти прокси для парсинга локализованных данных в ${countryName}?`,
          answer: `Да. Выходной IP-адрес в ${countryName} позволяет получать региональные поисковые выдачи, ценообразование и контент без срабатывания географических перенаправлений.`,
        },
      ]
    : [
        {
          question: `How is server geolocation in ${countryName} verified?`,
          answer: `During every validation pass, the Hydra engine matches proxy egress IPs against MaxMind GeoIP datasets and BGP autonomous system tables. Each entry includes the ISO 3166-1 alpha-2 country code and ASN name to guarantee authentic geographic routing.`,
        },
        {
          question: `How often is the ${countryName} proxy list audited?`,
          answer: `Audits run continuously every 60 seconds. Dead sockets, lagging endpoints, and timed-out connections are purged automatically without human intervention.`,
        },
        {
          question: `Can I use ${countryName} proxies for localized web scraping and testing?`,
          answer: `Yes. Routing requests through localized IPs in ${countryName} ensures access to geo-specific search results, localized pricing, currency formats, and regional content restrictions.`,
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
        <GitHubStarCard lang={lang} />
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
