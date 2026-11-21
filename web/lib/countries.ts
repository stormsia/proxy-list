import { CountryMetadata } from "./types";

export const ALL_ISO_COUNTRY_CODES = [
  "af", "al", "dz", "as", "ad", "ao", "ai", "aq", "ag", "ar", "am", "aw", "au", "at", "az",
  "bs", "bh", "bd", "bb", "by", "be", "bz", "bj", "bm", "bt", "bo", "ba", "bw", "bv", "br",
  "io", "bn", "bg", "bf", "bi", "kh", "cm", "ca", "cv", "ky", "cf", "td", "cl", "cn", "cx",
  "cc", "co", "km", "cg", "cd", "ck", "cr", "ci", "hr", "cu", "cy", "cz", "dk", "dj", "dm",
  "do", "ec", "eg", "sv", "gq", "er", "ee", "et", "fk", "fo", "fj", "fi", "fr", "gf", "pf",
  "tf", "ga", "gm", "ge", "de", "gh", "gi", "gr", "gl", "gd", "gp", "gu", "gt", "gn", "gw",
  "gy", "ht", "hm", "va", "hn", "hk", "hu", "is", "in", "id", "ir", "iq", "ie", "il", "it",
  "jm", "jp", "jo", "kz", "ke", "ki", "kp", "kr", "kw", "kg", "la", "lv", "lb", "ls", "lr",
  "ly", "li", "lt", "lu", "mo", "mk", "mg", "mw", "my", "mv", "ml", "mt", "mh", "mq", "mr",
  "mu", "yt", "mx", "fm", "md", "mc", "mn", "me", "ms", "ma", "mz", "mm", "na", "nr", "np",
  "nl", "nc", "nz", "ni", "ne", "ng", "nu", "nf", "mp", "no", "om", "pk", "pw", "ps", "pa",
  "pg", "py", "pe", "ph", "pn", "pl", "pt", "pr", "qa", "re", "ro", "ru", "rw", "sh", "kn",
  "lc", "pm", "vc", "ws", "sm", "st", "sa", "sn", "rs", "sc", "sl", "sg", "sk", "si", "sb",
  "so", "za", "gs", "es", "lk", "sd", "sr", "sj", "sz", "se", "ch", "sy", "tw", "tj", "tz",
  "th", "tl", "tg", "tk", "to", "tt", "tn", "tr", "tm", "tc", "tv", "ug", "ua", "ae", "gb",
  "us", "um", "uy", "uz", "vu", "ve", "vn", "vg", "vi", "wf", "eh", "ye", "zm", "zw"
];

export const COUNTRY_META: Record<string, CountryMetadata> = {
  us: {
    code: "us",
    name: "United States",
    nameRu: "США",
    titleEn: "Free USA Proxy List | United States Proxy Servers",
    titleRu: "Бесплатные Прокси США | SOCKS5 & HTTP Прокси в США",
    descriptionEn:
      "Download a free USA proxy list with SOCKS5, HTTP and HTTPS servers located in the United States. Updated every minute by Hydra engine.",
    descriptionRu:
      "Бесплатный список прокси-серверов США (US). Быстрые SOCKS5, HTTP и HTTPS прокси с автообновлением каждую минуту движком Hydra.",
    keywordsEn: ["usa proxy list", "us proxy server", "united states proxy", "free us socks5"],
    keywordsRu: ["прокси сша", "прокси сша бесплатно", "us proxy list", "socks5 сша"],
  },
  de: {
    code: "de",
    name: "Germany",
    nameRu: "Германия",
    titleEn: "Free Germany Proxy List | German Proxy Servers",
    titleRu: "Бесплатные Прокси Германии | Немецкие SOCKS5 & HTTP Прокси",
    descriptionEn:
      "Get a free German proxy list. Fast SOCKS5 and HTTP proxy servers physically located in Germany (DE). Verified by Hydra.",
    descriptionRu:
      "Бесплатный список прокси в Германии (DE). Быстрые SOCKS5 и HTTP серверы, проверенные движком Hydra.",
    keywordsEn: ["germany proxy list", "german proxy server", "de proxy", "free german socks5"],
    keywordsRu: ["прокси германия", "немецкие прокси", "socks5 германия", "de proxy"],
  },
  gb: {
    code: "gb",
    name: "United Kingdom",
    nameRu: "Великобритания",
    titleEn: "Free UK Proxy List | United Kingdom Proxy Servers",
    titleRu: "Бесплатные Прокси Великобритании | UK Proxy List",
    descriptionEn:
      "Free proxy servers located in the United Kingdom. SOCKS5, HTTP and HTTPS proxies from the UK. Auto-updated every minute.",
    descriptionRu:
      "Бесплатные прокси Великобритании (UK / GB). Надежные SOCKS5 и HTTP прокси-серверы с автопроверкой Hydra.",
    keywordsEn: ["uk proxy list", "united kingdom proxy", "free uk proxy", "gb proxy server"],
    keywordsRu: ["прокси великобритания", "английские прокси", "uk proxy", "socks5 uk"],
  },
  nl: {
    code: "nl",
    name: "Netherlands",
    nameRu: "Нидерланды",
    titleEn: "Free Netherlands Proxy List | Dutch Proxy Servers",
    titleRu: "Бесплатные Прокси Нидерландов | Голландские Прокси",
    descriptionEn:
      "Free proxy servers located in the Netherlands (NL). High-speed Dutch SOCKS5 and HTTP proxies. Updated every minute.",
    descriptionRu:
      "Бесплатный список прокси в Нидерландах (NL). Высокоскоростные голландские SOCKS5 и HTTP серверы.",
    keywordsEn: ["netherlands proxy list", "dutch proxy server", "nl proxy", "free netherlands socks5"],
    keywordsRu: ["прокси нидерланды", "голландские прокси", "nl proxy list", "socks5 нидерланды"],
  },
  fr: {
    code: "fr",
    name: "France",
    nameRu: "Франция",
    titleEn: "Free France Proxy List | French Proxy Servers",
    titleRu: "Бесплатные Прокси Франции | Французские Прокси",
    descriptionEn:
      "Free French proxy servers (FR). SOCKS5, SOCKS4 and HTTP proxies located in France. Auto-updated list.",
    descriptionRu:
      "Бесплатные прокси-серверы Франции (FR). SOCKS5, SOCKS4 и HTTP прокси с автоматическим обновлением.",
    keywordsEn: ["france proxy list", "french proxy server", "fr proxy", "free france socks5"],
    keywordsRu: ["прокси франция", "французские прокси", "fr proxy list"],
  },
  ca: {
    code: "ca",
    name: "Canada",
    nameRu: "Канада",
    titleEn: "Free Canada Proxy List | Canadian Proxy Servers",
    titleRu: "Бесплатные Прокси Канады | Канадские Прокси",
    descriptionEn:
      "Free proxy servers located in Canada (CA). SOCKS5, HTTP and HTTPS proxies. Updated automatically every minute.",
    descriptionRu:
      "Бесплатные прокси Канады (CA). Надежные SOCKS5 и HTTP серверы, проверенные высокоскоростным чекером.",
    keywordsEn: ["canada proxy list", "canadian proxy server", "ca proxy", "free canada socks5"],
    keywordsRu: ["прокси канада", "канадские прокси", "ca proxy list"],
  },
  ru: {
    code: "ru",
    name: "Russia",
    nameRu: "Россия",
    titleEn: "Free Russia Proxy List | Russian Proxy Servers",
    titleRu: "Бесплатные Прокси России | Рабочие Российские Прокси",
    descriptionEn:
      "Free proxy servers located in Russia (RU). SOCKS5, SOCKS4 and HTTP proxies. Auto-updated by Hydra engine.",
    descriptionRu:
      "Бесплатный список прокси в России (RU). Рабочие SOCKS5, HTTP и HTTPS серверы с быстрым пингом.",
    keywordsEn: ["russia proxy list", "russian proxy server", "ru proxy", "free russia socks5"],
    keywordsRu: ["прокси россия", "русские прокси", "российские прокси бесплатно", "socks5 россия"],
  },
  ua: {
    code: "ua",
    name: "Ukraine",
    nameRu: "Украина",
    titleEn: "Free Ukraine Proxy List | Ukrainian Proxy Servers",
    titleRu: "Бесплатные Прокси Украины | Украинские Прокси",
    descriptionEn:
      "Free proxy servers located in Ukraine (UA). Verified SOCKS5 and HTTP proxy servers with low latency.",
    descriptionRu:
      "Бесплатные прокси-серверы Украины (UA). Проверенные SOCKS5 и HTTP прокси с низким пингом.",
    keywordsEn: ["ukraine proxy list", "ukrainian proxy server", "ua proxy", "free ukraine socks5"],
    keywordsRu: ["прокси украина", "украинские прокси", "ua proxy list"],
  },
  in: {
    code: "in",
    name: "India",
    nameRu: "Индия",
    titleEn: "Free India Proxy List | Indian Proxy Servers",
    titleRu: "Бесплатные Прокси Индии | Индийские Прокси",
    descriptionEn:
      "Download free Indian proxy servers (IN). Fast residential and datacenter proxies. Updated continuously.",
    descriptionRu:
      "Бесплатные прокси Индии (IN). Быстрые резидентные и серверные прокси с постоянным обновлением.",
    keywordsEn: ["india proxy list", "indian proxy server", "in proxy", "free india socks5"],
    keywordsRu: ["прокси индия", "индийские прокси", "in proxy list"],
  },
  br: {
    code: "br",
    name: "Brazil",
    nameRu: "Бразилия",
    titleEn: "Free Brazil Proxy List | Brazilian Proxy Servers",
    titleRu: "Бесплатные Прокси Бразилии | Бразильские Прокси",
    descriptionEn:
      "Free proxy servers located in Brazil (BR). Verified SOCKS5, HTTP and HTTPS proxies. Auto-updated every minute.",
    descriptionRu:
      "Бесплатный список прокси Бразилии (BR). Проверенные SOCKS5, HTTP и HTTPS серверы с автопроверкой.",
    keywordsEn: ["brazil proxy list", "brazilian proxy server", "br proxy", "free brazil socks5"],
    keywordsRu: ["прокси бразилия", "бразильские прокси", "br proxy list"],
  },
  jp: {
    code: "jp",
    name: "Japan",
    nameRu: "Япония",
    titleEn: "Free Japan Proxy List | Japanese Proxy Servers",
    titleRu: "Бесплатные Прокси Японии | Японские Прокси",
    descriptionEn:
      "Free high-speed proxies located in Japan (JP). SOCKS5 and HTTP proxy servers verified by Hydra.",
    descriptionRu:
      "Бесплатные высокоскоростные прокси Японии (JP). SOCKS5 и HTTP прокси-серверы, проверенные Hydra.",
    keywordsEn: ["japan proxy list", "japanese proxy server", "jp proxy", "free japan socks5"],
    keywordsRu: ["прокси япония", "японские прокси", "jp proxy list"],
  },
  sg: {
    code: "sg",
    name: "Singapore",
    nameRu: "Сингапур",
    titleEn: "Free Singapore Proxy List | SG Proxy Servers",
    titleRu: "Бесплатные Прокси Сингапура | Сингапурские Прокси",
    descriptionEn:
      "Free low-latency proxy servers in Singapore (SG). Ideal for Southeast Asia web scraping and automation.",
    descriptionRu:
      "Бесплатные прокси с минимальной задержкой в Сингапуре (SG). Идеально для парсинга и автоматизации.",
    keywordsEn: ["singapore proxy list", "sg proxy server", "free singapore socks5"],
    keywordsRu: ["прокси сингапур", "сингапурские прокси", "sg proxy list"],
  },
  it: {
    code: "it",
    name: "Italy",
    nameRu: "Италия",
    titleEn: "Free Italy Proxy List | Italian Proxy Servers",
    titleRu: "Бесплатные Прокси Италии | Итальянские Прокси",
    descriptionEn: "Free proxy servers in Italy (IT). SOCKS5 and HTTP proxies verified by Hydra engine.",
    descriptionRu: "Бесплатные прокси-серверы Италии (IT). SOCKS5 и HTTP прокси, проверенные движком Hydra.",
    keywordsEn: ["italy proxy list", "italian proxy", "it proxy"],
    keywordsRu: ["прокси италия", "итальянские прокси"],
  },
  es: {
    code: "es",
    name: "Spain",
    nameRu: "Испания",
    titleEn: "Free Spain Proxy List | Spanish Proxy Servers",
    titleRu: "Бесплатные Прокси Испании | Испанские Прокси",
    descriptionEn: "Free proxy servers in Spain (ES). SOCKS5 and HTTP proxies verified continuously.",
    descriptionRu: "Бесплатные прокси-серверы Испании (ES). SOCKS5 и HTTP прокси с непрерывной проверкой.",
    keywordsEn: ["spain proxy list", "spanish proxy", "es proxy"],
    keywordsRu: ["прокси испания", "испанские прокси"],
  },
  ch: {
    code: "ch",
    name: "Switzerland",
    nameRu: "Швейцария",
    titleEn: "Free Switzerland Proxy List | Swiss Proxy Servers",
    titleRu: "Бесплатные Прокси Швейцарии | Швейцарские Прокси",
    descriptionEn: "High-anonymity Swiss proxy servers in Switzerland (CH). Verified by Hydra engine.",
    descriptionRu: "Высокоанонимные прокси-серверы Швейцарии (CH). Проверено движком Hydra.",
    keywordsEn: ["switzerland proxy list", "swiss proxy", "ch proxy"],
    keywordsRu: ["прокси швейцария", "швейцарские прокси"],
  },
  co: {
    code: "co",
    name: "Colombia",
    nameRu: "Колумбия",
    titleEn: "Free Colombia Proxy List | Colombian Proxy Servers",
    titleRu: "Бесплатные Прокси Колумбии | Колумбийские Прокси",
    descriptionEn: "Free proxy servers located in Colombia (CO). SOCKS5 and HTTP proxies verified by Hydra.",
    descriptionRu: "Бесплатные прокси-серверы Колумбии (CO). SOCKS5 и HTTP прокси, проверенные Hydra.",
    keywordsEn: ["colombia proxy list", "colombian proxy", "co proxy"],
    keywordsRu: ["прокси колумбия", "колумбийские прокси"],
  },
  id: {
    code: "id",
    name: "Indonesia",
    nameRu: "Индонезия",
    titleEn: "Free Indonesia Proxy List | Indonesian Proxy Servers",
    titleRu: "Бесплатные Прокси Индонезии | Индонезийские Прокси",
    descriptionEn: "Free proxy servers located in Indonesia (ID). SOCKS5 and HTTP proxies auto-updated by Hydra.",
    descriptionRu: "Бесплатные прокси-серверы Индонезии (ID). SOCKS5 и HTTP прокси с проверкой Hydra.",
    keywordsEn: ["indonesia proxy list", "indonesian proxy", "id proxy"],
    keywordsRu: ["прокси индонезия", "индонезийские прокси"],
  },
  th: {
    code: "th",
    name: "Thailand",
    nameRu: "Таиланд",
    titleEn: "Free Thailand Proxy List | Thai Proxy Servers",
    titleRu: "Бесплатные Прокси Таиланда | Тайские Прокси",
    descriptionEn: "Free proxy servers located in Thailand (TH). SOCKS5 and HTTP proxies auto-updated by Hydra.",
    descriptionRu: "Бесплатные прокси-серверы Таиланда (TH). SOCKS5 и HTTP прокси с проверкой Hydra.",
    keywordsEn: ["thailand proxy list", "thai proxy", "th proxy"],
    keywordsRu: ["прокси таиланд", "тайские прокси"],
  },
};

const regionNamesEn = new Intl.DisplayNames(["en"], { type: "region" });
const regionNamesRu = new Intl.DisplayNames(["ru"], { type: "region" });

export function getCountryDisplayName(
  code: string,
  fallbackName?: string,
  lang: "en" | "ru" = "en"
): string {
  const normalized = code.toLowerCase();
  const meta = COUNTRY_META[normalized];
  if (meta) {
    return lang === "ru" ? meta.nameRu : meta.name;
  }
  try {
    const upper = code.toUpperCase();
    const localized = lang === "ru" ? regionNamesRu.of(upper) : regionNamesEn.of(upper);
    if (localized) return localized;
  } catch {}
  return fallbackName || code.toUpperCase();
}

export function getCountryMetadata(code: string, lang: "en" | "ru"): {
  title: string;
  description: string;
  keywords: string[];
} {
  const norm = code.toLowerCase();
  const meta = COUNTRY_META[norm];
  const name = getCountryDisplayName(norm, norm.toUpperCase(), lang);

  if (meta) {
    return {
      title: lang === "ru" ? meta.titleRu : meta.titleEn,
      description: lang === "ru" ? meta.descriptionRu : meta.descriptionEn,
      keywords: lang === "ru" ? meta.keywordsRu : meta.keywordsEn,
    };
  }

  if (lang === "ru") {
    return {
      title: `Бесплатные Прокси ${name} (${code.toUpperCase()}) | SOCKS5 & HTTP`,
      description: `Бесплатный список прокси-серверов в ${name}. SOCKS5, HTTP и HTTPS прокси, непрерывно проверяемые движком Hydra.`,
      keywords: [`прокси ${name.toLowerCase()}`, `${norm} proxy`, `socks5 ${name.toLowerCase()}`, `бесплатные прокси ${name.toLowerCase()}`],
    };
  }

  return {
    title: `Free ${name} (${code.toUpperCase()}) Proxy List | SOCKS5 & HTTP`,
    description: `Free proxy list for ${name}. Verified SOCKS5, HTTP and HTTPS proxies tested continuously by the Hydra engine.`,
    keywords: [`${name.toLowerCase()} proxy list`, `${norm} proxy server`, `free ${name.toLowerCase()} proxy`, `socks5 ${norm}`],
  };
}

export const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  us: [37.0902, -95.7129],
  de: [51.1657, 10.4515],
  gb: [55.3781, -3.436],
  nl: [52.1326, 5.2913],
  fr: [46.2276, 2.2137],
  ca: [56.1304, -106.3468],
  ru: [61.524, 105.3188],
  ua: [48.3794, 31.1656],
  in: [20.5937, 78.9629],
  br: [-14.235, -51.9253],
  jp: [36.2048, 138.2529],
  sg: [1.3521, 103.8198],
  kr: [35.9078, 127.7669],
  cn: [35.8617, 104.1954],
  hk: [22.3193, 114.1694],
  tw: [23.6978, 120.9605],
  vn: [14.0583, 108.2772],
  th: [15.87, 100.9925],
  id: [-0.7893, 113.9213],
  pl: [51.9194, 19.1451],
  it: [41.8719, 12.5674],
  es: [40.4637, -3.7492],
  tr: [38.9637, 35.2433],
  mx: [23.6345, -102.5528],
  ar: [-38.4161, -63.6167],
  co: [4.5709, -74.2973],
  cl: [-35.6751, -71.543],
  za: [-30.5595, 22.9375],
  eg: [26.8206, 30.8025],
  ng: [9.082, 8.6753],
  ke: [-0.0236, 37.9062],
  au: [-25.2744, 133.7751],
  nz: [-40.9006, 174.886],
  se: [60.1282, 18.6435],
  no: [60.472, 8.4689],
  fi: [61.9241, 25.7482],
  ro: [45.9432, 24.9668],
  cz: [49.8175, 15.473],
  bg: [42.7339, 25.4858],
  gr: [39.0742, 21.8243],
  pt: [39.3999, -8.2245],
  at: [47.5162, 14.5501],
  ch: [46.8182, 8.2275],
  be: [50.5039, 4.4699],
  dk: [56.2639, 9.5018],
  ie: [53.1424, -7.6921],
  il: [31.0461, 34.8516],
  ae: [23.4241, 53.8478],
  sa: [23.8859, 45.0792],
  my: [4.2105, 101.9758],
  ph: [12.8797, 121.774],
  pk: [30.3753, 69.3451],
  bd: [23.685, 90.3563],
  hu: [47.1625, 19.5033],
  sk: [48.669, 19.699],
  rs: [44.0165, 21.0059],
  hr: [45.1, 15.2],
  by: [53.7098, 27.9534],
  kz: [48.0196, 66.9237],
  uz: [41.3775, 64.5853],
  az: [40.1431, 47.5769],
  ge: [42.3154, 43.3569],
  am: [40.0691, 45.0382],
  md: [47.4116, 28.3699],
  ee: [58.5953, 25.0136],
  lv: [56.8796, 24.6032],
  lt: [55.1694, 23.8813],
  si: [46.1512, 14.9955],
  lu: [49.8153, 6.1296],
  is: [64.9631, -19.0208],
  cy: [35.1264, 33.4299],
  mt: [35.9375, 14.3754],
};

export function getCountryCoordinates(code: string): [number, number] | null {
  const norm = code.toLowerCase();
  return COUNTRY_COORDINATES[norm] || null;
}
