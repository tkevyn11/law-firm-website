import type { MetadataRoute } from "next";
import { firm, team } from "@/lib/firm";

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
  const base = firm.siteUrl.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
        alternates: {
          languages: {
            en: `${base}/en${path}`,
            zh: `${base}/zh${path}`,
          },
        },
      });
    }

    for (const member of team) {
      const path = `/team/${member.slug}`;
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            en: `${base}/en${path}`,
            zh: `${base}/zh${path}`,
          },
        },
      });
    }
  }

  return entries;
}
