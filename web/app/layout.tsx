import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Free Proxy List (2026) | stormsia/proxy-list",
    template: "%s | stormsia/proxy-list",
  },
  description:
    "Free, open-source proxy list with SOCKS5, HTTP, HTTPS & SOCKS4 proxies. Verified by an async validator, updated automatically. Machine-readable JSON API included.",
  keywords: [
    "free proxy list",
    "socks5 proxy list",
    "http proxy list",
    "public proxy servers",
    "free proxies",
    "proxy checker",
    "residential proxies",
    "datacenter proxies",
    "llms.txt",
    "ai proxy api",
    "agentic resource discovery",
  ],
  authors: [{ name: "stormsia", url: "https://github.com/stormsia" }],
  creator: "stormsia",
  publisher: "stormsia",
  alternates: {
    canonical: "./",
    languages: {
      en: SITE_URL,
      ru: `${SITE_URL}/ru`,
      es: `${SITE_URL}/es`,
      zh: `${SITE_URL}/zh`,
      hi: `${SITE_URL}/hi`,
      ar: `${SITE_URL}/ar`,
      pt: `${SITE_URL}/pt`,
      fr: `${SITE_URL}/fr`,
      bn: `${SITE_URL}/bn`,
      id: `${SITE_URL}/id`,
      "x-default": SITE_URL,
    },
    types: {
      "text/markdown": `${SITE_URL}/llms.txt`,
      "application/json": `${SITE_URL}/.well-known/ai-catalog.json`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "stormsia/proxy-list",
    title: "Free Proxy List | stormsia/proxy-list",
    description:
      "Open-source, auto-updated proxy list. SOCKS5, HTTP, HTTPS, SOCKS4. Verified by async validator. JSON API available.",
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
    title: "Free Proxy List | stormsia/proxy-list",
    description:
      "Open-source, auto-updated proxy list. SOCKS5, HTTP, HTTPS, SOCKS4. Verified by async validator. JSON API available.",
    creator: "@stormsia",
    images: [`${SITE_URL}/og-image.png`],
  },
  verification: {
    google: "Ilxb2F7zsbKpIgNLwUwwxbxNlrbuD6-89ZG-yCgwYbo",
    other: {
      "msvalidate.01": "4D27CA575B813AAEA9224B7F6560D260",
    },
  },
  icons: {
    icon: [
      { url: `${SITE_URL}/favicon.ico`, sizes: "any" },
      { url: `${SITE_URL}/icon.svg`, type: "image/svg+xml" },
      { url: `${SITE_URL}/favicon-48x48.png`, sizes: "48x48", type: "image/png" },
      { url: `${SITE_URL}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
      { url: `${SITE_URL}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: `${SITE_URL}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" },
    ],
    shortcut: [`${SITE_URL}/favicon.ico`],
  },
  manifest: "/proxy-list/manifest.json",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/components/I18nProvider";
import LocaleMismatchBanner from "@/components/LocaleMismatchBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "stormsia/proxy-list",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: `${SITE_URL}/og-image.png`,
    sameAs: [
      "https://github.com/stormsia/proxy-list",
      "https://github.com/stormsia/hydra",
      `${SITE_URL}/llms.txt`,
      `${SITE_URL}/.well-known/ai-catalog.json`,
      `${SITE_URL}/pricing.md`,
      `${SITE_URL}/AGENTS.md`,
    ],
    knowsAbout: [
      "Proxy Servers",
      "SOCKS5 Protocol",
      "HTTP & HTTPS Proxies",
      "SOCKS4 Protocol",
      "Network Latency Auditing",
      "Web Scraping Infrastructure",
      "Autonomous Agent Discovery",
      "Zero-Auth APIs",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Public Proxy Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Free SOCKS5 & HTTP Proxy Feed",
            description: "Continuously validated free proxy endpoints with sub-second latency auditing.",
          },
          price: "0",
          priceCurrency: "USD",
        },
      ],
    },
    description:
      "Open-source proxy infrastructure network that collects, validates, and publishes free proxy lists using the high-concurrency Hydra Rust engine.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "technical support",
      url: "https://github.com/stormsia/proxy-list/issues",
      availableLanguage: [
        "English",
        "Russian",
        "Spanish",
        "Chinese",
        "Hindi",
        "Arabic",
        "Portuguese",
        "French",
        "Bengali",
        "Indonesian",
      ],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "stormsia/proxy-list",
    url: SITE_URL,
    sameAs: [
      `${SITE_URL}/llms.txt`,
      `${SITE_URL}/.well-known/ai-catalog.json`,
      `${SITE_URL}/pricing.md`,
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const webAppSchema = {
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Site Verification (Search Console) */}
        <meta
          name="google-site-verification"
          content="Ilxb2F7zsbKpIgNLwUwwxbxNlrbuD6-89ZG-yCgwYbo"
        />

        {/* Bing Webmaster Tools Verification */}
        <meta
          name="msvalidate.01"
          content="4D27CA575B813AAEA9224B7F6560D260"
        />

        {/* Microsoft Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "wz3d0xan93");`,
          }}
        />

        <meta name="theme-color" content="#0d1117" />
        <link rel="manifest" href={`${SITE_URL}/manifest.json`} />
        <link rel="icon" href={`${SITE_URL}/favicon.ico`} sizes="any" />
        <link rel="icon" type="image/svg+xml" href={`${SITE_URL}/icon.svg`} />
        <link rel="icon" type="image/png" sizes="48x48" href={`${SITE_URL}/favicon-48x48.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${SITE_URL}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${SITE_URL}/favicon-16x16.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${SITE_URL}/apple-touch-icon.png`} />
        <link rel="sitemap" type="application/xml" title="Sitemap" href={`${SITE_URL}/sitemap.xml`} />
        <link rel="security" href={`${SITE_URL}/.well-known/security.txt`} />
        <link rel="alternate" type="text/markdown" href={`${SITE_URL}/llms.txt`} title="LLM Context (llms.txt)" />
        <link rel="alternate" type="text/plain" href={`${SITE_URL}/llms.txt`} title="LLM Context (llms.txt)" />
        <link rel="help" type="text/markdown" href={`${SITE_URL}/llms.txt`} title="Agent Guidance (llms.txt)" />
        <link rel="alternate" type="text/markdown" href={`${SITE_URL}/llms-full.txt`} title="Full AI Agent Reference (llms-full.txt)" />
        <link rel="ai-catalog" type="application/json" href={`${SITE_URL}/.well-known/ai-catalog.json`} title="Agentic Resource Discovery Catalog" />
        <link rel="service-desc" type="application/json" href={`${SITE_URL}/.well-known/ai-catalog.json`} title="AI Catalog Manifest" />
        <link rel="ai-catalog" type="application/json" href={`${SITE_URL}/ai-catalog.json`} />
        <link rel="pricing" type="text/markdown" href={`${SITE_URL}/pricing.md`} title="Free Tier Pricing Spec" />
        <link rel="agent-guidelines" type="text/markdown" href={`${SITE_URL}/AGENTS.md`} title="Agent Guidelines" />
        <link rel="alternate" type="application/json" href="https://raw.githubusercontent.com/stormsia/proxy-list/main/data/proxies.json" title="Live Proxy JSON Feed" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <I18nProvider>
          <div className="main-layout">
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
          <LocaleMismatchBanner />
        </I18nProvider>
      </body>
    </html>
  );
}
