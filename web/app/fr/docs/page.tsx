import { Metadata } from "next";
import DocsView from "@/components/views/DocsView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("fr");

export const metadata: Metadata = buildPageMetadata({
  title: dict.docs.headline || dict.docs.title,
  description: dict.docs.description,
  subpath: "docs",
  lang: "fr",
});

export default function FrDocsPage() {
  return <DocsView lang="fr" />;
}
