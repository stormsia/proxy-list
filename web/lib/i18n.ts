import en from "../dictionaries/en.json";
import ru from "../dictionaries/ru.json";

export type Dictionary = typeof en;
export type Locale = "en" | "ru";

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  ru,
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  return dictionaries[locale] ?? dictionaries.en;
};

export const getDictionarySync = (locale: Locale): Dictionary => {
  return dictionaries[locale] ?? dictionaries.en;
};
