import { Metadata } from "next";
import AboutView from "@/components/views/AboutView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us — Open-Source Proxy Infrastructure",
  description:
    "Learn about stormsia/proxy-list, our open-source philosophy, the high-concurrency Hydra Rust validation engine, and our mission to provide free, continuously tested proxy pools.",
  subpath: "about",
  lang: "en",
  keywords: [
    "about stormsia proxy list",
    "hydra rust proxy engine",
    "open source proxy infrastructure",
    "free proxy project",
  ],
});

export default function AboutPage() {
  return <AboutView lang="en" />;
}
