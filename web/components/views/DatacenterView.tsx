import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { Server } from "lucide-react";
import FAQ from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
import { getDictionary, Locale, getLocalizedPath, getCanonicalUrl } from "@/lib/i18n";
import { getProxies, getDatacenterProxies } from "@/lib/proxies";
import { getBreadcrumbSchema, getFaqSchema } from "@/lib/seo";

const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";

export default async function DatacenterView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);

  const allProxies = await getProxies();
  const dcProxies = getDatacenterProxies(allProxies);

  const homeUrl = getCanonicalUrl("/", lang);
  const pageUrl = getCanonicalUrl("/datacenter", lang);

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: dict.datacenter.datasetName,
    description: dict.datacenter.datasetDesc,
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
    { name: dict.datacenter.breadcrumbHome, url: homeUrl },
    { name: dict.datacenter.breadcrumbCurrent, url: pageUrl },
  ]);

  const faqItems = dict.datacenter.faqs;
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
          {dict.datacenter.badgeTitle}{" "}
          <span className="text-gradient">
            {dict.datacenter.badgeHighlight}
          </span>
        </h1>
        <p className={styles.subtitle}>
          {dict.datacenter.subtitle.replace(
            "{count}",
            dcProxies.length.toLocaleString(lang)
          )}
        </p>
      </header>

      <section
        className={styles.seoArticle}
        aria-label={dict.datacenter.seoHeading}
      >
        <h2>
          {dict.datacenter.seoHeading}
        </h2>
        <p>
          {dict.datacenter.seoText}
        </p>
        <GitHubStarCard lang={lang} />
      </section>

      <section
        className={styles.tableSection}
        aria-label={`${dict.datacenter.tableContextLabel} - ${dict.table.tableCaption || "Proxy List"}`}
      >
        <ProxyTable
          proxies={dcProxies.slice(0, 50)}
          dict={dict.table}
          initialType="datacenter"
          viewAllHref={getLocalizedPath("/", lang)}
          pageContext={{
            type: "category",
            value: "datacenter",
            label: dict.datacenter.tableContextLabel,
          }}
        />
      </section>

      <FAQ items={faqItems} title={dict.faq.title} />
    </div>
  );
}
