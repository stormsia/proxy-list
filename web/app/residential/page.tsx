import { Metadata } from "next";
import ResidentialView from "@/components/views/ResidentialView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Residential Proxy List — Verified ISP Endpoints (Updated Every Minute)",
  description:
    "Free residential proxy list sourced from genuine ISP consumer connections. Lower block rates for web scraping. Audited every 60 seconds by Hydra with millisecond latency metrics.",
  subpath: "residential",
  lang: "en",
  keywords: [
    "free residential proxies",
    "residential proxy list",
    "residential ip proxy",
    "isp proxy list",
    "real ip proxy",
    "anti bot proxies",
  ],
});

export default function ResidentialPage() {
  return <ResidentialView lang="en" />;
}
