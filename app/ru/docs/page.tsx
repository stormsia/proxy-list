import DocsView from "@/components/views/DocsView";
import { Metadata } from "next";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  title: "API и Документация — Использование прокси",
  description:
    "Как скачивать и использовать бесплатные прокси в Python, Node.js, Go. Доступ к JSON API и raw-файлам без регистрации.",
  alternates: {
    canonical: `${SITE_URL}/ru/docs`,
    languages: {
      en: `${SITE_URL}/docs`,
      ru: `${SITE_URL}/ru/docs`,
      "x-default": `${SITE_URL}/docs`,
    },
  },
  openGraph: {
    title: "API и Документация | stormsia/proxy-list",
    description: "Как скачивать бесплатные прокси в Python, Node.js, Go.",
    url: `${SITE_URL}/ru/docs`,
    locale: "ru_RU",
    alternateLocale: "en_US",
  },
};

export default function DocsPage() {
  return <DocsView lang="ru" />;
}
