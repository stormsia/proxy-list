import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import ProxyTable from "@/components/ProxyTable";
import styles from "@/app/page.module.css";
import { MapPin } from "lucide-react";
import Link from "next/link";
import FAQ from "@/components/FAQ";

const SITE_URL = "https://stormsia.github.io/proxy-list";

// Full country names & SEO copy for high-traffic countries
const COUNTRY_META: Record<
  string,
  { name: string; title: string; description: string; keywords: string[] }
> = {
  us: {
    name: "United States",
    title: "Free USA Proxy List | United States Proxy Servers",
    description:
      "Download a free USA proxy list with SOCKS5, HTTP and HTTPS servers located in the United States. Updated every 15 minutes by an automated validator.",
    keywords: ["usa proxy list", "us proxy server", "united states proxy", "free us socks5"],
  },
  de: {
    name: "Germany",
    title: "Free Germany Proxy List | German Proxy Servers",
    description:
      "Get a free German proxy list. Fast SOCKS5 and HTTP proxy servers physically located in Germany (DE). Updated automatically.",
    keywords: ["germany proxy list", "german proxy server", "de proxy", "free german socks5"],
  },
  gb: {
    name: "United Kingdom",
    title: "Free UK Proxy List | United Kingdom Proxy Servers",
    description:
      "Free proxy servers located in the United Kingdom. SOCKS5, HTTP and HTTPS proxies from the UK. Auto-updated.",
    keywords: ["uk proxy list", "united kingdom proxy", "free uk proxy", "gb proxy server"],
  },
  nl: {
    name: "Netherlands",
    title: "Free Netherlands Proxy List | Dutch Proxy Servers",
    description:
      "Free proxy servers located in the Netherlands (NL). High-speed Dutch SOCKS5 and HTTP proxies. Updated every 15 minutes.",
    keywords: ["netherlands proxy list", "dutch proxy server", "nl proxy", "free netherlands socks5"],
  },
  fr: {
    name: "France",
    title: "Free France Proxy List | French Proxy Servers",
    description:
      "Free French proxy servers (FR). SOCKS5, SOCKS4 and HTTP proxies located in France. Auto-updated list.",
    keywords: ["france proxy list", "french proxy server", "fr proxy", "free france socks5"],
  },
  ca: {
    name: "Canada",
    title: "Free Canada Proxy List | Canadian Proxy Servers",
    description:
      "Free proxy servers located in Canada (CA). SOCKS5, HTTP and HTTPS proxies. Updated automatically every 15 minutes.",
    keywords: ["canada proxy list", "canadian proxy server", "ca proxy", "free canada socks5"],
  },
  ru: {
    name: "Russia",
    title: "Free Russia Proxy List | Russian Proxy Servers",
    description:
      "Free proxy servers located in Russia (RU). SOCKS5, SOCKS4 and HTTP proxies. Auto-updated by validator.",
    keywords: ["russia proxy list", "russian proxy server", "ru proxy", "free russia socks5"],
  },
  ua: {
    name: "Ukraine",
    title: "Free Ukraine Proxy List | Ukrainian Proxy Servers",
    description:
      "Free proxy servers located in Ukraine (UA). SOCKS5, HTTP and SOCKS4 proxies. Verified and updated automatically.",
    keywords: ["ukraine proxy list", "ukrainian proxy server", "ua proxy", "free ukraine socks5"],
  },
  cn: {
    name: "China",
    title: "Free China Proxy List | Chinese Proxy Servers",
    description:
      "Free proxy servers located in China (CN). SOCKS5 and HTTP proxies. Auto-updated list.",
    keywords: ["china proxy list", "chinese proxy server", "cn proxy", "free china socks5"],
  },
  br: {
    name: "Brazil",
    title: "Free Brazil Proxy List | Brazilian Proxy Servers",
    description:
      "Free proxy servers located in Brazil (BR). SOCKS5, HTTP and HTTPS proxies. Updated every 15 minutes.",
    keywords: ["brazil proxy list", "brazilian proxy server", "br proxy"],
  },
  in: {
    name: "India",
    title: "Free India Proxy List | Indian Proxy Servers",
    description:
      "Free proxy servers located in India (IN). SOCKS5 and HTTP proxies. Auto-validated and updated.",
    keywords: ["india proxy list", "indian proxy server", "in proxy"],
  },
  jp: {
    name: "Japan",
    title: "Free Japan Proxy List | Japanese Proxy Servers",
    description:
      "Free proxy servers located in Japan (JP). High-speed SOCKS5 and HTTP proxies. Updated automatically.",
    keywords: ["japan proxy list", "japanese proxy server", "jp proxy"],
  },
  sg: {
    name: "Singapore",
    title: "Free Singapore Proxy List | SG Proxy Servers",
    description:
      "Free proxy servers located in Singapore (SG). Fast SOCKS5 and HTTP proxies in Asia. Updated every 15 minutes.",
    keywords: ["singapore proxy list", "sg proxy server"],
  },
};

const ALL_COUNTRY_CODES = [
  "ad", "ae", "af", "ag", "ai", "al", "am", "ao", "aq", "ar", "as", "at", "au", "aw", "ax", "az",
  "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bl", "bm", "bn", "bo", "bq", "br", "bs",
  "bt", "bv", "bw", "by", "bz", "ca", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn",
  "co", "cr", "cu", "cv", "cw", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "ee",
  "eg", "eh", "er", "es", "et", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf",
  "gg", "gh", "gi", "gl", "gm", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm",
  "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "io", "iq", "ir", "is", "it", "je", "jm",
  "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc",
  "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mf", "mg", "mh", "mk",
  "ml", "mm", "mn", "mo", "mp", "mq", "mr", "ms", "mt", "mu", "mv", "mw", "mx", "my", "mz", "na",
  "nc", "ne", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "pa", "pe", "pf", "pg",
  "ph", "pk", "pl", "pm", "pn", "pr", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw",
  "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "ss",
  "st", "sv", "sx", "sy", "sz", "tc", "td", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to",
  "tr", "tt", "tv", "tw", "tz", "ua", "ug", "um", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi",
  "vn", "vu", "wf", "ws", "ye", "yt", "za", "zm", "zw", "uk"
];

export async function generateStaticParams() {
  return ALL_COUNTRY_CODES.map((code) => ({ code }));
}

export async function generateMetadata(
  props: { params: Promise<{ code: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const code = params.code.toLowerCase();
  const meta = COUNTRY_META[code];

  if (meta) {
    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      alternates: { canonical: `${SITE_URL}/country/${code}` },
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${SITE_URL}/country/${code}`,
      },
    };
  }

  const countryName = code.toUpperCase();
  return {
    title: `Free ${countryName} Proxy List | Proxy Servers in ${countryName}`,
    description: `Free proxy servers located in ${countryName}. SOCKS5, HTTP and HTTPS proxies. Auto-updated and verified.`,
    alternates: { canonical: `${SITE_URL}/country/${code}` },
    openGraph: {
      title: `Free ${countryName} Proxy List`,
      description: `Free proxy servers located in ${countryName}. Updated every 15 minutes.`,
      url: `${SITE_URL}/country/${code}`,
    },
  };
}

import CountryView from "@/components/views/CountryView";

export default async function CountryPage(
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const code = params.code.toLowerCase();

  return <CountryView lang="en" code={code} />;
}
