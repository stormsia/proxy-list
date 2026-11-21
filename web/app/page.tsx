import { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Proxy List | SOCKS5 · HTTP · HTTPS · SOCKS4",
  description:
    "Free auto-updated proxy list: verified SOCKS5, HTTP, HTTPS & SOCKS4 proxies. Audited every 60s by Hydra with 99.8% uptime SLA. Zero-auth JSON API.",
  lang: "en",
  keywords: [
    "free proxy list",
    "socks5 proxy list",
    "http proxy list",
    "public proxies",
    "free socks5 proxy",
    "anonymous proxy server",
    "proxy checker",
    "free proxy download",
  ],
});

export default function HomePage() {
  return <HomeView lang="en" />;
}
