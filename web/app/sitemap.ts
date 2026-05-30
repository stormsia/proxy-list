import { MetadataRoute } from "next";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-static";

const SITE_URL = "https://stormsia.github.io/proxy-list";

const PRIORITY_COUNTRIES = [
  "us", "de", "gb", "nl", "fr", "ca", "ru", "ua",
  "cn", "br", "in", "jp", "sg",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/docs", priority: 0.9, freq: "weekly" as const },
    { path: "/socks5", priority: 0.9, freq: "daily" as const },
    { path: "/socks4", priority: 0.8, freq: "daily" as const },
    { path: "/http", priority: 0.8, freq: "daily" as const },
    { path: "/https", priority: 0.8, freq: "daily" as const },
    { path: "/residential", priority: 0.8, freq: "daily" as const },
    { path: "/datacenter", priority: 0.8, freq: "daily" as const },
  ];

  const staticPages: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.freq,
    priority: route.priority,
    alternates: {
      languages: {
        en: `${SITE_URL}${route.path}`,
        ru: `${SITE_URL}/ru${route.path}`,
      }
    }
  }));

  const ruStaticPages: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${SITE_URL}/ru${route.path}`,
    lastModified: now,
    changeFrequency: route.freq,
    priority: route.priority,
    alternates: {
      languages: {
        en: `${SITE_URL}${route.path}`,
        ru: `${SITE_URL}/ru${route.path}`,
      }
    }
  }));

  // Collect all countries from the proxy list
  let countries = new Set<string>(PRIORITY_COUNTRIES);
  try {
    const filePath = path.join(process.cwd(), "public", "proxies.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const proxies = JSON.parse(fileContents);
    proxies.forEach((p: any) => {
      if (p.geolocation?.country?.iso_code) {
        countries.add(p.geolocation.country.iso_code.toLowerCase());
      }
    });
  } catch {
    // fallback: only use priority countries
  }

  const countryPages: MetadataRoute.Sitemap = Array.from(countries).flatMap(code => [
    {
      url: `${SITE_URL}/country/${code}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: PRIORITY_COUNTRIES.includes(code) ? 0.7 : 0.6,
      alternates: {
        languages: {
          en: `${SITE_URL}/country/${code}`,
          ru: `${SITE_URL}/ru/country/${code}`,
        }
      }
    },
    {
      url: `${SITE_URL}/ru/country/${code}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: PRIORITY_COUNTRIES.includes(code) ? 0.7 : 0.6,
      alternates: {
        languages: {
          en: `${SITE_URL}/country/${code}`,
          ru: `${SITE_URL}/ru/country/${code}`,
        }
      }
    }
  ]);

  return [...staticPages, ...ruStaticPages, ...countryPages];
}
