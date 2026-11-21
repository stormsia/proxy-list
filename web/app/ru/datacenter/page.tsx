import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Бесплатные Датацентр Прокси | Серверные Прокси",
  description:
    "Бесплатный список серверных (датацентр) прокси. Высокая скорость и низкая задержка. Идеально для массового парсинга. Обновляется каждые 15 минут.",
  subpath: "datacenter",
  lang: "ru",
  keywords: [
    "серверные прокси",
    "датацентр прокси",
    "datacenter proxy list",
    "быстрые прокси",
  ],
});

export default function RuDatacenterPage() {
  return <DatacenterView lang="ru" />;
}
