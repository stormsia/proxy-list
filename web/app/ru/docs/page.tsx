import { Metadata } from "next";
import DocsView from "@/components/views/DocsView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "API и Документация — Использование прокси",
  description:
    "Как скачивать и использовать бесплатные прокси в Python, Node.js, Go. Доступ к JSON API и raw-файлам без регистрации.",
  subpath: "docs",
  lang: "ru",
  keywords: [
    "документация прокси",
    "api прокси",
    "python прокси скрипт",
    "как использовать прокси",
    "бесплатное api прокси",
  ],
});

export default function RuDocsPage() {
  return <DocsView lang="ru" />;
}
