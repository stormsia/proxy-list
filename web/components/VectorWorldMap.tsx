/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Globe, Zap, ExternalLink } from "lucide-react";
import type { ProxyRecord } from "@/lib/types";
import { getCountryCoordinates, getCountryDisplayName } from "@/lib/countries";
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
}

// Simplified high-aesthetic landmass paths for natural world map projection (1000x500 viewBox)
const CONTINENT_PATHS = [
  // North America
  "M 160 65 L 195 55 L 250 50 L 310 65 L 340 90 L 300 115 L 290 140 L 250 140 L 235 170 L 260 195 L 285 190 L 305 210 L 285 240 L 245 255 L 230 240 L 225 210 L 190 200 L 175 170 L 150 160 L 130 135 L 120 100 L 135 75 Z",
  // Greenland
  "M 350 40 L 415 35 L 440 60 L 400 95 L 360 85 Z",
  // Central America & Caribbean
  "M 230 245 L 250 260 L 275 275 L 290 295 L 270 305 L 250 285 L 225 260 Z",
  // South America
  "M 285 300 L 335 315 L 380 340 L 410 380 L 380 435 L 350 480 L 320 495 L 305 450 L 295 400 L 275 350 L 270 320 Z",
  // Europe
  "M 470 95 L 525 80 L 565 75 L 595 100 L 585 130 L 545 155 L 520 170 L 495 175 L 465 150 L 450 120 L 470 95 Z",
  // Scandinavia
  "M 515 55 L 555 45 L 575 70 L 550 100 L 525 90 Z",
  // United Kingdom & Ireland
  "M 455 105 L 475 95 L 480 120 L 460 130 Z M 440 115 L 450 110 L 450 125 L 440 125 Z",
  // Africa
  "M 480 185 L 545 180 L 595 210 L 635 255 L 610 320 L 585 385 L 545 425 L 515 410 L 485 340 L 460 280 L 445 220 L 470 190 Z",
  // Madagascar
  "M 640 350 L 655 355 L 645 400 L 630 390 Z",
  // Asia (Mainland & Siberia)
  "M 590 75 L 680 50 L 780 45 L 890 55 L 940 85 L 910 125 L 860 135 L 830 170 L 870 210 L 845 250 L 790 260 L 760 230 L 715 255 L 675 225 L 640 175 L 610 135 Z",
  // Japan
  "M 890 145 L 910 140 L 925 175 L 895 190 Z",
  // Southeast Asia & Indonesia
  "M 740 260 L 785 270 L 805 305 L 775 320 L 735 290 Z M 770 340 L 820 335 L 860 355 L 800 370 Z",
  // Australia
  "M 810 375 L 880 365 L 935 390 L 930 450 L 880 475 L 825 450 L 800 410 Z",
  // New Zealand
  "M 950 450 L 970 445 L 965 485 L 945 480 Z"
];

function projectCoords(lat: number, lon: number): [number, number] {
  // Equirectangular projection for 1000x500 viewBox
  const x = ((lon + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

export default function VectorWorldMap({ proxies, lang = "en" }: VectorWorldMapProps) {
  const router = useRouter();
  const [activeProtocol, setActiveProtocol] = useState<string>("all");
  const [hoveredCluster, setHoveredCluster] = useState<CountryCluster | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isRu = lang === "ru";
  const prefix = isRu ? "/ru" : "";

  // Filter proxies by protocol if selected
  const filteredProxies = useMemo(() => {
    if (activeProtocol === "all") return proxies;
    const p = activeProtocol.toLowerCase();
    if (p === "https") {
      return proxies.filter((item) => item.supports_https || item.protocol === "https");
    }
    return proxies.filter((item) => (item.protocol || "").toLowerCase() === p);
  }, [proxies, activeProtocol]);

  // Aggregate country clusters with coordinates
  const clusters = useMemo<CountryCluster[]>(() => {
    const map = new Map<string, {
      count: number;
      protocols: Record<string, number>;
      totalLatency: number;
      latencyCount: number;
      sample?: string;
    }>();

    for (const p of filteredProxies) {
      const code = (p.country || "").toLowerCase();
      if (!code) continue;

      const existing = map.get(code) || {
        count: 0,
        protocols: {},
        totalLatency: 0,
        latencyCount: 0,
        sample: `${p.protocol}://${p.ip}:${p.port}`,
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

    const list: CountryCluster[] = [];
    map.forEach((data, code) => {
      const coords = getCountryCoordinates(code);
      if (!coords) return;

      const [x, y] = projectCoords(coords[0], coords[1]);
      const avgLatency = data.latencyCount > 0 ? Math.round(data.totalLatency / data.latencyCount) : 0;
      const name = getCountryDisplayName(code, code.toUpperCase(), lang);

      list.push({
        code,
        name,
        x,
        y,
        count: data.count,
        protocols: data.protocols,
        avgLatency,
        sampleProxy: data.sample,
      });
    });

    return list.sort((a, b) => b.count - a.count);
  }, [filteredProxies, lang]);

  const totalCountries = clusters.length;
  const totalMappedNodes = filteredProxies.length;
  const topCluster = clusters[0];

  const handleNodeClick = (code: string) => {
    router.push(`${prefix}/country/${code.toLowerCase()}`);
  };

  const handleMouseEnter = (cluster: CountryCluster, e: React.MouseEvent) => {
    setHoveredCluster(cluster);
    updateTooltipPos(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredCluster) {
      updateTooltipPos(e);
    }
  };

  const updateTooltipPos = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setTooltipPos({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredCluster(null);
    setTooltipPos(null);
  };

  return (
    <div className={styles.mapContainer} ref={containerRef} onMouseMove={handleMouseMove}>
      {/* Map Control Header */}
      <div className={styles.mapHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.mapTitle}>
            <Globe size={18} style={{ color: "var(--primary)" }} />
            <span>{isRu ? "Топология сети и геораспределение" : "Global Network Topology & Geodistribution"}</span>
          </div>

          <div className={styles.headerPills}>
            <span className={styles.statPill}>
              <strong style={{ color: "var(--text-primary)" }}>{totalMappedNodes}</strong> {isRu ? "нод" : "nodes"}
            </span>
            <span className={styles.statPill}>
              <strong style={{ color: "var(--text-primary)" }}>{totalCountries}</strong> {isRu ? "стран" : "countries"}
            </span>
            {topCluster && (
              <span className={styles.statPill} title={`Top country: ${topCluster.name}`}>
                🏆 {topCluster.name} ({topCluster.count})
              </span>
            )}
          </div>
        </div>

        {/* Protocol filter pills on map */}
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

      {/* SVG Canvas */}
      <div className={styles.svgWrapper} onMouseLeave={handleMouseLeave}>
        <svg
          viewBox="0 0 1000 500"
          className={styles.worldSvg}
          preserveAspectRatio="xMidYMid meet"
          aria-label="Interactive world map showing active proxy distribution"
        >
          <defs>
            {/* Coordinate grid pattern */}
            <pattern id="world-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
            </pattern>

            {/* Glowing radial gradient for radar nodes */}
            <radialGradient id="emeraldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="violetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="500" fill="url(#world-grid)" />

          {/* Longitude & Latitude lines */}
          <line x1="0" y1="250" x2="1000" y2="250" className={styles.equator} />
          <line x1="500" y1="0" x2="500" y2="500" className={styles.gridLines} />
          <line x1="250" y1="0" x2="250" y2="500" className={styles.gridLines} />
          <line x1="750" y1="0" x2="750" y2="500" className={styles.gridLines} />

          {/* Continents */}
          <g className={styles.continentsGroup}>
            {CONTINENT_PATHS.map((d, index) => (
              <path key={index} d={d} className={styles.continent} />
            ))}
          </g>

          {/* Interactive Country Cluster Nodes */}
          <g className={styles.nodesGroup}>
            {clusters.map((cluster) => {
              // Size proportional to node count
              const radius = Math.min(18, Math.max(5, 5 + Math.log2(cluster.count) * 2.2));
              const isLarge = cluster.count >= 50;
              const isMedium = cluster.count >= 15;
              const coreColor = isLarge ? "#10b981" : isMedium ? "#38bdf8" : "#8b5cf6";

              return (
                <g
                  key={cluster.code}
                  className={styles.nodeGroup}
                  transform={`translate(${cluster.x}, ${cluster.y})`}
                  onClick={() => handleNodeClick(cluster.code)}
                  onMouseEnter={(e) => handleMouseEnter(cluster, e)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${cluster.name}: ${cluster.count} active proxies`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleNodeClick(cluster.code);
                    }
                  }}
                >
                  {/* Outer animated radar ping ring */}
                  <circle
                    r={radius * 1.8}
                    fill="none"
                    stroke={coreColor}
                    strokeWidth="1.5"
                    className={styles.nodePing}
                  />

                  {/* Soft ambient glow halo */}
                  <circle
                    r={radius * 1.5}
                    fill={isLarge ? "url(#emeraldGlow)" : "url(#violetGlow)"}
                  />

                  {/* Core node dot */}
                  <circle
                    r={radius}
                    fill={coreColor}
                    stroke="#09090c"
                    strokeWidth="1.5"
                    className={styles.nodeCore}
                  />

                  {/* Count badge for prominent clusters */}
                  {cluster.count >= 20 && (
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="700"
                      style={{ pointerEvents: "none", userSelect: "none" }}
                    >
                      {cluster.count}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating Tooltip */}
        {hoveredCluster && tooltipPos && (
          <div
            className={styles.tooltip}
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`,
            }}
          >
            <div className={styles.tooltipHeader}>
              <img
                src={`https://flagcdn.com/24x18/${hoveredCluster.code.toLowerCase()}.png`}
                alt={hoveredCluster.name}
                width={18}
                height={13}
                className={styles.tooltipFlag}
              />
              <span className={styles.tooltipCountry}>{hoveredCluster.name}</span>
            </div>

            <div className={styles.tooltipCount}>
              ⚡ <strong>{hoveredCluster.count}</strong> {isRu ? "активных нод" : "active nodes"}
            </div>

            <div className={styles.tooltipMeta}>
              {Object.entries(hoveredCluster.protocols).map(([proto, count]) => (
                <span key={proto}>
                  {proto.toUpperCase()}: <strong>{count}</strong>
                </span>
              ))}
              {hoveredCluster.avgLatency > 0 && (
                <span>
                  • {isRu ? "Пинг" : "RTT"}: <strong>{hoveredCluster.avgLatency}ms</strong>
                </span>
              )}
            </div>

            <div className={styles.tooltipAction}>
              {isRu ? "Кликните для просмотра прокси →" : "Click to view proxies →"}
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className={styles.mapFooter}>
        <div className={styles.legend}>
          <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{isRu ? "Плотность нод:" : "Node Density:"}</span>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#8b5cf6" }} />
            <span>&lt; 15</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#38bdf8" }} />
            <span>15 - 50</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: "#10b981" }} />
            <span>50+</span>
          </div>
        </div>

        <div>
          <a
            href="https://github.com/stormsia/hydra"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hydraFooterLink}
          >
            <Zap size={13} />
            <span>{isRu ? "Геоданные проверены движком Hydra" : "Telemetry audited by Hydra Engine"}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
