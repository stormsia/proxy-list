import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("pt");

export const metadata: Metadata = buildPageMetadata({
  title: dict.datacenter.seoHeading,
  description: dict.datacenter.subtitle.replace("{count}", "1,000+"),
  subpath: "datacenter",
  lang: "pt",
});

export default function PtDatacenterPage() {
  return <DatacenterView lang="pt" />;
}
