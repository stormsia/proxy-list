import { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Бесплатные Прокси | SOCKS5 · HTTP · HTTPS · SOCKS4",
  description:
    "Скачать бесплатный, обновляемый список SOCKS5, HTTP, HTTPS и SOCKS4 прокси. Все прокси проверены высокоскоростным валидатором.",
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
