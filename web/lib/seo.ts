import { Metadata } from "next";
import {
  SITE_URL,
  Locale,
  LOCALES,
  DEFAULT_LOCALE,
  getCanonicalUrl,
} from "./i18n";

export { SITE_URL };

export interface PageMetadataOptions {
  title: string;
  description: string;
  /** Relative path without leading locale, e.g. "" or "/socks5" or "/country/us" */
  subpath?: string;
  lang: Locale;
  keywords?: string[];
}

const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
  es: "es_ES",
  zh: "zh_CN",
  hi: "hi_IN",
  ar: "ar_SA",
  pt: "pt_PT",
  fr: "fr_FR",
  bn: "bn_BD",
  id: "id_ID",
};

const OG_ALTERNATE_LOCALES: Record<Locale, string> = {
  en: "ru_RU",
  ru: "en_US",
  es: "en_US",
  zh: "en_US",
  hi: "en_US",
  ar: "en_US",
  pt: "en_US",
  fr: "en_US",
  bn: "en_US",
  id: "en_US",
};

/**
 * Standardized Metadata generator ensuring strict canonical, bidirectional hreflang (en/ru/x-default),
 * and synchronized OpenGraph / Twitter tags.
 */
export function buildPageMetadata({
  title,
  description,
  subpath = "",
  lang,
  keywords,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = getCanonicalUrl(subpath, lang);

  const languages: Record<string, string> = {};
  LOCALES.forEach((l) => {
    languages[l] = getCanonicalUrl(subpath, l);
  });
  languages["x-default"] = getCanonicalUrl(subpath, DEFAULT_LOCALE);

  const defaultKeywords = [
    "free proxy list",
    "socks5 proxy list",
    "http proxy list",
    "https proxies",
    "socks4 proxies",
    "public proxy servers",
    "free proxies",
    "proxy checker",
    "residential proxies",
    "datacenter proxies",
  ];

  return {
    title,
    description,
    keywords: keywords || defaultKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "stormsia/proxy-list",
      locale: OG_LOCALES[lang] || "en_US",
      alternateLocale: OG_ALTERNATE_LOCALES[lang] || "ru_RU",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "stormsia/proxy-list - Free SOCKS5, HTTP & SOCKS4 Proxies",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@stormsia",
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

/**
 * Google Dataset Search compliant Dataset schema markup
 */
export function getDatasetSchema() {
  return {
    "@context": "https://schema.org/",
    "@type": "Dataset",
    name: "Free Public Proxy List — stormsia/proxy-list",
    description:
      "A continuously auto-updated dataset of free public proxy servers including SOCKS5, SOCKS4, HTTP and HTTPS with verified RTT latency, uptime metrics, ASN, and country geolocation.",
    url: `${SITE_URL}/data/proxies.json`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    creator: {
      "@type": "Organization",
      name: "stormsia",
      url: "https://github.com/stormsia",
    },
    variableMeasured: [
      "IP Address (ip)",
      "Port (port)",
      "Protocol (protocol: http, socks4, socks5)",
      "Total Round-Trip Latency in ms (rtt_total_ms)",
      "TCP Connection Time in ms (rtt_tcp_ms)",
      "TLS/Protocol Handshake Time in ms (rtt_handshake_ms)",
      "Outbound IP Address (out_ip)",
      "Autonomous System Number (asn)",
      "ISP / Carrier Name (asn_org)",
      "Country Code (country: ISO 3166-1 alpha-2)",
      "Anonymity Level (anon: transparent, anonymous, elite)",
      "Uptime Percentage (uptime_pct: 0-100)",
      "Stability Percentage (stability_pct: 0-100)",
      "HTTPS Tunneling Support (supports_https)",
      "Lifecycle State (state: alive, cooldown, dead_permanent)",
    ],
    spatialCoverage: "Global",
    temporalCoverage: "Live (audited continuously every 60 seconds by Hydra Rust engine)",
    keywords: [
      "free proxy list",
      "socks5 proxy list",
      "http proxy list",
      "https proxies",
      "socks4 proxies",
      "public proxy servers",
      "residential proxies",
      "datacenter proxies",
      "hydra validation engine",
    ],
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/data/proxies.json`,
        name: "Full Hydra Engine JSON Dataset",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl:
          "https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json",
        name: "Raw GitHub Data Endpoint (JSON)",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl:
          "https://raw.githubusercontent.com/stormsia/proxy-list/main/working_proxies.txt",
        name: "All Working Proxies (TXT)",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl:
          "https://raw.githubusercontent.com/stormsia/proxy-list/main/socks5.txt",
        name: "SOCKS5 Proxies (TXT)",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl:
          "https://raw.githubusercontent.com/stormsia/proxy-list/main/socks4.txt",
        name: "SOCKS4 Proxies (TXT)",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "text/plain",
        contentUrl:
          "https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt",
        name: "HTTP & HTTPS Proxies (TXT)",
      },
    ],
  };
}

/**
 * WebSite & WebApplication schemas
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "stormsia/proxy-list",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "stormsia/proxy-list",
    url: SITE_URL,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Free open-source proxy list and network topology monitor with continuous 60-second verification cycles by Hydra.",
  };
}

/**
 * BreadcrumbList schema
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQPage schema
 */
export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * HowTo Schema for terminal and code integration snippets (Google Rich Results & AEO)
 */
export function getHowToSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Connect to Free Proxies via cURL and Python (2026)",
    description:
      "Step-by-step instructions to route traffic through free verified SOCKS5 and HTTP proxies using cURL and Python httpx.",
    totalTime: "PT1M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Select a verified proxy endpoint",
        text: "Pick an active SOCKS5 or HTTP proxy from the live directory filtered by sub-500ms latency and high uptime.",
        url: `${SITE_URL}/#proxies`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Execute cURL with remote DNS resolution",
        text: "Run in your terminal: curl -x socks5h://IP:PORT https://api.ipify.org?format=json to verify connection and prevent DNS leaks.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Integrate into Python httpx or requests",
        text: "In Python, pass proxy parameter to httpx.AsyncClient(proxy='http://IP:PORT') or requests.get('https://example.com', proxies={'http': 'http://IP:PORT'}).",
      },
    ],
  };
}
