import type { NextConfig } from "next";
import path from "node:path";
import fs from "node:fs";

// Pre-sync data/proxies.json to web/public for static export and client-side downloads
try {
  const rootData = path.resolve(__dirname, "../data/proxies.json");
  const publicDataDir = path.resolve(__dirname, "public/data");
  const publicDataFile = path.resolve(publicDataDir, "proxies.json");
  const publicFile = path.resolve(__dirname, "public/proxies.json");

  if (fs.existsSync(rootData)) {
    if (!fs.existsSync(publicDataDir)) {
      fs.mkdirSync(publicDataDir, { recursive: true });
    }
    fs.copyFileSync(rootData, publicDataFile);
    fs.copyFileSync(rootData, publicFile);
  }
} catch {
  // Silent fallback
}

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/proxy-list",
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
