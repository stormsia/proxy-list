"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Download,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Server,
  Globe,
  ShieldCheck,
  Lock,
  ArrowUpDown,
  ExternalLink,
  MapPin,
} from "lucide-react";
import styles from "./ProxyTable.module.css";
import { getCountryDisplayName } from "@/lib/countries";
import { isDatacenter, isResidential } from "@/lib/proxy-utils";
import type { ProxyRecord } from "@/lib/types";
import LiveSyncIndicator from "./LiveSyncIndicator";
import { useLiveProxies, type LiveProxiesState } from "@/lib/useLiveProxies";
import { useLiveProxiesContext } from "@/lib/LiveProxiesContext";
import { useDictionary } from "./I18nProvider";

export interface ProxyTableProps {
  proxies: ProxyRecord[];
  dict?: any;
  initialProtocol?: string;
  initialType?: string; // "all", "residential", "datacenter"
  initialCountry?: string; // ISO 2-letter country code
  viewAllHref?: string;
  pageContext?: {
    type: "protocol" | "country" | "category";
    value: string;
    label: string;
  };
  liveState?: LiveProxiesState;
}

export default function ProxyTable(props: ProxyTableProps) {
  const contextLiveState = useLiveProxiesContext();
  const activeLiveState = props.liveState || contextLiveState;

  if (activeLiveState) {
    return <ProxyTableView {...props} liveState={activeLiveState} />;
  }

  return <ProxyTableSelfContained {...props} />;
}

function ProxyTableSelfContained(props: ProxyTableProps) {
  const liveState = useLiveProxies(props.proxies);
  return <ProxyTableView {...props} liveState={liveState} />;
}

function ProxyTableView({
  proxies: passedProxies,
  dict: passedDict,
  initialProtocol = "all",
  initialType = "all",
  initialCountry = "all",
  viewAllHref,
  pageContext,
  liveState,
}: ProxyTableProps & { liveState: LiveProxiesState }) {
  const { dict: globalDict, locale, getPath } = useDictionary();
  const dict = passedDict || globalDict.table;

  // Live real-time proxy sync
  const {
    proxies: liveProxies,
    secondsLeft,
    isSyncing,
    isUpdatedFlash,
    syncNow,
  } = liveState;

  const proxies = liveProxies || passedProxies;

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

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    };
    if (exportOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exportOpen]);

  // Main filter + sort pipeline
  const filteredProxies = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return proxies
      .filter((p) => {
        // Protocol filter
        if (filterProtocol !== "all") {
          if (filterProtocol === "https") {
            if (!p.supports_https) return false;
          } else if (p.protocol?.toLowerCase() !== filterProtocol) {
            return false;
          }
        }

        // IP Type filter (Residential vs Datacenter)
        if (filterType === "datacenter" && !isDatacenter(p.asn_org)) {
          return false;
        }
        if (filterType === "residential" && !isResidential(p.asn_org)) {
          return false;
        }

        // Country filter
        if (filterCountry !== "all" && (p.country || "").toLowerCase() !== filterCountry) {
          return false;
        }

        // Anonymity filter
        if (anonymityFilter !== "all") {
          const proxyAnon = (p.anon || "").toLowerCase();
          if (proxyAnon !== anonymityFilter) {
            return false;
          }
        }

        // Latency filter
        if (latencyFilter !== "all") {
          const rtt = p.rtt_total_ms;
          if (typeof rtt !== "number" || rtt <= 0) return false;
          if (latencyFilter === "fast" && rtt >= 500) return false;
          if (latencyFilter === "medium" && (rtt < 500 || rtt > 2000)) return false;
          if (latencyFilter === "slow" && rtt <= 2000) return false;
        }

        // Search query filter
        if (normalizedQuery) {
          const ipVal = (p.ip || p.host || "").toLowerCase();
          const portVal = (p.port || "").toString();
          const countryCode = (p.country || "").toLowerCase();
          const countryName = getCountryDisplayName(
            countryCode,
            countryCode.toUpperCase(),
            locale
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
    locale,
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
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProxies.slice(start, start + PAGE_SIZE);
  }, [filteredProxies, currentPage]);

  // Copy handler
  const handleCopy = (proxy: ProxyRecord) => {
    const ip = proxy.ip || proxy.host;
    const text = `${ip}:${proxy.port}`;
    navigator.clipboard.writeText(text);
    const id = proxy.id || `${proxy.protocol}-${ip}:${proxy.port}`;
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === id ? null : curr));
    }, 2000);
  };

  // Export handlers
  const exportTxt = (withScheme = false) => {
    const lines = filteredProxies.map((p) => {
      const ip = p.ip || p.host;
      return withScheme ? `${p.protocol}://${ip}:${p.port}` : `${ip}:${p.port}`;
    });
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proxies_${filterProtocol}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(filteredProxies, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proxies_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportCsv = () => {
    const header = [
      "protocol",
      "ip",
      "port",
      "country",
      "asn",
      "asn_org",
      "latency_ms",
      "uptime_pct",
      "anon",
    ];
    const rows = filteredProxies.map((p) => [
      p.protocol,
      p.ip || p.host,
      p.port,
      p.country || "",
      p.asn || "",
      `"${(p.asn_org || "").replace(/"/g, '""')}"`,
      p.rtt_total_ms || "",
      p.uptime_pct !== undefined ? p.uptime_pct : "",
      p.anon || "",
    ]);
    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proxies_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  // Badge helpers
  const getProtocolBadgeClass = (proto: string) => {
    switch (proto.toLowerCase()) {
      case "socks5":
        return styles.badgeSocks5;
      case "socks4":
        return styles.badgeSocks4;
      case "http":
        return styles.badgeHttp;
      case "https":
        return styles.badgeHttps;
      default:
        return "";
    }
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

  return (
    <div className={styles.container}>
      {/* Search & Controls */}
      <div className={styles.controlsBar}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={17} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={dict.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label={dict.filterProxiesAria || "Filter proxies"}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery("")}
              aria-label={dict.clearSearchAria || "Clear search input"}
            >
              ×
            </button>
          )}
        </div>

        <div className={styles.filterActions}>
          {/* IP Type Filter */}
          <div className={styles.selectGroup}>
            <Server size={14} className={styles.selectIcon} />
            <select
              className={styles.select}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              aria-label={dict.filterTypeAria || "Filter by IP type"}
            >
              <option value="all">{dict.typeAll}</option>
              <option value="datacenter">{dict.datacenter}</option>
              <option value="residential">{dict.residential}</option>
            </select>
          </div>

          {/* Anonymity Filter */}
          <div className={styles.selectGroup}>
            <ShieldCheck size={14} className={styles.selectIcon} />
            <select
              className={styles.select}
              value={anonymityFilter}
              onChange={(e) => setAnonymityFilter(e.target.value)}
              aria-label={dict.filterAnonAria || "Filter by anonymity level"}
            >
              <option value="all">{dict.anonAll}</option>
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
              aria-label={dict.filterLatencyAria || "Filter by response time"}
            >
              <option value="all">{dict.speedAll}</option>
              <option value="fast">{dict.speedFast}</option>
              <option value="medium">{dict.speedMedium}</option>
              <option value="slow">{dict.speedSlow}</option>
            </select>
          </div>

          {/* Sort */}
          <div className={styles.selectGroup}>
            <ArrowUpDown size={14} className={styles.selectIcon} />
            <select
              className={styles.select}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label={dict.sortProxiesAria || "Sort proxies"}
            >
              <option value="default">{dict.sortDefault}</option>
              <option value="speed-asc">{dict.sortSpeedAsc}</option>
              <option value="speed-desc">{dict.sortSpeedDesc}</option>
              <option value="uptime-desc">{dict.sortUptimeDesc}</option>
              <option value="ip-asc">{dict.sortIpAsc}</option>
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
              <span>{dict.export}</span>
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
                  <span>{dict.fullJson}</span>
                </button>
                <button
                  type="button"
                  className={styles.exportOption}
                  onClick={exportCsv}
                  role="menuitem"
                >
                  <span className={styles.exportFormatTag}>CSV</span>
                  <span>{dict.csvSpreadsheet}</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Sync Status Pill */}
          <LiveSyncIndicator
            secondsLeft={secondsLeft}
            isSyncing={isSyncing}
            isUpdatedFlash={isUpdatedFlash}
            onSyncNow={syncNow}
          />

          {/* Hydra Link */}
          <a
            href="https://github.com/stormsia/hydra"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.hydraPill}
            title={dict.hydraTitle}
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
              {dict.activeFilter}
            </span>

            {filterType !== "all" && (
              <span className={styles.filterChip}>
                <Server size={12} />
                <span>
                  {filterType === "datacenter"
                    ? dict.datacenter
                    : dict.residential}
                </span>
                <button
                  type="button"
                  onClick={() => setFilterType("all")}
                  aria-label={dict.clearTypeFilterAria || "Clear type filter"}
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
                  aria-label={dict.clearProtocolFilterAria || "Clear protocol filter"}
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
                    locale
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setFilterCountry("all")}
                  aria-label={dict.clearCountryFilterAria || "Clear country filter"}
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
                  aria-label={dict.clearSearchFilterAria || "Clear search"}
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
                  aria-label={dict.clearAnonFilterAria || "Clear anonymity filter"}
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
                  aria-label={dict.clearLatencyFilterAria || "Clear latency filter"}
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
              title={dict.resetFiltersTitle}
            >
              <RotateCcw size={13} />
              <span>
                {dict.resetFilters} ({proxies.length})
              </span>
            </button>
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className={styles.catalogLink}
                title={dict.catalogTitle}
              >
                <span>{dict.catalog}</span>
                <ExternalLink size={12} />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Protocol Pills & Live Count */}
      <div className={styles.pillToolbar}>
        <div className={styles.pillsList} role="group" aria-label={dict.filterProtocolGroupAria || "Filter by protocol"}>
          {[
            { id: "all", label: dict.allProtocols },
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
                aria-pressed={isActive}
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
          {dict.showing}{" "}
          <strong className="tabular-nums">{filteredProxies.length}</strong>{" "}
          {dict.proxiesCount}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label={dict.tableCaption || "Proxy List"}>
          <thead>
            <tr>
              <th scope="col">{dict.protocol}</th>
              <th scope="col">{dict.ip}</th>
              <th scope="col">{dict.port}</th>
              <th scope="col">{dict.country}</th>
              <th scope="col">{dict.anonymity}</th>
              <th scope="col">{dict.speed}</th>
              <th scope="col">{dict.uptime}</th>
              <th scope="col" className={styles.alignRight}>
                {dict.action}
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
                      {dict.emptyTitle}
                    </h4>
                    <p className={styles.emptySubtitle}>
                      {dict.emptySubtitle.replace("{count}", String(proxies.length))}
                    </p>
                    <div className={styles.emptyButtonGroup}>
                      <button
                        type="button"
                        className={styles.primaryActionButton}
                        onClick={resetAllFilters}
                      >
                        <RotateCcw size={14} />
                        <span>
                          {dict.showAllInPool} ({proxies.length})
                        </span>
                      </button>
                      {viewAllHref && (
                        <Link href={viewAllHref} className={styles.secondaryActionButton}>
                          {dict.browseCatalog} →
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
                  locale
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
                          href={getPath(`/country/${countryCode}`)}
                          className={styles.countryCell}
                          title={dict.countryTitle.replace("{country}", countryName)}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <picture className={styles.flagPicture}>
                            <source srcSet={`https://flagcdn.com/24x18/${countryCode}.webp`} type="image/webp" />
                            <img
                              src={`https://flagcdn.com/24x18/${countryCode}.png`}
                              alt={countryName}
                              className={styles.flag}
                              width={20}
                              height={15}
                              loading="lazy"
                              decoding="async"
                            />
                          </picture>
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
                        aria-label={
                          isCopied
                            ? (dict.copiedIpPortAria || "Copied IP and port")
                            : (dict.copyIpPortAria
                                ? dict.copyIpPortAria.replace("{ip}", ip).replace("{port}", String(port))
                                : `Copy ${ip}:${port}`)
                        }
                        title={isCopied ? dict.copiedExclamation : dict.copyIpPort}
                      >
                        {isCopied ? (
                          <Check size={14} className={styles.iconSuccess} />
                        ) : (
                          <Copy size={14} />
                        )}
                        <span>
                          {isCopied ? dict.copied : dict.copy}
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
              {dict.emptyTitle}
            </h4>
            <p className={styles.emptySubtitle}>
              {dict.emptySubtitle.replace("{count}", String(proxies.length))}
            </p>
            <div className={styles.emptyButtonGroup}>
              <button
                type="button"
                className={styles.primaryActionButton}
                onClick={resetAllFilters}
              >
                <RotateCcw size={14} />
                <span>
                  {dict.showAllInPool} ({proxies.length})
                </span>
              </button>
              {viewAllHref && (
                <Link href={viewAllHref} className={styles.secondaryActionButton}>
                  {dict.browseCatalog} →
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
              locale
            );
            const asnOrg = proxy.asn_org;

            return (
              <div key={`m-${id}`} className={styles.proxyCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardCountry}>
                    {countryCode ? (
                      <Link
                        href={getPath(`/country/${countryCode}`)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <picture className={styles.flagPicture}>
                          <source srcSet={`https://flagcdn.com/24x18/${countryCode}.webp`} type="image/webp" />
                          <img
                            src={`https://flagcdn.com/24x18/${countryCode}.png`}
                            alt={countryName}
                            className={styles.flag}
                            width={20}
                            height={15}
                            loading="lazy"
                            decoding="async"
                          />
                        </picture>
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
                    <span className={styles.statLabel}>{dict.latency}</span>
                    {renderLatencyBadge(proxy)}
                  </div>
                  {proxy.uptime_pct !== null && proxy.uptime_pct !== undefined && (
                    <div className={styles.cardStatItem}>
                      <span className={styles.statLabel}>{dict.uptime}</span>
                      {renderUptimeBadge(proxy.uptime_pct)}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(proxy)}
                  className={`${styles.cardCopyBtn} ${isCopied ? styles.copyBtnSuccess : ""}`}
                  aria-label={
                    isCopied
                      ? (dict.copiedIpPortAria || "Copied IP and port")
                      : (dict.copyIpPortAria
                          ? dict.copyIpPortAria.replace("{ip}", ip).replace("{port}", String(port))
                          : `Copy ${ip}:${port}`)
                  }
                >
                  {isCopied ? (
                    <Check size={16} className={styles.iconSuccess} />
                  ) : (
                    <Copy size={16} />
                  )}
                  <span>
                    {isCopied ? dict.copied : dict.copy}
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
            aria-label={dict.prevPageAria || "Previous page"}
          >
            {dict.previous}
          </button>

          <span className={styles.pageInfo}>
            {dict.page}{" "}
            <strong className="tabular-nums">{currentPage}</strong>{" "}
            {dict.of}{" "}
            <strong className="tabular-nums">{totalPages}</strong>
          </span>

          <button
            type="button"
            className={styles.pageBtn}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            aria-label={dict.nextPageAria || "Next page"}
          >
            {dict.next}
          </button>
        </div>
      )}
    </div>
  );
}
