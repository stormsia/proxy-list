import { Metadata } from "next";
import AboutView from "@/components/views/AboutView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "О проекте — Открытая прокси-инфраструктура",
  description:
    "Узнайте больше о проекте stormsia/proxy-list: открытый исходный код, движок валидации Hydra на Rust, архитектура неблокирующих сокетов и миссия надежных бесплатных прокси.",
  subpath: "about",
  lang: "ru",
  keywords: [
    "о проекте stormsia proxy-list",
    "валидатор прокси hydra rust",
    "открытые прокси списки",
    "бесплатная прокси инфраструктура",
  ],
});

export default function RuAboutPage() {
  return <AboutView lang="ru" />;
}
