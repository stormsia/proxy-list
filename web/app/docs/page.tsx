import { Metadata } from "next";
import DocsView from "@/components/views/DocsView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Docs & API — Fetch Proxies Programmatically",
  description:
    "Complete developer documentation for stormsia/proxy-list. Learn how to download and integrate free proxies using Python, Node.js, Go, cURL, and the GitHub REST API. JSON schema reference included.",
  subpath: "docs",
  lang: "en",
  keywords: [
    "proxy list api",
    "download proxy list python",
    "socks5 proxy python script",
    "free proxy api",
    "proxy list json",
    "how to use proxy list",
  ],
});

export default function DocsPage() {
  return <DocsView lang="en" />;
}
