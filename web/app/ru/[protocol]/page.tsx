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
    title: `Бесплатные ${upper} Прокси | Рабочие списки ${upper}`,
    description: `Бесплатный список ${upper} прокси. Проверено валидатором. Обновляется каждые 15 минут.`,
    subpath: protocol,
    lang: "ru",
    keywords: [
      `${protocol} прокси бесплатно`,
      `список ${protocol} прокси`,
      `${protocol} proxy list`,
      `free ${protocol} proxy`,
    ],
  });
}

export default async function RuProtocolPage(
  props: { params: Promise<{ protocol: string }> }
) {
  const params = await props.params;
  return <ProtocolView lang="ru" protocol={params.protocol} />;
}
