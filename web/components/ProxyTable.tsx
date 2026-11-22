/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Search,
  X,
  Download,
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  ShieldCheck,
  Lock,
  Zap,
  RotateCcw,
  Globe,
  MapPin,
  Server,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type { ProxyRecord } from "@/lib/types";
import { getCountryDisplayName } from "@/lib/countries";
import { isDatacenter, isResidential } from "@/lib/proxy-utils";
import { useLiveProxies } from "@/lib/useLiveProxies";
import LiveSyncIndicator from "@/components/LiveSyncIndicator";
import styles from "./ProxyTable.module.css";

export type Proxy = ProxyRecord;

export type TableDict = {
  protocol?: string;
  ip?: string;
  port?: string;
  country?: string;
  speed?: string;
  anonymity?: string;
  uptime?: string;
  action?: string;
  copy?: string;
  copied?: string;
  allProtocols?: string;
  showing?: string;
  proxiesCount?: string;
  previous?: string;
  next?: string;
  page?: string;
  of?: string;
  unknown?: string;
  searchPlaceholder?: string;
  export?: string;
  [key: string]: string | undefined;
};

export interface ProxyTableProps {
  proxies: ProxyRecord[];
  dict?: TableDict;
  initialProtocol?: string;
  initialType?: "all" | "datacenter" | "residential";
  initialCountry?: string;
  viewAllHref?: string;
  pageContext?: {
    type: "protocol" | "category" | "country";
    value: string;
    label: string;
  };
}

export default function ProxyTable({
  proxies: initialProxies,
  dict,
  initialProtocol = "all",
  initialType = "all",
  initialCountry = "all",
  viewAllHref,
  pageContext,
}: ProxyTableProps) {
  const {
    proxies,
    secondsLeft,
    isSyncing,
    isUpdatedFlash,
    syncNow,
  } = useLiveProxies(initialProxies);

  const [filterProtocol, setFilterProtocol] = useState<string>(initialProtocol.toLowerCase());
  const [filterType, setFilterType] = useState<string>(initialType.toLowerCase());
  const [filterCountry, setFilterCountry] = useState<string>(initialCountry.toLowerCase());
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [latencyFilter, setLatencyFilter] = useState<string>("all"); // all, fast, medium, slow
  const [anonymityFilter, setAnonymityFilter] = useState<string>("all"); // all, elite, anonymous, transparent
  const [sortBy, setSortBy] = useState<string>("default"); // default, speed-asc, speed-desc, uptime-desc, ip-asc
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [exportOpen, setExportOpen] = useState<boolean>(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 50;
  const isRu = dict?.country === "Страна" || dict?.copy === "Копировать";

  // Check if any filter is actively applied
  const hasActiveFilter =
    filterProtocol !== "all" ||
    filterType !== "all" ||
    filterCountry !== "all" ||
    searchQuery.trim().length > 0 ||
    latencyFilter !== "all" ||
    anonymityFilter !== "all" ||
    sortBy !== "default";

  // Reset all filters back to full pool view
  const resetAllFilters = () => {
    setFilterProtocol("all");
    setFilterType("all");
    setFilterCountry("all");
    setSearchQuery("");
    setLatencyFilter("all");
    setAnonymityFilter("all");
    setSortBy("default");
    setCurrentPage(1);
  };

  // Pre-calculate protocol counts based on category/country context
  const protocolCounts = useMemo(() => {
    let pool = proxies;
    if (filterType === "datacenter") {
      pool = pool.filter((p) => isDatacenter(p.asn_org));
    } else if (filterType === "residential") {
      pool = pool.filter((p) => isResidential(p.asn_org));
    }
    if (filterCountry !== "all") {
      pool = pool.filter((p) => (p.country || "").toLowerCase() === filterCountry);
    }

    const counts: Record<string, number> = {
      all: pool.length,
      socks5: 0,
      socks4: 0,
      http: 0,
    };
    for (const p of pool) {
      const proto = p.protocol?.toLowerCase();
      if (proto && counts[proto] !== undefined) {
        counts[proto]++;
      }
    }
    return counts;
  }, [proxies, filterType, filterCountry]);

  // Close export dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered & Sorted proxies
  const filteredProxies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return proxies
      .filter((p) => {
        // IP Type filter
        if (filterType === "datacenter" && !isDatacenter(p.asn_org)) return false;
        if (filterType === "residential" && !isResidential(p.asn_org)) return false;

        // Country filter
        if (filterCountry !== "all" && (p.country || "").toLowerCase() !== filterCountry) {
          return false;
        }

        // Protocol filter
        if (filterProtocol !== "all") {
          if (filterProtocol === "https") {
            if (!p.supports_https && p.protocol?.toLowerCase() !== "https") return false;
          } else if (p.protocol?.toLowerCase() !== filterProtocol) {
            return false;
          }
        }

        // Anonymity filter
        if (anonymityFilter !== "all") {
          const anon = p.anon?.toLowerCase();
          if (anon !== anonymityFilter) return false;
        }

        // Latency in ms (Hydra rtt_total_ms or legacy timeout * 1000)
        const rtt =
          typeof p.rtt_total_ms === "number" && p.rtt_total_ms > 0
            ? p.rtt_total_ms
            : typeof p.timeout === "number"
            ? p.timeout * 1000
            : 99999;

        if (latencyFilter === "fast" && rtt >= 500) return false;
        if (latencyFilter === "medium" && (rtt < 500 || rtt > 2000)) return false;
        if (latencyFilter === "slow" && rtt <= 2000) return false;

        // Search query filter
        if (normalizedQuery) {
          const ipVal = (p.ip || p.host || "").toLowerCase();
          const portVal = (p.port || "").toString();
          const countryCode = (p.country || "").toLowerCase();
          const countryName = getCountryDisplayName(
            countryCode,
            countryCode.toUpperCase(),
            isRu ? "ru" : "en"
          ).toLowerCase();
          const asnOrg = (p.asn_org || "").toLowerCase();
          const anonVal = (p.anon || "").toLowerCase();

          const match =
            ipVal.includes(normalizedQuery) ||
            portVal.includes(normalizedQuery) ||
            countryCode.includes(normalizedQuery) ||
            countryName.includes(normalizedQuery) ||
            asnOrg.includes(normalizedQuery) ||
            anonVal.includes(normalizedQuery);

          if (!match) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aRtt = typeof a.rtt_total_ms === "number" && a.rtt_total_ms > 0 ? a.rtt_total_ms : 99999;
        const bRtt = typeof b.rtt_total_ms === "number" && b.rtt_total_ms > 0 ? b.rtt_total_ms : 99999;

        if (sortBy === "speed-asc") return aRtt - bRtt;
        if (sortBy === "speed-desc") return bRtt - aRtt;
        if (sortBy === "uptime-desc") return (b.uptime_pct ?? 0) - (a.uptime_pct ?? 0);
        if (sortBy === "ip-asc") {
          const aIp = a.ip || a.host || "";
          const bIp = b.ip || b.host || "";
          return aIp.localeCompare(bIp);
        }
        return 0;
      });
  }, [
    proxies,
    filterProtocol,
    filterType,
    filterCountry,
    anonymityFilter,
    latencyFilter,
    searchQuery,
    sortBy,
    isRu,
  ]);

  // Reset page on filter changes without cascading effect renders
  const filterKey = `${filterProtocol}|${filterType}|${filterCountry}|${anonymityFilter}|${latencyFilter}|${searchQuery}|${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filteredProxies.length / PAGE_SIZE));
  const paginatedProxies = useMemo(() => {
    return filteredProxies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [filteredProxies, currentPage]);

  const handleCopy = (proxy: ProxyRecord, withProtocol = false) => {
    const ip = proxy.ip || proxy.host || "";
    const port = proxy.port;
    const textToCopy = withProtocol
      ? proxy.url || `${proxy.protocol}://${ip}:${port}`
      : `${ip}:${port}`;

    navigator.clipboard.writeText(textToCopy);
    const id = proxy.id || `${proxy.protocol}-${ip}:${port}`;
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Export handlers
  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportTxt = (withProtocol: boolean) => {
    const lines = filteredProxies.map((p) => {
      const ip = p.ip || p.host || "";
      return withProtocol ? p.url || `${p.protocol}://${ip}:${p.port}` : `${ip}:${p.port}`;
    });
    const filename = withProtocol ? "proxies-url.txt" : "proxies-ip-port.txt";
    downloadFile(lines.join("\n"), filename, "text/plain;charset=utf-8");
  };

  const exportJson = () => {
    const jsonStr = JSON.stringify(filteredProxies, null, 2);
    downloadFile(jsonStr, "proxies.json", "application/json;charset=utf-8");
  };

  const exportCsv = () => {
    const headers = [
      "protocol",
      "ip",
      "port",
      "country",
      "asn",
      "asn_org",
      "anon",
      "rtt_ms",
      "uptime_pct",
      "supports_https",
    ];
    const rows = filteredProxies.map((p) => [
      p.protocol,
      p.ip || p.host || "",
      p.port,
      p.country || "",
      p.asn ?? "",
      `"${(p.asn_org || "").replace(/"/g, '""')}"`,
      p.anon || "",
      p.rtt_total_ms ?? "",
      p.uptime_pct !== null && p.uptime_pct !== undefined ? p.uptime_pct.toFixed(1) : "",
      p.supports_https ? "true" : "false",
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadFile(csvContent, "proxies.csv", "text/csv;charset=utf-8");
  };

  const renderLatencyBadge = (proxy: ProxyRecord) => {
    const rtt =
      typeof proxy.rtt_total_ms === "number" && proxy.rtt_total_ms > 0
        ? proxy.rtt_total_ms
        : typeof proxy.timeout === "number"
        ? proxy.timeout * 1000
        : null;

    if (rtt === null) {
      return <span className={styles.latencyBadgeMuted}>-</span>;
    }

    const label = rtt < 1000 ? `${Math.round(rtt)}ms` : `${(rtt / 1000).toFixed(1)}s`;
    let badgeClass = styles.latencyFast;
    if (rtt >= 2000) {
      badgeClass = styles.latencySlow;
    } else if (rtt >= 500) {
      badgeClass = styles.latencyMedium;
    }

    return (
      <span className={`${styles.latencyBadge} ${badgeClass} tabular-nums`}>
        {label}
      </span>
    );
  };

  const renderUptimeBadge = (uptime: number | null | undefined) => {
    if (uptime === null || uptime === undefined) return null;
    let badgeClass = styles.uptimeHigh;
    if (uptime < 60) {
      badgeClass = styles.uptimeLow;
    } else if (uptime < 90) {
      badgeClass = styles.uptimeFair;
    }

    return (
      <span
        className={`${styles.uptimeBadge} ${badgeClass} tabular-nums`}
        title={`Uptime: ${uptime.toFixed(1)}%`}
      >
        {Math.round(uptime)}%
      </span>
    );
  };

  const renderAnonymityBadge = (anon: string | null | undefined) => {
    if (!anon) return null;
    switch (anon.toLowerCase()) {
      case "elite":
        return <span className={`${styles.anonBadge} ${styles.anonElite}`}>Elite</span>;
      case "anonymous":
        return <span className={`${styles.anonBadge} ${styles.anonAnon}`}>Anon</span>;
      case "transparent":
      default:
        return <span className={`${styles.anonBadge} ${styles.anonTransp}`}>Transp</span>;
    }
  };

  const getProtocolBadgeClass = (proto: string) => {
    switch (proto?.toLowerCase()) {
      case "socks5":
        return styles.badgeSocks5;
      case "socks4":
        return styles.badgeSocks4;
      case "https":
        return styles.badgeHttps;
      case "http":
      default:
        return styles.badgeHttp;
    }
  };

  return (
    <div className={styles.container}>
      {/* Search & Controls */}
      <div className={styles.controlsBar}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={17} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={
              dict?.searchPlaceholder ||
              (isRu
                ? "Поиск по IP, порту, стране, ASN, анонимности..."
                : "Search by IP, port, country, ASN, anonymity...")
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter proxies"
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Export */}
        <div className={styles.filterActions}>
          {/* IP Type Filter */}
          <div className={styles.selectGroup}>
            <Server size={14} className={styles.selectIcon} />
            <select
              className={styles.select}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label="Filter by IP type"
            >
              <option value="all">{isRu ? "Тип: Все" : "Type: All"}</option>
              <option value="datacenter">{isRu ? "Датацентр" : "Datacenter"}</option>
              <option value="residential">{isRu ? "Резидентные" : "Residential"}</option>
            </select>
          </div>

          {/* Anonymity Filter */}
          <div className={styles.selectGroup}>
            <ShieldCheck size={14} className={styles.selectIcon} />
            <select
              className={styles.select}
              value={anonymityFilter}
              onChange={(e) => setAnonymityFilter(e.target.value)}
              aria-label="Filter by anonymity level"
            >
              <option value="all">{isRu ? "Анонимность: Все" : "Anon: All"}</option>
              <option value="elite">Elite</option>
              <option value="anonymous">Anonymous</option>
              <option value="transparent">Transparent</option>
            </select>
          </div>

          {/* Latency Filter */}
          <div className={styles.selectGroup}>
            <SlidersHorizontal size={14} className={styles.selectIcon} />
            <select
              className={styles.select}
              value={latencyFilter}
              onChange={(e) => setLatencyFilter(e.target.value)}
              aria-label="Filter by response time"
            >
              <option value="all">{isRu ? "Скорость: Любая" : "Speed: All"}</option>
              <option value="fast">{isRu ? "< 500ms (Быстрые)" : "< 500ms (Fast)"}</option>
              <option value="medium">{isRu ? "500 - 2000ms" : "500 - 2000ms"}</option>
              <option value="slow">{isRu ? "> 2000ms (Медленные)" : "> 2000ms (Slow)"}</option>
            </select>
          </div>

          {/* Sort */}
          <div className={styles.selectGroup}>
            <ArrowUpDown size={14} className={styles.selectIcon} />
            <select
              className={styles.select}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort proxies"
            >
              <option value="default">{isRu ? "По умолчанию" : "Sort: Default"}</option>
              <option value="speed-asc">{isRu ? "Сначала быстрые" : "Fastest first"}</option>
              <option value="speed-desc">{isRu ? "Сначала медленные" : "Slowest first"}</option>
              <option value="uptime-desc">{isRu ? "Лучший аптайм" : "Highest uptime"}</option>
              <option value="ip-asc">{isRu ? "По IP адресу" : "By IP Address"}</option>
            </select>
          </div>

          {/* Quick Export Dropdown */}
          <div className={styles.exportWrapper} ref={exportRef}>
            <button
              type="button"
              className={styles.exportTrigger}
              onClick={() => setExportOpen(!exportOpen)}
              aria-expanded={exportOpen}
              aria-haspopup="true"
            >
              <Download size={15} />
              <span>{dict?.export || (isRu ? "Экспорт" : "Export")}</span>
              <ChevronDown size={14} />
            </button>

            {exportOpen && (
              <div className={styles.exportMenu} role="menu">
                <button
                  type="button"
                  className={styles.exportOption}
                  onClick={() => exportTxt(false)}
                  role="menuitem"
                >
                  <span className={styles.exportFormatTag}>TXT</span>
                  <span>IP:Port</span>
                </button>
                <button
                  type="button"
                  className={styles.exportOption}
                  onClick={() => exportTxt(true)}
                  role="menuitem"
                >
                  <span className={styles.exportFormatTag}>TXT</span>
                  <span>protocol://IP:Port</span>
                </button>
                <button
                  type="button"
                  className={styles.exportOption}
                  onClick={exportJson}
                  role="menuitem"
                >
                  <span className={styles.exportFormatTag}>JSON</span>
                  <span>{isRu ? "Полный JSON массив" : "Full JSON Array"}</span>
                </button>
                <button
                  type="button"
                  className={styles.exportOption}
                  onClick={exportCsv}
                  role="menuitem"
                >
                  <span className={styles.exportFormatTag}>CSV</span>
                  <span>{isRu ? "Таблица CSV" : "Spreadsheet CSV"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Minimalist Live Sync Countdown Indicator */}
          <LiveSyncIndicator
            secondsLeft={secondsLeft}
            isSyncing={isSyncing}
            isUpdatedFlash={isUpdatedFlash}
            onSyncNow={syncNow}
            isRu={isRu}
          />

          {/* Hydra Link */}
          <a
            href="https://github.com/stormsia/hydra"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hydraPill}
            title={
              isRu
                ? "Проверено движком Hydra Rust каждую минуту"
                : "Audited 24/7 by Hydra Rust Engine"
            }
          >
            <Zap size={13} style={{ color: "var(--accent)" }} />
            <span>Hydra</span>
          </a>
        </div>
      </div>

      {/* Active Filter Bar (shown when any filter differs from default) */}
      {hasActiveFilter && (
        <div className={styles.activeFilterBar}>
          <div className={styles.activeFilterTags}>
            <span className={styles.activeFilterLabel}>
              {isRu ? "Активный фильтр:" : "Active filter:"}
            </span>

            {filterType !== "all" && (
              <span className={styles.filterChip}>
                <Server size={12} />
                <span>
                  {filterType === "datacenter"
                    ? isRu
                      ? "Датацентр"
                      : "Datacenter"
                    : isRu
                    ? "Резидентные"
                    : "Residential"}
                </span>
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  aria-label="Clear type filter"
                >
                  ×
                </button>
              </span>
            )}

            {filterProtocol !== "all" && (
              <span className={styles.filterChip}>
                <Globe size={12} />
                <span>{filterProtocol.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={() => setFilterProtocol("all")}
                  aria-label="Clear protocol filter"
                >
                  ×
                </button>
              </span>
            )}

            {filterCountry !== "all" && (
              <span className={styles.filterChip}>
                <MapPin size={12} />
                <span>
                  {getCountryDisplayName(
                    filterCountry,
                    filterCountry.toUpperCase(),
                    isRu ? "ru" : "en"
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setFilterCountry("all")}
                  aria-label="Clear country filter"
                >
                  ×
                </button>
              </span>
            )}

            {searchQuery && (
              <span className={styles.filterChip}>
                <Search size={12} />
                <span>&quot;{searchQuery}&quot;</span>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              </span>
            )}

            {anonymityFilter !== "all" && (
              <span className={styles.filterChip}>
                <ShieldCheck size={12} />
                <span>{anonymityFilter}</span>
                <button
                  type="button"
                  onClick={() => setAnonymityFilter("all")}
                  aria-label="Clear anonymity filter"
                >
                  ×
                </button>
              </span>
            )}

            {latencyFilter !== "all" && (
              <span className={styles.filterChip}>
                <SlidersHorizontal size={12} />
                <span>
                  {latencyFilter === "fast"
                    ? "<500ms"
                    : latencyFilter === "medium"
                    ? "500-2000ms"
                    : ">2000ms"}
                </span>
                <button
                  type="button"
                  onClick={() => setLatencyFilter("all")}
                  aria-label="Clear latency filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          <div className={styles.activeFilterActions}>
            <button
              type="button"
              className={styles.resetFilterBtn}
              onClick={resetAllFilters}
              title={
                isRu
                  ? "Сбросить фильтры и показать весь пул прокси"
                  : "Reset filters and show all proxies"
              }
            >
              <RotateCcw size={13} />
              <span>
                {isRu ? "Сбросить / Показать все" : "Reset / Show all"} ({proxies.length})
              </span>
            </button>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className={styles.catalogLink}
                title={
                  isRu
                    ? "Перейти на главную страницу каталога"
                    : "Go to main proxy catalog"
                }
              >
                <span>{isRu ? "Общий каталог" : "Catalog"}</span>
                <ExternalLink size={12} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Protocol Pills & Live Count */}
      <div className={styles.pillToolbar}>
        <div className={styles.pillsList} role="tablist" aria-label="Filter by protocol">
          {[
            { id: "all", label: dict?.allProtocols || (isRu ? "Все" : "All") },
            { id: "socks5", label: "SOCKS5" },
            { id: "socks4", label: "SOCKS4" },
            { id: "http", label: "HTTP" },
          ].map((item) => {
            const isActive = filterProtocol === item.id;
            const count = protocolCounts[item.id] || 0;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.pillBtn} ${isActive ? styles.pillBtnActive : ""}`}
                onClick={() => setFilterProtocol(item.id)}
              >
                <span>{item.label}</span>
                <span className={styles.pillCount}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.resultsCount}>
          {dict?.showing || (isRu ? "Показано" : "Showing")}{" "}
          <strong className="tabular-nums">{filteredProxies.length}</strong>{" "}
          {dict?.proxiesCount || (isRu ? "прокси" : "proxies")}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label={dict?.tableCaption || "Proxy List"}>
          <thead>
            <tr>
              <th scope="col">{dict?.protocol || (isRu ? "Протокол" : "Protocol")}</th>
              <th scope="col">{dict?.ip || (isRu ? "IP Адрес" : "IP Address")}</th>
              <th scope="col">{dict?.port || (isRu ? "Порт" : "Port")}</th>
              <th scope="col">{dict?.country || (isRu ? "Страна" : "Country")}</th>
              <th scope="col">{dict?.anonymity || (isRu ? "Анонимность" : "Anonymity")}</th>
              <th scope="col">{dict?.speed || (isRu ? "Пинг" : "Latency")}</th>
              <th scope="col">{dict?.uptime || (isRu ? "Аптайм" : "Uptime")}</th>
              <th scope="col" className={styles.alignRight}>
                {dict?.action || (isRu ? "Действие" : "Action")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedProxies.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 0 }}>
                  <div className={styles.emptyTableState}>
                    <div className={styles.emptyIconCircle}>
                      <AlertCircle size={28} style={{ color: "var(--accent)" }} />
                    </div>
                    <h4 className={styles.emptyTitle}>
                      {isRu
                        ? "По выбранным критериям прокси не найдены"
                        : "No proxies match the selected filters"}
                    </h4>
                    <p className={styles.emptySubtitle}>
                      {isRu
                        ? `Валидатор Hydra проверяет сокеты каждую минуту. В пуле доступно ${proxies.length} проверенных прокси.`
                        : `The Hydra engine audits sockets every 60 seconds. There are ${proxies.length} verified proxies in the global pool.`}
                    </p>
                    <div className={styles.emptyButtonGroup}>
                      <button
                        type="button"
                        className={styles.primaryActionButton}
                        onClick={resetAllFilters}
                      >
                        <RotateCcw size={14} />
                        <span>
                          {isRu ? "Показать весь пул прокси" : "Show all proxies in pool"} (
                          {proxies.length})
                        </span>
                      </button>
                      {viewAllHref && (
                        <Link href={viewAllHref} className={styles.secondaryActionButton}>
                          {isRu ? "Перейти в общий каталог" : "Browse global catalog"} →
                        </Link>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedProxies.map((proxy) => {
                const ip = proxy.ip || proxy.host || "";
                const port = proxy.port;
                const id = proxy.id || `${proxy.protocol}-${ip}:${port}`;
                const isCopied = copiedId === id;
                const countryCode = (proxy.country || "").toLowerCase();
                const countryName = getCountryDisplayName(
                  countryCode,
                  countryCode.toUpperCase(),
                  isRu ? "ru" : "en"
                );

                return (
                  <tr key={id} className={styles.tableRow}>
                    <td>
                      <div className={styles.protocolGroup}>
                        <span
                          className={`${styles.badge} ${getProtocolBadgeClass(proxy.protocol)}`}
                        >
                          {proxy.protocol.toUpperCase()}
                        </span>
                        {proxy.supports_https && (
                          <span className={styles.httpsPill} title="Supports HTTPS CONNECT">
                            <Lock size={11} />
                            SSL
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.mono} tabular-nums`}>{ip}</span>
                    </td>
                    <td>
                      <span className={`${styles.mono} tabular-nums`}>{port}</span>
                    </td>
                    <td>
                      {countryCode ? (
                        <Link
                          href={`${isRu ? "/ru" : ""}/country/${countryCode}`}
                          className={styles.countryCell}
                          title={
                            isRu
                              ? `Прокси в регионе ${countryName}`
                              : `Proxies in ${countryName}`
                          }
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <img
                            src={`https://flagcdn.com/24x18/${countryCode}.png`}
                            alt={countryName}
                            className={styles.flag}
                            width={20}
                            height={15}
                            loading="lazy"
                            decoding="async"
                          />
                          <span className={styles.countryName}>{countryName}</span>
                        </Link>
                      ) : (
                        <div className={styles.countryCell}>
                          <span className={styles.flagPlaceholder} />
                          <span className={styles.countryName}>{countryName}</span>
                        </div>
                      )}
                    </td>
                    <td>{renderAnonymityBadge(proxy.anon)}</td>
                    <td>
                      <div className={styles.latencyCell}>{renderLatencyBadge(proxy)}</div>
                    </td>
                    <td>{renderUptimeBadge(proxy.uptime_pct)}</td>
                    <td className={styles.alignRight}>
                      <button
                        type="button"
                        onClick={() => handleCopy(proxy)}
                        className={`${styles.copyBtn} ${isCopied ? styles.copyBtnSuccess : ""}`}
                        aria-label={isCopied ? "Copied IP and port" : `Copy ${ip}:${port}`}
                        title={isCopied ? "Copied to clipboard" : "Click to copy IP:Port"}
                      >
                        {isCopied ? (
                          <Check size={14} className={styles.iconSuccess} />
                        ) : (
                          <Copy size={14} />
                        )}
                        <span>
                          {isCopied
                            ? dict?.copied || (isRu ? "Скопировано" : "Copied")
                            : dict?.copy || (isRu ? "Копировать" : "Copy")}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (renders on screens <= 768px) */}
      <div className={styles.mobileCardList}>
        {paginatedProxies.length === 0 ? (
          <div className={styles.emptyTableState}>
            <div className={styles.emptyIconCircle}>
              <AlertCircle size={28} style={{ color: "var(--accent)" }} />
            </div>
            <h4 className={styles.emptyTitle}>
              {isRu
                ? "По выбранным критериям прокси не найдены"
                : "No proxies match the selected filters"}
            </h4>
            <p className={styles.emptySubtitle}>
              {isRu
                ? `Валидатор Hydra проверяет сокеты каждую минуту. В пуле доступно ${proxies.length} проверенных прокси.`
                : `The Hydra engine audits sockets every 60 seconds. There are ${proxies.length} verified proxies in the global pool.`}
            </p>
            <div className={styles.emptyButtonGroup}>
              <button
                type="button"
                className={styles.primaryActionButton}
                onClick={resetAllFilters}
              >
                <RotateCcw size={14} />
                <span>
                  {isRu ? "Показать весь пул прокси" : "Show all proxies in pool"} ({proxies.length})
                </span>
              </button>
              {viewAllHref && (
                <Link href={viewAllHref} className={styles.secondaryActionButton}>
                  {isRu ? "Перейти в общий каталог" : "Browse global catalog"} →
                </Link>
              )}
            </div>
          </div>
        ) : (
          paginatedProxies.map((proxy) => {
            const ip = proxy.ip || proxy.host || "";
            const port = proxy.port;
            const id = proxy.id || `${proxy.protocol}-${ip}:${port}`;
            const isCopied = copiedId === id;
            const countryCode = (proxy.country || "").toLowerCase();
            const countryName = getCountryDisplayName(
              countryCode,
              countryCode.toUpperCase(),
              isRu ? "ru" : "en"
            );
            const asnOrg = proxy.asn_org;

            return (
              <div key={`m-${id}`} className={styles.proxyCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardCountry}>
                    {countryCode ? (
                      <Link
                        href={`${isRu ? "/ru" : ""}/country/${countryCode}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <img
                          src={`https://flagcdn.com/24x18/${countryCode}.png`}
                          alt={countryName}
                          className={styles.flag}
                          width={20}
                          height={15}
                          loading="lazy"
                          decoding="async"
                        />
                        <span className={styles.countryName}>{countryName}</span>
                      </Link>
                    ) : (
                      <span className={styles.countryName}>{countryName}</span>
                    )}
                  </div>

                  <div className={styles.cardBadges}>
                    <span className={`${styles.badge} ${getProtocolBadgeClass(proxy.protocol)}`}>
                      {proxy.protocol.toUpperCase()}
                    </span>
                    {proxy.supports_https && (
                      <span className={styles.httpsPill} title="Supports HTTPS">
                        <Lock size={10} />
                      </span>
                    )}
                    {renderAnonymityBadge(proxy.anon)}
                  </div>
                </div>

                <div className={styles.cardEndpoint}>
                  <span className={`${styles.cardHostPort} tabular-nums`}>
                    {ip}:{port}
                  </span>
                  {asnOrg && (
                    <span className={styles.cardAsn} title={asnOrg}>
                      {asnOrg}
                    </span>
                  )}
                </div>

                <div className={styles.cardStatsRow}>
                  <div className={styles.cardStatItem}>
                    <span className={styles.statLabel}>{isRu ? "Пинг" : "Latency"}</span>
                    {renderLatencyBadge(proxy)}
                  </div>
                  {proxy.uptime_pct !== null && proxy.uptime_pct !== undefined && (
                    <div className={styles.cardStatItem}>
                      <span className={styles.statLabel}>{isRu ? "Аптайм" : "Uptime"}</span>
                      {renderUptimeBadge(proxy.uptime_pct)}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(proxy)}
                  className={`${styles.cardCopyBtn} ${isCopied ? styles.copyBtnSuccess : ""}`}
                  aria-label={isCopied ? "Copied" : `Copy ${ip}:${port}`}
                >
                  {isCopied ? (
                    <Check size={16} className={styles.iconSuccess} />
                  ) : (
                    <Copy size={16} />
                  )}
                  <span>
                    {isCopied
                      ? dict?.copied || (isRu ? "Скопировано!" : "Copied!")
                      : dict?.copy || (isRu ? "Копировать IP:Port" : "Copy IP:Port")}
                  </span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pageBtn}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            {dict?.previous || (isRu ? "Назад" : "Previous")}
          </button>

          <span className={styles.pageInfo}>
            {dict?.page || (isRu ? "Страница" : "Page")}{" "}
            <strong className="tabular-nums">{currentPage}</strong>{" "}
            {dict?.of || (isRu ? "из" : "of")}{" "}
            <strong className="tabular-nums">{totalPages}</strong>
          </span>

          <button
            type="button"
            className={styles.pageBtn}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            {dict?.next || (isRu ? "Вперед" : "Next")}
          </button>
        </div>
      )}
    </div>
  );
}
