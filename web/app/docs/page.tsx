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

export default function DocsPage() {
  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "TechArticle",
    headline: "stormsia/proxy-list — Developer Documentation & API Reference",
    description:
      "How to integrate the free proxy list programmatically: download raw files, query the GitHub REST API, and use code snippets in Python, Node.js, Go, and cURL.",
    author: {
      "@type": "Organization",
      name: "stormsia",
      url: "https://github.com/stormsia",
    },
    about: {
      "@type": "SoftwareApplication",
      name: "stormsia/proxy-list",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
    },
    url: `${SITE_URL}/docs`,
    dateModified: new Date().toISOString().split("T")[0],
  };

  return (
    <div className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <header className={styles.header}>
        <div className={styles.iconWrapper}>
          <Terminal size={32} style={{ color: "var(--accent)" }} />
        </div>
        <h1 className={styles.title}>Developer Docs & API</h1>
        <p className={styles.subtitle}>
          Integrate proxies into your scrapers, LLM pipelines and automation tools
          in minutes. No API keys, no registration.
        </p>
      </header>

      <div className={styles.content}>
        {/* Intro / Overview */}
        <div className={styles.seoIntro}>
          <p>
            <strong>stormsia/proxy-list</strong> is a fully open-source project
            that runs an asynchronous Python daemon every 15 minutes to collect,
            validate and publish free proxy servers. Each proxy is tested by a
            native <strong>validator</strong> for actual connectivity and
            response time — only working proxies make it to the list.
          </p>
          <p>
            All data is freely accessible without authentication: grab a
            plain-text file with <code>curl</code>, poll the JSON feed, or query
            the GitHub REST API. This page documents every integration method
            available.
          </p>
        </div>

        {/* Data Sources table */}
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Download size={20} style={{ color: "var(--primary)" }} />
            <h2>Available Data Endpoints</h2>
          </div>
          <p>
            All endpoints below are publicly accessible without authentication.
            GitHub's raw CDN also supports HTTP range requests for partial
            downloads.
          </p>
          <div className={styles.endpointGrid}>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="json">JSON</span>
              <div className={styles.endpointPath}>/proxies.json</div>
              <div className={styles.endpointDesc}>
                Full proxy list as JSON. Contains protocol, host, port, timeout,
                exit_ip, ASN, and geolocation for every entry.
              </div>
              <Link
                href="/proxies.json"
                target="_blank"
                className={styles.endpointLink}
              >
                Open →
              </Link>
            </div>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>working_proxies.txt</div>
              <div className={styles.endpointDesc}>
                All working proxies in <code>host:port</code> format. One entry
                per line.
              </div>
              <a
                href={`${REPO_RAW}/working_proxies.txt`}
                target="_blank"
                className={styles.endpointLink}
              >
                Open →
              </a>
            </div>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>socks5.txt</div>
              <div className={styles.endpointDesc}>
                SOCKS5-only proxies in <code>host:port</code> format.
              </div>
              <a
                href={`${REPO_RAW}/socks5.txt`}
                target="_blank"
                className={styles.endpointLink}
              >
                Open →
              </a>
            </div>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>socks4.txt</div>
              <div className={styles.endpointDesc}>SOCKS4-only proxies.</div>
              <a
                href={`${REPO_RAW}/socks4.txt`}
                target="_blank"
                className={styles.endpointLink}
              >
                Open →
              </a>
            </div>
            <div className={styles.endpointCard}>
              <span className={styles.endpointBadge} data-type="txt">TXT</span>
              <div className={styles.endpointPath}>http.txt</div>
              <div className={styles.endpointDesc}>HTTP/HTTPS-only proxies.</div>
              <a
                href={`${REPO_RAW}/http.txt`}
                target="_blank"
                className={styles.endpointLink}
              >
                Open →
              </a>
            </div>
          </div>
        </section>

        {/* JSON Schema */}
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Layers size={20} style={{ color: "var(--accent)" }} />
            <h2>JSON Schema Reference</h2>
          </div>
          <p>
            Each entry in <code>proxies.json</code> follows this structure:
          </p>
          <CodeSnippet
            language="json"
            code={`{
  "protocol": "socks5",       // "socks5" | "socks4" | "http" | "https"
  "host": "1.2.3.4",          // Proxy IP address
  "port": 1080,               // Proxy port number
  "timeout": 0.312,           // Response time in seconds
  "exit_ip": "1.2.3.4",       // External IP seen through the proxy
  "asn": {
    "autonomous_system_number": 12345,
    "autonomous_system_organization": "Example ISP"
  },
  "geolocation": {
    "city": { "names": { "en": "Frankfurt" } },
    "continent": { "code": "EU", "names": { "en": "Europe" } },
    "country": {
      "iso_code": "DE",
      "names": { "en": "Germany" }
    },
    "location": { "latitude": 50.11, "longitude": 8.68 },
    "registered_country": {
      "iso_code": "DE",
      "names": { "en": "Germany" }
    }
  }
}`}
          />
        </section>

        {/* cURL */}
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Terminal size={20} style={{ color: "#eab308" }} />
            <h2>Download via cURL</h2>
          </div>
          <p>
            The quickest way to grab the list from any Unix-like system or CI
            pipeline:
          </p>
          <CodeSnippet
            language="bash"
            code={`# All working proxies (host:port)
curl -o working.txt ${REPO_RAW}/working_proxies.txt

# SOCKS5 only
curl -o socks5.txt ${REPO_RAW}/socks5.txt

# SOCKS4 only
curl -o socks4.txt ${REPO_RAW}/socks4.txt

# HTTP/HTTPS only
curl -o http.txt ${REPO_RAW}/http.txt

# Full JSON dataset (protocol, geolocation, ASN, latency)
curl -o proxies.json ${SITE_URL}/proxies.json`}
          />
        </section>

        {/* Python */}
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Code2 size={20} style={{ color: "#3b82f6" }} />
            <h2>Python — Auto-Update & Use</h2>
          </div>
          <p>
            Fetch and immediately use the latest proxies inside a{" "}
            <code>requests</code> session:
          </p>
          <CodeSnippet
            language="python"
            code={`import requests
import random

SOCKS5_URL = "${REPO_RAW}/socks5.txt"
HTTP_URL   = "${REPO_RAW}/http.txt"

def fetch_proxies(url: str) -> list[str]:
    """Download a plain-text proxy list and return as a list of host:port strings."""
    response = requests.get(url, timeout=15)
    response.raise_for_status()
    return [line.strip() for line in response.text.splitlines() if line.strip()]


if __name__ == "__main__":
    proxies = fetch_proxies(SOCKS5_URL)
    print(f"Loaded {len(proxies)} SOCKS5 proxies")

    proxy = random.choice(proxies)


    try:
        
        print("Proxy:", proxy)
    except Exception as e:
        print(f"Error: {e}")`}
          />
        </section>



        {/* Node.js */}
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Code2 size={20} style={{ color: "#84cc16" }} />
            <h2>Node.js (fetch API)</h2>
          </div>
          <p>Works in Node 18+ without any extra dependencies:</p>
          <CodeSnippet
            language="javascript"
            code={`// Download the SOCKS5 proxy list and log the first 5
const SOCKS5_URL = "${REPO_RAW}/socks5.txt";

async function fetchProxies(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  const text = await res.text();
  return text.split("\\n").map(l => l.trim()).filter(Boolean);
}

const proxies = await fetchProxies(SOCKS5_URL);
console.log(\`Loaded \${proxies.length} SOCKS5 proxies\`);
console.log("Sample:", proxies.slice(0, 5));`}
          />
        </section>

        {/* Go */}
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <Code2 size={20} style={{ color: "#06b6d4" }} />
            <h2>Go</h2>
          </div>
          <CodeSnippet
            language="go"
            code={`package main

import (
	"fmt"
	"io"
	"net/http"
	"strings"
)

const socks5URL = "${REPO_RAW}/socks5.txt"

func main() {
	resp, err := http.Get(socks5URL)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	lines := strings.Split(strings.TrimSpace(string(body)), "\\n")

	fmt.Printf("Loaded %d SOCKS5 proxies\\n", len(lines))
	for i, proxy := range lines[:5] {
		fmt.Printf("%d: %s\\n", i+1, strings.TrimSpace(proxy))
	}
}`}
          />
        </section>

        {/* GitHub REST API */}
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <GitBranch size={20} style={{ color: "var(--accent)" }} />
            <h2>GitHub REST API</h2>
          </div>
          <p>
            To inspect file metadata (SHA, size, last commit timestamp) before
            downloading, query the GitHub REST API. An auth token is optional
            but raises your rate limit from 60 to 5 000 requests/hour.
          </p>
          <CodeSnippet
            language="http"
            code={`GET ${REPO_API}/contents/working_proxies.txt
Accept: application/vnd.github.v3+json
// Optional (raises rate limit):
// Authorization: Bearer <YOUR_GITHUB_TOKEN>`}
          />
          <p style={{ marginTop: "1.5rem" }}>
            The response includes a <code>sha</code> field you can cache locally
            to detect changes without re-downloading the full file:
          </p>
          <CodeSnippet
            language="python"
            code={`import requests

API = "${REPO_API}/contents/working_proxies.txt"
HEADERS = {"Accept": "application/vnd.github.v3+json"}
# headers["Authorization"] = "Bearer <token>"  # optional

meta = requests.get(API, headers=HEADERS).json()
print("SHA:",       meta["sha"])
print("Size:",      meta["size"], "bytes")
print("Last push:", meta.get("commit", {}).get("committer", {}).get("date", "—"))`}
          />
        </section>


        {/* Anonymity notice */}
        <section className={styles.noticeSection}>
          <div className={styles.noticeIcon}>⚠️</div>
          <div>
            <h3 className={styles.noticeTitle}>Anonymity Disclaimer</h3>
            <p className={styles.noticeText}>
              Proxies in this list have varying anonymity levels — transparent,
              anonymous, and elite. The project does not guarantee anonymity for
              any specific proxy. Always verify the anonymity level of a proxy
              with a tool like{" "}
              <a
                href="https://httpbin.org/ip"
                target="_blank"
                rel="noopener noreferrer"
              >
                httpbin.org/ip
              </a>{" "}
              before using it in production.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
