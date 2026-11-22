import en from "../dictionaries/en.json";
import ru from "../dictionaries/ru.json";

export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const SITE_URL = "https://stormsia.github.io/proxy-list";

export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  ru,
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
};

export const getDictionarySync = (locale: Locale): Dictionary => {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
};

// Given a path like "/datacenter" or "docs", returns clean path with or without /ru
export function getLocalizedPath(pathname: string, locale: Locale): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (locale === DEFAULT_LOCALE) {
    return clean;
  }
  return clean === "/" ? `/${locale}` : `/${locale}${clean}`;
}

// Generates full canonical URL for SEO
export function getCanonicalUrl(pathname: string, locale: Locale): string {
  return `${SITE_URL}${getLocalizedPath(pathname, locale)}`;
}

// Language switch helper: converts any path between locales cleanly
export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const normalized = currentPath.startsWith("/proxy-list")
    ? currentPath.slice("/proxy-list".length)
    : currentPath;
  let unlocalized = normalized.replace(/^\/ru(\/|$)/, "$1") || "/";
  if (!unlocalized.startsWith("/")) unlocalized = `/${unlocalized}`;
  return getLocalizedPath(unlocalized, targetLocale);
}
