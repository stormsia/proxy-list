import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { MapPin } from "lucide-react";
import FAQ from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
import { getDictionary, Locale, getLocalizedPath, getCanonicalUrl, SITE_URL } from "@/lib/i18n";
import { getProxies, getProxiesByCountry } from "@/lib/proxies";
import { COUNTRY_META, getCountryDisplayName } from "@/lib/countries";
import { getFaqSchema } from "@/lib/seo";

export { COUNTRY_META };

export default async function CountryView({
  lang,
  code,
}: {
  lang: Locale;
  code: string;
}) {
  const dict = await getDictionary(lang);
  const normalizedCode = code.toLowerCase();

  const allProxies = await getProxies();
  const filteredProxies = getProxiesByCountry(allProxies, normalizedCode);

  const fallbackName = code.toUpperCase();

  const countryName = getCountryDisplayName(
    normalizedCode,
    fallbackName,
    lang
  );

  const pageUrl = getCanonicalUrl(`/country/${normalizedCode}`, lang);
  const homeUrl = getCanonicalUrl("/", lang);

  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: dict.country.datasetName.replace("{country}", countryName),
    description: dict.country.datasetDesc.replace("{country}", countryName),
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
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/data/proxies.json`,
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
        name: dict.country.breadcrumbHome,
        item: homeUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: dict.country.breadcrumbCurrent.replace("{country}", countryName),
        item: pageUrl,
      },
    ],
  };

  const faqItems = [
    {
      question: dict.country.faqQ1.replace("{country}", countryName),
      answer: dict.country.faqA1.replace("{country}", countryName),
    },
    {
      question: dict.country.faqQ2.replace("{country}", countryName),
      answer: dict.country.faqA2.replace("{country}", countryName),
    },
    {
      question: dict.country.faqQ3.replace("{country}", countryName),
      answer: dict.country.faqA3.replace("{country}", countryName),
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
          <MapPin size={32} style={{ color: "var(--primary)" }} />
        </div>
        <h1 className={styles.title}>
          {dict.country.titlePrefix}{" "}
          <span className="text-gradient">{countryName}</span>{" "}
          {dict.country.titleSuffix}
        </h1>
        <p className={styles.subtitle}>
          {filteredProxies.length > 0
            ? `${filteredProxies.length.toLocaleString(lang)} ${dict.country.subtitle.replace(
                "{country}",
                countryName
              )}`
            : dict.country.subtitleEmpty.replace("{country}", countryName)}
        </p>
      </header>

      <section
        className={styles.seoArticle}
        aria-label={dict.country.aboutTitle.replace("{country}", countryName)}
      >
        <h2>
          {dict.country.aboutTitle.replace("{country}", countryName)}
        </h2>
        <p>
          {dict.country.aboutText1}
          <strong>{countryName}</strong>
          {dict.country.aboutText2}
        </p>
        <GitHubStarCard lang={lang} />
      </section>

      <section
        className={styles.tableSection}
        aria-label={`${countryName} - ${dict.table.tableCaption || "Proxy List"}`}
      >
        <ProxyTable
          proxies={filteredProxies.slice(0, 50)}
          dict={dict.table}
          initialCountry={normalizedCode}
          viewAllHref={getLocalizedPath("/", lang)}
          pageContext={{
            type: "country",
            value: normalizedCode,
            label: countryName,
          }}
        />
      </section>

      <FAQ items={faqItems} title={dict.faq.title} />
    </div>
  );
}
