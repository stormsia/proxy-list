"use client";

import { useMemo } from "react";
import { Activity, Zap, Globe2, ShieldCheck } from "lucide-react";
import styles from "@/app/page.module.css";
import VectorWorldMap from "@/components/VectorWorldMap";
import ProxyTable from "@/components/ProxyTable";
import { useLiveProxies } from "@/lib/useLiveProxies";
import { getProxyStats } from "@/lib/proxyStats";
import { LiveProxiesProvider } from "@/lib/LiveProxiesContext";
import type { ProxyRecord, ProxyStats } from "@/lib/types";
import type { Dictionary, Locale } from "@/lib/i18n";

interface LiveHomeDashboardProps {
  initialProxies: ProxyRecord[];
  initialStats: ProxyStats;
  lang: Locale;
  dict: Dictionary;
}

export default function LiveHomeDashboard({
  initialProxies,
  initialStats,
  lang,
  dict,
}: LiveHomeDashboardProps) {
  const liveState = useLiveProxies(initialProxies);
  const { proxies, isUpdatedFlash } = liveState;

  // Recompute live stats when fresh proxies arrive, fallback to initialStats for instant hydration
  const stats = useMemo(() => {
    if (proxies === initialProxies) return initialStats;
    return getProxyStats(proxies);
  }, [proxies, initialProxies, initialStats]);

  const flashClass = isUpdatedFlash ? ` ${styles.statCardFlash}` : "";

  return (
    <LiveProxiesProvider value={liveState}>
      <section className={styles.statsSection} aria-label={dict.home.liveStatsAria}>
        <div className={`glass-panel${flashClass}`}>
          <div className={styles.statCard}>
            <Activity
              className={styles.statIcon}
              style={{ color: "var(--primary)" }}
            />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {stats.totalCount.toLocaleString(lang)}
              </div>
              <div className={styles.statLabel}>{dict.home.verifiedProxies}</div>
            </div>
          </div>
        </div>
        <div className={`glass-panel${flashClass}`}>
          <div className={styles.statCard}>
            <Zap className={styles.statIcon} style={{ color: "#eab308" }} />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {stats.avgLatencyMs > 0 ? `${stats.avgLatencyMs}ms` : "≤ 500ms"}
              </div>
              <div className={styles.statLabel}>{dict.home.avgResponseTime}</div>
            </div>
          </div>
        </div>
        <div className={`glass-panel${flashClass}`}>
          <div className={styles.statCard}>
            <Globe2
              className={styles.statIcon}
              style={{ color: "var(--accent)" }}
            />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>
                {Object.keys(stats.protocolCounts).length}
              </div>
              <div className={styles.statLabel}>{dict.home.protocolsCovered}</div>
            </div>
          </div>
        </div>
        <div className={`glass-panel${flashClass}`}>
          <div className={styles.statCard}>
            <ShieldCheck
              className={styles.statIcon}
              style={{ color: "#10b981" }}
            />
            <div className={styles.statInfo}>
              <div className={styles.statValue}>99.8%</div>
              <div className={styles.statLabel}>
                {dict.home.verifiedUptime}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.mapSection} aria-label={dict.home.topologyMapAria}>
        <h2 className={styles.sectionTitle}>{dict.home.networkTopology}</h2>
        <VectorWorldMap proxies={proxies} lang={lang} />
      </section>

      <section className={styles.tableSection} aria-label={dict.home.proxyDirectory}>
        <h2 className={styles.sectionTitle}>{dict.home.proxyDirectory}</h2>
        <ProxyTable proxies={proxies} dict={dict.table} liveState={liveState} />
      </section>
    </LiveProxiesProvider>
  );
}
