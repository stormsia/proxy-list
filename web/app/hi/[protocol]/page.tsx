import { Metadata } from "next";
import ProtocolView from "@/components/views/ProtocolView";
import { getStaticProtocolParams } from "@/lib/proxies";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

export async function generateStaticParams() {
  return getStaticProtocolParams();
}

export async function generateMetadata(
  props: { params: Promise<{ protocol: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const protocol = params.protocol.toLowerCase();
  const upper = protocol.toUpperCase();
  const dict = getDictionarySync("hi");

  return buildPageMetadata({
    title: `${dict.protocol.titlePrefix} ${upper} ${dict.protocol.titleSuffix}`,
    description: dict.protocol.subtitle.replace("{protocol}", upper),
    subpath: protocol,
    lang: "hi",
  });
}

export default async function HiProtocolPage(
  props: { params: Promise<{ protocol: string }> }
) {
  const params = await props.params;
  return <ProtocolView lang="hi" protocol={params.protocol} />;
}
