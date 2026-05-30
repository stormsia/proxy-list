"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Locale } from "@/lib/i18n";

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();

  // Simple path toggler:
  // If we are at /ru/docs, en -> /docs
  // If we are at /docs, ru -> /ru/docs
  const togglePath = () => {
    if (!pathname) return "/";
    if (currentLang === "ru") {
      // Remove /ru prefix
      if (pathname === "/ru") return "/";
      return pathname.replace(/^\/ru\//, "/") || "/";
    } else {
      // Add /ru prefix
      if (pathname === "/") return "/ru";
      return `/ru${pathname}`;
    }
  };

  const targetLang = currentLang === "en" ? "ru" : "en";
  const label = currentLang === "en" ? "🇷🇺 Русский" : "🇬🇧 English";

  return (
    <Link
      href={togglePath()}
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
        transition: "all 0.2s ease"
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
