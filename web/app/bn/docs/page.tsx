import { Metadata } from "next";
import DocsView from "@/components/views/DocsView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("bn");

export const metadata: Metadata = buildPageMetadata({
  title: dict.docs.headline || dict.docs.title,
  description: dict.docs.description,
  subpath: "docs",
  lang: "bn",
});

export default function BnDocsPage() {
  return <DocsView lang="bn" />;
}
