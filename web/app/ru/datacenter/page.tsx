import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Бесплатные Серверные (Датацентр) Прокси — Обновление Каждую Минуту",
  description:
    "Бесплатный список проверенных датацентр-прокси (AWS, Hetzner, DigitalOcean, OVH). Проверка каждые 60 секунд движком Hydra с замером RTT и аптайма.",
  subpath: "datacenter",
  lang: "ru",
  keywords: [
    "серверные прокси",
    "датацентр прокси",
    "datacenter proxy list",
    "быстрые прокси",
    "прокси для парсинга",
  ],
});

export default function RuDatacenterPage() {
  return <DatacenterView lang="ru" />;
}
