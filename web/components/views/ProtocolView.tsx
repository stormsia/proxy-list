import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Globe } from "lucide-react";
import FAQ from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
import { getDictionary, Locale, getLocalizedPath, getCanonicalUrl } from "@/lib/i18n";
import { getProxies, getProxiesByProtocol } from "@/lib/proxies";


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
  const normalizedProtocol = protocol.toLowerCase();
  const upper = normalizedProtocol.toUpperCase();

  const allProxies = await getProxies();
  const filteredProxies = getProxiesByProtocol(allProxies, normalizedProtocol);

  const meta = PROTOCOL_META[normalizedProtocol];
  const color = meta?.color ?? "var(--primary)";
  const txtFile = meta?.file ?? `${normalizedProtocol}.txt`;

  const about = dict.protocol.about[normalizedProtocol as keyof typeof dict.protocol.about];
  const pageUrl = getCanonicalUrl(`/${normalizedProtocol}`, lang);
  const homeUrl = getCanonicalUrl("/", lang);

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: dict.protocol.datasetName.replace("{protocol}", upper),
    description: dict.protocol.datasetDesc.replace("{protocol}", upper),
    url: pageUrl,
    inLanguage: lang,
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
        name: dict.protocol.breadcrumbHome,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.protocol.breadcrumbCurrent.replace("{protocol}", upper),
        item: pageUrl,
      },
    ],
  };

  const faqItems = [
    {
      question: dict.protocol.faqQ1.replace("{protocol}", upper),
      answer:
        normalizedProtocol === "socks5"
          ? dict.protocol.faqA1Socks5
          : dict.protocol.faqA1Other.replace(/\{protocol\}/g, normalizedProtocol),
    },
    {
      question: dict.protocol.faqQ2.replace("{protocol}", upper),
      answer: dict.protocol.faqA2.replace("{protocol}", upper),
    },
    {
      question: dict.protocol.faqQ3.replace("{protocol}", upper),
      answer: dict.protocol.faqA3.replace("{protocol}", upper),
    },
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
          {dict.protocol.titlePrefix}{" "}
          <span className="text-gradient">{upper}</span>{" "}
          {dict.protocol.titleSuffix}
        </h1>
        <p className={styles.subtitle}>
          {filteredProxies.length > 0
            ? `${filteredProxies.length.toLocaleString(lang)} ${dict.protocol.subtitle.replace(
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
        <section className={styles.seoArticle} aria-label={dict.protocol.aboutTitle.replace("{protocol}", upper)}>
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
        aria-label={`${upper} - ${dict.table.tableCaption || "Proxy List"}`}
      >
        <ProxyTable
          proxies={filteredProxies.slice(0, 50)}
          dict={dict.table}
          initialProtocol={normalizedProtocol}
          viewAllHref={getLocalizedPath("/", lang)}
          pageContext={{
            type: "protocol",
            value: normalizedProtocol,
            label: upper,
          }}
        />
      </section>

      <FAQ items={faqItems} title={dict.faq.title} />
    </div>
  );
}
