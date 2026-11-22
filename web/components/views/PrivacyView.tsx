import { ShieldCheck, Lock, EyeOff, AlertTriangle, ExternalLink } from "lucide-react";
import styles from "./LegalView.module.css";
import { getDictionary, Locale, getCanonicalUrl } from "@/lib/i18n";

export default async function PrivacyView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const pageUrl = getCanonicalUrl("/privacy", lang);

  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: dict.privacy.name,
    description: dict.privacy.description,
    url: pageUrl,
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.iconCircle}>
            <ShieldCheck size={32} style={{ color: "var(--primary)" }} />
          </div>
          <h1 className={styles.title}>
            {dict.privacy.title}
          </h1>
          <p className={styles.subtitle}>
            {dict.privacy.subtitle}
          </p>
        </header>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <EyeOff size={20} style={{ color: "var(--primary)" }} />
            <h2>{dict.privacy.sec1Title}</h2>
          </div>
          <p>
            {dict.privacy.sec1P1}
          </p>
          <p>
            {dict.privacy.sec1P2}
          </p>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <Lock size={20} style={{ color: "var(--accent)" }} />
            <h2>{dict.privacy.sec2Title}</h2>
          </div>
          <p>
            {dict.privacy.sec2P1}
          </p>
          <p>
            {dict.privacy.sec2P2}
          </p>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <AlertTriangle size={20} style={{ color: "#eab308" }} />
            <h2>{dict.privacy.sec3Title}</h2>
          </div>
          <p>
            {dict.privacy.sec3P1}
          </p>
          <ul className={styles.featureList}>
            <li>
              <span>
                <strong>{dict.privacy.sec3EncLabel}</strong>{" "}
                {dict.privacy.sec3EncDesc}
              </span>
            </li>
            <li>
              <span>
                <strong>{dict.privacy.sec3DnsLabel}</strong>{" "}
                {dict.privacy.sec3DnsDesc}
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <ShieldCheck size={20} style={{ color: "#38bdf8" }} />
            <h2>{dict.privacy.sec4Title}</h2>
          </div>
          <p>
            {dict.privacy.sec4P1}
          </p>
          <div style={{ marginTop: "1rem" }}>
            <a
              href="https://github.com/stormsia/proxy-list/issues"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buttonPrimary}
            >
              <span>{dict.privacy.sec4Button}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
