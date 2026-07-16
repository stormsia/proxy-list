"use client";

import { useState, useMemo } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import styles from "./ProxyTable.module.css";

type Proxy = {
  protocol: string;
  host: string;
  port: number;
  timeout: number;
  geolocation: {
    country: {
      iso_code: string;
      names: { en: string };
    };
    city?: {
      names: { en: string };
    };
  };
};

export default function ProxyTable({ proxies }: { proxies: Proxy[] }) {
  const [filterProtocol, setFilterProtocol] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 50;

  const filteredProxies = useMemo(() => {
    return proxies.filter((p) => {
      if (filterProtocol !== "all" && p.protocol !== filterProtocol) return false;
      return true;
    });
  }, [proxies, filterProtocol]);

  const totalPages = Math.ceil(filteredProxies.length / PAGE_SIZE);
  const paginatedProxies = useMemo(() => {
    return filteredProxies.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [filteredProxies, currentPage]);

  // Reset page when filter changes
  useMemo(() => setCurrentPage(1), [filterProtocol]);

  const handleCopy = (proxy: Proxy) => {
    const url = `${proxy.protocol}://${proxy.host}:${proxy.port}`;
    navigator.clipboard.writeText(url);
    const id = `${proxy.protocol}-${proxy.host}:${proxy.port}`;
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <select
            className={styles.select}
            value={filterProtocol}
            onChange={(e) => setFilterProtocol(e.target.value)}
          >
            <option value="all">All Protocols</option>
            <option value="http">HTTP</option>
            <option value="socks4">SOCKS4</option>
            <option value="socks5">SOCKS5</option>
          </select>
        </div>
        <div className={styles.stats}>
          Showing <span>{filteredProxies.length}</span> proxies
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Protocol</th>
              <th>IP Address</th>
              <th>Port</th>
              <th>Country</th>
              <th>Speed (s)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProxies.map((proxy) => {
              // Need protocol in ID because the same proxy host:port might support multiple protocols
              const id = `${proxy.protocol}-${proxy.host}:${proxy.port}`;
              const isCopied = copiedId === id;
              const countryCode = proxy.geolocation?.country?.iso_code?.toLowerCase() || "unknown";
              
              return (
                <tr key={id}>
                  <td>
                    <span className={`${styles.badge} ${styles[proxy.protocol]}`}>
                      {proxy.protocol.toUpperCase()}
                    </span>
                  </td>
                  <td className={styles.mono}>{proxy.host}</td>
                  <td className={styles.mono}>{proxy.port}</td>
                  <td>
                    <div className={styles.countryCell}>
                      {countryCode !== "unknown" && (
                        <img 
                          src={`https://flagcdn.com/24x18/${countryCode}.png`} 
                          alt={proxy.geolocation.country.names.en} 
                          className={styles.flag}
                        />
                      )}
                      <span>{proxy.geolocation?.country?.names?.en || "Unknown"}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.speedCell}>
                      <div className={styles.speedBar}>
                        <div 
                          className={styles.speedFill} 
                          style={{ width: `${Math.max(10, 100 - (proxy.timeout * 10))}%`, backgroundColor: proxy.timeout < 2 ? 'var(--primary)' : proxy.timeout < 5 ? '#eab308' : '#ef4444' }}
                        />
                      </div>
                      <span className={styles.mono}>{proxy.timeout.toFixed(2)}s</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleCopy(proxy)}
                      className={`${styles.copyBtn} ${isCopied ? styles.copied : ""}`}
                    >
                      {isCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
