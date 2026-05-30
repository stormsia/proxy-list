import { Metadata } from "next";
import ResidentialView from "@/components/views/ResidentialView";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  title: "Бесплатные Резидентные Прокси | Residential IP Proxies",
  description: "Бесплатные резидентные прокси с реальными IP-адресами от провайдеров. Более низкая вероятность блокировки. Автообновление каждые 15 минут.",
  alternates: { canonical: `${SITE_URL}/ru/residential` },
};

export default function ResidentialPage() {
  return <ResidentialView lang="ru" />;
}
