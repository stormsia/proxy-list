import { Metadata } from "next";
import DocsView from "@/components/views/DocsView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("ar");

export const metadata: Metadata = buildPageMetadata({
  title: dict.docs.headline || dict.docs.title,
  description: dict.docs.description,
  subpath: "docs",
  lang: "ar",
});

export default function ArDocsPage() {
  return <DocsView lang="ar" />;
}
