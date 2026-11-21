import { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Proxy List | SOCKS5 · HTTP · HTTPS · SOCKS4",
  description:
    "Download a free, auto-updated proxy list with SOCKS5, HTTP, HTTPS and SOCKS4 proxies. Verified by a high-speed validator. Machine-readable JSON API available — no registration required.",
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
