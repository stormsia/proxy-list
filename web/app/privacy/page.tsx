import { Metadata } from "next";
import PrivacyView from "@/components/views/PrivacyView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy — Zero Personal Data Collection",
  description:
    "Review our transparent Privacy Policy: zero-log architecture, no tracking cookies, public proxy security disclosures, and telemetry provenance.",
  subpath: "privacy",
  lang: "en",
  keywords: [
    "proxy list privacy policy",
    "zero log proxy service",
    "public proxy security",
  ],
});

export default function PrivacyPage() {
  return <PrivacyView lang="en" />;
}
