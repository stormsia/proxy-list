const fs = require('fs');
const path = require('path');

const NEW_LOCALES = [
  { code: 'es', og: 'es_ES', dir: 'ltr' },
  { code: 'zh', og: 'zh_CN', dir: 'ltr' },
  { code: 'hi', og: 'hi_IN', dir: 'ltr' },
  { code: 'ar', og: 'ar_SA', dir: 'rtl' },
  { code: 'pt', og: 'pt_PT', dir: 'ltr' },
  { code: 'fr', og: 'fr_FR', dir: 'ltr' },
  { code: 'bn', og: 'bn_BD', dir: 'ltr' },
  { code: 'id', og: 'id_ID', dir: 'ltr' },
];

const webAppDir = path.resolve(__dirname, '../web/app');

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

for (const { code, og, dir } of NEW_LOCALES) {
  const localeDir = path.join(webAppDir, code);
  const layoutContent = `import type { Metadata } from "next";
import { I18nProvider } from "@/components/I18nProvider";

const SITE_URL = "https://stormsia.github.io/proxy-list";

export const metadata: Metadata = {
  openGraph: {
    locale: "${og}",
    alternateLocale: "en_US",
  },
  alternates: {
    languages: {
      en: SITE_URL,
      ru: \`\${SITE_URL}/ru\`,
      es: \`\${SITE_URL}/es\`,
      zh: \`\${SITE_URL}/zh\`,
      hi: \`\${SITE_URL}/hi\`,
      ar: \`\${SITE_URL}/ar\`,
      pt: \`\${SITE_URL}/pt\`,
      fr: \`\${SITE_URL}/fr\`,
      bn: \`\${SITE_URL}/bn\`,
      id: \`\${SITE_URL}/id\`,
      "x-default": SITE_URL,
    },
  },
};

export default function ${cap(code)}Layout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="${code}" dir="${dir}">
      <I18nProvider locale="${code}">
        {children}
      </I18nProvider>
    </div>
  );
}
`;

  const pageContent = `import { Metadata } from "next";
import HomeView from "@/components/views/HomeView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("${code}");

export const metadata: Metadata = buildPageMetadata({
  title: dict.home.title,
  description: dict.home.description,
  lang: "${code}",
});

export default function ${cap(code)}HomePage() {
  return <HomeView lang="${code}" />;
}
`;

  const aboutContent = `import { Metadata } from "next";
import AboutView from "@/components/views/AboutView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("${code}");

export const metadata: Metadata = buildPageMetadata({
  title: \`\${dict.about.title} — stormsia/proxy-list\`,
  description: dict.about.description,
  subpath: "about",
  lang: "${code}",
});

export default function ${cap(code)}AboutPage() {
  return <AboutView lang="${code}" />;
}
`;

  const docsContent = `import { Metadata } from "next";
import DocsView from "@/components/views/DocsView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("${code}");

export const metadata: Metadata = buildPageMetadata({
  title: dict.docs.headline || dict.docs.title,
  description: dict.docs.description,
  subpath: "docs",
  lang: "${code}",
});

export default function ${cap(code)}DocsPage() {
  return <DocsView lang="${code}" />;
}
`;

  const datacenterContent = `import { Metadata } from "next";
import DatacenterView from "@/components/views/DatacenterView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("${code}");

export const metadata: Metadata = buildPageMetadata({
  title: \`\${dict.datacenter.seoHeading} | stormsia/proxy-list\`,
  description: dict.datacenter.subtitle.replace("{count}", "1,000+"),
  subpath: "datacenter",
  lang: "${code}",
});

export default function ${cap(code)}DatacenterPage() {
  return <DatacenterView lang="${code}" />;
}
`;

  const residentialContent = `import { Metadata } from "next";
import ResidentialView from "@/components/views/ResidentialView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("${code}");

export const metadata: Metadata = buildPageMetadata({
  title: \`\${dict.residential.seoHeading} | stormsia/proxy-list\`,
  description: dict.residential.subtitle.replace("{count}", "1,000+"),
  subpath: "residential",
  lang: "${code}",
});

export default function ${cap(code)}ResidentialPage() {
  return <ResidentialView lang="${code}" />;
}
`;

  const privacyContent = `import { Metadata } from "next";
import PrivacyView from "@/components/views/PrivacyView";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

const dict = getDictionarySync("${code}");

export const metadata: Metadata = buildPageMetadata({
  title: \`\${dict.privacy.title} — stormsia/proxy-list\`,
  description: dict.privacy.description,
  subpath: "privacy",
  lang: "${code}",
});

export default function ${cap(code)}PrivacyPage() {
  return <PrivacyView lang="${code}" />;
}
`;

  const protocolContent = `import { Metadata } from "next";
import ProtocolView from "@/components/views/ProtocolView";
import { getStaticProtocolParams } from "@/lib/proxies";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionarySync } from "@/lib/i18n";

export async function generateStaticParams() {
  return getStaticProtocolParams();
}

export async function generateMetadata(
  props: { params: Promise<{ protocol: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const protocol = params.protocol.toLowerCase();
  const upper = protocol.toUpperCase();
  const dict = getDictionarySync("${code}");

  return buildPageMetadata({
    title: \`\${dict.protocol.titlePrefix} \${upper} \${dict.protocol.titleSuffix}\`,
    description: dict.protocol.subtitle.replace("{protocol}", upper),
    subpath: protocol,
    lang: "${code}",
  });
}

export default async function ${cap(code)}ProtocolPage(
  props: { params: Promise<{ protocol: string }> }
) {
  const params = await props.params;
  return <ProtocolView lang="${code}" protocol={params.protocol} />;
}
`;

  const countryContent = `import { Metadata } from "next";
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
  const { title, description, keywords } = getCountryMetadata(code, "${code}");

  return buildPageMetadata({
    title,
    description,
    subpath: \`country/\${code}\`,
    lang: "${code}",
    keywords,
  });
}

export default async function ${cap(code)}CountryPage(
  props: { params: Promise<{ code: string }> }
) {
  const params = await props.params;
  return <CountryView lang="${code}" code={params.code} />;
}
`;

  // Write files
  fs.mkdirSync(localeDir, { recursive: true });
  fs.writeFileSync(path.join(localeDir, 'layout.tsx'), layoutContent, 'utf8');
  fs.writeFileSync(path.join(localeDir, 'page.tsx'), pageContent, 'utf8');

  fs.mkdirSync(path.join(localeDir, 'about'), { recursive: true });
  fs.writeFileSync(path.join(localeDir, 'about', 'page.tsx'), aboutContent, 'utf8');

  fs.mkdirSync(path.join(localeDir, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(localeDir, 'docs', 'page.tsx'), docsContent, 'utf8');

  fs.mkdirSync(path.join(localeDir, 'datacenter'), { recursive: true });
  fs.writeFileSync(path.join(localeDir, 'datacenter', 'page.tsx'), datacenterContent, 'utf8');

  fs.mkdirSync(path.join(localeDir, 'residential'), { recursive: true });
  fs.writeFileSync(path.join(localeDir, 'residential', 'page.tsx'), residentialContent, 'utf8');

  fs.mkdirSync(path.join(localeDir, 'privacy'), { recursive: true });
  fs.writeFileSync(path.join(localeDir, 'privacy', 'page.tsx'), privacyContent, 'utf8');

  fs.mkdirSync(path.join(localeDir, '[protocol]'), { recursive: true });
  fs.writeFileSync(path.join(localeDir, '[protocol]', 'page.tsx'), protocolContent, 'utf8');

  fs.mkdirSync(path.join(localeDir, 'country', '[code]'), { recursive: true });
  fs.writeFileSync(path.join(localeDir, 'country', '[code]', 'page.tsx'), countryContent, 'utf8');

  console.log(`✓ Generated all 9 routes for [${code}]`);
}
console.log('All 8 locales generated successfully!');
