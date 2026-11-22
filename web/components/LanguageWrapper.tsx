"use client";

import { useDictionary } from "./I18nProvider";

export default function LanguageWrapper({
  en,
  ru,
}: {
  en: React.ReactNode;
  ru: React.ReactNode;
}) {
  const { locale } = useDictionary();
  return <>{locale === "ru" ? ru : en}</>;
}
