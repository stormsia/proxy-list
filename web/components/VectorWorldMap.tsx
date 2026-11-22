"use client";

import { useState, useMemo, useRef, useEffect, MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Globe,
  Radio,
  Zap,
  Activity,
  ArrowRight,
  X,
  Share2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import styles from "./VectorWorldMap.module.css";
import { WORLD_LAND_PATH } from "@/lib/worldLandmass";
import { getCountryDisplayName, getCountryCoordinates } from "@/lib/countries";
import type { ProxyRecord } from "@/lib/types";
import { Locale } from "@/lib/i18n";
import { useDictionary } from "./I18nProvider";

interface VectorWorldMapProps {
  proxies: ProxyRecord[];
  lang?: Locale;
}

interface CountryCluster {
  code: string;
  name: string;
  x: number;
  y: number;
  count: number;
  protocols: Record<string, number>;
  avgLatency: number;
  sampleProxy: string;
  sharePercent: number;
  rank: number;
}

// Equirectangular projection mapping WGS84 lat/long to a 1000x500 canvas
function projectCoords(lat: number, lon: number): [number, number] {
  const x = ((lon + 180) * 1000) / 360;
  const y = ((90 - lat) * 500) / 180;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// Curvature offsets for elegant arched great-circle transit lines
function getArcPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  curvature = 0.16
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return "";

  // Midpoint with upward arch
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const cx = mx - dy * curvature;
  const cy = my + dx * curvature * 0.45;

  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export default function VectorWorldMap({ proxies, lang }: VectorWorldMapProps) {
  const router = useRouter();
  const { dict: globalDict, locale: ctxLocale } = useDictionary();
  const currentLocale = lang || ctxLocale;
  const dict = globalDict.map;
  const prefix = currentLocale === "ru" ? "/ru" : "";

  const [activeProtocol, setActiveProtocol] = useState<string>("all");
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [hoveredCluster, setHoveredCluster] = useState<CountryCluster | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<CountryCluster | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect coarse pointer / touch screens
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(hover: none), (pointer: coarse)");
      setIsTouchDevice(mq.matches);
      const listener = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
      mq.addEventListener?.("change", listener);
      return () => mq.removeEventListener?.("change", listener);
    }
  }, []);

  // 1. Filter proxies by protocol
  const filteredProxies = useMemo(() => {
    if (activeProtocol === "all") return proxies;
    const p = activeProtocol.toLowerCase();
    if (p === "https") {
      return proxies.filter((item) => item.supports_https || item.protocol === "https");
    }
    return proxies.filter((item) => (item.protocol || "").toLowerCase() === p);
  }, [proxies, activeProtocol]);

  // 2. Aggregate clusters per country with ISO code coordinates
  const clusters = useMemo(() => {
    const map = new Map<
      string,
      {
        count: number;
        protocols: Record<string, number>;
        totalLatency: number;
        latencyCount: number;
        sample: string;
      }
    >();

    for (const p of filteredProxies) {
      const code = (p.country || "").toLowerCase();
      if (!code || code === "--") continue;

      const existing = map.get(code) || {
        count: 0,
        protocols: {},
        totalLatency: 0,
        latencyCount: 0,
        sample: `${(p.protocol || "http").toLowerCase()}://${p.ip}:${p.port}`,
      };

      existing.count++;
      const proto = (p.protocol || "http").toLowerCase();
      existing.protocols[proto] = (existing.protocols[proto] || 0) + 1;

      if (typeof p.rtt_total_ms === "number" && p.rtt_total_ms > 0) {
        existing.totalLatency += p.rtt_total_ms;
        existing.latencyCount++;
      } else if (typeof p.timeout === "number" && p.timeout > 0) {
        existing.totalLatency += p.timeout * 1000;
        existing.latencyCount++;
      }

      map.set(code, existing);
    }

    const totalProxies = filteredProxies.length || 1;
    const list: CountryCluster[] = [];

    map.forEach((data, code) => {
      const coords = getCountryCoordinates(code);
      if (!coords) return;

      const [x, y] = projectCoords(coords[0], coords[1]);
      const avgLatency = data.latencyCount > 0 ? Math.round(data.totalLatency / data.latencyCount) : 0;
      const name = getCountryDisplayName(code, code.toUpperCase(), currentLocale);
      const sharePercent = Math.round((data.count / totalProxies) * 1000) / 10;

      list.push({
        code,
        name,
        x,
        y,
        count: data.count,
        protocols: data.protocols,
        avgLatency,
        sampleProxy: data.sample,
        sharePercent,
        rank: 0,
      });
    });

    list.sort((a, b) => b.count - a.count);
    list.forEach((c, i) => {
      c.rank = i + 1;
    });

    return list;
  }, [filteredProxies, currentLocale]);

  // Total telemetry aggregates
  const totalMappedNodes = useMemo(
    () => clusters.reduce((acc, c) => acc + c.count, 0),
    [clusters]
  );
  const totalCountries = clusters.length;
  const topCluster = clusters[0] || null;

  const overallAvgLatency = useMemo(() => {
    const latencies = clusters.filter((c) => c.avgLatency > 0);
    if (latencies.length === 0) return 0;
    const sum = latencies.reduce((acc, c) => acc + c.avgLatency, 0);
    return Math.round(sum / latencies.length);
  }, [clusters]);

  // Dynamic backbone transit routes interconnecting key regional hubs
  const backboneRoutes = useMemo(() => {
    if (!showRoutes || clusters.length < 2) return [];

    // Focus backbone transit on top 14 hubs
    const topHubs = clusters.slice(0, 14);
    const routes: { id: string; d: string; latencyClass: string }[] = [];

    // Star connections from #1 hub to other top hubs
    const primary = topHubs[0];
    for (let i = 1; i < Math.min(topHubs.length, 9); i++) {
      const target = topHubs[i];
      const d = getArcPath(primary.x, primary.y, target.x, target.y, 0.14);
      if (d) {
        routes.push({
          id: `primary-${primary.code}-${target.code}`,
          d,
          latencyClass: target.avgLatency < 120 ? styles.routeFast : styles.routeNormal,
        });
      }
    }

    // Inter-regional transatlantic/transpacific bridge lines
    for (let i = 1; i < Math.min(topHubs.length, 6); i++) {
      const next = topHubs[i + 1] || topHubs[1];
      const d = getArcPath(topHubs[i].x, topHubs[i].y, next.x, next.y, -0.12);
      if (d) {
        routes.push({
          id: `inter-${topHubs[i].code}-${next.code}`,
          d,
          latencyClass: styles.routeSecondary,
        });
      }
    }

    return routes;
  }, [clusters, showRoutes]);

  // Determine active cluster for docked HUD: hovered first, then selected, else top hub
  const activeCluster = hoveredCluster || selectedCluster;

  // Interaction handlers
  const handleMouseEnter = (cluster: CountryCluster, e: MouseEvent<SVGGElement>) => {
    if (isTouchDevice) return;
    setHoveredCluster(cluster);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      setTooltipPos({ x: clientX, y: clientY });
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setHoveredCluster(null);
      setTooltipPos(null);
    }
  };

  const handleNodeClick = (cluster: CountryCluster, e: MouseEvent) => {
    e.stopPropagation();
    if (isTouchDevice) {
      setSelectedCluster((prev) => (prev?.code === cluster.code ? null : cluster));
    } else {
      router.push(`${prefix}/country/${cluster.code.toLowerCase()}`);
    }
  };

  const handleSvgClick = () => {
    if (selectedCluster) {
      setSelectedCluster(null);
    }
  };

  const handleNodeKeyDown = (cluster: CountryCluster, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isTouchDevice) {
        setSelectedCluster((prev) => (prev?.code === cluster.code ? null : cluster));
      } else {
        router.push(`${prefix}/country/${cluster.code.toLowerCase()}`);
      }
    }
  };

  return (
    <div className={styles.mapContainer} ref={containerRef}>
      {/* Map Header Toolbar */}
      <div className={styles.mapHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.mapTitle}>
            <span className={styles.beaconDot} aria-hidden="true" />
            <Globe size={17} className={styles.titleIcon} />
            <span className={styles.titleText}>
              {dict.title}
            </span>
          </div>

          <div className={styles.headerPills}>
            <div className={styles.statPill}>
              <Activity size={12} className={styles.pillIcon} />
              <strong className={styles.statValue}>{totalMappedNodes}</strong>
              <span className={styles.statLabel}>{dict.nodes}</span>
            </div>

            <div className={styles.statPill}>
              <Radio size={12} className={styles.pillIcon} />
              <strong className={styles.statValue}>{totalCountries}</strong>
              <span className={styles.statLabel}>{dict.countries}</span>
            </div>

            {overallAvgLatency > 0 && (
              <div className={styles.statPill} title={dict.avgLatencyTitle}>
                <Zap size={12} className={styles.pillIcon} style={{ color: "#38bdf8" }} />
                <strong className={styles.statValue}>{overallAvgLatency}</strong>
                <span className={styles.statLabel}>ms</span>
              </div>
            )}

            {topCluster && (
              <div
                className={`${styles.statPill} ${styles.topHubPill}`}
                title={dict.primaryHubTitle.replace("{name}", topCluster.name)}
              >
                <span className={styles.hubCrown}>👑</span>
                <span className={styles.hubName}>{topCluster.name}</span>
                <span className={styles.hubCount}>({topCluster.count})</span>
              </div>
            )}
          </div>
        </div>

        {/* Controls: Protocol filters & Transit Routes toggle */}
        <div className={styles.headerRight}>
          <button
            type="button"
            className={`${styles.toggleRoutesBtn} ${showRoutes ? styles.toggleRoutesActive : ""}`}
            onClick={() => setShowRoutes(!showRoutes)}
            title={dict.routesTitle}
            aria-pressed={showRoutes}
          >
            <Share2 size={13} />
            <span>{dict.routes}</span>
          </button>

          <div className={styles.filterGroup}>
            {(["all", "socks5", "http", "socks4"] as const).map((proto) => (
              <button
                key={proto}
                type="button"
                className={`${styles.filterBtn} ${activeProtocol === proto ? styles.filterBtnActive : ""}`}
                onClick={() => setActiveProtocol(proto)}
              >
                {proto === "all" ? dict.all : proto.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive SVG Surface */}
      <div className={styles.svgWrapper} onMouseLeave={handleMouseLeave} onClick={handleSvgClick}>
        <svg
          viewBox="0 0 1000 500"
          className={styles.mapSvg}
          role="img"
          aria-label={dict.title}
        >
          <defs>
            {/* Subtle matrix grid pattern */}
            <pattern id="worldGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.025)"
                strokeWidth="0.75"
              />
            </pattern>

            {/* Neon radial glow gradients for hubs */}
            <radialGradient id="hubGlowEmerald" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hubGlowCyan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hubGlowViolet" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#a855f7" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Deep cyber dark ocean background */}
          <rect width="1000" height="500" className={styles.oceanBg} />
          <rect width="1000" height="500" fill="url(#worldGrid)" />

          {/* Graticule meridians / parallels */}
          <g className={styles.graticules}>
            <line x1="0" y1="250" x2="1000" y2="250" className={styles.equatorLine} />
            <line x1="500" y1="0" x2="500" y2="500" className={styles.meridianLine} />
            <line x1="0" y1="125" x2="1000" y2="125" className={styles.parallelLine} />
            <line x1="0" y1="375" x2="1000" y2="375" className={styles.parallelLine} />
          </g>

          {/* Continental landmasses */}
          <g className={styles.landmassGroup}>
            <path
              d={WORLD_LAND_PATH}
              className={styles.landmass}
            />
          </g>

          {/* Great-circle backbone transit paths */}
          {showRoutes && (
            <g className={styles.routesGroup}>
              {backboneRoutes.map((route) => (
                <path
                  key={route.id}
                  d={route.d}
                  fill="none"
                  className={`${styles.routePath} ${route.latencyClass}`}
                />
              ))}
            </g>
          )}

          {/* Active country cluster nodes */}
          <g className={styles.nodesGroup}>
            {clusters.map((cluster) => {
              const isSelected = activeCluster?.code === cluster.code;

              // Size: Stable logarithmic scale clamped between 4.5px and 12px
              const radius = Math.min(
                12,
                Math.max(4.5, 4.5 + Math.log2(cluster.count + 1) * 1.35)
              );

              // Distinct neon hierarchy: Core Hubs (50+) -> Regional (15-50) -> Peripheral (<15)
              let coreColor = "#a855f7"; // Violet: Peripheral nodes
              let glowGradient = "url(#hubGlowViolet)";

              if (cluster.count >= 50) {
                coreColor = "#10b981"; // Emerald: Core global transit hub
                glowGradient = "url(#hubGlowEmerald)";
              } else if (cluster.count >= 15) {
                coreColor = "#06b6d4"; // Cyan: Regional backbone hub
                glowGradient = "url(#hubGlowCyan)";
              }

              return (
                <g
                  key={cluster.code}
                  role="link"
                  tabIndex={0}
                  aria-label={`${dict.activeNodesAria.replace("{name}", cluster.name).replace("{count}", String(cluster.count))}. ${dict.clickToView}`}
                  className={`${styles.nodeGroup} ${isSelected ? styles.nodeGroupHovered : ""}`}
                  transform={`translate(${cluster.x}, ${cluster.y})`}
                  onMouseEnter={(e) => handleMouseEnter(cluster, e)}
                  onClick={(e) => handleNodeClick(cluster, e)}
                  onKeyDown={(e) => handleNodeKeyDown(cluster, e)}
                >
                  {/* Concentric radar ping rings - pointer-events: none */}
                  <circle
                    r={radius * 1.7}
                    fill="none"
                    stroke={coreColor}
                    strokeWidth="1.2"
                    className={styles.nodePing}
                    style={{
                      animationDelay: `${((cluster.x + cluster.y) % 24) * 0.12}s`,
                    }}
                  />

                  {/* Soft ambient glow halo for hubs */}
                  <circle r={radius * 1.55} fill={glowGradient} className={styles.nodeGlow} />

                  {/* Core node dot: Stable size, neon highlight on hover */}
                  <circle
                    r={radius}
                    fill={coreColor}
                    stroke="#08090d"
                    strokeWidth="1.75"
                    className={styles.nodeCore}
                  />

                  {/* Hub count label for prominent nodes */}
                  {cluster.count >= 15 && (
                    <text
                      y="3.2"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={cluster.count >= 100 ? "8" : "8.5"}
                      fontWeight="700"
                      className={styles.nodeText}
                    >
                      {cluster.count}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Lightweight Desktop Micro-Marker (Non-blocking, zero occlusion of neighbouring nodes) */}
        {hoveredCluster && tooltipPos && !isTouchDevice && (
          <div
            className={styles.microMarker}
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y < 45 ? tooltipPos.y + 20 : tooltipPos.y - 28}px`,
            }}
          >
            <img
              src={`https://flagcdn.com/20x15/${hoveredCluster.code.toLowerCase()}.png`}
              alt=""
              width={14}
              height={10}
              className={styles.microFlag}
              loading="lazy"
            />
            <span className={styles.microName}>{hoveredCluster.name}</span>
            <span className={styles.microCount}>· {hoveredCluster.count} {dict.nodes}</span>
            <span className={styles.microHint}>
              <span className={styles.microArrow}>↗</span> {dict.clickToView}
            </span>
          </div>
        )}
      </div>

      {/* Docked HUD Telemetry Bar (Zero map occlusion, full telemetry & instant mobile action) */}
      <div className={styles.dockedHud}>
        {activeCluster ? (
          <div className={styles.hudActive}>
            {/* Identity & Rank */}
            <div className={styles.hudIdentity}>
              <img
                src={`https://flagcdn.com/28x21/${activeCluster.code.toLowerCase()}.png`}
                alt=""
                width={26}
                height={19}
                className={styles.hudFlag}
                loading="lazy"
              />
              <div className={styles.hudTitleGroup}>
                <div className={styles.hudCountryRow}>
                  <span className={styles.hudCountryName}>{activeCluster.name}</span>
                  <span className={styles.hudIsoBadge}>{activeCluster.code.toUpperCase()}</span>
                </div>
                <div className={styles.hudRankRow}>
                  <span className={styles.hudRankPill}>
                    {dict.networkHubRank.replace("{rank}", String(activeCluster.rank))}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Telemetry Metrics */}
            <div className={styles.hudMetrics}>
              <div className={styles.hudMetricItem}>
                <span className={styles.hudMetricLabel}>{dict.hudActiveNodes}</span>
                <span className={styles.hudMetricValue}>
                  <strong className={styles.hudHighlightNodes}>{activeCluster.count}</strong>
                  <span className={styles.hudSharePercent}>({activeCluster.sharePercent}%)</span>
                </span>
              </div>

              {activeCluster.avgLatency > 0 && (
                <div className={styles.hudMetricItem}>
                  <span className={styles.hudMetricLabel}>{dict.hudAvgLatency}</span>
                  <span className={styles.hudMetricValue}>
                    <span
                      className={styles.hudLatencyBadge}
                      data-latency={
                        activeCluster.avgLatency <= 120
                          ? "fast"
                          : activeCluster.avgLatency <= 250
                          ? "med"
                          : "slow"
                      }
                    >
                      ⚡ {activeCluster.avgLatency} ms ·{" "}
                      {activeCluster.avgLatency <= 120
                        ? dict.fast
                        : activeCluster.avgLatency <= 250
                        ? dict.fair
                        : dict.highLatency}
                    </span>
                  </span>
                </div>
              )}

              <div className={styles.hudMetricItem}>
                <span className={styles.hudMetricLabel}>{dict.hudProtocols}</span>
                <div className={styles.hudProtoPills}>
                  {Object.entries(activeCluster.protocols).map(([proto, count]) => (
                    <span key={proto} className={styles.hudProtoPill} data-proto={proto}>
                      {proto.toUpperCase()} <strong>{count}</strong>
                    </span>
                  ))}
                </div>
              </div>

              {activeCluster.sampleProxy && (
                <div className={`${styles.hudMetricItem} ${styles.hudSampleItem}`}>
                  <span className={styles.hudMetricLabel}>{dict.hudSampleEndpoint}</span>
                  <code className={styles.hudSampleCode}>{activeCluster.sampleProxy}</code>
                </div>
              )}
            </div>

            {/* Action CTA & Selection Dismiss */}
            <div className={styles.hudActions}>
              {isTouchDevice && selectedCluster ? (
                <>
                  <Link
                    href={`${prefix}/country/${selectedCluster.code.toLowerCase()}`}
                    className={styles.hudCtaBtn}
                    title={`${dict.inspectCountry} ${selectedCluster.name}`}
                  >
                    <span>{dict.inspectCountry}</span>
                    <ArrowRight size={14} className={styles.hudCtaArrow} />
                  </Link>
                  <button
                    type="button"
                    className={styles.hudCloseBtn}
                    onClick={() => setSelectedCluster(null)}
                    title={dict.clearSelection}
                    aria-label={dict.clearSelection}
                  >
                    <X size={15} />
                  </button>
                </>
              ) : (
                <div className={styles.hudDesktopHint}>
                  <span className={styles.hudHintText}>
                    {dict.clickNodeHint || dict.clickToView}
                  </span>
                  <ArrowRight size={12} className={styles.hudHintArrow} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.hudIdle}>
            <div className={styles.hudIdleLeft}>
              <span className={styles.idleBeacon} aria-hidden="true" />
              <span className={styles.idleStatusText}>
                <>
                  {dict.statusMeshActive} <strong>{totalMappedNodes}</strong> {dict.statusNodes} <strong>{totalCountries}</strong> {dict.statusCountries}
                  {topCluster && (
                    <>
                      {" "}• {dict.statusPrimaryHub} <strong>{topCluster.name}</strong> ({topCluster.count})
                    </>
                  )}
                </>
              </span>
            </div>
            <div className={styles.hudIdleHint}>
              <Activity size={13} className={styles.idleHintIcon} />
              <span>
                {dict.hoverHint}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend & Telemetry Footer */}
      <div className={styles.mapFooter}>
        <div className={styles.legend}>
          <span className={styles.legendTitle}>{dict.poolDensity}</span>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#a855f7" }} />
            <span>&lt; 15 {dict.densityEdge}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#06b6d4" }} />
            <span>15 – 50 {dict.densityRegional}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
            <span>50+ {dict.densityCore}</span>
          </div>
        </div>

        <div className={styles.footerRight}>
          <a
            href="https://github.com/stormsia/hydra"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hydraFooterLink}
            title={dict.hydraEngineTitle}
          >
            <ShieldCheck size={14} className={styles.hydraIcon} />
            <span>{dict.hydraMesh}</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
