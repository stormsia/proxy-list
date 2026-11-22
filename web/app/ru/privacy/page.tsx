import { Metadata } from "next";
import PrivacyView from "@/components/views/PrivacyView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Политика конфиденциальности",
  description:
    "Политика конфиденциальности проекта stormsia/proxy-list: нулевой сбор данных, отсутствие трекеров, безопасность использования публичных прокси и техническая телеметрия.",
  subpath: "privacy",
  lang: "ru",
  keywords: [
    "политика конфиденциальности прокси",
    "безопасность публичных прокси",
    "zero log прокси",
  ],
});

export default function RuPrivacyPage() {
  return <PrivacyView lang="ru" />;
}
