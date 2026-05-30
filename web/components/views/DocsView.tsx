import { Terminal, BookOpen, Code2, Layers, Download, GitBranch, Cpu } from "lucide-react";
import styles from "@/app/docs/page.module.css";
import CodeSnippet from "@/components/CodeSnippet";
import Link from "next/link";
import { getDictionary, Locale } from "@/lib/i18n";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";
const REPO_API = "https://api.github.com/repos/stormsia/proxy-list";

export default async function DocsView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";

  const pageUrl = isRu ? `${SITE_URL}/ru/docs` : `${SITE_URL}/docs`;
  const homeUrl = isRu ? `${SITE_URL}/ru` : SITE_URL;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    headline: isRu
      ? "stormsia/proxy-list — Документация и API"
      : "stormsia/proxy-list — Developer Documentation & API Reference",
    description: isRu
      ? "Как интегрировать список прокси программно: загрузка TXT, JSON, использование GitHub REST API и примеры на Python."
      : "How to integrate the free proxy list programmatically: download raw files, query the GitHub REST API, and use code snippets in Python, Node.js, Go, and cURL.",
    inLanguage: isRu ? "ru" : "en",
    author: {
      "@type": "Organization",
      name: "stormsia",
      url: "https://github.com/stormsia",
    },
    about: {
      "@type": "SoftwareApplication",
      name: "stormsia/proxy-list",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
    },
    url: pageUrl,
    dateModified: new Date().toISOString().split("T")[0],
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
        name: isRu ? "Документация и API" : "Documentation & API",
        item: pageUrl,
      },
    ],
  };

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
        <div className={styles.iconWrapper}>
          <Terminal size={32} style={{ color: "var(--accent)" }} />
        </div>
        <h1 className={styles.title}>{dict.docs.title}</h1>
        <p className={styles.subtitle}>{dict.docs.subtitle}</p>
      </header>

      <div className={styles.content}>
        <div className={styles.seoIntro}>
          <p>
            <strong>stormsia/proxy-list</strong> {dict.docs.intro1} <strong>validator</strong> {dict.docs.intro2}
          </p>
          <p>
            {dict.docs.intro3} <code>curl</code>{dict.docs.intro4}
          </p>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Download size={20} style={{ color: "var(--primary)" }} />
            <h2>{dict.docs.availableEndpoints}</h2>
          </div>
          <p>
            {dict.docs.endpointsDesc}
          </p>
          <div className={styles.endpointGrid}>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="json">JSON</span>
              <div className={styles.endpointPath}>/proxies.json</div>
              <div className={styles.endpointDesc}>
                {dict.docs.jsonDesc}
              </div>
              <Link href="/proxies.json" target="_blank" className={styles.endpointLink}>Open →</Link>
            </div>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>working_proxies.txt</div>
              <div className={styles.endpointDesc}>
                {dict.docs.txtAll}
              </div>
              <a href={`${REPO_RAW}/working_proxies.txt`} target="_blank" className={styles.endpointLink}>Open →</a>
            </div>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>socks5.txt</div>
              <div className={styles.endpointDesc}>{dict.docs.txtSocks5}</div>
              <a href={`${REPO_RAW}/socks5.txt`} target="_blank" className={styles.endpointLink}>Open →</a>
            </div>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>http.txt</div>
              <div className={styles.endpointDesc}>{dict.docs.txtHttp}</div>
              <a href={`${REPO_RAW}/http.txt`} target="_blank" className={styles.endpointLink}>Open →</a>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Layers size={20} style={{ color: "var(--accent)" }} />
            <h2>{dict.docs.jsonSchema}</h2>
          </div>
          <p>{dict.docs.jsonSchemaDesc}</p>
          <CodeSnippet
            language="json"
            code={`{
  "protocol": "socks5",       // "socks5" | "socks4" | "http" | "https"
  "host": "1.2.3.4",          // Proxy IP address
  "port": 1080,               // Proxy port number
  "timeout": 0.312,           // Response time in seconds
  "exit_ip": "1.2.3.4",       // External IP seen through the proxy
  "asn": {
    "autonomous_system_number": 12345,
    "autonomous_system_organization": "Example ISP"
  },
  "geolocation": {
    "city": { "names": { "en": "Frankfurt" } },
    "continent": { "code": "EU", "names": { "en": "Europe" } },
    "country": {
      "iso_code": "DE",
      "names": { "en": "Germany" }
    },
    "location": { "latitude": 50.11, "longitude": 8.68 },
    "registered_country": {
      "iso_code": "DE",
      "names": { "en": "Germany" }
    }
  }
}`}
          />
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Code2 size={20} style={{ color: "#3b82f6" }} />
            <h2>{dict.docs.pythonTitle}</h2>
          </div>
          <p>{dict.docs.pythonDesc}</p>
          <CodeSnippet
            language="python"
            code={`import requests
import random

SOCKS5_URL = "${REPO_RAW}/socks5.txt"
HTTP_URL   = "${REPO_RAW}/http.txt"

def fetch_proxies(url: str) -> list[str]:
    """Download a plain-text proxy list and return as a list of host:port strings."""
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    return [line.strip() for line in response.text.splitlines() if line.strip()]

if __name__ == "__main__":
    proxies = fetch_proxies(SOCKS5_URL)
    print(f"Loaded {len(proxies)} SOCKS5 proxies")

    proxy = random.choice(proxies)
    print("Using proxy:", proxy)`}
          />
        </section>

        <section className={styles.noticeSection}>
          <div className={styles.noticeIcon}>⚠️</div>
          <div>
            <h3 className={styles.noticeTitle}>{dict.docs.anonymityDisclaimer}</h3>
            <p className={styles.noticeText}>
              {dict.docs.anonymityDesc.split("httpbin.org/ip")[0]}<a href="https://httpbin.org/ip" target="_blank" rel="noopener noreferrer">httpbin.org/ip</a>{dict.docs.anonymityDesc.split("httpbin.org/ip")[1]}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
