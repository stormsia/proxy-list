import { Metadata } from "next";
import ResidentialView from "@/components/views/ResidentialView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("hi");

export const metadata: Metadata = buildPageMetadata({
  title: dict.residential.seoHeading,
  description: dict.residential.subtitle.replace("{count}", "1,000+"),
  subpath: "residential",
  lang: "hi",
});

export default function HiResidentialPage() {
  return <ResidentialView lang="hi" />;
}
