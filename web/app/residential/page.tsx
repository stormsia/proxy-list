import { Metadata } from "next";
import ResidentialView from "@/components/views/ResidentialView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Free Residential Proxy List | Residential IP Proxies",
  description:
    "Free residential proxies sourced from real ISP-assigned IP addresses. Lower detection rates compared to datacenter proxies. Verified automatically every 15 minutes. No registration required.",
  subpath: "residential",
  lang: "en",
  keywords: [
    "free residential proxies",
    "residential proxy list",
    "residential ip proxy",
    "isp proxy list",
    "real ip proxy",
  ],
});

export default function ResidentialPage() {
  return <ResidentialView lang="en" />;
}
