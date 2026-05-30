"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.css";

type Proxy = {
  host: string;
  port: number;
  protocol: string;
  geolocation?: {
    location?: {
      latitude: number;
      longitude: number;
    };
    city?: { names: { en: string } };
    country?: { names: { en: string } };
  };
};

export default function Map({ proxies }: { proxies: Proxy[] }) {
  // Leaflet has issues with Next.js SSR, so we only render on client
  if (typeof window === "undefined") {
    return <div className={styles.mapPlaceholder}>Loading Map...</div>;
  }

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
        {proxies.map((proxy) => {
          if (!proxy.geolocation?.location) return null;
          const { latitude, longitude } = proxy.geolocation.location;
          return (
            <CircleMarker
              key={`${proxy.protocol}-${proxy.host}:${proxy.port}`}
              center={[latitude, longitude]}
              radius={5}
              pathOptions={{
                color: proxy.protocol === "socks5" ? "#10b981" : "#8b5cf6",
                fillColor: proxy.protocol === "socks5" ? "#10b981" : "#8b5cf6",
                fillOpacity: 0.7,
                weight: 1,
              }}
            >
              <Popup className={styles.popup}>
                <div className={styles.popupContent}>
                  <strong>{proxy.host}:{proxy.port}</strong>
                  <br />
                  Protocol: {proxy.protocol.toUpperCase()}
                  <br />
                  Location: {proxy.geolocation.city?.names?.en || "Unknown"}, {proxy.geolocation.country?.names?.en || "Unknown"}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
