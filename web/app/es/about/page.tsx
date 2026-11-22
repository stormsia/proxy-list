import { Metadata } from "next";
import AboutView from "@/components/views/AboutView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("es");

export const metadata: Metadata = buildPageMetadata({
  title: dict.about.title,
  description: dict.about.description,
  subpath: "about",
  lang: "es",
});

export default function EsAboutPage() {
  return <AboutView lang="es" />;
}
