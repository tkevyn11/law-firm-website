import type { MetadataRoute } from "next";
import { SITE_URL, team } from "@/lib/firm";
import { sitemapAlternates } from "@/lib/seo";

const locales = ["en", "zh"] as const;
const paths = [
  "",
  "/about",
  "/practice-areas",
  "/team",
  "/careers",
  "/book-appointment",
  "/contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: sitemapAlternates(path),
      });
    }

    for (const member of team) {
      const path = `/team/${member.slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: sitemapAlternates(path),
      });
    }
  }

  return entries;
}
