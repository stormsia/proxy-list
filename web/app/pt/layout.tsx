import type { Metadata } from "next";
import { I18nProvider } from "@/components/I18nProvider";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  openGraph: {
    locale: "pt_PT",
    alternateLocale: "en_US",
  },
  alternates: {
    languages: {
      en: SITE_URL,
      ru: `${SITE_URL}/ru`,
      es: `${SITE_URL}/es`,
      zh: `${SITE_URL}/zh`,
      hi: `${SITE_URL}/hi`,
      ar: `${SITE_URL}/ar`,
      pt: `${SITE_URL}/pt`,
      fr: `${SITE_URL}/fr`,
      bn: `${SITE_URL}/bn`,
      id: `${SITE_URL}/id`,
      "x-default": SITE_URL,
    },
  },
};

export default function PtLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="pt" dir="ltr">
      <I18nProvider locale="pt">
        {children}
      </I18nProvider>
    </div>
  );
}
