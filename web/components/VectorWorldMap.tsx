/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Zap,
  ExternalLink,
  Activity,
  Radio,
  Share2,
  ShieldCheck,
  ArrowRight,
  X,
} from "lucide-react";
import type { ProxyRecord } from "@/lib/types";
import { getCountryCoordinates, getCountryDisplayName } from "@/lib/countries";
import { WORLD_LAND_PATH } from "@/lib/worldLandmass";
import { Locale, getLocalizedPath } from "@/lib/i18n";
import { useDictionary } from "./I18nProvider";
import styles from "./VectorWorldMap.module.css";

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
  sampleProxy?: string;
  sharePercent: number;
  rank: number;
}

interface TransitRoute {
  id: string;
  sourceCode: string;
  targetCode: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  path: string;
  distance: number;
}

// Equirectangular projection for 1000x500 viewBox
function projectCoords(lat: number, lon: number): [number, number] {
  const x = ((lon + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

// Generate quadratic Bezier arc curving gracefully upward towards the poles
function createCurvedArc(x1: number, y1: number, x2: number, y2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);

  // Midpoint
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;

  // Arc height arches upward
  const arcHeight = Math.min(65, Math.max(18, dist * 0.16));
  const cx = mx;
  const cy = my - arcHeight;

  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

export default function VectorWorldMap({ proxies, lang }: VectorWorldMapProps) {
  const router = useRouter();
  const { dict: globalDict, locale: ctxLocale } = useDictionary();
  const currentLocale = lang || ctxLocale;
  const dict = globalDict.map;
  const getCountryPath = useCallback(
    (code: string) => getLocalizedPath(`/country/${code.toLowerCase()}`, currentLocale),
    [currentLocale]
  );

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

  // 2. Aggregate country clusters
  const clusters = useMemo<CountryCluster[]>(() => {
    const map = new Map<
      string,
      {
        count: number;
        protocols: Record<string, number>;
        totalLatency: number;
        latencyCount: number;
        sample?: string;
      }
    >();

    for (const p of filteredProxies) {
      const code = (p.country || "").toLowerCase();
      if (!code) continue;

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

  // Active cluster: either hovered on desktop or tapped/selected on mobile
  const activeCluster = hoveredCluster || selectedCluster;

  // 3. Compute dynamic planetary backbone transit routes
  const transitRoutes = useMemo<TransitRoute[]>(() => {
    if (!showRoutes || clusters.length < 2) return [];

    // Focus on top 8 hubs for meaningful backbone connectivity
    const hubs = clusters.slice(0, 8);
    const routes: TransitRoute[] = [];
    const connectedPairs = new Set<string>();

    for (let i = 0; i < hubs.length; i++) {
      for (let j = i + 1; j < hubs.length; j++) {
        const h1 = hubs[i];
        const h2 = hubs[j];

        // Avoid long Pacific wraps for now to keep equirectangular lines clean
        const dx = Math.abs(h2.x - h1.x);
        if (dx > 540) continue;

        const pairKey = [h1.code, h2.code].sort().join("::");
        if (connectedPairs.has(pairKey)) continue;

        const distance = Math.hypot(h2.x - h1.x, h2.y - h1.y);
        // Skip excessively distant or tiny routes
        if (distance < 35 || distance > 580) continue;

        connectedPairs.add(pairKey);
        routes.push({
          id: pairKey,
          sourceCode: h1.code,
          targetCode: h2.code,
          sourceX: h1.x,
          sourceY: h1.y,
          targetX: h2.x,
          targetY: h2.y,
          path: createCurvedArc(h1.x, h1.y, h2.x, h2.y),
          distance,
        });

        // Limit to maximum 12 backbone routes for ultra-clean aesthetics
        if (routes.length >= 12) break;
      }
      if (routes.length >= 12) break;
    }

    return routes;
  }, [clusters, showRoutes]);

  // Order clusters in SVG so that the active node is drawn last (on top in SVG z-order)
  const orderedClusters = useMemo(() => {
    const activeCode = activeCluster?.code;
    if (!activeCode) return clusters;
    const regular: CountryCluster[] = [];
    let topNode: CountryCluster | null = null;
    for (const c of clusters) {
      if (c.code === activeCode) {
        topNode = c;
      } else {
        regular.push(c);
      }
    }
    return topNode ? [...regular, topNode] : clusters;
  }, [clusters, activeCluster]);

  // Metrics summary
  const totalCountries = clusters.length;
  const totalMappedNodes = filteredProxies.length;
  const topCluster = clusters[0];

  const overallAvgLatency = useMemo(() => {
    const latencies = clusters.filter((c) => c.avgLatency > 0);
    if (!latencies.length) return 0;
    const sum = latencies.reduce((acc, c) => acc + c.avgLatency, 0);
    return Math.round(sum / latencies.length);
  }, [clusters]);

  const updateTooltipPos = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(70, Math.min(rect.width - 70, e.clientX - rect.left));
    const y = e.clientY - rect.top;
    setTooltipPos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(
    (cluster: CountryCluster, e: React.MouseEvent) => {
      // Ignore hover if pointer is touch
      if ((e.nativeEvent as PointerEvent)?.pointerType === "touch") return;
      setHoveredCluster(cluster);
      updateTooltipPos(e);
    },
    [updateTooltipPos]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (hoveredCluster) {
        updateTooltipPos(e);
      }
    },
    [hoveredCluster, updateTooltipPos]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredCluster(null);
    setTooltipPos(null);
  }, []);

  // Node interaction: tap-to-select on touch, navigate on second tap or desktop click
  const handleNodeClick = useCallback(
    (cluster: CountryCluster, e: React.MouseEvent) => {
      e.stopPropagation();
      const isTouch =
        (e.nativeEvent as PointerEvent)?.pointerType === "touch" || isTouchDevice;

      if (isTouch) {
        if (selectedCluster?.code === cluster.code) {
          // Second tap on already selected country -> navigate to catalog
          router.push(getCountryPath(cluster.code));
        } else {
          // First tap -> select and display in Docked HUD
          setSelectedCluster(cluster);
          setHoveredCluster(null);
        }
      } else {
        // Desktop mouse click -> navigate directly
        router.push(getCountryPath(cluster.code));
      }
    },
    [isTouchDevice, selectedCluster, getCountryPath, router]
  );

  const handleNodeKeyDown = useCallback(
    (cluster: CountryCluster, e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        router.push(getCountryPath(cluster.code));
      }
    },
    [getCountryPath, router]
  );

  // Clicking empty SVG space deselects on mobile
  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === "svg" ||
      target.tagName === "rect" ||
      target.classList?.contains(styles.landmassBase)
    ) {
      setSelectedCluster(null);
    }
  }, []);

  return (
    <div className={styles.mapContainer} ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Top HUD Control Bar */}
      <div className={styles.mapHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.mapTitle}>
            <span className={styles.beaconDot} aria-hidden="true" />
            <Globe size={17} className={styles.titleIcon} />
            <span className={styles.titleText}>{dict.title}</span>
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
          className={styles.worldSvg}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={dict.title}
        >
          <defs>
            {/* Background Cyber Coordinate Grid */}
            <pattern id="cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255, 255, 255, 0.02)"
                strokeWidth="0.5"
              />
              <circle cx="0" cy="0" r="0.75" fill="rgba(56, 189, 248, 0.15)" />
            </pattern>

            {/* Landmass Matrix Micro-Dot Grid */}
            <pattern id="cyber-dots" width="9" height="9" patternUnits="userSpaceOnUse">
              <circle cx="4.5" cy="4.5" r="0.85" fill="#38bdf8" fillOpacity="0.16" />
            </pattern>

            {/* Node Radial Glow Halos */}
            <radialGradient id="glowEmerald" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="glowCyan" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="glowViolet" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#a855f7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>

            {/* Linear Radar Sweep Gradient */}
            <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.12" />
            </linearGradient>

            {/* Backbone route gradient */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Layer 1: Background & Graticule */}
          <rect width="1000" height="500" fill="#08090d" />
          <rect width="1000" height="500" fill="url(#cyber-grid)" />

          {/* Latitude Parallels */}
          <line x1="0" y1="250" x2="1000" y2="250" className={styles.equatorLine} />
          <line x1="0" y1="185" x2="1000" y2="185" className={styles.tropicLine} />
          <line x1="0" y1="315" x2="1000" y2="315" className={styles.tropicLine} />

          {/* Longitude Meridians */}
          <line x1="500" y1="0" x2="500" y2="500" className={styles.meridianPrime} />
          <line x1="250" y1="0" x2="250" y2="500" className={styles.meridianLine} />
          <line x1="750" y1="0" x2="750" y2="500" className={styles.meridianLine} />

          {/* Coordinate Watermarks */}
          <text x="14" y="246" className={styles.geoLabel}>
            0° EQUATOR
          </text>
          <text x="506" y="16" className={styles.geoLabel}>
            0° UTC
          </text>
          <text x="14" y="181" className={styles.geoLabel}>
            +23.5° TROPIC
          </text>
          <text x="14" y="329" className={styles.geoLabel}>
            -23.5° TROPIC
          </text>

          {/* Layer 2: Geographic Landmass Topology */}
          <g className={styles.landmassGroup}>
            <path d={WORLD_LAND_PATH} className={styles.landmassBase} />
            <path d={WORLD_LAND_PATH} fill="url(#cyber-dots)" className={styles.landmassDots} />
            <path d={WORLD_LAND_PATH} className={styles.landmassRim} fill="none" />
          </g>

          {/* Layer 3: Radar Scan Beam */}
          <g className={styles.radarGroup}>
            <rect x="0" y="0" width="80" height="500" fill="url(#radarSweepGrad)" className={styles.radarSweep} />
          </g>

          {/* Layer 4: Backbone Telemetry Transit Routes */}
          {showRoutes && (
            <g className={styles.transitGroup}>
              {transitRoutes.map((route) => {
                const isHoverConnected =
                  activeCluster &&
                  (activeCluster.code === route.sourceCode || activeCluster.code === route.targetCode);
                const isDimmed = activeCluster && !isHoverConnected;

                return (
                  <g
                    key={route.id}
                    className={`${styles.routeItem} ${isHoverConnected ? styles.routeActive : ""} ${
                      isDimmed ? styles.routeDimmed : ""
                    }`}
                  >
                    <path d={route.path} className={styles.routeBase} />
                    <path d={route.path} className={styles.routePulse} />
                    <circle r="2.2" className={styles.routePacket}>
                      <animateMotion
                        dur={`${Math.max(3.2, Math.min(8.5, route.distance / 45))}s`}
                        repeatCount="indefinite"
                        path={route.path}
                      />
                    </circle>
                  </g>
                );
              })}
            </g>
          )}

          {/* Layer 5: Interactive Country Cluster Nodes */}
          <g className={styles.nodesGroup}>
            {orderedClusters.map((cluster) => {
              const radius = Math.min(16, Math.max(5, 4.5 + Math.log2(cluster.count) * 1.8));
              const isLarge = cluster.count >= 50;
              const isMedium = cluster.count >= 15;
              const coreColor = isLarge ? "#10b981" : isMedium ? "#06b6d4" : "#a855f7";
              const glowGradient = isLarge ? "url(#glowEmerald)" : isMedium ? "url(#glowCyan)" : "url(#glowViolet)";
              const isSelected = activeCluster?.code === cluster.code;

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

        {/* Lightweight Desktop Micro-Marker */}
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
              <span className={styles.microArrow}>↗</span>
              <span>{dict.clickToView}</span>
            </span>
          </div>
        )}
      </div>

      {/* Docked HUD Telemetry Bar */}
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
              {selectedCluster ? (
                <>
                  <Link
                    href={getCountryPath(activeCluster.code)}
                    className={styles.hudCtaBtn}
                    title={`${dict.inspectCountry} ${activeCluster.name}`}
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
                  <span className={styles.hudHintText}>{dict.clickNodeHint}</span>
                  <span className={styles.hudHintArrow}>↗</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.hudIdle}>
            <div className={styles.hudIdleLeft}>
              <span className={styles.idleBeacon} aria-hidden="true" />
              <span className={styles.idleStatusText}>
                {dict.statusMeshActive} <strong>{totalMappedNodes}</strong> {dict.statusNodes}{" "}
                <strong>{totalCountries}</strong> {dict.statusCountries}
                {topCluster && (
                  <>
                    {" "}• {dict.statusPrimaryHub} <strong>{topCluster.name}</strong> ({topCluster.count})
                  </>
                )}
              </span>
            </div>
            <div className={styles.hudIdleHint}>
              <Activity size={13} className={styles.idleHintIcon} />
              <span>{dict.hoverHint}</span>
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
