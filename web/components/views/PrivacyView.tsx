import { ShieldCheck, Lock, EyeOff, AlertTriangle, ExternalLink } from "lucide-react";
import styles from "./LegalView.module.css";
import { Locale } from "@/lib/i18n";

export default function PrivacyView({ lang }: { lang: Locale }) {
  const isRu = lang === "ru";
  const SITE_URL = "https://stormsia.github.io/proxy-list";
  const pageUrl = isRu ? `${SITE_URL}/ru/privacy` : `${SITE_URL}/privacy`;

  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: isRu ? "Политика конфиденциальности — stormsia/proxy-list" : "Privacy Policy — stormsia/proxy-list",
    description: isRu
      ? "Политика конфиденциальности stormsia/proxy-list: политика нулевого логирования, отсутствие сбора персональных данных и правила безопасности публичных прокси."
      : "Privacy Policy for stormsia/proxy-list: zero-log commitments, no personal data collection, and public proxy security recommendations.",
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
            {isRu ? "Политика конфиденциальности" : "Privacy Policy"}
          </h1>
          <p className={styles.subtitle}>
            {isRu
              ? "Прозрачность, политика нулевого логирования и безопасность данных."
              : "Transparency, zero-log commitments, and public proxy security disclosures."}
          </p>
        </header>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <EyeOff size={20} style={{ color: "var(--primary)" }} />
            <h2>{isRu ? "1. Нулевой сбор персональных данных (Zero-Log)" : "1. Zero Personal Data Collection (Zero-Log)"}</h2>
          </div>
          <p>
            {isRu
              ? "Сервис stormsia/proxy-list спроектирован по принципу минимизации данных. Мы не требуем регистрации учетной записи, не используем формы ввода личных данных, не выпускаем и не требуем API-ключей, а также не собираем ваши платежные реквизиты."
              : "stormsia/proxy-list is built with a zero-collection architecture. We do not require account registration, do not request email addresses or personal identities, do not issue mandatory API keys, and never collect billing details."}
          </p>
          <p>
            {isRu
              ? "На нашем сайте отсутствуют сторонние рекламные пиксели, трекеры ретаргетинга и аналитические профилирующие скрипты. Все статические ресурсы отдаются напрямую через распределенный CDN GitHub / Fastly."
              : "We do not deploy third-party advertising pixels, behavioral trackers, or retargeting beacons. All web pages and data assets are distributed via GitHub and Fastly CDN edges."}
          </p>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <Lock size={20} style={{ color: "var(--accent)" }} />
            <h2>{isRu ? "2. Происхождение данных и телеметрия" : "2. Dataset Origin & Public Telemetry"}</h2>
          </div>
          <p>
            {isRu
              ? "Все опубликованные в proxies.json и текстовых файлах IP-адреса и порты являются открытыми публичными узлами, обнаруженными валидатором Hydra в общедоступных сетевых источниках. stormsia/proxy-list не является владельцем, хостером или оператором этих прокси-серверов."
              : "All proxy endpoints published in proxies.json and plain text feeds are publicly reachable nodes aggregated from open upstream sources and verified by Hydra. stormsia/proxy-list does not own, operate, or host these proxy servers."}
          </p>
          <p>
            {isRu
              ? "Телеметрия Hydra включает только технические параметры сетевой доступности: задержку TCP/TLS (rtt_total_ms), код страны ISO 3166-1, номер автономной системы (ASN) и уровень анонимности заголовков. Никакой пользовательский трафик через наши сервера не маршрутизируется."
              : "Hydra telemetry contains strictly technical operational metrics: TCP/TLS handshake latency, ISO country codes, Autonomous System Numbers (ASN), and header anonymity flags. No client traffic is ever routed through our infrastructure."}
          </p>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <AlertTriangle size={20} style={{ color: "#eab308" }} />
            <h2>{isRu ? "3. Безопасность при работе с публичными прокси" : "3. Public Proxy Security Considerations"}</h2>
          </div>
          <p>
            {isRu
              ? "Публичные прокси-серверы управляются независимыми третьими сторонами по всему миру. По этой причине:"
              : "Public proxies are operated by independent third parties across various networks. Therefore:"}
          </p>
          <ul className={styles.featureList}>
            <li>
              <span>
                <strong>{isRu ? "Шифрование данных:" : "End-to-End Encryption:"}</strong>{" "}
                {isRu
                  ? "Никогда не передавайте незашифрованные логины, пароли или токены через прозрачные HTTP-прокси. Всегда используйте протокол HTTPS или SOCKS5."
                  : "Never transmit unencrypted credentials or sensitive payloads over plain HTTP proxies. Always enforce HTTPS or authenticated TLS."}
              </span>
            </li>
            <li>
              <span>
                <strong>{isRu ? "Защита от DNS-утечек:" : "DNS Leak Prevention:"}</strong>{" "}
                {isRu
                  ? "Для предотвращения утечки DNS-запросов вашему провайдеру используйте удаленный DNS-резолвинг (формат socks5h://)."
                  : "Use remote DNS resolution (socks5h://) to ensure domain queries are resolved at the proxy node rather than leaking through your local ISP."}
              </span>
            </li>
          </ul>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHeader}>
            <ShieldCheck size={20} style={{ color: "#38bdf8" }} />
            <h2>{isRu ? "4. Вопросы и контакты" : "4. Contact & Inquiries"}</h2>
          </div>
          <p>
            {isRu
              ? "Если у вас возникли вопросы касательно политики конфиденциальности или открытого датасета, вы можете связаться с мейнтейнерами проекта через публичный репозиторий GitHub:"
              : "If you have questions regarding this Privacy Policy or the open dataset, please reach out via our official GitHub repository:"}
          </p>
          <div style={{ marginTop: "1rem" }}>
            <a
              href="https://github.com/stormsia/proxy-list/issues"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.buttonPrimary}
            >
              <span>GitHub Issues / Discussions</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
