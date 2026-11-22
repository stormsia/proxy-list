import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("ar");

export const metadata: Metadata = buildPageMetadata({
  title: dict.datacenter.seoHeading,
  description: dict.datacenter.subtitle.replace("{count}", "1,000+"),
  subpath: "datacenter",
  lang: "ar",
});

export default function ArDatacenterPage() {
  return <DatacenterView lang="ar" />;
}
