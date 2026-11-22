"use client";

import LanguagePicker from "./LanguagePicker";
import { Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ currentLang }: { currentLang?: Locale }) {
  return <LanguagePicker currentLang={currentLang} />;
}
