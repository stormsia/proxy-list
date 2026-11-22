import { Star, ExternalLink } from "lucide-react";
import styles from "./GitHubStarCard.module.css";
import { getDictionary, Locale } from "@/lib/i18n";

interface GitHubStarCardProps {
  lang: Locale;
  className?: string;
}

export default async function GitHubStarCard({ lang, className }: GitHubStarCardProps) {
  const dict = await getDictionary(lang);
  const starCard = dict.starCard;

  return (
    <aside
      className={`${styles.starCard} ${className || ""}`}
      aria-label={starCard.ariaLabel}
    >
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.content}>
        <div className={styles.iconCol}>
          <div className={styles.iconCircle}>
            <Star
              className={styles.starIcon}
              size={28}
              fill="#eab308"
              color="#eab308"
            />
          </div>
        </div>

        <div className={styles.textCol}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>
              <Star size={11} fill="#eab308" color="#eab308" />
              {starCard.badge}
            </span>
          </div>
          <h3 className={styles.title}>{starCard.title}</h3>
          <p className={styles.description}>{starCard.description}</p>
        </div>

        <div className={styles.actionCol}>
          <a
            href="https://github.com/stormsia/proxy-list"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.starButton}
          >
            <Star size={16} fill="#eab308" color="#eab308" />
            <span>{starCard.button}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </aside>
  );
}
