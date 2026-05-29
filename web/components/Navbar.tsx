import Link from "next/link";
import { Globe, Map, FileCode2, Terminal } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <Globe className={styles.logoIcon} />
          <span className="text-gradient">proxy-list</span>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.link}>
            <Map className={styles.icon} size={18} />
            Dashboard
          </Link>
          <Link href="/docs" className={styles.link}>
            <Terminal className={styles.icon} size={18} />
            Docs & API
          </Link>
          <a href="https://github.com/stormsia/proxy-list" target="_blank" rel="noopener noreferrer" className={styles.exportBtn}>
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
