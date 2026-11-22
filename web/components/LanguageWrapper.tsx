"use client";

import { useDictionary } from "./I18nProvider";
import { Locale } from "@/lib/i18n";

export default function LanguageWrapper({
  en,
  ru,
}: {
  en: React.ReactNode;
  ru: React.ReactNode;
}) {
  const { locale } = useDictionary();
  const content: Partial<Record<Locale, React.ReactNode>> = { en, ru };
  return <>{content[locale] ?? en}</>;
}
