"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Check } from "lucide-react";
import styles from "./LiveSyncIndicator.module.css";
import { useDictionary } from "./I18nProvider";

export interface LiveSyncIndicatorProps {
  secondsLeft: number;
  isSyncing: boolean;
  isUpdatedFlash: boolean;
  onSyncNow: () => void;
}

export default function LiveSyncIndicator({
  secondsLeft,
  isSyncing,
  isUpdatedFlash,
  onSyncNow,
}: LiveSyncIndicatorProps) {
  const [mounted, setMounted] = useState(false);
  const { dict } = useDictionary();
  const t = dict.liveSync;

  useEffect(() => {
    setMounted(true);
  }, []);

  const tooltipText = isSyncing
    ? t.tooltipSyncing
    : t.tooltipCountdown.replace("{seconds}", String(secondsLeft));

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
          t.syncing
        ) : isUpdatedFlash ? (
          t.updated
        ) : !mounted ? (
          t.liveDefault
        ) : (
          `${t.livePrefix} ${secondsLeft}${t.secSuffix}`
        )}
      </span>
    </button>
  );
}
