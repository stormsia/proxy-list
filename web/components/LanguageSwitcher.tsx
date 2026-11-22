"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Locale, switchLocalePath, LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";
import { useDictionary } from "./I18nProvider";

const LANGUAGE_LABELS: Record<Locale, string> = {
  en: "🇬🇧 English",
  ru: "🇷🇺 Русский",
};

export default function LanguageSwitcher({ currentLang }: { currentLang?: Locale }) {
  const pathname = usePathname() || "/";
  const { locale } = useDictionary();
  const lang = currentLang || locale;

  const targetLang: Locale = LOCALES.find((l) => l !== lang) || DEFAULT_LOCALE;
  const label = LANGUAGE_LABELS[targetLang];
  const targetHref = switchLocalePath(pathname, targetLang);

  return (
    <Link
      href={targetHref}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 0.875rem",
        background: "rgba(139, 92, 246, 0.1)",
        borderRadius: "8px",
        fontSize: "0.875rem",
        fontWeight: 600,
        textDecoration: "none",
        color: "var(--foreground)",
        border: "1px solid rgba(139, 92, 246, 0.3)",
        marginLeft: "1rem",
        boxShadow: "0 2px 10px rgba(139, 92, 246, 0.1)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(139, 92, 246, 0.2)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      title={`Switch to ${targetLang.toUpperCase()}`}
    >
      {label}
    </Link>
  );
}
