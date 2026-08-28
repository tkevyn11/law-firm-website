import { getTranslations } from "next-intl/server";
import { firm, partners } from "@/lib/firm";
import { absoluteUrl, breadcrumbList, type Crumb } from "@/lib/seo";

const ORG_ID = `${firm.siteUrl}/#organization`;
const SITE_ID = `${firm.siteUrl}/#website`;

function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Site-wide entity graph, rendered once per page from the locale layout.
 *
 * `@id` values are locale-independent so both language versions describe the
 * same firm and the same two people rather than duplicate entities. Only the
 * human-readable labels (`description`, `jobTitle`) are localized, with the
 * Chinese names carried in `alternateName`.
 */
export async function JsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "meta" });
  const isZh = locale === "zh";

  const attorney = (index: 0 | 1) => {
    const p = partners[index];
    return {
      "@type": "Attorney",
      "@id": `${firm.siteUrl}/#${p.id}`,
      name: p.name,
      alternateName: p.nameZh,
      url: absoluteUrl(locale, `/team/${p.slug}`),
      jobTitle: isZh ? p.roleZh : p.role,
      worksFor: { "@id": ORG_ID },
      telephone: p.phones[0],
      email: p.email,
      knowsLanguage: p.languageCodes,
    };
  };

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: firm.siteUrl,
        name: firm.name,
        alternateName: firm.nameZh,
        publisher: { "@id": ORG_ID },
        inLanguage: ["en-MY", "zh-MY"],
      },
      {
        "@type": ["LegalService", "LocalBusiness", "Attorney"],
        "@id": ORG_ID,
        name: firm.name,
        alternateName: firm.nameZh,
        description: t("description"),
        url: firm.siteUrl,
        logo: `${firm.siteUrl}/icon-512.png`,
        image: `${firm.siteUrl}/og-image.png`,
        telephone: firm.phone,
        email: firm.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${firm.address.line1}, ${firm.address.line2}`,
          addressLocality: "Mont Kiara, Kuala Lumpur",
          postalCode: "50480",
          addressCountry: "MY",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 3.172,
          longitude: 101.665,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
        areaServed: {
          "@type": "Country",
          name: "Malaysia",
        },
        priceRange: "$$",
        knowsLanguage: ["en", "zh", "ms"],
        employee: [
          { "@id": `${firm.siteUrl}/#${partners[0].id}` },
          { "@id": `${firm.siteUrl}/#${partners[1].id}` },
        ],
      },
      attorney(0),
      attorney(1),
    ],
  };

  return <JsonLdScript data={data} />;
}

/**
 * Per-page WebPage node plus its BreadcrumbList.
 *
 * Kept separate from the site-wide graph because both are page-specific: the
 * `@id`s include the locale-prefixed URL so `/en/about` and `/zh/about` are
 * distinct pages of the same site.
 */
export function PageJsonLd({
  locale,
  path,
  name,
  description,
  trail,
}: {
  locale: string;
  path: string;
  name: string;
  description?: string;
  /** Real hierarchy only. Home omits this — a single Home crumb is not useful. */
  trail?: Crumb[];
}) {
  const url = absoluteUrl(locale, path);
  const hasCrumbs = Boolean(trail && trail.length >= 2);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        ...(description ? { description } : {}),
        isPartOf: { "@id": SITE_ID },
        about: { "@id": ORG_ID },
        inLanguage: locale === "zh" ? "zh-MY" : "en-MY",
        ...(hasCrumbs ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
      },
      ...(hasCrumbs && trail ? [breadcrumbList(locale, trail)] : []),
    ],
  };

  return <JsonLdScript data={data} />;
}

/**
 * FAQPage for the home page only.
 *
 * Google expects FAQ markup on the page whose content actually answers the
 * questions; emitting the same FAQPage on every route would be duplicate
 * structured data across 18 URLs.
 */
export async function FaqJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "faq" });
  const keys = ["location", "practiceAreas", "languages"] as const;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(locale)}#faq`,
    inLanguage: locale === "zh" ? "zh-MY" : "en-MY",
    mainEntity: keys.map((key) => ({
      "@type": "Question",
      name: t(`${key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`${key}.answer`),
      },
    })),
  };

  return <JsonLdScript data={data} />;
}
