import { Shield, Cpu, Globe, CheckCircle2, Terminal, ExternalLink } from "lucide-react";
import Link from "next/link";
import styles from "./LegalView.module.css";
import { Locale } from "@/lib/i18n";

export default function AboutView({ lang }: { lang: Locale }) {
  const isRu = lang === "ru";
  const SITE_URL = "https://stormsia.github.io/proxy-list";
  const pageUrl = isRu ? `${SITE_URL}/ru/about` : `${SITE_URL}/about`;

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: isRu ? "О проекте stormsia/proxy-list" : "About stormsia/proxy-list",
    description: isRu
      ? "Информация об архитектуре, открытом исходном коде, движке валидации Hydra и миссии открытой прокси-инфраструктуры stormsia/proxy-list."
      : "Architecture overview, open-source principles, Hydra validation engine, and mission of the stormsia/proxy-list proxy infrastructure.",
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
            {isRu ? "О проекте stormsia/proxy-list" : "About stormsia/proxy-list"}
          </h1>
          <p className={styles.subtitle}>
            {isRu
              ? "Открытая глобальная сеть валидации и публикации свободных прокси-серверов с непрерывным поминутным аудитом."
              : "Zero-auth, continuously audited public proxy infrastructure powered by the high-speed Hydra validation engine."}
          </p>
        </header>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <Shield size={20} style={{ color: "var(--primary)" }} />
            <h2>{isRu ? "Миссия и философия" : "Our Mission & Philosophy"}</h2>
          </div>
          <p>
            {isRu
              ? "Традиционные бесплатные списки прокси страдают от критической проблемы устаревания данных: от 80% до 95% опубликованных IP-адресов оказываются нерабочими, медленными или заблокированными. Миссия stormsia/proxy-list — предоставить разработчикам, исследователям данных и инженерам машинного обучения надежный, актуальный и прозрачный источник бесплатных прокси, проверяемый каждые 60 секунд."
              : "Traditional free proxy lists suffer from extreme data staleness: 80% to 95% of listed IPs are offline, unresponsive, or blacklisted. The mission of stormsia/proxy-list is to provide developers, data scientists, and autonomous AI agents with an auditable, high-availability public proxy pool filtered every 60 seconds."}
          </p>
          <p>
            {isRu
              ? "Мы верим в открытость интернета и доступность инструментов веб-скрейпинга. Наш сервис работает без авторизации, без скрытых платных тарифов, без рекламных редиректов и без сбора персональных данных пользователей."
              : "We believe in an open web. Our infrastructure operates with zero authentication, no paywalls, no tracking redirects, and no collection of private user credentials."}
          </p>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <Cpu size={20} style={{ color: "var(--accent)" }} />
            <h2>{isRu ? "Технология валидации Hydra (Rust)" : "The Hydra Validation Engine"}</h2>
          </div>
          <p>
            {isRu
              ? "Основой надежности списков является Hydra — высокопроизводительный движок на языке Rust с асинхронным рантаймом Tokio. Hydra непрерывно обрабатывает десятки тысяч сокетов в неблокирующем режиме:"
              : "The backbone of our dataset reliability is Hydra, an open-source Rust engine built on asynchronous Tokio non-blocking sockets. Hydra inspects tens of thousands of candidate endpoints simultaneously:"}
          </p>
          <ul className={styles.featureList}>
            <li>
              <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
              <span>
                <strong>{isRu ? "TCP Handshake:" : "TCP Handshake:"}</strong>{" "}
                {isRu ? "Замер миллисекундной задержки сокета (rtt_tcp_ms)." : "Sub-millisecond socket connection timing."}
              </span>
            </li>
            <li>
              <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
              <span>
                <strong>{isRu ? "TLS & Протоколы:" : "TLS & Protocols:"}</strong>{" "}
                {isRu ? "Проверка согласования TLS, поддержка SOCKS5 UDP/TCP и HTTP CONNECT." : "TLS negotiation verification and protocol handshake validation."}
              </span>
            </li>
            <li>
              <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
              <span>
                <strong>{isRu ? "Инспекция анонимности:" : "Anonymity Auditing:"}</strong>{" "}
                {isRu ? "Классификация узлов на Elite (Level 1), Anonymous (Level 2) и Transparent." : "Header inspection classifying nodes into Elite, Anonymous, or Transparent."}
              </span>
            </li>
            <li>
              <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
              <span>
                <strong>{isRu ? "Геолокация и ASN:" : "Geo & ASN Telemetry:"}</strong>{" "}
                {isRu ? "Обогащение базы 239 странами, ASN и организациями провайдеров." : "BGP Autonomous System Numbers and ISO country enrichment."}
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <Terminal size={20} style={{ color: "#38bdf8" }} />
            <h2>{isRu ? "Открытый исходный код и сообщество" : "Open Source & Community"}</h2>
          </div>
          <p>
            {isRu
              ? "Код веб-приложения и конфигурации валидатора доступны на GitHub под лицензией MIT. Набор данных публикуется под лицензией Creative Commons Attribution 4.0 International (CC-BY 4.0). Вы можете свободно использовать данные в коммерческих и некоммерческих проектах с сохранением указания авторства."
              : "All application code is released under the MIT license on GitHub. The telemetry dataset is published under Creative Commons Attribution 4.0 International (CC-BY 4.0). You are free to consume the data in personal or commercial projects with proper attribution."}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <a
              href="https://github.com/stormsia/proxy-list"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buttonPrimary}
            >
              <span>GitHub Репозиторий</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/stormsia/proxy-list/issues"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buttonSecondary}
            >
              <span>{isRu ? "Сообщить об ошибке / Issues" : "Report Issue / Feedback"}</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
