import { Metadata } from "next";
import CountryView from "@/components/views/CountryView";
import { getStaticCountryParams } from "@/lib/proxies";
import { COUNTRY_META, getCountryDisplayName } from "@/lib/countries";
import { buildPageMetadata } from "@/lib/seo";

export { COUNTRY_META };

export async function generateStaticParams() {
  return getStaticCountryParams();
}

export async function generateMetadata(
  props: { params: Promise<{ code: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const code = params.code.toLowerCase();
  const countryName = getCountryDisplayName(code, code.toUpperCase(), "en");
  const meta = COUNTRY_META[code];

  return buildPageMetadata({
    title: meta?.titleEn || `Free ${countryName} Proxy List | ${countryName} Proxy Servers`,
    description:
      meta?.descriptionEn ||
      `Download a free ${countryName} proxy list with SOCKS5, HTTP and HTTPS servers. Updated every 15 minutes by an automated validator.`,
    subpath: `country/${code}`,
    lang: "en",
    keywords: meta?.keywordsEn || [
      `${countryName.toLowerCase()} proxy list`,
      `${code} proxy server`,
      `free ${code} proxy`,
    ],
  });
}

export default async function CountryPage(
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  return <CountryView lang="en" code={params.code} />;
}
