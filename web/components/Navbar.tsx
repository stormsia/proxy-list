"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Map, Terminal, Menu, X, Languages, Star } from "lucide-react";
import styles from "./Navbar.module.css";
import { useDictionary } from "./I18nProvider";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname() || "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dict, locale } = useDictionary();

  const isRuLocale = locale === "ru";
  const baseHome = isRuLocale ? "/ru" : "/";
  const baseDocs = isRuLocale ? "/ru/docs" : "/docs";

  // Toggle path for language switcher
  const getAltLangPath = () => {
    if (isRuLocale) {
      if (pathname === "/ru") return "/";
      return pathname.replace(/^\/ru/, "") || "/";
    } else {
      if (pathname === "/") return "/ru";
      return `/ru${pathname}`;
    }
  };

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const isHomeActive = isRuLocale ? pathname === "/ru" : pathname === "/";
  const isDocsActive = pathname.includes("/docs");

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.leftGroup}>
          <Link href={baseHome} className={styles.logo} aria-label="Proxy List Homepage">
            <Globe className={styles.logoIcon} size={22} />
            <span className={styles.brandTitle}>proxy-list</span>
          </Link>

          <div className={styles.liveBadge} title="Continuous 1-minute Hydra validator active">
            <span className={styles.liveDot} />
            <span className={styles.liveText}>Live</span>
          </div>

          <a
            href="https://github.com/stormsia/hydra"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hydraBadge}
            title={dict.nav.hydraTitle}
          >
            <span>⚡ Hydra</span>
          </a>
        </div>

        <nav className={styles.navLinks} aria-label="Main Navigation">
          <Link
            href={baseHome}
            className={`${styles.link} ${isHomeActive ? styles.activeLink : ""}`}
            aria-current={isHomeActive ? "page" : undefined}
          >
            <Map className={styles.icon} size={16} />
            <span>{dict.nav.dashboard}</span>
          </Link>

          <Link
            href={baseDocs}
            className={`${styles.link} ${isDocsActive ? styles.activeLink : ""}`}
            aria-current={isDocsActive ? "page" : undefined}
          >
            <Terminal className={styles.icon} size={16} />
            <span>{dict.nav.docs}</span>
          </Link>

          <Link
            href={getAltLangPath()}
            className={styles.langBtn}
            aria-label={dict.nav.langSwitchAria}
          >
            <Languages size={15} />
            <span>{dict.nav.langSwitchText}</span>
          </Link>

          <a
            href="https://github.com/stormsia/proxy-list"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.gitHubBtn}
            aria-label={dict.nav.starAria}
            title={dict.nav.starTitle}
          >
            <GitHubIcon size={15} />
            <Star size={13} className={styles.starNavIcon} fill="#eab308" color="#eab308" />
            <span className={styles.gitHubText}>{dict.nav.starText}</span>
          </a>
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          className={styles.mobileToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={`container ${styles.mobileMenuContent}`}>
            <Link
              href={baseHome}
              className={`${styles.mobileLink} ${isHomeActive ? styles.activeLink : ""}`}
            >
              <Map size={18} />
              <span>{dict.nav.dashboard}</span>
            </Link>

            <Link
              href={baseDocs}
              className={`${styles.mobileLink} ${isDocsActive ? styles.activeLink : ""}`}
            >
              <Terminal size={18} />
              <span>{dict.nav.docs}</span>
            </Link>

            <Link href={getAltLangPath()} className={styles.mobileLink}>
              <Languages size={18} />
              <span>{dict.nav.langSwitchMobile}</span>
            </Link>

            <a
              href="https://github.com/stormsia/proxy-list"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.mobileLink} ${styles.mobileStarLink}`}
            >
              <Star size={18} className={styles.starNavIcon} fill="#eab308" color="#eab308" />
              <span>{dict.nav.mobileStar}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
