import { MetadataRoute } from "next";
import { getStaticCountryParams } from "@/lib/proxies";

export const dynamic = "force-static";

const SITE_URL = "https://stormsia.github.io/proxy-list";

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

  // Helper to generate paired en/ru entries with bidirectional hreflang alternates
  const addLocalizedPair = (
    enPath: string,
    ruPath: string,
    priority: number,
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  ) => {
    const enUrl = `${SITE_URL}${enPath}`;
    const ruUrl = `${SITE_URL}${ruPath}`;

    const languages = {
      en: enUrl,
      ru: ruUrl,
      "x-default": enUrl,
    };

    // English entry
    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages,
      },
    });

    // Russian entry
    entries.push({
      url: ruUrl,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages,
      },
    });
  };

  // Add static core pages
  for (const route of coreRoutes) {
    const enPath = route.path;
    const ruPath = `/ru${route.path}`;
    addLocalizedPair(enPath, ruPath, route.priority, route.changeFrequency);
  }

  // Add dynamic country pages (100% parity with static generation)
  for (const { code } of countryParams) {
    const isPriority = PRIORITY_COUNTRIES.includes(code.toLowerCase());
    const priority = isPriority ? 0.7 : 0.6;
    const enPath = `/country/${code.toLowerCase()}`;
    const ruPath = `/ru/country/${code.toLowerCase()}`;
    addLocalizedPair(enPath, ruPath, priority, "daily");
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
