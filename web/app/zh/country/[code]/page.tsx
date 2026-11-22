import { Metadata } from "next";
import CountryView from "@/components/views/CountryView";
import { getStaticCountryParams } from "@/lib/proxies";
import { getCountryMetadata } from "@/lib/countries";
import { buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return getStaticCountryParams();
}

export async function generateMetadata(
  props: { params: Promise<{ code: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const code = params.code.toLowerCase();
  const { title, description, keywords } = getCountryMetadata(code, "zh");

  return buildPageMetadata({
    title,
    description,
    subpath: `country/${code}`,
    lang: "zh",
    keywords,
  });
}

export default async function ZhCountryPage(
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  return <CountryView lang="zh" code={params.code} />;
}
