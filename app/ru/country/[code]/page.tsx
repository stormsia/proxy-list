import { Metadata } from "next";
import CountryView from "@/components/views/CountryView";

const SITE_URL = "https://stormsia.github.io/proxy-list";

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
  const countryName = code.toUpperCase();
  
  return {
    title: `Бесплатные ${countryName} Прокси | Прокси-серверы в ${countryName}`,
    description: `Бесплатные прокси-серверы, расположенные в ${countryName}. SOCKS5, HTTP и HTTPS прокси. Обновляются каждые 15 минут.`,
    alternates: {
      canonical: `${SITE_URL}/ru/country/${code}`,
      languages: {
        en: `${SITE_URL}/country/${code}`,
        ru: `${SITE_URL}/ru/country/${code}`,
        "x-default": `${SITE_URL}/country/${code}`,
      },
    },
    openGraph: {
      title: `Бесплатные ${countryName} Прокси`,
      description: `Бесплатные прокси-серверы, расположенные в ${countryName}. Обновляются каждые 15 минут.`,
      url: `${SITE_URL}/ru/country/${code}`,
      locale: "ru_RU",
      alternateLocale: "en_US",
    },
  };
}

export default async function CountryPage(
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  const code = params.code.toLowerCase();

  return <CountryView lang="ru" code={code} />;
}
