import type { Metadata } from "next";
import { I18nProvider } from "@/components/I18nProvider";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  openGraph: {
    locale: "ru_RU",
    alternateLocale: "en_US",
  },
  alternates: {
    languages: {
      en: SITE_URL,
      ru: `${SITE_URL}/ru`,
      "x-default": SITE_URL,
    },
  },
};

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ru">
      <I18nProvider locale="ru">
        {children}
      </I18nProvider>
    </div>
  );
}
