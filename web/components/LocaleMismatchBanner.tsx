"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import styles from "./LocaleMismatchBanner.module.css";
import {
  Locale,
  LOCALES,
  SUPPORTED_LOCALES_META,
  switchLocalePath,
} from "@/lib/i18n";
import { useDictionary } from "./I18nProvider";

const PROMPT_MESSAGES: Record<
  Locale,
  { prompt: (langName: string, nativeName: string) => string; action: string; dismiss: string }
> = {
  en: {
    prompt: (name, native) => `We noticed you speak ${name}. Switch to ${native}?`,
    action: "Switch",
    dismiss: "Dismiss",
  },
  ru: {
    prompt: (_, native) => `Мы заметили, что ваш язык — ${native}. Переключить?`,
    action: "Переключить",
    dismiss: "Закрыть",
  },
  es: {
    prompt: (_, native) => `Notamos que hablas español. ¿Cambiar a ${native}?`,
    action: "Cambiar",
    dismiss: "Descartar",
  },
  zh: {
    prompt: (_, native) => `检测到您的偏好语言为 ${native}。是否切换？`,
    action: "切换",
    dismiss: "忽略",
  },
  hi: {
    prompt: (_, native) => `हमने देखा कि आप ${native} बोलते हैं। क्या बदलें?`,
    action: "बदलें",
    dismiss: "हटाएं",
  },
  ar: {
    prompt: (_, native) => `لاحظنا أن لغتك هي ${native}. هل ترغب بالتبديل؟`,
    action: "تبديل",
    dismiss: "تجاهل",
  },
  pt: {
    prompt: (_, native) => `Notamos que seu idioma é ${native}. Deseja mudar?`,
    action: "Mudar",
    dismiss: "Dispensar",
  },
  fr: {
    prompt: (_, native) => `Nous avons remarqué que vous parlez ${native}. Changer ?`,
    action: "Changer",
    dismiss: "Fermer",
  },
  bn: {
    prompt: (_, native) => `আমরা লক্ষ্য করেছি আপনার ভাষা ${native}। পরিবর্তন করবেন?`,
    action: "পরিবর্তন",
    dismiss: "বাতিল",
  },
  id: {
    prompt: (_, native) => `Kami melihat bahasa Anda ${native}. Beralih sekarang?`,
    action: "Beralih",
    dismiss: "Tutup",
  },
};

export default function LocaleMismatchBanner() {
  const pathname = usePathname() || "/";
  const { locale } = useDictionary();
  const [suggestedLocale, setSuggestedLocale] = useState<Locale | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const dismissed = localStorage.getItem("dismissed_lang_toast");
      if (dismissed) return;

      const navLangs = navigator.languages || [navigator.language];
      for (const raw of navLangs) {
        if (!raw) continue;
        const primary = raw.split("-")[0].toLowerCase();
        const match = LOCALES.find((l) => l === primary);
        if (match && match !== locale) {
          setSuggestedLocale(match);
          break;
        }
      }
    } catch {
      // Ignore in restricted environments
    }
  }, [locale]);

  if (!mounted || !suggestedLocale) {
    return null;
  }

  const meta = SUPPORTED_LOCALES_META[suggestedLocale];
  const targetHref = switchLocalePath(pathname, suggestedLocale);
  const strings = PROMPT_MESSAGES[suggestedLocale] || PROMPT_MESSAGES.en;

  const handleDismiss = () => {
    try {
      localStorage.setItem("dismissed_lang_toast", "true");
    } catch {}
    setSuggestedLocale(null);
  };

  const handleSwitch = () => {
    try {
      localStorage.setItem("dismissed_lang_toast", "true");
    } catch {}
    setSuggestedLocale(null);
  };

  return (
    <aside
      className={styles.toastContainer}
      aria-label="Language preference suggestion"
      role="region"
      dir={meta.dir || "ltr"}
    >
      <div className={styles.toastCard}>
        <div className={styles.toastHeader}>
          <span className={styles.flag} aria-hidden="true">
            {meta.flag}
          </span>
          <span className={styles.toastTitle}>{meta.name}</span>
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={handleDismiss}
            aria-label={strings.dismiss}
          >
            <X size={16} />
          </button>
        </div>

        <p className={styles.toastMessage}>
          {strings.prompt(meta.englishName, meta.name)}
        </p>

        <div className={styles.toastActions}>
          <button
            type="button"
            className={styles.skipBtn}
            onClick={handleDismiss}
          >
            {strings.dismiss}
          </button>
          <Link
            href={targetHref}
            className={styles.switchBtn}
            onClick={handleSwitch}
          >
            <span>{strings.action}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
