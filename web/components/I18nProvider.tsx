"use client";

import React, { createContext, useContext, useMemo, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  dictionaries,
  Dictionary,
  Locale,
  LOCALES,
  DEFAULT_LOCALE,
  getLocalizedPath,
} from "@/lib/i18n";

export interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
  getPath: (pathname: string) => string;
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
  const cleanPath = pathname.startsWith("/proxy-list")
    ? pathname.slice("/proxy-list".length)
    : pathname;
  const segments = cleanPath.split("/").filter(Boolean);
  const matchedLocale = LOCALES.find(
    (l) => l !== DEFAULT_LOCALE && segments[0] === l
  );
  const derivedLocale: Locale = matchedLocale || DEFAULT_LOCALE;
  const locale = forcedLocale || derivedLocale;
  const dict = forcedDict || dictionaries[locale];

  const getPath = useMemo(
    () => (pathnameToLocalize: string) =>
      getLocalizedPath(pathnameToLocalize, locale),
    [locale]
  );

  const value = useMemo(
    () => ({ locale, dict, getPath }),
    [locale, dict, getPath]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useDictionary(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (ctx) {
    return ctx;
  }
  return {
    locale: DEFAULT_LOCALE,
    dict: dictionaries[DEFAULT_LOCALE],
    getPath: (pathname: string) => getLocalizedPath(pathname, DEFAULT_LOCALE),
  };
}
