import { SITE_URL, firm } from "@/lib/firm";

/** hreflang codes: Malaysian English and Malaysian Chinese. */
const HREFLANG = { en: "en-MY", zh: "zh-MY" } as const;

function localeSegment(locale: string) {
  return locale === "zh" ? "zh" : "en";
}

/**
 * Canonical + hreflang alternates for a locale-agnostic route.
 *
 * `path` is the route without the locale segment ("" for home, "/about", …).
 * Each language canonicalises to its own URL — never across languages — and
 * `x-default` points at the English equivalent.
 */
export function localeAlternates(locale: string, path = "") {
  return {
    canonical: `${SITE_URL}/${localeSegment(locale)}${path}`,
    languages: {
      [HREFLANG.en]: `${SITE_URL}/en${path}`,
      [HREFLANG.zh]: `${SITE_URL}/zh${path}`,
      "x-default": `${SITE_URL}/en${path}`,
    },
  };
}

/**
 * Complete Open Graph object for a route, so `og:url` matches the canonical.
 *
 * Next.js replaces the parent `openGraph` wholesale when a child route defines
 * its own, so every field the layout sets is repeated here. `title` and
 * `description` are intentionally omitted — Next falls back to each page's own
 * metadata, which is more specific than anything this helper could supply.
 */
export function openGraphFor(locale: string, path = "") {
  return {
    url: `${SITE_URL}/${localeSegment(locale)}${path}`,
    siteName: firm.name,
    locale: locale === "zh" ? "zh_CN" : "en_MY",
    type: "website" as const,
    images: [{ url: "/logo.png", width: 926, height: 314, alt: firm.name }],
  };
}

/** Canonical + Open Graph in one call, for per-route `generateMetadata`. */
export function routeSeo(locale: string, path = "") {
  return {
    alternates: localeAlternates(locale, path),
    openGraph: openGraphFor(locale, path),
  };
}

/** Same alternate map, for `MetadataRoute.Sitemap` entries. */
export function sitemapAlternates(path = "") {
  return {
    languages: {
      [HREFLANG.en]: `${SITE_URL}/en${path}`,
      [HREFLANG.zh]: `${SITE_URL}/zh${path}`,
      "x-default": `${SITE_URL}/en${path}`,
    },
  };
}
