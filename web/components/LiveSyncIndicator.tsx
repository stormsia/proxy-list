"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Check } from "lucide-react";
import styles from "./LiveSyncIndicator.module.css";

export interface LiveSyncIndicatorProps {
  secondsLeft: number;
  isSyncing: boolean;
  isUpdatedFlash: boolean;
  onSyncNow: () => void;
  isRu?: boolean;
}

export default function LiveSyncIndicator({
  secondsLeft,
  isSyncing,
  isUpdatedFlash,
  onSyncNow,
  isRu = false,
}: LiveSyncIndicatorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tooltipText = isRu
    ? isSyncing
      ? "Синхронизация с базой проверенных прокси Hydra..."
      : `Автообновление пула через ${secondsLeft}с. Нажмите для мгновенной синхронизации.`
    : isSyncing
    ? "Syncing with Hydra verified proxy pool..."
    : `Auto-updating pool in ${secondsLeft}s. Click for immediate sync.`;

  let pillClass = styles.liveSyncPill;
  if (isSyncing) {
    pillClass += ` ${styles.liveSyncPillSyncing}`;
  } else if (isUpdatedFlash) {
    pillClass += ` ${styles.liveSyncPillUpdated}`;
  }

  return (
    <button
      type="button"
      className={pillClass}
      onClick={onSyncNow}
      disabled={isSyncing}
      title={tooltipText}
      aria-label={tooltipText}
      role="status"
    >
      {isSyncing ? (
        <RefreshCw size={12} className={styles.spin} />
      ) : isUpdatedFlash ? (
        <Check size={12} className={styles.iconUpdated} />
      ) : (
        <div className={styles.dotWrapper} aria-hidden="true">
          <div className={styles.pulseRing} />
          <div className={styles.pulseDot} />
        </div>
      )}

      <span className={styles.timerText}>
        {isSyncing ? (
          isRu ? "Синхронизация..." : "Syncing..."
        ) : isUpdatedFlash ? (
          isRu ? "Обновлено!" : "Updated!"
        ) : !mounted ? (
          isRu ? "Live · 60с" : "Live · 60s"
        ) : (
          `${isRu ? "Live ·" : "Live ·"} ${secondsLeft}${isRu ? "с" : "s"}`
        )}
      </span>
    </button>
  );
}
