import { Metadata } from "next";

export const SITE_URL = "https://stormsia.github.io/proxy-list";

export interface PageMetadataOptions {
  title: string;
  description: string;
  /** Relative path without leading locale, e.g. "" or "/socks5" or "/country/us" */
  subpath?: string;
  lang: "en" | "ru";
  keywords?: string[];
}

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
  const cleanSubpath = subpath ? (subpath.startsWith("/") ? subpath : `/${subpath}`) : "";
  const enUrl = `${SITE_URL}${cleanSubpath}`;
  const ruUrl = `${SITE_URL}/ru${cleanSubpath}`;
  const canonicalUrl = lang === "ru" ? ruUrl : enUrl;

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
      languages: {
        en: enUrl,
        ru: ruUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "stormsia/proxy-list",
      locale: lang === "ru" ? "ru_RU" : "en_US",
      alternateLocale: lang === "ru" ? "en_US" : "ru_RU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@stormsia",
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
    temporalCoverage: "Live (updated continuously by Hydra Engine)",
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
      "Free open-source proxy list and network topology monitor with automated 15-minute verification cycles.",
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
