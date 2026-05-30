import { promises as fs } from "fs";
import path from "path";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Server } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import { getDictionary, Locale } from "@/lib/i18n";

const SITE_URL = "https://stormsia.github.io/proxy-list";

const DC_KEYWORDS = [
  "digitalocean", "amazon", "aws", "hosting", "ovh", "hetzner", "linode", "vultr",
  "contabo", "datacamp", "cloudflare", "google", "microsoft", "azure", "server",
  "datacenter", "data center", "colocation",
];

export default async function DatacenterView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";

  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const allProxies = JSON.parse(fileContents);

  const dcProxies = allProxies.filter((p: any) => {
    const asnOrg = p.asn?.autonomous_system_organization?.toLowerCase() || "";
    return DC_KEYWORDS.some((kw) => asnOrg.includes(kw));
  });

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: "Free Datacenter Proxy List",
    description: "A list of free proxy servers hosted in cloud and datacenter infrastructure. Verified by a validator and updated every 15 minutes.",
    url: `${SITE_URL}${isRu ? '/ru' : ''}/datacenter`,
  };

  const faqItems = isRu ? [
    { question: "Что такое серверные (датацентр) прокси?", answer: "Это IP-адреса, принадлежащие облачным провайдерам (AWS, DigitalOcean). Они отличаются высокой скоростью и низкой задержкой, но легче обнаруживаются антибот-системами." },
    { question: "Для чего лучше использовать серверные прокси?", answer: "Они идеально подходят для высоконагруженного парсинга, массовых запросов к API и тестирования приложений, где важна максимальная пропускная способность." },
    { question: "Бесплатны ли эти датацентр прокси?", answer: "Да, все серверные прокси в этом списке полностью бесплатны." }
  ] : [
    { question: "What are datacenter proxies?", answer: "Datacenter proxies are IP addresses assigned by cloud hosting providers like AWS or DigitalOcean. They offer high speed and low latency but are easier for anti-bot systems to detect." },
    { question: "What are datacenter proxies best for?", answer: "They are ideal for high-volume scraping, bulk API polling, and automated testing where raw speed and bandwidth matter." },
    { question: "Are these datacenter proxies free?", answer: "Yes, all datacenter proxies on this list are completely free to use." }
  ];

  return (
    <div className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <header className={styles.header}>
        <div style={{ display: "inline-flex", padding: "1rem", background: "rgba(56, 189, 248, 0.1)", borderRadius: "50%", marginBottom: "1.5rem" }}>
          <Server size={32} style={{ color: "#38bdf8" }} />
        </div>
        <h1 className={styles.title}>
          {isRu ? "Бесплатные " : "Free "}
          <span className="text-gradient" style={{ backgroundImage: "linear-gradient(to right, #38bdf8, #818cf8)" }}>Datacenter</span>
          {isRu ? " Прокси" : " Proxies"}
        </h1>
        <p className={styles.subtitle}>
          {dcProxies.length > 0
            ? (isRu ? `${dcProxies.length.toLocaleString()} серверных прокси в облачной инфраструктуре — высокая скорость, низкий пинг.` : `${dcProxies.length.toLocaleString()} datacenter proxies hosted in cloud infrastructure — high bandwidth, low latency.`)
            : (isRu ? "IP-адреса с высокой пропускной способностью от облачных провайдеров." : "High-bandwidth, low-latency IPs from cloud providers. Ideal for bulk scraping.")}
        </p>
      </header>

      <section className={styles.seoArticle}>
        <h2>{isRu ? "Что такое датацентр прокси?" : "What Are Datacenter Proxies?"}</h2>
        <p>
          {isRu ? "Серверные (датацентр) прокси — это IP-адреса, размещенные в коммерческих облачных системах и дата-центрах (DigitalOcean, AWS, OVH). Они обычно предлагают более высокую скорость и низкую задержку, чем резидентные прокси." : "Datacenter proxies are IP addresses hosted in commercial cloud or colocation facilities. They typically offer higher bandwidth and lower latency than residential proxies."}
        </p>
        <p style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(139, 92, 246, 0.1)", borderRadius: "8px", borderLeft: "4px solid var(--accent)" }}>
          ⭐ <strong>{dict.home.starPrefix}</strong> <a href="https://github.com/stormsia/proxy-list" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: "bold", textDecoration: "underline" }}>{dict.home.starLink}</a>{dict.home.starSuffix}
        </p>
      </section>

      <section className={styles.tableSection}>
        {dcProxies.length > 0 ? (
          <ProxyTable proxies={dcProxies} dict={dict.table} />
        ) : (
          <div className={styles.emptyState}>
            <h3>{isRu ? "В данный момент нет доступных серверных прокси" : "No datacenter proxies currently available"}</h3>
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
