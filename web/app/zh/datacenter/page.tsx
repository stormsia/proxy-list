import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("zh");

export const metadata: Metadata = buildPageMetadata({
  title: dict.datacenter.seoHeading,
  description: dict.datacenter.subtitle.replace("{count}", "1,000+"),
  subpath: "datacenter",
  lang: "zh",
});

export default function ZhDatacenterPage() {
  return <DatacenterView lang="zh" />;
}
