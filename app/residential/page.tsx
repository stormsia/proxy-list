import { Metadata } from "next";
import ResidentialView from "@/components/views/ResidentialView";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  title: "Free Residential Proxy List | Residential IP Proxies",
  description:
    "Free residential proxies sourced from real ISP-assigned IP addresses. Lower detection rates compared to datacenter proxies. Verified automatically every 15 minutes. No registration required.",
  keywords: [
    "free residential proxies",
    "residential proxy list",
    "residential ip proxy",
    "isp proxy list",
    "real ip proxy",
  ],
  alternates: { canonical: `${SITE_URL}/residential` },
  openGraph: {
    title: "Free Residential Proxy List | stormsia/proxy-list",
    description:
      "Free residential proxies — real ISP-assigned IPs. Lower detection rates. Auto-updated every 15 minutes.",
    url: `${SITE_URL}/residential`,
  },
};

export default function ResidentialPage() {
  return <ResidentialView lang="en" />;
}
