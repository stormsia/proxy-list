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
    default: "Free Proxy List | stormsia/proxy-list",
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
      { url: "/proxy-list/icon.svg", type: "image/svg+xml" },
      { url: "/proxy-list/favicon.ico" },
    ],
    apple: [
      { url: "/proxy-list/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/components/I18nProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
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
    description:
      "Open-source proxy infrastructure network that collects, validates, and publishes free proxy lists using the high-concurrency Hydra Rust engine.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "technical support",
      url: "https://github.com/stormsia/proxy-list/issues",
      availableLanguage: ["English", "Russian"],
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

        <link rel="icon" type="image/svg+xml" href={`${SITE_URL}/icon.svg`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${SITE_URL}/apple-touch-icon.png`} />
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
        </I18nProvider>
      </body>
    </html>
  );
}
