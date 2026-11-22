import { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("hi");

export const metadata: Metadata = buildPageMetadata({
  title: dict.home.title,
  description: dict.home.description,
  lang: "hi",
});

export default function HiHomePage() {
  return <HomeView lang="hi" />;
}
