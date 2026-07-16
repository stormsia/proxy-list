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

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`,            lastModified: now, changeFrequency: "daily",  priority: 1.0 },
    { url: `${SITE_URL}/docs`,       lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/socks5`,     lastModified: now, changeFrequency: "daily",  priority: 0.9 },
    { url: `${SITE_URL}/socks4`,     lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${SITE_URL}/http`,       lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${SITE_URL}/https`,      lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${SITE_URL}/residential`,lastModified: now, changeFrequency: "daily",  priority: 0.8 },
    { url: `${SITE_URL}/datacenter`, lastModified: now, changeFrequency: "daily",  priority: 0.8 },
  ];

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

  const countryPages: MetadataRoute.Sitemap = Array.from(countries).map(
    (code) => ({
      url: `${SITE_URL}/country/${code}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: PRIORITY_COUNTRIES.includes(code) ? 0.7 : 0.6,
    })
  );

  return [...staticPages, ...countryPages];
}
