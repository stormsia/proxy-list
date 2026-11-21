import { Star, ExternalLink } from "lucide-react";
import styles from "./GitHubStarCard.module.css";
import { getDictionary, Locale } from "@/lib/i18n";

interface GitHubStarCardProps {
  lang: Locale;
  className?: string;
}

export default async function GitHubStarCard({ lang, className }: GitHubStarCardProps) {
  const dict = await getDictionary(lang);
  const isRu = lang === "ru";

  const starCard = (dict as Record<string, unknown>).starCard as
    | {
        badge?: string;
        title?: string;
        description?: string;
        button?: string;
      }
    | undefined;

  const badgeText =
    starCard?.badge || (isRu ? "Open-Source Сообщество" : "Open-Source Community");
  const titleText =
    starCard?.title ||
    (isRu
      ? "Помогите другим разработчикам найти проект"
      : "Help Other Developers Discover This Project");
  const descText =
    starCard?.description ||
    (isRu
      ? "Ваша звезда на GitHub поднимает репозиторий в поиске и рекомендациях, помогая другим разработчикам, авторам парсеров и AI-агентов быстрее найти надежный бесплатный пул прокси."
      : "Starring stormsia/proxy-list on GitHub boosts our visibility, making it easier for scrapers, AI agent builders, and developers worldwide to discover a reliable, live-tested proxy pool.");
  const buttonText =
    starCard?.button || (isRu ? "Поставить звезду на GitHub" : "Star on GitHub");

  return (
    <aside
      className={`${styles.starCard} ${className || ""}`}
      aria-label={isRu ? "Поддержать проект на GitHub" : "Support on GitHub"}
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
              {badgeText}
            </span>
          </div>
          <h3 className={styles.title}>{titleText}</h3>
          <p className={styles.description}>{descText}</p>
        </div>

        <div className={styles.actionCol}>
          <a
            href="https://github.com/stormsia/proxy-list"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.starButton}
          >
            <Star size={16} fill="#eab308" color="#eab308" />
            <span>{buttonText}</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </aside>
  );
}
