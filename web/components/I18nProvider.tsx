"use client";

import React, { createContext, useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { dictionaries, Dictionary, Locale } from "@/lib/i18n";

export interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale: forcedLocale,
  dict: forcedDict,
  children,
}: {
  locale?: Locale;
  dict?: Dictionary;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const derivedLocale: Locale =
    pathname.startsWith("/ru") || pathname.startsWith("/proxy-list/ru")
      ? "ru"
      : "en";
  const locale = forcedLocale || derivedLocale;
  const dict = forcedDict || dictionaries[locale];

  const value = useMemo(() => ({ locale, dict }), [locale, dict]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useDictionary(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (ctx) {
    return ctx;
  }
  return { locale: "en", dict: dictionaries.en };
}
