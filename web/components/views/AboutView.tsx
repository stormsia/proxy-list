import { Shield, Cpu, Globe, CheckCircle2, Terminal, ExternalLink } from "lucide-react";
import styles from "./LegalView.module.css";
import { getDictionary, Locale, getCanonicalUrl, SITE_URL } from "@/lib/i18n";

export default async function AboutView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const pageUrl = getCanonicalUrl("/about", lang);

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: dict.about.name,
    description: dict.about.description,
    url: pageUrl,
    mainEntity: {
      "@type": "Organization",
      name: "stormsia/proxy-list",
      url: SITE_URL,
      sameAs: [
        "https://github.com/stormsia/proxy-list",
        "https://github.com/stormsia/hydra",
      ],
    },
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.iconCircle}>
            <Globe size={32} style={{ color: "var(--primary)" }} />
          </div>
          <h1 className={styles.title}>
            {dict.about.title}
          </h1>
          <p className={styles.subtitle}>
            {dict.about.subtitle}
          </p>
        </header>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <Shield size={20} style={{ color: "var(--primary)" }} />
            <h2>{dict.about.missionTitle}</h2>
          </div>
          <p>
            {dict.about.missionP1}
          </p>
          <p>
            {dict.about.missionP2}
          </p>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <Cpu size={20} style={{ color: "var(--accent)" }} />
            <h2>{dict.about.hydraTitle}</h2>
          </div>
          <p>
            {dict.about.hydraIntro}
          </p>
          <ul className={styles.featureList}>
            <li>
              <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
              <span>
                <strong>{dict.about.featureTcpLabel}</strong>{" "}
                {dict.about.featureTcpDesc}
              </span>
            </li>
            <li>
              <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
              <span>
                <strong>{dict.about.featureTlsLabel}</strong>{" "}
                {dict.about.featureTlsDesc}
              </span>
            </li>
            <li>
              <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
              <span>
                <strong>{dict.about.featureAnonLabel}</strong>{" "}
                {dict.about.featureAnonDesc}
              </span>
            </li>
            <li>
              <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
              <span>
                <strong>{dict.about.featureGeoLabel}</strong>{" "}
                {dict.about.featureGeoDesc}
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <Terminal size={20} style={{ color: "#38bdf8" }} />
            <h2>{dict.about.openSourceTitle}</h2>
          </div>
          <p>
            {dict.about.openSourceP1}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <a
              href="https://github.com/stormsia/proxy-list"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buttonPrimary}
            >
              <span>{dict.about.githubRepo}</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/stormsia/proxy-list/issues"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buttonSecondary}
            >
              <span>{dict.about.reportIssue}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
