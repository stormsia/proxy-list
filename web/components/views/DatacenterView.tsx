import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Server } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
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
      ? "Бесплатные Серверные (Датацентр) Прокси — Рабочий Список"
      : "Free Datacenter Proxy List — High-Bandwidth Cloud Endpoints",
    description: isRu
      ? "Список проверенных серверных прокси-узлов в облачных датацентрах (AWS, Hetzner, DigitalOcean, OVH). Проверяется валидатором Hydra каждые 60 секунд."
      : "Continuously updated dataset of free datacenter proxy servers hosted on high-throughput cloud infrastructure. Audited every 60 seconds by Hydra.",
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
        encodingFormat: "text/plain",
        contentUrl: `${REPO_RAW}/working_proxies.txt`,
        name: "All Working Proxies (TXT)",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${REPO_RAW}/data/proxies.json`,
        name: "Full Hydra JSON Dataset",
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
          question: "Что такое серверные (датацентр) прокси и в чем их преимущество?",
          answer:
            "Датацентр-прокси развернуты на физических и виртуальных серверах в центрах обработки данных (AWS, Hetzner, DigitalOcean, OVH, Leaseweb). Их ключевые преимущества — гигабитные каналы связи, минимальный джиттер и стабильно низкое время отклика (RTT < 400 мс).",
        },
        {
          question: "Для каких задач подходят серверные прокси?",
          answer:
            "Они оптимальны для высокоскоростного парсинга каталогов, API-нагрузочного тестирования, мониторинга цен, сбора открытых структурированных данных и микросервисной балансировки, где критична пропускная способность канала.",
        },
        {
          question: "Как часто тестируются серверные узлы?",
          answer:
            "Многопоточный движок Hydra на Rust тестирует все серверные узлы каждые 60 секунд. Серверы с повышенной потерей пакетов или недоступным портом немедленно исключаются из списка.",
        },
      ]
    : [
        {
          question: "What are datacenter proxies and what are their technical advantages?",
          answer:
            "Datacenter proxies originate from cloud hosting providers and commercial server facilities (AWS, Hetzner, OVH, DigitalOcean). They provide Gigabit uplink bandwidth, minimal packet jitter, and predictable sub-second round-trip latency (often RTT < 400ms).",
        },
        {
          question: "What workloads are datacenter proxies best suited for?",
          answer:
            "They are ideal for high-throughput web scraping, API stress testing, price monitoring, streaming data ingestion, and bulk asset downloads where network speed and bandwidth take priority over residential ASN stealth.",
        },
        {
          question: "How frequently are datacenter nodes monitored?",
          answer:
            "Hydra's multi-threaded Rust engine audits every datacenter IP every 60 seconds. Sockets failing connection deadlines or dropping TLS handshakes are pruned immediately.",
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
            background: "rgba(59, 130, 246, 0.1)",
            borderRadius: "50%",
            marginBottom: "1.5rem",
          }}
        >
          <Server size={32} style={{ color: "var(--primary)" }} />
        </div>
        <h1 className={styles.title}>
          {isRu ? "Бесплатные" : "Free"}{" "}
          <span className="text-gradient">
            {isRu ? "Серверные Прокси" : "Datacenter Proxies"}
          </span>
        </h1>
        <p className={styles.subtitle}>
          {isRu
            ? `${dcProxies.length.toLocaleString("en-US")} проверенных датацентр-узлов (AWS, Hetzner, DigitalOcean, OVH). Проверка каждые 60 секунд движком Hydra.`
            : `${dcProxies.length.toLocaleString("en-US")} verified datacenter proxy nodes hosted on cloud infrastructure. Audited every 60 seconds by Hydra.`}
        </p>
      </header>

      <section
        className={styles.seoArticle}
        aria-label="About datacenter proxies"
      >
        <h2>
          {isRu
            ? "Высокоскоростные Серверные Прокси"
            : "High-Bandwidth Datacenter Proxies"}
        </h2>
        <p>
          {isRu
            ? "Серверные прокси расположены на оптических каналах в ведущих датацентрах мира. Они обеспечивают максимальную скорость скачивания и идеальны для задач с высокой сетевой нагрузкой."
            : "Datacenter proxies offer raw connection speed and low latency across global cloud backbones. Sourced from enterprise hosting facilities, these endpoints are built for high-throughput network workloads."}
        </p>
        <GitHubStarCard lang={lang} />
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
                ? "Нет доступных серверных прокси"
                : "No datacenter proxies currently available"}
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0.5rem auto 1.5rem",
              }}
            >
              {isRu
                ? "Все серверные узлы проходят 60-секундную перепроверку движком Hydra. Ознакомьтесь с общим пулом прокси ниже:"
                : "All nodes are being re-audited by Hydra's 60-second cycle. Browse the global pool below:"}
            </p>
            <div style={{ marginBottom: "2rem" }}>
              <Link href={isRu ? "/ru" : "/"} className={styles.primaryButton}>
                {dict.protocol.viewAll}
              </Link>
            </div>
            <ProxyTable proxies={allProxies.slice(0, 20)} dict={dict.table} />
          </div>
        )}
      </section>

      <FAQ items={faqItems} title={dict.faq.title} />
    </div>
  );
}
