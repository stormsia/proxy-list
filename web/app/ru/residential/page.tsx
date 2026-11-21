import { Metadata } from "next";
import ResidentialView from "@/components/views/ResidentialView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Бесплатные Резидентные Прокси | Residential IP Proxies",
  description:
    "Бесплатные резидентные прокси с реальными IP-адресами от провайдеров. Более низкая вероятность блокировки. Автообновление каждые 15 минут.",
  subpath: "residential",
  lang: "ru",
  keywords: [
    "резидентные прокси",
    "домашние прокси",
    "residential proxy list",
    "isp прокси",
  ],
});

export default function RuResidentialPage() {
  return <ResidentialView lang="ru" />;
}
