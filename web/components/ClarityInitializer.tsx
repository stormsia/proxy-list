"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "wz3d0xan93";

/**
 * Safely trigger a custom event in Microsoft Clarity.
 * Constraints:
 * - max 32 characters
 * - only [a-zA-Z0-9_]
 * - never throw exceptions (AdBlock / privacy shield resilience)
 */
function safeEvent(eventName: string): void {
  try {
    const cleanName = eventName.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 32);
    if (!cleanName) return;

    if (typeof window !== "undefined") {
      const win = window as unknown as { clarity?: (...args: unknown[]) => void };
      if (typeof win.clarity === "function") {
        win.clarity("event", cleanName);
      } else {
        Clarity.event(cleanName);
      }
    }
  } catch {
    // Silently capture AdBlock or network blocks
  }
}

/**
 * Safely set a custom tag in Microsoft Clarity.
 * Constraints:
 * - key: max 32 characters, only [a-zA-Z0-9_]
 * - value: max 255 characters
 * - never throw exceptions
 */
function safeTag(key: string, value: string | number | boolean): void {
  try {
    const cleanKey = key.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 32);
    const cleanValue = String(value).slice(0, 255);
    if (!cleanKey) return;

    if (typeof window !== "undefined") {
      const win = window as unknown as { clarity?: (...args: unknown[]) => void };
      if (typeof win.clarity === "function") {
        win.clarity("set", cleanKey, cleanValue);
      } else {
        Clarity.setTag(cleanKey, cleanValue);
      }
    }
  } catch {
    // Silently capture AdBlock or network blocks
  }
}

/**
 * Extract string className safely across HTMLElement and SVGElement
 */
function getElementClassName(el: Element | null): string {
  if (!el) return "";
  try {
    const rawClass = el.className;
    if (typeof rawClass === "string") return rawClass;
    if (typeof rawClass === "object" && rawClass !== null && "baseVal" in rawClass) {
      return (rawClass as SVGAnimatedString).baseVal || "";
    }
    return el.getAttribute("class") || "";
  } catch {
    return "";
  }
}

/**
 * Checks if element contains part of a class name (matches CSS Modules hashed classes)
 */
function matchesClass(el: Element | null, part: string): boolean {
  if (!el) return false;
  return getElementClassName(el).includes(part);
}

/**
 * Fallback DOM traversal for CSS Module hashed class tokens
 */
function closestByClassPart<T extends Element = Element>(
  start: Element | null,
  part: string
): T | null {
  let curr: Element | null = start;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    if (matchesClass(curr, part)) return curr as T;
    curr = curr.parentElement;
  }
  return null;
}

/**
 * Generic query closest with fallback
 */
function findClosest<T extends Element = Element>(
  target: Element | null,
  selector: string,
  classPartFallback?: string
): T | null {
  if (!target) return null;
  try {
    const match = target.closest<T>(selector);
    if (match) return match;
  } catch {
    // Ignore invalid selector in older engines
  }
  if (classPartFallback) {
    return closestByClassPart<T>(target, classPartFallback);
  }
  return null;
}

/**
 * Parse pathname into structured context (path, locale, category, protocol)
 */
function analyzePath(rawPath: string) {
  let path = rawPath.replace(/^\/proxy-list/, "") || "/";
  if (!path.startsWith("/")) path = "/" + path;

  const segments = path.split("/").filter(Boolean);
  const knownLocales = ["en", "ru", "es", "zh", "hi", "ar", "pt", "fr", "bn", "id"];
  let locale = "en";
  let restSegments = [...segments];

  if (segments.length > 0 && knownLocales.includes(segments[0])) {
    locale = segments[0];
    restSegments = segments.slice(1);
  }

  const firstRest = restSegments[0] || "";
  let category = "home";
  let protocol = "none";

  const knownProtocols = ["socks5", "http", "https", "socks4"];

  if (!firstRest) {
    category = "home";
  } else if (knownProtocols.includes(firstRest.toLowerCase())) {
    category = "protocol";
    protocol = firstRest.toLowerCase();
  } else if (firstRest === "datacenter" || firstRest === "residential") {
    category = firstRest;
  } else if (firstRest === "country") {
    category = "country";
  } else if (firstRest === "docs") {
    category = "docs";
  } else if (firstRest === "about") {
    category = "about";
  } else if (firstRest === "privacy") {
    category = "privacy";
  } else {
    category = firstRest;
  }

  return {
    path,
    locale,
    category,
    protocol,
  };
}

/**
 * Update Clarity context tags for current page
 */
function trackPageContext(pathname: string): void {
  try {
    const context = analyzePath(pathname || (typeof window !== "undefined" ? window.location.pathname : "/"));
    safeTag("page_path", context.path);
    safeTag("page_locale", context.locale);
    safeTag("page_category", context.category);
    if (context.protocol !== "none") {
      safeTag("page_protocol", context.protocol);
    }
  } catch {
    // Never throw
  }
}

export default function ClarityInitializer() {
  const pathname = usePathname() || "";
  const prevPathRef = useRef<string>(pathname);

  // Initialize Clarity SDK once on mount
  useEffect(() => {
    try {
      Clarity.init(CLARITY_PROJECT_ID);
    } catch {
      // Ignore if already initialized or blocked
    }
  }, []);

  // Update page context on route changes
  useEffect(() => {
    trackPageContext(pathname);
    if (prevPathRef.current && prevPathRef.current !== pathname) {
      safeEvent("route_change");
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  // Event delegation listeners on document
  useEffect(() => {
    let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

    // Popstate listener for history navigation
    const handlePopstate = () => {
      try {
        trackPageContext(window.location.pathname);
        safeEvent("route_change");
      } catch {
        // ignore
      }
    };

    // Global Click Handler (Passive Event Delegation)
    const handleClick = (e: MouseEvent) => {
      try {
        const target = e.target as Element | null;
        if (!target) return;

        // 1. ANCHOR LINKS
        const link = findClosest<HTMLAnchorElement>(target, "a");
        if (link) {
          const href = (link.href || link.getAttribute("href") || "").toLowerCase();

          // A. Hydra Validator Transitions
          if (
            href.includes("github.com/stormsia/hydra") ||
            matchesClass(link, "hydraBadge") ||
            matchesClass(link, "hydraHeroBadge") ||
            matchesClass(link, "hydraPill") ||
            matchesClass(link, "hydraFooterLink")
          ) {
            let hydraSource = "other";
            if (matchesClass(link, "hydraBadge") || link.closest("header")) {
              hydraSource = "navbar";
            } else if (matchesClass(link, "hydraHeroBadge")) {
              hydraSource = "hero";
            } else if (matchesClass(link, "hydraPill")) {
              hydraSource = "table";
            } else if (matchesClass(link, "hydraFooterLink")) {
              hydraSource = "map";
            } else if (matchesClass(link, "readmePill") || link.closest('[class*="content"]')) {
              hydraSource = "docs";
            } else if (link.closest("footer")) {
              hydraSource = "footer";
            }

            safeTag("hydra_source", hydraSource);
            safeEvent("hydra_click");
            return;
          }

          // B. Direct Raw Data Endpoints (raw.githubusercontent.com)
          if (href.includes("raw.githubusercontent.com/stormsia/proxy-list")) {
            let rawFile = "unknown";
            try {
              const urlObj = new URL(link.href, "https://raw.githubusercontent.com");
              const pathParts = urlObj.pathname.split("/").filter(Boolean);
              rawFile = pathParts[pathParts.length - 1] || "unknown";
            } catch {
              const parts = href.split("?")[0].split("/").filter(Boolean);
              rawFile = parts[parts.length - 1] || "unknown";
            }
            safeTag("raw_file", rawFile);
            safeEvent("raw_endpoint_click");
            return;
          }

          // C. AI & AI-Agent Specifications (llms.txt, llms-full.txt, ai-catalog.json, pricing.md, AGENTS.md)
          let specName = "";
          if (href.includes("llms-full.txt")) {
            specName = "llms-full.txt";
          } else if (href.includes("llms.txt")) {
            specName = "llms.txt";
          } else if (href.includes("ai-catalog.json")) {
            specName = "ai-catalog.json";
          } else if (href.includes("pricing.md")) {
            specName = "pricing.md";
          } else if (href.includes("agents.md")) {
            specName = "AGENTS.md";
          }
          if (specName) {
            safeTag("spec_name", specName);
            safeEvent("ai_spec_click");
            return;
          }

          // D. GitHub Issues (About & Privacy pages)
          if (href.includes("github.com/stormsia/proxy-list/issues")) {
            safeEvent("github_issue_click");
            return;
          }

          // E. GitHub Star Transitions
          if (
            href.includes("github.com/stormsia/proxy-list") ||
            matchesClass(link, "gitHubBtn") ||
            matchesClass(link, "mobileStarLink") ||
            matchesClass(link, "starHeroBadge") ||
            matchesClass(link, "starButton") ||
            matchesClass(link, "footerStarBadge") ||
            matchesClass(link, "bottomStarPill") ||
            matchesClass(link, "readmePill") ||
            matchesClass(link, "readmeInlineBtn") ||
            matchesClass(link, "readmeCardBtn")
          ) {
            let starSource = "other";
            if (
              matchesClass(link, "mobileStarLink") ||
              (link.closest('[class*="mobileMenu"]') && matchesClass(link, "mobileLink"))
            ) {
              starSource = "mobile_menu";
            } else if (matchesClass(link, "gitHubBtn") || link.closest("header")) {
              starSource = "navbar";
            } else if (matchesClass(link, "starHeroBadge")) {
              starSource = "hero_badge";
            } else if (matchesClass(link, "starButton") || link.closest('[class*="starCard"]')) {
              starSource = "star_card";
            } else if (matchesClass(link, "readmePill")) {
              starSource = "docs_header";
            } else if (matchesClass(link, "readmeInlineBtn")) {
              starSource = "docs_inline";
            } else if (matchesClass(link, "readmeCardBtn")) {
              starSource = "docs_card";
            } else if (matchesClass(link, "footerStarBadge")) {
              starSource = "footer_badge";
            } else if (matchesClass(link, "bottomStarPill")) {
              starSource = "footer_pill";
            } else if (matchesClass(link, "titleLink")) {
              starSource = "footer_badge";
            } else if (
              matchesClass(link, "buttonPrimary") ||
              matchesClass(link, "buttonSecondary")
            ) {
              starSource = "about_or_privacy";
            } else if (link.closest("footer")) {
              starSource = "footer";
            }

            safeTag("star_source", starSource);
            safeEvent("github_star_click");
            return;
          }

          // F. Language switch in banner
          if (matchesClass(link, "switchBtn")) {
            safeEvent("lang_switch_accept");
            return;
          }

          // G. Language picker click
          if (matchesClass(link, "langCard")) {
            safeEvent("lang_picker_click");
            return;
          }

          // H. Map HUD inspect country
          if (matchesClass(link, "hudCtaBtn")) {
            safeEvent("map_inspect_country");
            return;
          }
        }

        // 2. BUTTONS & CONTROLS
        const copyBtn = findClosest<HTMLButtonElement>(
          target,
          'button[class*="copyBtn"], button[class*="cardCopyBtn"]',
          "copyBtn"
        );
        if (copyBtn) {
          safeEvent("proxy_copied");
          return;
        }

        const btn = findClosest<HTMLButtonElement>(target, "button");
        if (btn) {
          // Table or mobile card copy button
          if (matchesClass(btn, "cardCopyBtn")) {
            safeEvent("proxy_copied");
            return;
          }

          // Table active filter chip remove button
          if (btn.closest('[class*="filterChip"]') || matchesClass(btn, "filterChipRemove")) {
            safeEvent("filter_chip_remove");
            return;
          }

          // Code snippet copy
          if (
            matchesClass(btn, "copyButton") ||
            btn.closest("pre, [class*=\"codeSnippet\"], [class*=\"CodeSnippet\"]")
          ) {
            safeEvent("code_snippet_copied");
            return;
          }

          // Export menu trigger
          if (matchesClass(btn, "exportTrigger")) {
            safeEvent("export_menu_open");
            return;
          }

          // Export option click
          if (matchesClass(btn, "exportOption")) {
            const text = (btn.textContent || "").toLowerCase();
            let format = "txt";
            if (text.includes("json")) {
              format = "json";
            } else if (text.includes("csv")) {
              format = "csv";
            }
            safeTag("export_format", format);
            safeEvent("export_click");
            return;
          }

          // Vector World Map toggle routes
          if (matchesClass(btn, "toggleRoutesBtn")) {
            safeEvent("map_toggle_routes");
            return;
          }

          // Vector World Map protocol filter
          if (matchesClass(btn, "filterBtn") && btn.closest('[class*="filterGroup"]')) {
            const proto = (btn.textContent || "").trim().toLowerCase();
            if (proto) safeTag("map_protocol", proto);
            safeEvent("map_filter_protocol");
            return;
          }

          // Table search clear
          if (matchesClass(btn, "clearSearchBtn")) {
            safeEvent("table_search_clear");
            return;
          }

          // Table protocol pills
          if (matchesClass(btn, "pillBtn") && btn.closest('[class*="pillsList"]')) {
            const proto = (btn.textContent || "").trim().toLowerCase();
            if (proto) safeTag("filter_protocol_val", proto);
            safeEvent("filter_protocol");
            return;
          }

          // Table reset all filters (normal reset button + empty state primary action button)
          if (
            matchesClass(btn, "resetFilterBtn") ||
            matchesClass(btn, "primaryActionButton")
          ) {
            safeEvent("filters_reset");
            return;
          }

          // LiveSync manual refresh button
          if (matchesClass(btn, "liveSyncPill")) {
            safeEvent("live_sync_click");
            return;
          }

          // Table pagination
          if (matchesClass(btn, "pageBtn") || btn.closest('[class*="pagination"]')) {
            safeEvent("pagination_click");
            return;
          }

          // FAQ toggle accordion
          if (matchesClass(btn, "questionButton")) {
            safeEvent("faq_toggle");
            return;
          }

          // Locale banner dismiss / skip
          if (matchesClass(btn, "dismissBtn") || matchesClass(btn, "skipBtn")) {
            safeEvent("lang_switch_dismiss");
            return;
          }
        }

        // 3. SVG MAP NODES (Country circles and pulse markers)
        const mapNode = findClosest<SVGElement>(
          target,
          'g[class*="nodeGroup"], [class*="nodeGroup"]',
          "nodeGroup"
        );
        if (mapNode) {
          safeEvent("map_node_clicked");
          return;
        }
      } catch {
        // Suppress any unexpected error
      }
    };

    // Search Input Debounced Handler
    const handleInput = (e: Event) => {
      try {
        const input = e.target as HTMLInputElement | null;
        if (!input || input.tagName !== "INPUT") return;

        if (
          input.type === "search" ||
          matchesClass(input, "searchInput") ||
          (input.type === "text" && input.closest('[class*="searchWrapper"], [class*="searchBox"]'))
        ) {
          if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
          searchDebounceTimer = setTimeout(() => {
            const val = input.value.trim();
            if (val.length > 0) {
              safeTag("search_query", val.slice(0, 50));
              safeEvent("table_search");
            }
          }, 600);
        }
      } catch {
        // ignore
      }
    };

    // Filter Select Dropdowns Change Handler
    const handleChange = (e: Event) => {
      try {
        const select = e.target as HTMLSelectElement | null;
        if (!select || select.tagName !== "SELECT") return;

        const val = select.value;
        const hasOpt = (value: string) => Boolean(select.querySelector(`option[value="${value}"]`));

        if (hasOpt("datacenter") || hasOpt("residential")) {
          safeTag("filter_type", val);
          safeEvent("filter_change");
        } else if (hasOpt("elite") || hasOpt("transparent")) {
          safeTag("filter_anonymity", val);
          safeEvent("filter_change");
        } else if (hasOpt("fast") || hasOpt("slow")) {
          safeTag("filter_latency", val);
          safeEvent("filter_change");
        } else if (hasOpt("speed-asc") || hasOpt("uptime-desc")) {
          safeTag("sort_order", val);
          safeEvent("sort_change");
        }
      } catch {
        // ignore
      }
    };

    // Native text copy interception (detects IP:PORT pattern)
    const handleCopy = () => {
      try {
        const sel = window.getSelection()?.toString() || "";
        const ipPortRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):\d{2,5}\b/;
        if (ipPortRegex.test(sel)) {
          safeEvent("native_text_copy");
        }
      } catch {
        // ignore
      }
    };

    // Register all listeners with { passive: true }
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("input", handleInput, { passive: true });
    document.addEventListener("change", handleChange, { passive: true });
    document.addEventListener("copy", handleCopy, { passive: true });
    window.addEventListener("popstate", handlePopstate, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("input", handleInput);
      document.removeEventListener("change", handleChange);
      document.removeEventListener("copy", handleCopy);
      window.removeEventListener("popstate", handlePopstate);
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }
    };
  }, []);

  return null;
}
