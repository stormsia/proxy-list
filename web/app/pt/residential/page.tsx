import { Metadata } from "next";
import ResidentialView from "@/components/views/ResidentialView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("pt");

export const metadata: Metadata = buildPageMetadata({
  title: dict.residential.seoHeading,
  description: dict.residential.subtitle.replace("{count}", "1,000+"),
  subpath: "residential",
  lang: "pt",
});

export default function PtResidentialPage() {
  return <ResidentialView lang="pt" />;
}
