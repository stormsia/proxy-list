import type { Metadata } from "next";

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
    },
  },
};

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ru">
      {children}
    </div>
  );
}
