import { Metadata } from "next";
import ResidentialView from "@/components/views/ResidentialView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Бесплатные Резидентные Прокси — IP Домашних Провайдеров (Обновление Каждую Минуту)",
  description:
    "Бесплатные резидентные прокси с реальными IP интернет-провайдеров (ISP). Минимальный риск блокировок. Проверка каждые 60 секунд движком Hydra.",
  subpath: "residential",
  lang: "ru",
  keywords: [
    "резидентные прокси",
    "домашние прокси",
    "residential proxy list",
    "isp прокси",
    "прокси без блокировок",
  ],
});

export default function RuResidentialPage() {
  return <ResidentialView lang="ru" />;
}
