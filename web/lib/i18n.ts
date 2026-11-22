import en from "../dictionaries/en.json";
import ru from "../dictionaries/ru.json";
import es from "../dictionaries/es.json";
import zh from "../dictionaries/zh.json";
import hi from "../dictionaries/hi.json";
import ar from "../dictionaries/ar.json";
import pt from "../dictionaries/pt.json";
import fr from "../dictionaries/fr.json";
import bn from "../dictionaries/bn.json";
import id from "../dictionaries/id.json";

export const LOCALES = [
  "en",
  "ru",
  "es",
  "zh",
  "hi",
  "ar",
  "pt",
  "fr",
  "bn",
  "id",
] as const;

export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const SITE_URL = "https://stormsia.github.io/proxy-list";

export type Dictionary = typeof en;

export interface LocaleMeta {
  code: Locale;
  name: string;        // Native name e.g. "Español", "Русский", "العربية", "中文", "हिन्दी", "Português", "Français", "বাংলা", "Bahasa Indonesia", "English"
  englishName: string; // "Spanish", "Russian", etc.
  flag: string;        // "🇪🇸", "🇷🇺", "🇨🇳", "🇸🇦", "🇮🇳", "🇵🇹", "🇫🇷", "🇧🇩", "🇮🇩", "🇬🇧"
  dir?: "ltr" | "rtl"; // "rtl" for "ar"
}

export const SUPPORTED_LOCALES_META: Record<Locale, LocaleMeta> = {
  en: { code: "en", name: "English", englishName: "English", flag: "🇬🇧", dir: "ltr" },
  ru: { code: "ru", name: "Русский", englishName: "Russian", flag: "🇷🇺", dir: "ltr" },
  es: { code: "es", name: "Español", englishName: "Spanish", flag: "🇪🇸", dir: "ltr" },
  zh: { code: "zh", name: "中文", englishName: "Chinese (Simplified)", flag: "🇨🇳", dir: "ltr" },
  hi: { code: "hi", name: "हिन्दी", englishName: "Hindi", flag: "🇮🇳", dir: "ltr" },
  ar: { code: "ar", name: "العربية", englishName: "Arabic", flag: "🇸🇦", dir: "rtl" },
  pt: { code: "pt", name: "Português", englishName: "Portuguese", flag: "🇵🇹", dir: "ltr" },
  fr: { code: "fr", name: "Français", englishName: "French", flag: "🇫🇷", dir: "ltr" },
  bn: { code: "bn", name: "বাংলা", englishName: "Bengali", flag: "🇧🇩", dir: "ltr" },
  id: { code: "id", name: "Bahasa Indonesia", englishName: "Indonesian", flag: "🇮🇩", dir: "ltr" },
};

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  ru,
  es,
  zh,
  hi,
  ar,
  pt,
  fr,
  bn,
  id,
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
};

export const getDictionarySync = (locale: Locale): Dictionary => {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
};

// Given a path like "/datacenter" or "docs", returns clean path with or without locale prefix and trailing slash
export function getLocalizedPath(pathname: string, locale: Locale): string {
  let clean = pathname.startsWith("/") ? pathname : `/${pathname}`;

  // For root path "/"
  if (clean === "/") {
    return locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
  }

  // Ensure trailing slash for directory routes, skipping static files with extensions (.json, .txt, .xml, .md)
  if (!clean.endsWith("/") && !clean.includes(".")) {
    clean = `${clean}/`;
  }

  return locale === DEFAULT_LOCALE ? clean : `/${locale}${clean}`;
}

// Generates full canonical URL for SEO
export function getCanonicalUrl(pathname: string, locale: Locale): string {
  const localized = getLocalizedPath(pathname, locale);
  const base = SITE_URL.endsWith("/") ? SITE_URL.slice(0, -1) : SITE_URL;
  return `${base}${localized}`;
}

// Language switch helper: converts any path between locales cleanly
export function switchLocalePath(currentPath: string, targetLocale: Locale): string {
  const normalized = currentPath.startsWith("/proxy-list")
    ? currentPath.slice("/proxy-list".length)
    : currentPath;
  const nonDefaultLocales = LOCALES.filter((l) => l !== DEFAULT_LOCALE).join("|");
  const regex = new RegExp(`^\\/(${nonDefaultLocales})(\\/|$)`);
  let unlocalized = normalized.replace(regex, "$2") || "/";
  if (!unlocalized.startsWith("/")) unlocalized = `/${unlocalized}`;
  return getLocalizedPath(unlocalized, targetLocale);
}
