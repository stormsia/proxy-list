import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Globe } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
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
  const upper = normalizedProtocol.toUpperCase();

  const allProxies = await getProxies();
  const filteredProxies = getProxiesByProtocol(allProxies, normalizedProtocol);

  const meta = PROTOCOL_META[normalizedProtocol];
  const color = meta?.color ?? "var(--primary)";
  const txtFile = meta?.file ?? `${normalizedProtocol}.txt`;

  const aboutEn: Record<string, string> = {
    socks5:
      "SOCKS5 operates at OSI Layer 5 (Session Layer), routing arbitrary TCP and UDP packets without inspecting or modifying application payload headers. By configuring remote DNS resolution via socks5h://, your scraper prevents local DNS leak traces and bypasses domain-level SNI filtering. SOCKS5 is the recommended standard for Python httpx, Puppeteer, Playwright, and high-concurrency data scraping pipelines.",
    socks4:
      "SOCKS4 is an established stream-oriented proxy protocol designed strictly for TCP connections (IPv4 only, no UDP support and no native user authentication). It introduces minimal transport overhead, making it useful for legacy automation tools, socket wrappers, and network testing where basic IP relaying is sufficient.",
    http:
      "HTTP proxies operate at OSI Layer 7 (Application Layer), handling direct HTTP GET/POST requests and relaying them to destination web servers. When evaluated as Elite or Anonymous, they strip identifying headers. They integrate natively with standard command-line tools like cURL, Wget, and default HTTP clients across Node.js, Go, and Python.",
    https:
      "HTTPS proxies support the HTTP CONNECT tunneling method (RFC 2817), establishing an opaque end-to-end TCP tunnel between your client and the target server. Because TLS encryption is negotiated directly between your client and the destination, the proxy server only sees raw encrypted ciphertext and destination hostnames, ensuring end-to-end confidentiality.",
  };

  const aboutRu: Record<string, string> = {
    socks5:
      "SOCKS5 функционирует на 5 (сессионном) уровне модели OSI, маршрутизируя произвольные TCP и UDP пакеты без изменения заголовков прикладного уровня. При использовании удаленного DNS-резолвинга (схема socks5h://) исключаются утечки DNS-запросов и обходятся блокировки на уровне SNI. Протокол SOCKS5 оптимален для Python httpx, Puppeteer, Playwright и многопоточных скрейперов.",
    socks4:
      "SOCKS4 — потоковый протокол передачи данных для протокола TCP (только IPv4, без поддержки UDP и встроенной аутентификации). Обладает минимальным накладным расходом на обработку пакетов, что удобно для интеграции в legacy-библиотеки, системные утилиты и сетевые скрипты тестирования.",
    http:
      "HTTP-прокси работают на 7 (прикладном) уровне OSI, принимая HTTP-запросы и перенаправляя их на целевые серверы. При уровне анонимности Elite или Anonymous они удаляют клиентские идентификаторы. Протокол поддерживается из коробки всеми библиотеками: cURL, Wget, Axios, Requests и стандартными сетевыми пакетами.",
    https:
      "HTTPS-прокси поддерживают метод туннелирования HTTP CONNECT (RFC 2817), создавая сквозной TCP-туннель к целевому серверу. Поскольку TLS-рукопожатие происходит напрямую между клиентом и сайтом, промежуточный прокси видит только зашифрованный трафик, гарантируя конфиденциальность сессии.",
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
      ? `Бесплатные ${upper} Прокси — Рабочий Список`
      : `Free ${upper} Proxy List — Live Verified Endpoints`,
    description: isRu
      ? `Автообновляемый список проверенных ${upper} прокси-серверов. Непрерывный аудит каждые 60 секунд движком Hydra с замером задержки RTT и аптайма.`
      : `Continuously updated dataset of active ${upper} proxy servers. Audited every 60 seconds by the Hydra Rust engine with millisecond RTT benchmarks.`,
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
        contentUrl: `${REPO_RAW}/${txtFile}`,
        name: `${upper} Proxies Raw (TXT)`,
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${REPO_RAW}/data/proxies.json`,
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
        name: isRu ? `${upper} Прокси` : `${upper} Proxies`,
        item: pageUrl,
      },
    ],
  };

  const faqItems = isRu
    ? [
        {
          question: `Как подключить ${upper} прокси в cURL и Python?`,
          answer:
            normalizedProtocol === "socks5"
              ? "В cURL используйте: `curl -x socks5h://host:port https://httpbin.org/ip`. Схема socks5h передает DNS-запрос на сторону прокси. В Python (httpx): `httpx.AsyncClient(proxy='socks5://host:port')` с установленным пакетом socksio."
              : `В cURL выполните: \`curl -x ${normalizedProtocol}://host:port https://httpbin.org/ip\`. В Python (requests): \`requests.get('https://example.com', proxies={'http': '${normalizedProtocol}://host:port', 'https': '${normalizedProtocol}://host:port'})\`.`,
        },
        {
          question: `Как часто обновляется пул ${upper} прокси?`,
          answer: `Валидация выполняется непрерывно каждые 60 секунд движком Hydra на Rust. Прокси, переставшие отвечать на TCP-рукопожатие или превысившие таймаут задержки, исключаются из рабочего списка без задержек.`,
        },
        {
          question: `Подходят ли эти ${upper} прокси для парсинга и скрейпинга?`,
          answer: `Да. Пул активно используется дата-инженерами и разработчиками ботов. Для предотвращения блокировок рекомендуем ротировать IP каждые 10–25 запросов, фильтровать ноды с RTT < 1000 мс и отслеживать HTTP-статусы 429 и 403.`,
        },
      ]
    : [
        {
          question: `How do I connect to a ${upper} proxy using cURL or Python?`,
          answer:
            normalizedProtocol === "socks5"
              ? "In cURL, run: `curl -x socks5h://host:port https://httpbin.org/ip`. The socks5h protocol ensures DNS resolution occurs on the proxy server. In Python, install `httpx socksio` and initialize: `client = httpx.AsyncClient(proxy='socks5://host:port')`."
              : `In cURL, pass the proxy flag: \`curl -x ${normalizedProtocol}://host:port https://httpbin.org/ip\`. In Python requests: \`requests.get('https://example.com', proxies={'http': '${normalizedProtocol}://host:port', 'https': '${normalizedProtocol}://host:port'})\`.`,
        },
        {
          question: `How frequently are ${upper} proxies tested?`,
          answer: `Every node in the ${upper} pool is audited every 60 seconds by our multi-threaded Hydra Rust validator. Dead nodes, high packet-loss servers, and unresponsive sockets are culled immediately.`,
        },
        {
          question: `Can I use these ${upper} proxies for high-volume web scraping?`,
          answer: `Yes. For best results, pool multiple nodes from data/proxies.json, filter for latency under 1000ms and uptime above 80%, and rotate exit nodes on each request cycle or upon hitting HTTP 429/403 status codes.`,
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
          <span className="text-gradient">{upper}</span>{" "}
          {dict.protocol.titleSuffix}
        </h1>
        <p className={styles.subtitle}>
          {filteredProxies.length > 0
            ? `${filteredProxies.length.toLocaleString()} ${dict.protocol.subtitle.replace(
                "{protocol}",
                upper
              )}`
            : dict.protocol.subtitleEmpty.replace(
                "{protocol}",
                upper
              )}
        </p>
      </header>

      {about && (
        <section className={styles.seoArticle}>
          <h2>
            {dict.protocol.aboutTitle.replace(
              "{protocol}",
              upper
            )}
          </h2>
          <p>{about}</p>
          <p>
            {dict.protocol.downloadTxt}{" "}
            <a
              href={`${REPO_RAW}/${txtFile}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              {txtFile}
            </a>
          </p>
          <GitHubStarCard lang={lang} />
        </section>
      )}

      <section
        className={styles.tableSection}
        aria-label={`${upper} proxy table`}
      >
        {filteredProxies.length > 0 ? (
          <ProxyTable proxies={filteredProxies} dict={dict.table} />
        ) : (
          <div className={styles.emptyState}>
            <h3>
              {dict.protocol.emptyTitle.replace(
                "{protocol}",
                upper
              )}
            </h3>
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0.5rem auto 1.5rem" }}>
              {isRu
                ? `В данный момент нет доступных прокси для протокола ${upper}. Движок Hydra проверяет сокеты каждую минуту — новые серверы появятся здесь автоматически сразу после подтверждения. Вы можете использовать другие рабочие прокси ниже:`
                : `No active proxies available for ${upper} at the moment. Our Hydra engine tests sockets every minute — new nodes will appear here automatically once validated. Explore other verified proxies below:`}
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
