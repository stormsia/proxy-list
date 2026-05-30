import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  title: "Free Datacenter Proxy List | Fast DC Proxy Servers",
  description:
    "Free datacenter proxy list featuring high-bandwidth, low-latency IPs from cloud providers. Ideal for bulk scraping, API polling, and automated testing. Verified every 15 minutes by a validator.",
  keywords: [
    "free datacenter proxies",
    "datacenter proxy list",
    "cheap datacenter proxy",
    "fast datacenter proxy",
    "cloud proxy server",
  ],
  alternates: { canonical: `${SITE_URL}/datacenter` },
  openGraph: {
    title: "Free Datacenter Proxy List | stormsia/proxy-list",
    description:
      "Fast datacenter proxies — cloud-hosted IPs with high bandwidth. Auto-updated every 15 minutes.",
    url: `${SITE_URL}/datacenter`,
  },
};

export default function DatacenterPage() {
  return <DatacenterView lang="en" />;
}
