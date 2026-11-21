import { Metadata } from "next";
import CountryView from "@/components/views/CountryView";
import { getStaticCountryParams } from "@/lib/proxies";
import { COUNTRY_META, getCountryDisplayName } from "@/lib/countries";
import { buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getStaticCountryParams();
}

export async function generateMetadata(
  props: { params: Promise<{ code: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const code = params.code.toLowerCase();
  const countryName = getCountryDisplayName(code, code.toUpperCase(), "ru");
  const meta = COUNTRY_META[code];

  return buildPageMetadata({
    title:
      meta?.titleRu ||
      `Бесплатные Прокси в ${countryName} | Прокси-серверы (${code.toUpperCase()})`,
    description:
      meta?.descriptionRu ||
      `Бесплатные проверенные прокси-серверы в регионе ${countryName}. SOCKS5, HTTP и HTTPS прокси. Обновляются каждые 15 минут.`,
    subpath: `country/${code}`,
    lang: "ru",
    keywords: meta?.keywordsRu || [
      `прокси ${countryName.toLowerCase()}`,
      `бесплатные прокси ${code}`,
      `${code} proxy list`,
    ],
  });
}

export default async function RuCountryPage(
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  return <CountryView lang="ru" code={params.code} />;
}
