import { Metadata } from "next";
import { Terminal, BookOpen, Code2, Layers, Download, GitBranch, Cpu } from "lucide-react";
import styles from "./page.module.css";
import CodeSnippet from "@/components/CodeSnippet";
import Link from "next/link";
const SITE_URL = "https://stormsia.github.io/proxy-list";
const REPO_RAW = "https://raw.githubusercontent.com/stormsia/proxy-list/main";
const REPO_API = "https://api.github.com/repos/stormsia/proxy-list";

export const metadata: Metadata = {
  title: "Docs & API — Fetch Proxies Programmatically",
  description:
    "Complete developer documentation for stormsia/proxy-list. Learn how to download and integrate free proxies using Python, Node.js, Go, cURL, and the GitHub REST API. JSON schema reference included.",
  keywords: [
    "proxy list api",
    "download proxy list python",
    "socks5 proxy python script",
    "free proxy api",
    "proxy list json",
    "how to use proxy list",
  ],
  alternates: {
    canonical: `${SITE_URL}/docs`,
  },
  openGraph: {
    title: "Docs & API | stormsia/proxy-list",
    description:
      "Developer guide: fetch free proxies via cURL, Python, Node.js, Go or GitHub API. No keys required.",
    url: `${SITE_URL}/docs`,
  },
};

import DocsView from "@/components/views/DocsView";

export default function DocsPage() {
  return <DocsView lang="en" />;
}
