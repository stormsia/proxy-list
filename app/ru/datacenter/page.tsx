import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  title: "Бесплатные Датацентр Прокси | Серверные Прокси",
  description: "Бесплатный список серверных (датацентр) прокси. Высокая скорость и низкая задержка. Идеально для массового парсинга. Обновляется каждые 15 минут.",
  alternates: { canonical: `${SITE_URL}/ru/datacenter` },
};

export default function DatacenterPage() {
  return <DatacenterView lang="ru" />;
}
