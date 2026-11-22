"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Globe, X, Check, Sparkles } from "lucide-react";
import styles from "./LanguagePicker.module.css";
import {
  Locale,
  LOCALES,
  SUPPORTED_LOCALES_META,
  switchLocalePath,
} from "@/lib/i18n";
import { useDictionary } from "./I18nProvider";

interface LanguagePickerProps {
  currentLang?: Locale;
  className?: string;
  variant?: "button" | "menuItem";
}

export default function LanguagePicker({
  currentLang,
  className = "",
  variant = "button",
}: LanguagePickerProps) {
  const pathname = usePathname() || "/";
  const { locale } = useDictionary();
  const activeLocale = currentLang || locale;
  const currentMeta = SUPPORTED_LOCALES_META[activeLocale];

  const [isOpen, setIsOpen] = useState(false);
  const [recommendedLocales, setRecommendedLocales] = useState<Locale[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Browser language detection
  useEffect(() => {
    try {
      const navLangs = navigator.languages || [navigator.language];
      const matches: Locale[] = [];
      for (const lang of navLangs) {
        if (!lang) continue;
        const code = lang.split("-")[0].toLowerCase();
        const found = LOCALES.find((l) => l === code);
        if (found && !matches.includes(found) && found !== activeLocale) {
          matches.push(found);
        }
      }
      setRecommendedLocales(matches);
    } catch {
      // Ignore in non-browser env
    }
  }, [activeLocale]);

  // ESC to close and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const handleSelectLanguage = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.triggerBtn} ${className}`}
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Select Language, currently ${currentMeta?.name || "English"}`}
        title="Select Language / Выберите язык"
      >
        <span className={styles.triggerFlag} aria-hidden="true">
          {currentMeta?.flag || "🌐"}
        </span>
        <span className={styles.triggerName}>
          {variant === "menuItem"
            ? currentMeta?.name || "English"
            : currentMeta?.englishName || "English"}
        </span>
      </button>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
          role="presentation"
        >
          <div
            ref={modalRef}
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="language-picker-title"
          >
            <div className={styles.header}>
              <h2 id="language-picker-title" className={styles.headerTitle}>
                <Globe size={20} className={styles.activeCheck} />
                <span>Select Language</span>
              </h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="Close language selector"
              >
                <X size={18} />
              </button>
            </div>

            {recommendedLocales.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Sparkles size={12} style={{ display: "inline", marginRight: "4px" }} />
                  Recommended for you
                </h3>
                <div className={styles.grid}>
                  {recommendedLocales.map((recLocale) => {
                    const meta = SUPPORTED_LOCALES_META[recLocale];
                    const targetHref = switchLocalePath(pathname, recLocale);
                    return (
                      <Link
                        key={`rec-${recLocale}`}
                        href={targetHref}
                        className={styles.langCard}
                        onClick={handleSelectLanguage}
                      >
                        <span className={styles.flag} aria-hidden="true">
                          {meta.flag}
                        </span>
                        <div className={styles.langInfo}>
                          <span className={styles.nativeName}>{meta.name}</span>
                          <span className={styles.englishName}>{meta.englishName}</span>
                        </div>
                        <span className={styles.recommendedBadge}>Detected</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>All Languages (10)</h3>
              <div className={styles.grid}>
                {LOCALES.map((loc) => {
                  const meta = SUPPORTED_LOCALES_META[loc];
                  const isActive = loc === activeLocale;
                  const targetHref = switchLocalePath(pathname, loc);

                  return (
                    <Link
                      key={loc}
                      href={targetHref}
                      className={`${styles.langCard} ${isActive ? styles.activeCard : ""}`}
                      onClick={handleSelectLanguage}
                      aria-current={isActive ? "true" : undefined}
                      dir={meta.dir || "ltr"}
                    >
                      <span className={styles.flag} aria-hidden="true">
                        {meta.flag}
                      </span>
                      <div className={styles.langInfo}>
                        <span className={styles.nativeName}>{meta.name}</span>
                        <span className={styles.englishName}>{meta.englishName}</span>
                      </div>
                      {isActive && (
                        <Check size={18} className={styles.activeCheck} aria-hidden="true" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
