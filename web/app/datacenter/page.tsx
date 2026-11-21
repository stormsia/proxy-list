import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Datacenter Proxy List | Fast DC Proxy Servers",
  description:
    "Free datacenter proxy list featuring high-bandwidth, low-latency IPs from cloud providers. Ideal for bulk scraping, API polling, and automated testing. Verified every 15 minutes by a validator.",
  subpath: "datacenter",
  lang: "en",
  keywords: [
    "free datacenter proxies",
    "datacenter proxy list",
    "cheap datacenter proxy",
    "fast datacenter proxy",
    "cloud proxy server",
  ],
});

export default function DatacenterPage() {
  return <DatacenterView lang="en" />;
}
