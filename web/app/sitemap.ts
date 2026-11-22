import { MetadataRoute } from "next";
import { getStaticCountryParams } from "@/lib/proxies";
import { LOCALES, DEFAULT_LOCALE, getCanonicalUrl, SITE_URL } from "@/lib/i18n";

export const dynamic = "force-static";

const PRIORITY_COUNTRIES = [
  "us", "de", "gb", "nl", "fr", "ca", "ru", "ua",
  "cn", "br", "in", "jp", "sg",
];

interface RouteDef {
  path: string;
  priority: number;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const coreRoutes: RouteDef[] = [
    { path: "",             priority: 1.0, changeFrequency: "daily" },
    { path: "/docs",        priority: 0.9, changeFrequency: "weekly" },
    { path: "/socks5",      priority: 0.9, changeFrequency: "daily" },
    { path: "/socks4",      priority: 0.8, changeFrequency: "daily" },
    { path: "/http",        priority: 0.8, changeFrequency: "daily" },
    { path: "/https",       priority: 0.8, changeFrequency: "daily" },
    { path: "/residential", priority: 0.8, changeFrequency: "daily" },
    { path: "/datacenter",  priority: 0.8, changeFrequency: "daily" },
    { path: "/about",       priority: 0.8, changeFrequency: "monthly" },
    { path: "/privacy",     priority: 0.7, changeFrequency: "monthly" },
  ];

  const countryParams = await getStaticCountryParams();

  const entries: MetadataRoute.Sitemap = [];

  // Helper to generate localized entries with bidirectional hreflang alternates
  const addLocalizedEntries = (
    basePath: string,
    priority: number,
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  ) => {
    const languages: Record<string, string> = {};
    LOCALES.forEach((locale) => {
      languages[locale] = getCanonicalUrl(basePath, locale);
    });
    languages["x-default"] = getCanonicalUrl(basePath, DEFAULT_LOCALE);

    LOCALES.forEach((locale) => {
      entries.push({
        url: getCanonicalUrl(basePath, locale),
        lastModified: now,
        changeFrequency,
        priority,
        alternates: {
          languages,
        },
      });
    });
  };

  // Add static core pages
  for (const route of coreRoutes) {
    addLocalizedEntries(route.path, route.priority, route.changeFrequency);
  }

  // Add dynamic country pages (100% parity with static generation)
  for (const { code } of countryParams) {
    const isPriority = PRIORITY_COUNTRIES.includes(code.toLowerCase());
    const priority = isPriority ? 0.7 : 0.6;
    addLocalizedEntries(`/country/${code.toLowerCase()}`, priority, "daily");
  }

  // Machine-readable AI Agent discovery manifests
  const aiManifests: { path: string; priority: number; changeFrequency: RouteDef["changeFrequency"] }[] = [
    { path: "/llms.txt",                    priority: 0.8, changeFrequency: "daily" },
    { path: "/llms-full.txt",               priority: 0.8, changeFrequency: "daily" },
    { path: "/.well-known/ai-catalog.json", priority: 0.8, changeFrequency: "daily" },
    { path: "/ai-catalog.json",             priority: 0.7, changeFrequency: "daily" },
    { path: "/pricing.md",                  priority: 0.7, changeFrequency: "weekly" },
    { path: "/AGENTS.md",                   priority: 0.7, changeFrequency: "weekly" },
  ];

  for (const manifest of aiManifests) {
    entries.push({
      url: `${SITE_URL}${manifest.path}`,
      lastModified: now,
      changeFrequency: manifest.changeFrequency,
      priority: manifest.priority,
    });
  }

  return entries;
}
