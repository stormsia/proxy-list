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
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Proxy List | stormsia/proxy-list",
    description:
      "Open-source, auto-updated proxy list. SOCKS5, HTTP, HTTPS, SOCKS4. Verified by async validator. JSON API available.",
    creator: "@stormsia",
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
    sameAs: [
      "https://github.com/stormsia/proxy-list",
      "https://github.com/stormsia/hydra",
      `${SITE_URL}/llms.txt`,
      `${SITE_URL}/.well-known/ai-catalog.json`,
    ],
    description:
      "Open-source proxy infrastructure network that collects, validates, and publishes free proxy lists using the high-concurrency Hydra Rust engine.",
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
        <div className="main-layout">
          <Navbar />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
