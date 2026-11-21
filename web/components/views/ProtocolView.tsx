import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Globe } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import { getDictionary, Locale } from "@/lib/i18n";
import { getProxies, getProxiesByProtocol } from "@/lib/proxies";
import { getFaqSchema } from "@/lib/seo";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

export const PROTOCOL_META: Record<string, { color: string; file: string }> = {
  socks5: { color: "var(--primary)", file: "socks5.txt" },
  socks4: { color: "#f59e0b", file: "socks4.txt" },
  http: { color: "#38bdf8", file: "http.txt" },
  https: { color: "#a78bfa", file: "http.txt" },
};

export default async function ProtocolView({
  lang,
  protocol,
}: {
  lang: Locale;
  protocol: string;
}) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";
  const normalizedProtocol = protocol.toLowerCase();

  const allProxies = await getProxies();
  const filteredProxies = getProxiesByProtocol(allProxies, normalizedProtocol);

  const meta = PROTOCOL_META[normalizedProtocol];
  const color = meta?.color ?? "var(--primary)";
  const txtFile = meta?.file ?? `${normalizedProtocol}.txt`;

  const aboutEn: Record<string, string> = {
    socks5:
      "SOCKS5 is the most versatile proxy protocol — it supports TCP and UDP traffic, handles any type of data (HTTP, FTP, email, torrents), and does not alter your request headers, making it the hardest to detect. Ideal for web scraping, P2P, and applications that need full network-layer proxying.",
    socks4:
      "SOCKS4 is an older proxy protocol that supports TCP connections only (no UDP). It does not require authentication and is widely supported by legacy applications. Use SOCKS5 when possible for broader compatibility.",
    http:
      "HTTP proxies operate at the application layer and are designed for web traffic. They can forward HTTP requests and some support HTTPS via the CONNECT tunnel method. Widely supported by browsers, scrapers and automation tools.",
    https:
      "HTTPS proxies support the HTTP CONNECT method, allowing them to tunnel encrypted TLS traffic. They are ideal for scraping HTTPS websites while keeping your requests secure in transit between your client and the proxy server.",
  };

  const aboutRu: Record<string, string> = {
    socks5:
      "SOCKS5 — самый универсальный протокол. Он поддерживает TCP и UDP, обрабатывает любые данные (HTTP, FTP, P2P) и не меняет заголовки, что делает его труднообнаружимым. Идеален для парсинга и анонимности.",
    socks4:
      "SOCKS4 — проверенный временем протокол прокси, поддерживающий только TCP. Не требует аутентификации, поддерживается legacy-приложениями. По возможности используйте SOCKS5.",
    http:
      "HTTP-прокси работают на прикладном уровне и созданы для веб-трафика. Поддерживаются любыми браузерами и инструментами для автоматизации.",
    https:
      "HTTPS-прокси поддерживают туннелирование CONNECT, позволяя безопасно передавать зашифрованный TLS трафик.",
  };

  const about = isRu ? aboutRu[normalizedProtocol] : aboutEn[normalizedProtocol];
  const pageUrl = isRu
    ? `${SITE_URL}/ru/${normalizedProtocol}`
    : `${SITE_URL}/${normalizedProtocol}`;
  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: isRu
      ? `Бесплатные ${normalizedProtocol.toUpperCase()} Прокси`
      : `Free ${normalizedProtocol.toUpperCase()} Proxy List`,
    description: isRu
      ? `Автообновляемый список бесплатных ${normalizedProtocol.toUpperCase()} прокси-серверов. Проверяется валидатором каждые 15 минут.`
      : `Auto-updated list of free ${normalizedProtocol.toUpperCase()} proxy servers. Verified by a validator every 15 minutes.`,
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
        name: `${normalizedProtocol.toUpperCase()} Proxies (TXT)`,
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
        name: isRu
          ? `${normalizedProtocol.toUpperCase()} Прокси`
          : `${normalizedProtocol.toUpperCase()} Proxies`,
        item: pageUrl,
      },
    ],
  };

  const faqItems = isRu
    ? [
        {
          question: `Бесплатны ли прокси ${normalizedProtocol.toUpperCase()}?`,
          answer: `Да, все прокси ${normalizedProtocol.toUpperCase()} полностью бесплатны.`,
        },
        {
          question: `Как часто вы тестируете эти прокси?`,
          answer: `Наш автоматический валидатор проверяет каждый ${normalizedProtocol.toUpperCase()} прокси на доступность и время ответа каждые 15 минут.`,
        },
        {
          question: `Могу ли я использовать ${normalizedProtocol.toUpperCase()} прокси для парсинга?`,
          answer: `Абсолютно. ${normalizedProtocol.toUpperCase()} прокси часто используются разработчиками для гео-таргетированного парсинга и обхода блокировок.`,
        },
      ]
    : [
        {
          question: `Are the ${normalizedProtocol.toUpperCase()} proxies free to use?`,
          answer: `Yes, all ${normalizedProtocol.toUpperCase()} proxies listed on this page are completely free and open-source.`,
        },
        {
          question: `How often do you test these ${normalizedProtocol.toUpperCase()} proxies?`,
          answer: `Our automated validator checks every ${normalizedProtocol.toUpperCase()} proxy for connectivity and response time every 15 minutes.`,
        },
        {
          question: `Can I use these ${normalizedProtocol.toUpperCase()} proxies for web scraping?`,
          answer: `Absolutely. These ${normalizedProtocol.toUpperCase()} proxies are frequently used by developers for geo-targeted web scraping.`,
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
            background: `rgba(16, 185, 129, 0.1)`,
            borderRadius: "50%",
            marginBottom: "1.5rem",
          }}
        >
          <Globe size={32} style={{ color }} />
        </div>
        <h1 className={styles.title}>
          {dict.protocol.titlePrefix}{" "}
          <span className="text-gradient">{normalizedProtocol.toUpperCase()}</span>{" "}
          {dict.protocol.titleSuffix}
        </h1>
        <p className={styles.subtitle}>
          {filteredProxies.length > 0
            ? `${filteredProxies.length.toLocaleString()} ${dict.protocol.subtitle.replace(
                "{protocol}",
                normalizedProtocol.toUpperCase()
              )}`
            : dict.protocol.subtitleEmpty.replace(
                "{protocol}",
                normalizedProtocol.toUpperCase()
              )}
        </p>
      </header>

      {about && (
        <section className={styles.seoArticle}>
          <h2>
            {dict.protocol.aboutTitle.replace(
              "{protocol}",
              normalizedProtocol.toUpperCase()
            )}
          </h2>
          <p>{about}</p>
          <p>
            {dict.protocol.downloadTxt}{" "}
            <a
              href={`${REPO_RAW}/${txtFile}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txtFile}
            </a>
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
      )}

      <section
        className={styles.tableSection}
        aria-label={`${normalizedProtocol.toUpperCase()} proxy table`}
      >
        {filteredProxies.length > 0 ? (
          <ProxyTable proxies={filteredProxies} dict={dict.table} />
        ) : (
          <div className={styles.emptyState}>
            <h3>
              {dict.protocol.emptyTitle.replace(
                "{protocol}",
                normalizedProtocol.toUpperCase()
              )}
            </h3>
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0.5rem auto 1.5rem" }}>
              {isRu
                ? `В данный момент нет доступных прокси для протокола ${normalizedProtocol.toUpperCase()}. Движок Hydra проверяет сокеты каждую минуту — новые серверы появятся здесь автоматически сразу после подтверждения. Вы можете использовать другие рабочие прокси ниже:`
                : `No active proxies available for ${normalizedProtocol.toUpperCase()} at the moment. Our Hydra engine tests sockets every minute — new nodes will appear here automatically once validated. Explore other verified proxies below:`}
            </p>
            <div style={{ marginBottom: "2rem" }}>
              <Link href={isRu ? "/ru" : "/"} className={styles.primaryButton}>
                {dict.protocol.viewAll}
              </Link>
            </div>
            <div style={{ textAlign: "left", marginTop: "1rem" }}>
              <h4 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
                {isRu ? "Альтернативные проверенные прокси:" : "Alternative Verified Proxies:"}
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
