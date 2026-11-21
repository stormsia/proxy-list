import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Home } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
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

  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;
  const pageUrl = `${SITE_URL}${isRu ? "/ru" : ""}/residential`;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: isRu
      ? "Бесплатные Резидентные Прокси — Рабочий Список"
      : "Free Residential Proxy List — Verified ISP Endpoints",
    description: isRu
      ? "Список проверенных резидентных прокси-узлов с IP-адресами от домашних интернет-провайдеров (ISP). Аудит каждые 60 секунд движком Hydra."
      : "Continuously updated dataset of free residential proxies assigned by consumer ISPs. Audited every 60 seconds by Hydra with millisecond latency metrics.",
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
    { name: isRu ? "Резидентные Прокси" : "Residential Proxies", url: pageUrl },
  ]);

  const faqItems = isRu
    ? [
        {
          question: "Что такое резидентные прокси и чем они отличаются от серверных?",
          answer:
            "Резидентные прокси используют IP-адреса, выделенные интернет-провайдерами (ISP) для домашних широкополосных подключений (Comcast, AT&T, Vodafone, Ростелеком). В отличие от серверных IP, они обладают высоким рейтингом доверия и не вызывают мгновенных подозрений у WAF (Cloudflare, Akamai, DataDome).",
        },
        {
          question: "Почему в открытом доступе резидентных прокси меньше, чем серверных?",
          answer:
            "Домашние интернет-подключения имеют динамические IP и зависят от статуса пользовательского оборудования. Публичные резидентные ноды появляются и исчезают быстрее серверных. Движок Hydra проверяет их каждую минуту, сохраняя в выдаче только действительно активные адреса.",
        },
        {
          question: "Как эффективно использовать резидентные прокси для сбора данных?",
          answer:
            "Используйте короткие таймауты подключения (5–8 секунд), настройте автоматический переход на следующий адрес при ошибке сокета и объединяйте резидентные ноды в ротируемый пул с User-Agent ротацией.",
        },
      ]
    : [
        {
          question: "What are residential proxies and how do they differ from datacenter IPs?",
          answer:
            "Residential proxies route traffic through IP addresses assigned by consumer Internet Service Providers (such as Comcast, AT&T, Vodafone, or Deutsche Telekom) to residential households. Because target websites see organic residential ASN ranges, these requests encounter significantly lower CAPTCHA rates and WAF blocks compared to datacenter IPs.",
        },
        {
          question: "Why is the pool of free residential proxies smaller than datacenter lists?",
          answer:
            "Consumer broadband connections are dynamic and subject to frequent disconnects and IP reassignments. As a result, public residential nodes have higher churn. Hydra audits these nodes every 60 seconds to prune offline endpoints immediately.",
        },
        {
          question: "How should I structure scrapers using public residential proxies?",
          answer:
            "Implement conservative request timeouts (5–8 seconds), handle connection retries with exponential backoff, and combine residential IPs with header randomization to preserve session hygiene.",
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
          <Home size={32} style={{ color: "var(--primary)" }} />
        </div>
        <h1 className={styles.title}>
          {isRu ? "Бесплатные" : "Free"}{" "}
          <span className="text-gradient">
            {isRu ? "Резидентные Прокси" : "Residential Proxies"}
          </span>
        </h1>
        <p className={styles.subtitle}>
          {isRu
            ? `${residentialProxies.length.toLocaleString("en-US")} проверенных прокси с реальными IP интернет-провайдеров (ISP). Аудит каждые 60 секунд движком Hydra.`
            : `${residentialProxies.length.toLocaleString("en-US")} verified residential proxy servers with real ISP-assigned IPs. Audited every 60 seconds by Hydra.`}
        </p>
      </header>

      <section
        className={styles.seoArticle}
        aria-label="About residential proxies"
      >
        <h2>
          {isRu
            ? "Резидентные Прокси Домашних Провайдеров"
            : "ISP Residential Proxy Infrastructure"}
        </h2>
        <p>
          {isRu
            ? "Резидентные прокси маршрутизируют соединения через реальные пулы домашних интернет-провайдеров. Они незаменимы при анализе сайтов со строгими антибот-системами, требующих органического профиля сетевого трафика."
            : "Residential proxies route requests through genuine residential ISP autonomous systems. Ideal for tasks where datacenter IP ranges trigger automated security challenges or rate limiting."}
        </p>
        <GitHubStarCard lang={lang} />
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
                ? "Нет активных резидентных прокси в текущем цикле"
                : "No residential proxies active in the current cycle"}
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0.5rem auto 1.5rem",
              }}
            >
              {isRu
                ? "Резидентные узлы обладают динамическим временем жизни. Движок Hydra тестирует новые адреса каждую минуту. Вы можете использовать проверенные серверные ноды из общего пула ниже:"
                : "Residential endpoints rotate frequently. Our Hydra engine verifies candidate nodes every 60 seconds. You can explore verified endpoints from our global pool below:"}
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
