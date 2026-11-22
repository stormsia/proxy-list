import { Metadata } from "next";
import PrivacyView from "@/components/views/PrivacyView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("ar");

export const metadata: Metadata = buildPageMetadata({
  title: dict.privacy.title,
  description: dict.privacy.description,
  subpath: "privacy",
  lang: "ar",
});

export default function ArPrivacyPage() {
  return <PrivacyView lang="ar" />;
}
