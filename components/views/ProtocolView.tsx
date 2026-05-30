import { promises as fs } from "fs";
import path from "path";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Globe } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import { getDictionary, Locale } from "@/lib/i18n";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

// Meta data exported so pages can use it, but keeping it simple here
export const PROTOCOL_META: Record<string, { color: string; file: string }> = {
  socks5: { color: "var(--primary)", file: "socks5.txt" },
  socks4: { color: "#f59e0b", file: "socks4.txt" },
  http: { color: "#38bdf8", file: "http.txt" },
  https: { color: "#a78bfa", file: "http.txt" },
};

export default async function ProtocolView({ lang, protocol }: { lang: Locale, protocol: string }) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";

  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const allProxies = JSON.parse(fileContents);

  const filteredProxies = allProxies.filter((p: any) => {
    return p.protocol.toLowerCase() === protocol;
  });

  const meta = PROTOCOL_META[protocol];
  const color = meta?.color ?? "var(--primary)";
  const txtFile = meta?.file ?? `${protocol}.txt`;

  // We could translate the "about" sections, but let's keep it minimal for the view or hardcode the Russian for now
  const aboutEn = {
    socks5: "SOCKS5 is the most versatile proxy protocol — it supports TCP and UDP traffic, handles any type of data (HTTP, FTP, email, torrents), and does not alter your request headers, making it the hardest to detect. Ideal for web scraping, P2P, and applications that need full network-layer proxying.",
    socks4: "SOCKS4 is an older proxy protocol that supports TCP connections only (no UDP). It does not require authentication and is widely supported by legacy applications. Use SOCKS5 when possible for broader compatibility.",
    http: "HTTP proxies operate at the application layer and are designed for web traffic. They can forward HTTP requests and some support HTTPS via the CONNECT tunnel method. Widely supported by browsers, scrapers and automation tools.",
    https: "HTTPS proxies support the HTTP CONNECT method, allowing them to tunnel encrypted TLS traffic. They are ideal for scraping HTTPS websites while keeping your requests secure in transit between your client and the proxy server."
  };
  
  const aboutRu = {
    socks5: "SOCKS5 — самый универсальный протокол. Он поддерживает TCP и UDP, обрабатывает любые данные (HTTP, FTP, P2P) и не меняет заголовки, что делает его труднообнаружимым. Идеален для парсинга и анонимности.",
    socks4: "SOCKS4 — старый протокол прокси, поддерживающий только TCP. Не требует аутентификации, поддерживается старыми приложениями. По возможности используйте SOCKS5.",
    http: "HTTP-прокси работают на прикладном уровне и созданы для веб-трафика. Поддерживаются любыми браузерами и инструментами для парсинга.",
    https: "HTTPS-прокси поддерживают туннелирование CONNECT, позволяя безопасно передавать зашифрованный TLS трафик."
  };

  const about = isRu ? (aboutRu as any)[protocol] : (aboutEn as any)[protocol];

  const pageUrl = isRu ? `${SITE_URL}/ru/${protocol}` : `${SITE_URL}/${protocol}`;
  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: isRu ? `Бесплатные ${protocol.toUpperCase()} Прокси` : `Free ${protocol.toUpperCase()} Proxy List`,
    description: isRu
      ? `Автообновляемый список бесплатных ${protocol.toUpperCase()} прокси-серверов. Проверяется валидатором каждые 15 минут.`
      : `Auto-updated list of free ${protocol.toUpperCase()} proxy servers. Verified by a validator every 15 minutes.`,
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
        contentUrl: `${REPO_RAW}/${txtFile}`,
        name: `${protocol.toUpperCase()} Proxies (TXT)`,
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
        name: isRu ? `${protocol.toUpperCase()} Прокси` : `${protocol.toUpperCase()} Proxies`,
        item: pageUrl,
      },
    ],
  };

  const faqItems = isRu ? [
    { question: `Бесплатны ли прокси ${protocol.toUpperCase()}?`, answer: `Да, все прокси ${protocol.toUpperCase()} полностью бесплатны.` },
    { question: `Как часто вы тестируете эти прокси?`, answer: `Наш автоматический валидатор проверяет каждый ${protocol.toUpperCase()} прокси на доступность и время ответа каждые 15 минут.` },
    { question: `Могу ли я использовать ${protocol.toUpperCase()} прокси для парсинга?`, answer: `Абсолютно. ${protocol.toUpperCase()} прокси часто используются разработчиками для гео-таргетированного парсинга и обхода блокировок.` },
  ] : [
    { question: `Are the ${protocol.toUpperCase()} proxies free to use?`, answer: `Yes, all ${protocol.toUpperCase()} proxies listed on this page are completely free and open-source.` },
    { question: `How often do you test these ${protocol.toUpperCase()} proxies?`, answer: `Our automated validator checks every ${protocol.toUpperCase()} proxy for connectivity and response time every 15 minutes.` },
    { question: `Can I use these ${protocol.toUpperCase()} proxies for web scraping?`, answer: `Absolutely. These ${protocol.toUpperCase()} proxies are frequently used by developers for geo-targeted web scraping.` },
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
            background: `rgba(16, 185, 129, 0.1)`,
            borderRadius: "50%",
            marginBottom: "1.5rem",
          }}
        >
          <Globe size={32} style={{ color }} />
        </div>
        <h1 className={styles.title}>
          {dict.protocol.titlePrefix} <span className="text-gradient">{protocol.toUpperCase()}</span> {dict.protocol.titleSuffix}
        </h1>
        <p className={styles.subtitle}>
          {filteredProxies.length > 0
            ? `${filteredProxies.length.toLocaleString()} ${dict.protocol.subtitle.replace("{protocol}", protocol.toUpperCase())}`
            : dict.protocol.subtitleEmpty.replace("{protocol}", protocol.toUpperCase())}
        </p>
      </header>

      {about && (
        <section className={styles.seoArticle}>
          <h2>{dict.protocol.aboutTitle.replace("{protocol}", protocol.toUpperCase())}</h2>
          <p>{about}</p>
          <p>
            {dict.protocol.downloadTxt}{" "}
            <a href={`${REPO_RAW}/${txtFile}`} target="_blank" rel="noopener noreferrer">{txtFile}</a>
          </p>
          <p style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(139, 92, 246, 0.1)", borderRadius: "8px", borderLeft: "4px solid var(--accent)" }}>
            ⭐ <strong>{dict.home.starPrefix}</strong> <a href="https://github.com/stormsia/proxy-list" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontWeight: "bold", textDecoration: "underline" }}>{dict.home.starLink}</a>{dict.home.starSuffix}
          </p>
        </section>
      )}

      <section className={styles.tableSection} aria-label={`${protocol.toUpperCase()} proxy table`}>
        {filteredProxies.length > 0 ? (
          <ProxyTable proxies={filteredProxies} dict={dict.table} />
        ) : (
          <div className={styles.emptyState}>
            <h3>{dict.protocol.emptyTitle.replace("{protocol}", protocol.toUpperCase())}</h3>
            <Link href="/" className={styles.primaryButton}>
              {dict.protocol.viewAll}
            </Link>
          </div>
        )}
      </section>

      <FAQ items={faqItems} title={dict.faq.title} />
    </div>
  );
}
