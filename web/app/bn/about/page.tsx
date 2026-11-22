import { Metadata } from "next";
import AboutView from "@/components/views/AboutView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("bn");

export const metadata: Metadata = buildPageMetadata({
  title: dict.about.title,
  description: dict.about.description,
  subpath: "about",
  lang: "bn",
});

export default function BnAboutPage() {
  return <AboutView lang="bn" />;
}
