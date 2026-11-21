/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Zap, ExternalLink, Activity, Radio, Share2, ShieldCheck, ArrowRight } from "lucide-react";
import type { ProxyRecord } from "@/lib/types";
import { getCountryCoordinates, getCountryDisplayName } from "@/lib/countries";
import { WORLD_LAND_PATH } from "@/lib/worldLandmass";
import styles from "./VectorWorldMap.module.css";

interface VectorWorldMapProps {
  proxies: ProxyRecord[];
  lang?: "en" | "ru";
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

export default function VectorWorldMap({ proxies, lang = "en" }: VectorWorldMapProps) {
  const router = useRouter();
  const [activeProtocol, setActiveProtocol] = useState<string>("all");
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [hoveredCluster, setHoveredCluster] = useState<CountryCluster | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRu = lang === "ru";
  const prefix = isRu ? "/ru" : "";

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
      const name = getCountryDisplayName(code, code.toUpperCase(), lang);
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
  }, [filteredProxies, lang]);

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

  const handleNodeClick = useCallback(
    (code: string) => {
      router.push(`${prefix}/country/${code.toLowerCase()}`);
    },
    [router, prefix]
  );

  const updateTooltipPos = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(110, Math.min(rect.width - 110, e.clientX - rect.left));
    const y = e.clientY - rect.top;
    setTooltipPos({ x, y });
  }, []);

  const handleMouseEnter = useCallback(
    (cluster: CountryCluster, e: React.MouseEvent) => {
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

  return (
    <div className={styles.mapContainer} ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Top HUD Control Bar */}
      <div className={styles.mapHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.mapTitle}>
            <span className={styles.beaconDot} aria-hidden="true" />
            <Globe size={17} className={styles.titleIcon} />
            <span className={styles.titleText}>
              {isRu ? "Топология глобальной сети" : "Global Network Topology"}
            </span>
          </div>

          <div className={styles.headerPills}>
            <div className={styles.statPill}>
              <Activity size={12} className={styles.pillIcon} />
              <strong className={styles.statValue}>{totalMappedNodes}</strong>
              <span className={styles.statLabel}>{isRu ? "нод" : "nodes"}</span>
            </div>

            <div className={styles.statPill}>
              <Radio size={12} className={styles.pillIcon} />
              <strong className={styles.statValue}>{totalCountries}</strong>
              <span className={styles.statLabel}>{isRu ? "стран" : "countries"}</span>
            </div>

            {overallAvgLatency > 0 && (
              <div className={styles.statPill} title={isRu ? "Средний пинг пула" : "Pool average latency"}>
                <Zap size={12} className={styles.pillIcon} style={{ color: "#38bdf8" }} />
                <strong className={styles.statValue}>{overallAvgLatency}</strong>
                <span className={styles.statLabel}>ms</span>
              </div>
            )}

            {topCluster && (
              <div
                className={`${styles.statPill} ${styles.topHubPill}`}
                title={`${isRu ? "Ведущий хаб сети" : "Network Primary Hub"}: ${topCluster.name}`}
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
            title={isRu ? "Переключить отображение магистралей" : "Toggle backbone transit routes"}
            aria-pressed={showRoutes}
          >
            <Share2 size={13} />
            <span>{isRu ? "Магистрали" : "Routes"}</span>
          </button>

          <div className={styles.filterGroup}>
            {(["all", "socks5", "http", "socks4"] as const).map((proto) => (
              <button
                key={proto}
                type="button"
                className={`${styles.filterBtn} ${activeProtocol === proto ? styles.filterBtnActive : ""}`}
                onClick={() => setActiveProtocol(proto)}
              >
                {proto === "all" ? (isRu ? "Все" : "All") : proto.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive SVG Surface */}
      <div className={styles.svgWrapper} onMouseLeave={handleMouseLeave}>
        <svg
          viewBox="0 0 1000 500"
          className={styles.worldSvg}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Interactive high-precision world map of proxy servers"
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
            {/* Solid sleek landmass base */}
            <path d={WORLD_LAND_PATH} className={styles.landmassBase} />
            {/* Cyber Dot-Matrix Overlay */}
            <path d={WORLD_LAND_PATH} fill="url(#cyber-dots)" className={styles.landmassDots} />
            {/* Razor-sharp glowing coastline rim */}
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
                  hoveredCluster &&
                  (hoveredCluster.code === route.sourceCode || hoveredCluster.code === route.targetCode);
                const isDimmed = hoveredCluster && !isHoverConnected;

                return (
                  <g
                    key={route.id}
                    className={`${styles.routeItem} ${isHoverConnected ? styles.routeActive : ""} ${
                      isDimmed ? styles.routeDimmed : ""
                    }`}
                  >
                    {/* Shadow / Base Arc */}
                    <path d={route.path} className={styles.routeBase} />
                    {/* Glowing animated laser packet pulse */}
                    <path d={route.path} className={styles.routePulse} />
                    {/* Live traveling telemetry packet */}
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
            {clusters.map((cluster) => {
              // Proportional radius with clean bounds
              const radius = Math.min(16, Math.max(5, 4.5 + Math.log2(cluster.count) * 1.8));
              const isLarge = cluster.count >= 50;
              const isMedium = cluster.count >= 15;
              const coreColor = isLarge ? "#10b981" : isMedium ? "#06b6d4" : "#a855f7";
              const glowGradient = isLarge ? "url(#glowEmerald)" : isMedium ? "url(#glowCyan)" : "url(#glowViolet)";
              const isSelected = hoveredCluster?.code === cluster.code;

              return (
                <Link
                  key={cluster.code}
                  href={`${prefix}/country/${cluster.code.toLowerCase()}`}
                  aria-label={`${cluster.name}: ${cluster.count} active proxies`}
                  style={{ textDecoration: "none" }}
                >
                  <g
                    className={`${styles.nodeGroup} ${isSelected ? styles.nodeGroupHovered : ""}`}
                    transform={`translate(${cluster.x}, ${cluster.y})`}
                    onMouseEnter={(e) => handleMouseEnter(cluster, e)}
                  >
                    {/* Concentric radar ping rings */}
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

                    {/* Core node dot */}
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
                </Link>
              );
            })}
          </g>
        </svg>

        {/* Cinematic HUD Floating Tooltip */}
        {hoveredCluster && tooltipPos && (
          <div
            className={styles.tooltipCard}
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y < 170 ? tooltipPos.y + 24 : tooltipPos.y - 12}px`,
              transform: tooltipPos.y < 170 ? "translate(-50%, 0)" : "translate(-50%, -100%)",
            }}
          >
            {/* Tooltip Header */}
            <div className={styles.tooltipHead}>
              <div className={styles.tooltipHeadLeft}>
                <img
                  src={`https://flagcdn.com/24x18/${hoveredCluster.code.toLowerCase()}.png`}
                  alt=""
                  width={20}
                  height={15}
                  className={styles.tooltipFlag}
                  loading="lazy"
                />
                <div className={styles.tooltipTitleWrap}>
                  <span className={styles.tooltipCountry}>{hoveredCluster.name}</span>
                  <span className={styles.tooltipIso}>{hoveredCluster.code.toUpperCase()}</span>
                </div>
              </div>

              <div className={styles.tooltipRankPill}>
                #{hoveredCluster.rank} {isRu ? "хаб" : "hub"}
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className={styles.tooltipBody}>
              <div className={styles.tooltipMetricRow}>
                <span className={styles.tooltipMetricLabel}>{isRu ? "Активных нод:" : "Active Nodes:"}</span>
                <span className={styles.tooltipMetricVal}>
                  ⚡ <strong>{hoveredCluster.count}</strong>{" "}
                  <span className={styles.tooltipPercent}>({hoveredCluster.sharePercent}%)</span>
                </span>
              </div>

              {hoveredCluster.avgLatency > 0 && (
                <div className={styles.tooltipMetricRow}>
                  <span className={styles.tooltipMetricLabel}>{isRu ? "Средний RTT:" : "Avg Latency:"}</span>
                  <span
                    className={styles.tooltipLatencyBadge}
                    data-latency={
                      hoveredCluster.avgLatency <= 120 ? "fast" : hoveredCluster.avgLatency <= 250 ? "med" : "slow"
                    }
                  >
                    {hoveredCluster.avgLatency} ms
                  </span>
                </div>
              )}

              {/* Protocols Bar */}
              <div className={styles.tooltipProtocols}>
                {Object.entries(hoveredCluster.protocols).map(([proto, count]) => (
                  <div key={proto} className={styles.protoPill} data-proto={proto}>
                    <span className={styles.protoKey}>{proto.toUpperCase()}</span>
                    <span className={styles.protoCount}>{count}</span>
                  </div>
                ))}
              </div>

              {/* Sample proxy */}
              {hoveredCluster.sampleProxy && (
                <div className={styles.tooltipSample}>
                  <span className={styles.sampleLabel}>{isRu ? "Пример узла:" : "Sample endpoint:"}</span>
                  <code className={styles.sampleCode}>{hoveredCluster.sampleProxy}</code>
                </div>
              )}
            </div>

            {/* Action CTA */}
            <Link
              href={`${prefix}/country/${hoveredCluster.code.toLowerCase()}`}
              className={styles.tooltipFoot}
              title={`${isRu ? "Открыть прокси страны" : "Inspect country proxies"} ${hoveredCluster.name}`}
            >
              <span>{isRu ? "Открыть прокси страны" : "Inspect country proxies"}</span>
              <ArrowRight size={13} className={styles.tooltipArrow} />
            </Link>
          </div>
        )}
      </div>

      {/* Map Legend & Telemetry Footer */}
      <div className={styles.mapFooter}>
        <div className={styles.legend}>
          <span className={styles.legendTitle}>{isRu ? "Плотность пула:" : "Pool Density:"}</span>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#a855f7" }} />
            <span>&lt; 15 {isRu ? "(Периферия)" : "(Edge)"}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#06b6d4" }} />
            <span>15 – 50 {isRu ? "(Региональные)" : "(Regional)"}</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
            <span>50+ {isRu ? "(Магистральные)" : "(Core Hubs)"}</span>
          </div>
        </div>

        <div className={styles.footerRight}>
          <a
            href="https://github.com/stormsia/hydra"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hydraFooterLink}
            title={isRu ? "Движок проверки прокси Hydra" : "Hydra Proxy Verification Engine"}
          >
            <ShieldCheck size={14} className={styles.hydraIcon} />
            <span>{isRu ? "Телеметрия Hydra Engine" : "Hydra Telemetry Mesh"}</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
