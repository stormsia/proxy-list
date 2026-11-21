import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Server } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import { getDictionary, Locale } from "@/lib/i18n";
import { getProxies, getDatacenterProxies } from "@/lib/proxies";
import { getBreadcrumbSchema, getFaqSchema } from "@/lib/seo";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

export default async function DatacenterView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";

  const allProxies = await getProxies();
  const dcProxies = getDatacenterProxies(allProxies);

  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;
  const pageUrl = `${SITE_URL}${isRu ? "/ru" : ""}/datacenter`;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: isRu
      ? "Бесплатные Серверные (Датацентр) Прокси"
      : "Free Datacenter Proxy List",
    description: isRu
      ? "Список бесплатных прокси-серверов в облачных датацентрах (AWS, DigitalOcean, Hetzner, OVH). Проверяется валидатором каждые 15 минут."
      : "A list of free proxy servers hosted in cloud and datacenter infrastructure. Verified by a validator and updated every 15 minutes.",
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
        encodingFormat: "text/plain",
        contentUrl: `${REPO_RAW}/working_proxies.txt`,
        name: "All Working Proxies (TXT)",
      },
    ],
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isRu ? "Главная" : "Home", url: homeUrl },
    { name: isRu ? "Датацентр Прокси" : "Datacenter Proxies", url: pageUrl },
  ]);

  const faqItems = isRu
    ? [
        {
          question: "Что такое серверные (датацентр) прокси?",
          answer:
            "Датацентр-прокси размещаются в крупных облачных центрах обработки данных (AWS, Hetzner, DigitalOcean, OVH). Они обеспечивают высокую скорость и низкий пинг.",
        },
        {
          question: "Для чего лучше всего подходят датацентр прокси?",
          answer:
            "Они идеальны для автоматического парсинга, тестирования API, высокоскоростной загрузки и задач с высокой пропускной способностью.",
        },
        {
          question: "Как часто обновляются эти серверные прокси?",
          answer:
            "Список проверяется автоматическим демоном каждые 15 минут, исключая неработающие узлы.",
        },
      ]
    : [
        {
          question: "What are datacenter proxies?",
          answer:
            "Datacenter proxies are hosted in commercial data centers (AWS, Hetzner, DigitalOcean, OVH). They offer fast connections and low latency.",
        },
        {
          question: "What are datacenter proxies best used for?",
          answer:
            "They are ideal for web scraping, API testing, high-bandwidth streaming, and fast content extraction.",
        },
        {
          question: "How often are these datacenter proxies verified?",
          answer:
            "Our async daemon tests all proxies every 15 minutes, removing dead endpoints automatically.",
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
            background: "rgba(56, 189, 248, 0.1)",
            borderRadius: "50%",
            marginBottom: "1.5rem",
          }}
        >
          <Server size={32} style={{ color: "#38bdf8" }} />
        </div>
        <h1 className={styles.title}>
          {isRu ? "Бесплатные " : "Free "}
          <span
            className="text-gradient"
            style={{
              backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8)",
            }}
          >
            Datacenter
          </span>
          {isRu ? " Прокси" : " Proxies"}
        </h1>
        <p className={styles.subtitle}>
          {dcProxies.length > 0
            ? `${dcProxies.length.toLocaleString()} ${
                isRu
                  ? "высокоскоростных датацентр прокси онлайн."
                  : "high-bandwidth datacenter proxies online."
              }`
            : isRu
            ? "Нет активных датацентр прокси."
            : "No active datacenter proxies."}
        </p>
      </header>

      <section
        className={styles.seoArticle}
        aria-label="About datacenter proxies"
      >
        <h2>
          {isRu
            ? "О серверных прокси (Datacenter Proxies)"
            : "About Free Datacenter Proxies"}
        </h2>
        <p>
          {isRu
            ? "Датацентр прокси размещены на мощных выделенных серверах в датацентрах по всему миру. Они гарантируют гигабитные каналы и мгновенный отклик."
            : "Datacenter proxies originate from secondary corporations and cloud hosts rather than traditional residential ISPs. They provide superior network speed, massive bandwidth, and lower latency for automated systems."}
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
        aria-label="Datacenter proxy table"
      >
        {dcProxies.length > 0 ? (
          <ProxyTable proxies={dcProxies} dict={dict.table} />
        ) : (
          <div className={styles.emptyState}>
            <h3>
              {isRu
                ? "В данный момент нет активных серверных прокси"
                : "No active datacenter proxies at this moment"}
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
