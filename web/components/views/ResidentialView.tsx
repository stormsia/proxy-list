import { promises as fs } from "fs";
import path from "path";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Home } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import { getDictionary, Locale } from "@/lib/i18n";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

const DC_KEYWORDS = [
  "digitalocean", "amazon", "aws", "hosting", "ovh", "hetzner", "linode", "vultr",
  "contabo", "datacamp", "cloudflare", "google", "microsoft", "azure", "server",
  "datacenter", "data center", "colocation",
];

export default async function ResidentialView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";

  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const allProxies = JSON.parse(fileContents);

  const residentialProxies = allProxies.filter((p: any) => {
    const asnOrg = p.asn?.autonomous_system_organization?.toLowerCase() || "";
    return !DC_KEYWORDS.some((kw) => asnOrg.includes(kw));
  });

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: "Free Residential Proxy List",
    description: "A list of free proxy servers classified as residential — sourced from ISP-assigned IPs rather than cloud/datacenter providers. Verified by a validator and updated every 15 minutes.",
    url: `${SITE_URL}${isRu ? '/ru' : ''}/residential`,
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

  const faqItems = isRu ? [
    { question: "Что такое резидентные прокси?", answer: "Резидентные прокси используют IP-адреса, выданные интернет-провайдерами (ISP) реальным домашним пользователям. Они реже блокируются системами защиты." },
    { question: "Бесплатны ли эти резидентные прокси?", answer: "Да, все прокси на этой странице полностью бесплатны и проверяются каждые 15 минут." },
    { question: "Почему их так мало?", answer: "Большинство публичных прокси работают в датацентрах. Настоящие резидентные прокси встречаются редко и быстро перестают работать." }
  ] : [
    { question: "What are residential proxies?", answer: "Residential proxies use IP addresses assigned by Internet Service Providers (ISPs) to real home users. They are less likely to be blocked by anti-bot systems." },
    { question: "Are these residential proxies free?", answer: "Yes, all proxies on this page are completely free and verified every 15 minutes." },
    { question: "Why are there so few residential proxies?", answer: "Most public proxies are hosted in datacenters. Genuine residential public proxies are rare and often short-lived." }
  ];

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <header className={styles.header}>
        <div style={{ display: "inline-flex", padding: "1rem", background: "rgba(245, 158, 11, 0.1)", borderRadius: "50%", marginBottom: "1.5rem" }}>
          <Home size={32} style={{ color: "#f59e0b" }} />
        </div>
        <h1 className={styles.title}>
          {isRu ? "Бесплатные " : "Free "}<span className="text-gradient">Residential</span>{isRu ? " Прокси" : " Proxies"}
        </h1>
        <p className={styles.subtitle}>
          {residentialProxies.length > 0
            ? (isRu ? `${residentialProxies.length.toLocaleString()} резидентных прокси от реальных провайдеров — автообновление каждые 15 минут.` : `${residentialProxies.length.toLocaleString()} residential proxies from real ISP-assigned IPs — auto-updated every 15 minutes.`)
            : (isRu ? "Прокси с IP-адресами от реальных интернет-провайдеров. Идеально для парсинга и обхода блокировок." : "Proxies from real ISP-assigned IP addresses. Lower detection rates for scraping and automation.")}
        </p>
      </header>

      <section className={styles.seoArticle}>
        <h2>{isRu ? "Что такое резидентные прокси?" : "What Are Residential Proxies?"}</h2>
        <p>
          {isRu ? "Резидентные прокси маршрутизируют ваш трафик через IP-адреса, назначенные интернет-провайдерами (ISP) реальным домашним или мобильным устройствам. В отличие от прокси-серверов в датацентрах, резидентные IP-адреса реже блокируются антибот-системами." : "Residential proxies route your traffic through IP addresses assigned by Internet Service Providers (ISPs) to real home or mobile devices. Unlike datacenter proxies, residential IPs are less likely to be flagged or blocked by anti-bot systems."}
        </p>
        <p style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(139, 92, 246, 0.1)", borderRadius: "8px", borderLeft: "4px solid var(--accent)" }}>
          ⭐ <strong>{dict.home.starPrefix}</strong> <a href="https://github.com/stormsia/proxy-list" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: "bold", textDecoration: "underline" }}>{dict.home.starLink}</a>{dict.home.starSuffix}
        </p>
      </section>

      <section className={styles.tableSection}>
        {residentialProxies.length > 0 ? (
          <ProxyTable proxies={residentialProxies} dict={dict.table} />
        ) : (
          <div className={styles.emptyState}>
            <h3>{isRu ? "В данный момент нет доступных резидентных прокси" : "No residential proxies currently available"}</h3>
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
