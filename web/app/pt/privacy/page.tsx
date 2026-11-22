import { Metadata } from "next";
import PrivacyView from "@/components/views/PrivacyView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("pt");

export const metadata: Metadata = buildPageMetadata({
  title: dict.privacy.title,
  description: dict.privacy.description,
  subpath: "privacy",
  lang: "pt",
});

export default function PtPrivacyPage() {
  return <PrivacyView lang="pt" />;
}
