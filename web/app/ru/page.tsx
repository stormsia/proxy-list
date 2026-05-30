import HomeView from "@/components/views/HomeView";
import { Metadata } from "next";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  title: "Бесплатные Прокси | SOCKS5 · HTTP · HTTPS · SOCKS4",
  description:
    "Скачать бесплатный, обновляемый список SOCKS5, HTTP, HTTPS и SOCKS4 прокси. Все прокси проверены высокоскоростным валидатором.",
  alternates: {
    canonical: `${SITE_URL}/ru`,
    languages: {
      en: SITE_URL,
      ru: `${SITE_URL}/ru`,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    title: "Бесплатные Прокси | SOCKS5 · HTTP · HTTPS",
    description: "Автообновляемый список прокси. Проверено валидатором.",
    url: `${SITE_URL}/ru`,
    locale: "ru_RU",
    alternateLocale: "en_US",
  },
};

export default function Page() {
  return <HomeView lang="ru" />;
}
