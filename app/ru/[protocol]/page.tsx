import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import ProtocolView from "@/components/views/ProtocolView";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public", "proxies.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const proxies = JSON.parse(fileContents);

  const protocols = new Set<string>(["socks5", "socks4", "http", "https"]);

  proxies.forEach((p: any) => {
    if (p.protocol) {
      protocols.add(p.protocol.toLowerCase());
    }
  });

  return Array.from(protocols).map((protocol) => ({ protocol }));
}

export async function generateMetadata(
  props: { params: Promise<{ protocol: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const protocol = params.protocol.toLowerCase();

  return {
    title: `Бесплатные ${protocol.toUpperCase()} Прокси | Рабочие списки ${protocol.toUpperCase()}`,
    description: `Бесплатный список ${protocol.toUpperCase()} прокси. Проверено валидатором. Обновляется каждые 15 минут.`,
    keywords: [
      `${protocol} прокси бесплатно`,
      `список ${protocol} прокси`,
      `${protocol} proxy list`,
      `free ${protocol} proxy`,
    ],
    alternates: {
      canonical: `${SITE_URL}/ru/${protocol}`,
      languages: {
        en: `${SITE_URL}/${protocol}`,
        ru: `${SITE_URL}/ru/${protocol}`,
        "x-default": `${SITE_URL}/${protocol}`,
      },
    },
    openGraph: {
      title: `Бесплатные ${protocol.toUpperCase()} Прокси`,
      description: `Автообновляемый список ${protocol.toUpperCase()} прокси.`,
      url: `${SITE_URL}/ru/${protocol}`,
      locale: "ru_RU",
      alternateLocale: "en_US",
    },
  };
}

export default async function ProtocolPage(
  props: { params: Promise<{ protocol: string }> }
) {
  const params = await props.params;
  const protocol = params.protocol.toLowerCase();

  return <ProtocolView lang="ru" protocol={protocol} />;
}
