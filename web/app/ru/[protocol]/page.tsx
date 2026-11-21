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
    title: `Бесплатные ${upper} Прокси — Рабочий Список (Обновление Каждую Минуту)`,
    description: `Актуальный список проверенных ${upper} прокси. Непрерывный аудит каждые 60 секунд движком Hydra: замеры RTT, аптайм, текстовые списки и JSON фид.`,
    subpath: protocol,
    lang: "ru",
    keywords: [
      `${protocol} прокси бесплатно`,
      `список ${protocol} прокси`,
      `${protocol} proxy list`,
      `free ${protocol} proxy`,
      `рабочие ${protocol} прокси`,
    ],
  });
}

export default async function RuProtocolPage(
  props: { params: Promise<{ protocol: string }> }
) {
  const params = await props.params;
  return <ProtocolView lang="ru" protocol={params.protocol} />;
}
