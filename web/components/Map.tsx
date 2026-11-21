/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Copy, Check } from "lucide-react";
import Link from "next/link";
import type { ProxyItem } from "@/lib/types";
import { getCountryDisplayName } from "@/lib/countries";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";

// ISO 3166-1 alpha-2 centroids for country cluster mapping
const COUNTRY_CENTROIDS: Record<string, [number, number]> = {
  af: [33.93, 67.71],
  ar: [-38.41, -63.61],
  au: [-25.27, 133.77],
  az: [40.14, 47.57],
  bd: [23.68, 90.35],
  be: [50.50, 4.46],
  bg: [42.73, 25.48],
  bi: [-3.37, 29.91],
  br: [-14.23, -51.92],
  ca: [56.13, -106.34],
  cd: [-4.03, 21.75],
  ch: [46.81, 8.22],
  cm: [7.36, 12.35],
  cn: [35.86, 104.19],
  co: [4.57, -74.29],
  cz: [49.81, 15.47],
  de: [51.16, 10.45],
  dk: [56.26, 9.50],
  ec: [-1.83, -78.18],
  eg: [26.82, 30.80],
  es: [40.46, -3.74],
  fi: [61.92, 25.74],
  fr: [46.22, 2.21],
  gb: [55.37, -3.43],
  hk: [22.31, 114.16],
  hn: [15.19, -86.24],
  id: [-0.78, 113.92],
  ie: [53.14, -7.69],
  in: [20.59, 78.96],
  iq: [33.22, 43.67],
  it: [41.87, 12.56],
  jp: [36.20, 138.25],
  kg: [41.20, 74.76],
  kh: [12.56, 104.99],
  kr: [35.90, 127.76],
  kz: [48.01, 66.92],
  lt: [55.16, 23.88],
  lv: [56.87, 24.60],
  mw: [-13.25, 34.30],
  mx: [23.63, -102.55],
  my: [4.21, 101.97],
  nl: [52.13, 5.29],
  no: [60.47, 8.46],
  np: [28.39, 84.12],
  ph: [12.87, 121.77],
  pk: [30.37, 69.34],
  pl: [51.91, 19.14],
  ro: [45.94, 24.96],
  rs: [44.01, 21.00],
  ru: [61.52, 105.31],
  se: [60.12, 18.64],
  sg: [1.35, 103.81],
  sy: [34.80, 38.99],
  th: [15.87, 100.99],
  tr: [38.96, 35.24],
  ua: [48.37, 31.16],
  us: [37.09, -95.71],
  vn: [14.05, 108.27],
  za: [-30.55, 22.93],
  zw: [-19.01, 29.15],
};

interface CountryMarker {
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  count: number;
  protocols: Record<string, number>;
  sampleUrl: string;
  sampleEndpoint: string;
}

export default function InteractiveMap({ proxies }: { proxies: ProxyItem[] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Group proxies by country centroid for high-performance rendering (60 FPS, ~50 nodes)
  const markers = useMemo<CountryMarker[]>(() => {
    const map = new globalThis.Map<string, CountryMarker>();

    for (const proxy of proxies) {
      // Resolve country code from flat .country
      const rawCode = proxy.country || "";
      if (!rawCode) continue;

      const code = rawCode.toLowerCase();
      const coords = COUNTRY_CENTROIDS[code];
      if (!coords) continue;

      const proto = (proxy.protocol || "http").toLowerCase();
      const endpoint = `${proxy.ip || proxy.host}:${proxy.port}`;
      const url = proxy.url || `${proto}://${endpoint}`;

      const existing = map.get(code);
      if (existing) {
        existing.count += 1;
        existing.protocols[proto] = (existing.protocols[proto] || 0) + 1;
      } else {
        map.set(code, {
          code,
          name: getCountryDisplayName(code, code.toUpperCase(), "en"),
          latitude: coords[0],
          longitude: coords[1],
          count: 1,
          protocols: { [proto]: 1 },
          sampleUrl: url,
          sampleEndpoint: endpoint,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [proxies]);

  if (typeof window === "undefined") {
    return <div className={styles.mapPlaceholder}>Loading Map...</div>;
  }

  const handleCopy = (marker: CountryMarker) => {
    navigator.clipboard.writeText(marker.sampleUrl);
    setCopiedCode(marker.code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getMarkerRadius = (count: number) => {
    return Math.min(18, Math.max(6, Math.round(Math.sqrt(count) * 2.2 + 4)));
  };

  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {markers.map((marker) => {
          const isCopied = copiedCode === marker.code;
          const radius = getMarkerRadius(marker.count);

          return (
            <CircleMarker
              key={marker.code}
              center={[marker.latitude, marker.longitude]}
              radius={radius}
              pathOptions={{
                color: "#10b981",
                fillColor: "#10b981",
                fillOpacity: 0.65,
                weight: 1.5,
              }}
            >
              <Popup className={styles.popup}>
                <div className={styles.popupContent}>
                  <div className={styles.popupCountryHeader}>
                    <img
                      src={`https://flagcdn.com/24x18/${marker.code}.png`}
                      alt={marker.name}
                      width={20}
                      height={15}
                      loading="lazy"
                      decoding="async"
                      className={styles.popupFlag}
                    />
                    <span className={styles.popupCountryName}>{marker.name}</span>
                  </div>

                  <div className={styles.popupStat}>
                    {marker.count} verified {marker.count === 1 ? "proxy" : "proxies"}
                  </div>

                  <div className={styles.popupProtocols}>
                    {Object.entries(marker.protocols).map(([proto, count]) => (
                      <span
                        key={proto}
                        className={`${styles.popupBadge} ${
                          proto === "socks5"
                            ? styles.popupBadgeSocks5
                            : proto === "socks4"
                            ? styles.popupBadgeSocks4
                            : proto === "https"
                            ? styles.popupBadgeHttps
                            : styles.popupBadgeHttp
                        }`}
                      >
                        {proto.toUpperCase()}: {count}
                      </span>
                    ))}
                  </div>

                  <div className={styles.popupHost}>
                    Sample: {marker.sampleEndpoint}
                  </div>

                  <div className={styles.popupFooter}>
                    <button
                      type="button"
                      className={styles.popupCopyBtn}
                      onClick={() => handleCopy(marker)}
                      aria-label={`Copy sample proxy for ${marker.name}`}
                    >
                      {isCopied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{isCopied ? "Copied" : "Copy"}</span>
                    </button>

                    <Link
                      href={`/country/${marker.code}`}
                      className={styles.popupLink}
                    >
                      View all &rarr;
                    </Link>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
