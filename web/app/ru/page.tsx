import { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Бесплатные Прокси | SOCKS5 · HTTP · HTTPS",
  description:
    "Бесплатный список рабочих SOCKS5, HTTP и SOCKS4 прокси. Непрерывный аудит каждые 60 секунд движком Hydra, аптайм 99.8%. Готовые JSON API и TXT фиды без ключей.",
  lang: "ru",
  keywords: [
    "бесплатные прокси",
    "список прокси",
    "socks5 прокси",
    "http прокси",
    "публичные прокси",
    "чекер прокси",
    "скачать прокси бесплатно",
  ],
});

export default function RuHomePage() {
  return <HomeView lang="ru" />;
}
