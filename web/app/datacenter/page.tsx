import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Datacenter Proxy List — Fast Cloud Endpoints (Updated Every Minute)",
  description:
    "Download free datacenter proxies hosted on high-speed cloud infrastructure (AWS, Hetzner, OVH, DigitalOcean). Audited every 60 seconds by Hydra with millisecond latency metrics.",
  subpath: "datacenter",
  lang: "en",
  keywords: [
    "free datacenter proxies",
    "datacenter proxy list",
    "fast datacenter proxy",
    "cloud proxy server",
    "high speed proxies",
    "bulk scraping proxies",
  ],
});

export default function DatacenterPage() {
  return <DatacenterView lang="en" />;
}
