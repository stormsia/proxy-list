import { Metadata } from "next";
import ProtocolView from "@/components/views/ProtocolView";
import { getStaticProtocolParams } from "@/lib/proxies";
import { buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getStaticProtocolParams();
}

export async function generateMetadata(
  props: { params: Promise<{ protocol: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const protocol = params.protocol.toLowerCase();
  const upper = protocol.toUpperCase();

  return buildPageMetadata({
    title: `Free ${upper} Proxy List — Verified Live Endpoints (Updated Every Minute)`,
    description: `Download verified ${upper} proxy list. Tested every 60 seconds by the Hydra Rust engine with millisecond latency metrics, uptime %, and raw JSON/TXT feeds.`,
    subpath: protocol,
    lang: "en",
    keywords: [
      `free ${protocol} proxy list`,
      `${protocol} proxy download`,
      `${protocol} proxy server`,
      `fast ${protocol} proxies`,
      `working ${protocol} proxies`,
    ],
  });
}

export default async function ProtocolPage(
  props: { params: Promise<{ protocol: string }> }
) {
  const params = await props.params;
  return <ProtocolView lang="en" protocol={params.protocol} />;
}
