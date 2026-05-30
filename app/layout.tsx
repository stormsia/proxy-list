import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
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
  ],
  authors: [{ name: "stormsia", url: "https://github.com/stormsia" }],
  creator: "stormsia",
  publisher: "stormsia",
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
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "Ilxb2F7zsbKpIgNLwUwwxbxNlrbuD6-89ZG-yCgwYbo",
  },
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LanguageWrapper from "@/components/LanguageWrapper";

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
    sameAs: ["https://github.com/stormsia/proxy-list"],
    description:
      "Open-source project that automatically collects, validates and publishes free proxy lists using an async Python daemon and a high-speed validator.",
  };

  const websiteSchema = {
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/proxy-list/sitemap.xml" />
        <link rel="help" type="text/plain" title="Robots" href="/proxy-list/robots.txt" />
        <link rel="alternate" type="text/plain" title="LLMs" href="/proxy-list/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wz3d0xan93");
          `}
        </Script>
        <div className="main-layout">
          <LanguageWrapper 
            en={<Navbar lang="en" />} 
            ru={<Navbar lang="ru" />} 
          />
          <main className="main-content">{children}</main>
          <LanguageWrapper 
            en={<Footer lang="en" />} 
            ru={<Footer lang="ru" />} 
          />
        </div>
      </body>
    </html>
  );
}
