import { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("es");

export const metadata: Metadata = buildPageMetadata({
  title: dict.home.title,
  description: dict.home.description,
  lang: "es",
});

export default function EsHomePage() {
  return <HomeView lang="es" />;
}
