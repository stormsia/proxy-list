import { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("zh");

export const metadata: Metadata = buildPageMetadata({
  title: dict.home.title,
  description: dict.home.description,
  lang: "zh",
});

export default function ZhHomePage() {
  return <HomeView lang="zh" />;
}
