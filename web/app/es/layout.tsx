import type { Metadata } from "next";
import { I18nProvider } from "@/components/I18nProvider";
import { getAlternateOgLocales, OG_LOCALES } from "@/lib/seo";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  openGraph: {
    locale: OG_LOCALES["es"],
    alternateLocale: getAlternateOgLocales("es"),
  },
  alternates: {
    canonical: `${SITE_URL}/es/`,
    languages: {
      en: `${SITE_URL}/`,
      ru: `${SITE_URL}/ru/`,
      es: `${SITE_URL}/es/`,
      zh: `${SITE_URL}/zh/`,
      hi: `${SITE_URL}/hi/`,
      ar: `${SITE_URL}/ar/`,
      pt: `${SITE_URL}/pt/`,
      fr: `${SITE_URL}/fr/`,
      bn: `${SITE_URL}/bn/`,
      id: `${SITE_URL}/id/`,
      "x-default": `${SITE_URL}/`,
    },
  },
};

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="es">
      <I18nProvider locale="es">
        {children}
      </I18nProvider>
    </div>
  );
}
