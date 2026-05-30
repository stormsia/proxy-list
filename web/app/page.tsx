import dynamic from "next/dynamic";
import { promises as fs } from "fs";
import path from "path";
import ProxyTable from "@/components/ProxyTable";
import styles from "./page.module.css";
import { Activity, Zap, Globe2 } from "lucide-react";
import MapClient from "@/components/MapClient";
import { Metadata } from "next";
import Link from "next/link";
import FAQ from "@/components/FAQ";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  title: "Free Proxy List | SOCKS5 · HTTP · HTTPS · SOCKS4",
  description:
    "Download a free, auto-updated proxy list with SOCKS5, HTTP, HTTPS and SOCKS4 proxies. Verified by a high-speed validator. Machine-readable JSON API available — no registration required.",
  keywords: [
    "free proxy list",
    "socks5 proxy list",
    "http proxy list",
    "public proxies",
    "free socks5 proxy",
    "anonymous proxy server",
    "proxy checker",
    "free proxy download",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Free Proxy List | SOCKS5 · HTTP · HTTPS · SOCKS4",
    description:
      "Auto-updated free proxy list. SOCKS5, HTTP, HTTPS, SOCKS4. JSON API available.",
    url: SITE_URL,
  },
};

import HomeView from "@/components/views/HomeView";

export default function Home() {
  return <HomeView lang="en" />;
}

