import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Home } from "lucide-react";
import FAQ from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
import { getDictionary, Locale } from "@/lib/i18n";
import { getProxies, getResidentialProxies } from "@/lib/proxies";
import { getBreadcrumbSchema, getFaqSchema } from "@/lib/seo";

const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

export default async function ResidentialView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const isRuLocale = lang === "ru";

  const allProxies = await getProxies();
  const residentialProxies = getResidentialProxies(allProxies);

  const homeUrl = isRuLocale ? `${SITE_URL}/ru` : SITE_URL;
  const pageUrl = `${SITE_URL}${isRuLocale ? "/ru" : ""}/residential`;

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: dict.residential.datasetName,
    description: dict.residential.datasetDesc,
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
    { name: dict.residential.breadcrumbHome, url: homeUrl },
    { name: dict.residential.breadcrumbCurrent, url: pageUrl },
  ]);

  const faqItems = dict.residential.faqs;
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
          {dict.residential.badgeTitle}{" "}
          <span className="text-gradient">
            {dict.residential.badgeHighlight}
          </span>
        </h1>
        <p className={styles.subtitle}>
          {dict.residential.subtitle.replace(
            "{count}",
            residentialProxies.length.toLocaleString("en-US")
          )}
        </p>
      </header>

      <section
        className={styles.seoArticle}
        aria-label="About residential proxies"
      >
        <h2>
          {dict.residential.seoHeading}
        </h2>
        <p>
          {dict.residential.seoText}
        </p>
        <GitHubStarCard lang={lang} />
      </section>

      <section
        className={styles.tableSection}
        aria-label="Residential proxy table"
      >
        <ProxyTable
          proxies={allProxies}
          dict={dict.table}
          initialType="residential"
          viewAllHref={isRuLocale ? "/ru" : "/"}
          pageContext={{
            type: "category",
            value: "residential",
            label: dict.residential.tableContextLabel,
          }}
        />
      </section>

      <FAQ items={faqItems} title={dict.faq.title} />
    </div>
  );
}
