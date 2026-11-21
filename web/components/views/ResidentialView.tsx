import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Home } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import { getDictionary, Locale } from "@/lib/i18n";
import { getProxies, getResidentialProxies } from "@/lib/proxies";
import { getBreadcrumbSchema, getFaqSchema } from "@/lib/seo";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

export default async function ResidentialView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";

  const allProxies = await getProxies();
  const residentialProxies = getResidentialProxies(allProxies);

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: isRu ? "Бесплатные Резидентные Прокси" : "Free Residential Proxy List",
    description: isRu
      ? "Список бесплатных прокси-серверов с реальными IP-адресами от домашних провайдеров (ISP). Проверяется валидатором каждые 15 минут."
      : "A list of free proxy servers classified as residential — sourced from ISP-assigned IPs rather than cloud/datacenter providers. Verified by a validator and updated every 15 minutes.",
    url: `${SITE_URL}${isRu ? "/ru" : ""}/residential`,
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

  const faqItems = isRu
    ? [
        {
          question: "Что такое резидентные прокси?",
          answer:
            "Резидентные прокси используют IP-адреса, выданные интернет-провайдерами (ISP) реальным домашним пользователям. Они реже блокируются системами защиты.",
        },
        {
          question: "Бесплатны ли эти резидентные прокси?",
          answer:
            "Да, все прокси на этой странице полностью бесплатны и проверяются каждые 15 минут.",
        },
        {
          question: "Почему их так мало?",
          answer:
            "Большинство публичных прокси работают в датацентрах. Настоящие резидентные прокси встречаются реже и имеют более динамичный цикл доступности.",
        },
      ]
    : [
        {
          question: "What are residential proxies?",
          answer:
            "Residential proxies use IP addresses assigned by Internet Service Providers (ISPs) to real home users. They are less likely to be blocked by anti-bot systems.",
        },
        {
          question: "Are these residential proxies free?",
          answer:
            "Yes, all proxies on this page are completely free and verified every 15 minutes.",
        },
        {
          question: "Why are there fewer residential proxies?",
          answer:
            "Most open proxies are hosted on cloud servers. Genuine residential proxies are rare in public collections and have shorter operational lifespans.",
        },
      ];

  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;
  const pageUrl = `${SITE_URL}${isRu ? "/ru" : ""}/residential`;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isRu ? "Главная" : "Home", url: homeUrl },
    { name: isRu ? "Резидентные Прокси" : "Residential Proxies", url: pageUrl },
  ]);
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
          <Home size={32} style={{ color: "var(--primary)" }} />
        </div>
        <h1 className={styles.title}>
          {isRu ? "Бесплатные " : "Free "}
          <span className="text-gradient">Residential</span>
          {isRu ? " Прокси" : " Proxies"}
        </h1>
        <p className={styles.subtitle}>
          {residentialProxies.length > 0
            ? `${residentialProxies.length.toLocaleString()} ${
                isRu
                  ? "резидентных прокси с IP-адресами от реальных интернет-провайдеров."
                  : "residential proxies assigned by consumer ISPs with low block rates."
              }`
            : isRu
            ? "Нет активных резидентных прокси."
            : "No active residential proxies."}
        </p>
      </header>

      <section
        className={styles.seoArticle}
        aria-label="About residential proxies"
      >
        <h2>
          {isRu
            ? "О резидентных прокси (Residential Proxies)"
            : "About Free Residential Proxies"}
        </h2>
        <p>
          {isRu
            ? "Резидентные прокси маршрутизируют ваш сетевой трафик через реальные домашние интернет-соединения. Благодаря этому запросы выглядят как естественный трафик обычных пользователей."
            : "Residential proxies route your web traffic through IP addresses assigned to homeowners by consumer ISPs (e.g. Comcast, AT&T, Vodafone). Because these IPs appear as genuine home users, target web servers rarely trigger CAPTCHAs or IP blocks."}
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
        aria-label="Residential proxy table"
      >
        {residentialProxies.length > 0 ? (
          <ProxyTable proxies={residentialProxies} dict={dict.table} />
        ) : (
          <div className={styles.emptyState}>
            <h3>
              {isRu
                ? "В данный момент нет активных резидентных прокси"
                : "No active residential proxies at this moment"}
            </h3>
            <Link href="/" className={styles.primaryButton}>
              {isRu ? "Посмотреть все прокси" : "View All Proxies"}
            </Link>
          </div>
        )}
      </section>

      <FAQ items={faqItems} title={dict.faq.title} />
    </div>
  );
}
