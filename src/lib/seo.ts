import { SITE_URL, firm } from "@/lib/firm";

/** hreflang codes: Malaysian English and Malaysian Chinese. */
const HREFLANG = { en: "en-MY", zh: "zh-MY" } as const;

export function localeSegment(locale: string) {
  return locale === "zh" ? "zh" : "en";
}

/** Absolute canonical URL for a locale + locale-agnostic route path. */
export function absoluteUrl(locale: string, path = "") {
  return `${SITE_URL}/${localeSegment(locale)}${path}`;
}

/**
 * Dedicated social-sharing card (`public/og-image.png`), generated from the
 * firm logo by `scripts/generate-brand-assets.mjs`.
 */
export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: `${firm.name} — ${firm.titles}`,
} as const;

/**
 * Canonical + hreflang alternates for a locale-agnostic route.
 *
 * `path` is the route without the locale segment ("" for home, "/about", …).
 * Each language canonicalises to its own URL — never across languages — and
 * `x-default` points at the English equivalent.
 */
export function localeAlternates(locale: string, path = "") {
  return {
    canonical: absoluteUrl(locale, path),
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
    url: absoluteUrl(locale, path),
    siteName: firm.name,
    locale: locale === "zh" ? "zh_CN" : "en_MY",
    type: "website" as const,
    images: [OG_IMAGE],
  };
}

/** Twitter card mirroring the Open Graph card. */
export function twitterFor() {
  return {
    card: "summary_large_image" as const,
    images: [OG_IMAGE.url],
  };
}

/** Canonical + Open Graph in one call, for per-route `generateMetadata`. */
export function routeSeo(locale: string, path = "") {
  return {
    alternates: localeAlternates(locale, path),
    openGraph: openGraphFor(locale, path),
    twitter: twitterFor(),
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

export type Crumb = {
  /** Visible label, already localized. */
  name: string;
  /** Locale-agnostic route path ("" for home, "/team", …). */
  path: string;
};

/**
 * BreadcrumbList reflecting the real route hierarchy — Home is always first
 * and the current page last. No synthetic levels are introduced.
 */
export function breadcrumbList(locale: string, trail: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(locale, trail[trail.length - 1]?.path ?? "")}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(locale, crumb.path),
    })),
  };
}
