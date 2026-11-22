import styles from "@/app/page.module.css";
import { Star } from "lucide-react";
import LiveHomeDashboard from "@/components/views/LiveHomeDashboard";
import FAQ, { FAQItem } from "@/components/FAQ";
import GitHubStarCard from "@/components/GitHubStarCard";
import { getDictionary, Locale } from "@/lib/i18n";
import { getProxies, getProxyStats } from "@/lib/proxies";
import { getDatasetSchema, getBreadcrumbSchema, getFaqSchema, SITE_URL } from "@/lib/seo";

export default async function HomeView({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  const proxies = await getProxies();
  const stats = getProxyStats(proxies);

  const schemaMarkup = getDatasetSchema();
  const faqData = dict.faq as unknown as { items?: FAQItem[] };
  const homeFaq: FAQItem[] = faqData?.items || [];
  const faqSchema = getFaqSchema(homeFaq);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
  ]);

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className={styles.header}>
        <div className={styles.heroBadgeRow}>
          <a
            href="https://github.com/stormsia/hydra"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hydraHeroBadge}
          >
            <span>⚡</span>
            <span>
              {dict.home.heroBadgeHydra}
            </span>
            <span style={{ opacity: 0.7 }}>→</span>
          </a>

          <a
            href="https://github.com/stormsia/proxy-list"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.starHeroBadge}
            title={dict.home.heroBadgeStarTitle}
          >
            <Star size={13} className={styles.heroStarIcon} fill="#eab308" color="#eab308" />
            <span>{dict.home.heroBadgeStar}</span>
            <span style={{ opacity: 0.75 }}>★</span>
          </a>
        </div>
        <h1 className={styles.title}>
          {dict.home.heroPrefix}{" "}
          <span className="text-gradient">{dict.home.heroHighlight}</span>{" "}
          {dict.home.heroSuffix}
        </h1>
        <p className={styles.subtitle}>{dict.home.subtitle}</p>
      </header>

      <LiveHomeDashboard
        initialProxies={proxies}
        initialStats={stats}
        lang={lang}
        dict={dict}
      />

      <section className={styles.seoArticle} aria-label="About stormsia/proxy-list infrastructure">
        <h2>{dict.home.seoTitle}</h2>
        <p>{dict.footer.seoText}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", margin: "1.5rem 0" }}>
          <div style={{ padding: "1rem", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
              ⚡ {dict.home.card1Title}
            </h3>
            <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)" }}>
              {dict.home.card1Desc}
            </p>
          </div>
          <div style={{ padding: "1rem", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
              🌐 {dict.home.card2Title}
            </h3>
            <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)" }}>
              {dict.home.card2Desc}
            </p>
          </div>
          <div style={{ padding: "1rem", background: "rgba(255, 255, 255, 0.03)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            <h3 style={{ fontSize: "1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
              🤖 {dict.home.card3Title}
            </h3>
            <p style={{ fontSize: "0.875rem", margin: 0, color: "var(--text-secondary)" }}>
              {dict.home.card3Desc}
            </p>
          </div>
        </div>

        <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--foreground)", marginBottom: "0.75rem" }}>
            💻 {dict.home.integrationTitle}
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
            {dict.home.integrationDesc}
          </p>
          <pre className={styles.codeBlock}>
            <code>curl -x socks5h://IP:PORT https://api.ipify.org?format=json</code>
          </pre>
          <pre className={styles.codeBlock}>
            <code>python -c &quot;import httpx; print(httpx.get(&apos;https://api.ipify.org&apos;, proxy=&apos;http://IP:PORT&apos;).text)&quot;</code>
          </pre>
        </div>

        <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.15rem", color: "var(--foreground)", marginBottom: "0.75rem" }}>
            📊 {dict.home.matrixTitle}
          </h3>
          <div className={styles.matrixTableWrapper}>
            <table className={styles.matrixTable}>
              <thead>
                <tr>
                  <th>{dict.home.matrixThProtocol}</th>
                  <th>{dict.home.matrixThLayer}</th>
                  <th>{dict.home.matrixThUdp}</th>
                  <th>{dict.home.matrixThAnonymity}</th>
                  <th>{dict.home.matrixThBestFor}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>SOCKS5</td>
                  <td>Layer 5 (Session)</td>
                  <td>TCP + UDP / Remote (socks5h)</td>
                  <td>Elite (No headers added)</td>
                  <td>{dict.home.matrixSocks5Best}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: "var(--accent)" }}>HTTP / HTTPS</td>
                  <td>Layer 7 (Application)</td>
                  <td>TCP only / Local DNS</td>
                  <td>Elite / Anonymous / Transparent</td>
                  <td>{dict.home.matrixHttpBest}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600, color: "#9ca3af" }}>SOCKS4</td>
                  <td>Layer 5 (Session)</td>
                  <td>TCP only / IPv4 only</td>
                  <td>No authentication</td>
                  <td>{dict.home.matrixSocks4Best}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <GitHubStarCard lang={lang} />
      </section>

      <FAQ items={homeFaq} title={dict.faq.title} />
    </div>
  );
}
