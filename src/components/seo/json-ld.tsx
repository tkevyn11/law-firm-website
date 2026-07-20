import { firm, partners } from "@/lib/firm";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LegalService", "LocalBusiness", "Attorney"],
        "@id": `${firm.siteUrl}/#organization`,
        name: firm.name,
        alternateName: firm.nameZh,
        description:
          "Boutique advocates & solicitors in Publika, Mont Kiara, Kuala Lumpur. Criminal defence, civil litigation, corporate, family and property law.",
        url: firm.siteUrl,
        logo: `${firm.siteUrl}/logo.png`,
        image: `${firm.siteUrl}/logo.png`,
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
      },
      {
        "@type": "Attorney",
        "@id": `${firm.siteUrl}/#kenny-tan`,
        name: partners[0].name,
        jobTitle: partners[0].role,
        worksFor: { "@id": `${firm.siteUrl}/#organization` },
        telephone: partners[0].phone,
        email: partners[0].email,
        knowsLanguage: partners[0].languages,
      },
      {
        "@type": "Attorney",
        "@id": `${firm.siteUrl}/#melvin-kong`,
        name: partners[1].name,
        jobTitle: partners[1].role,
        worksFor: { "@id": `${firm.siteUrl}/#organization` },
        telephone: partners[1].phone,
        email: partners[1].email,
        knowsLanguage: partners[1].languages,
      },
      {
        "@type": "FAQPage",
        "@id": `${firm.siteUrl}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Where is TAN, KONG & ASSOCIATES located?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "C4-2-9, Block C4, Publika Solaris Dutamas, No. 1, Jalan Dutamas 1, Mont Kiara, 50480 Kuala Lumpur, Malaysia.",
            },
          },
          {
            "@type": "Question",
            name: "What practice areas does the firm cover?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Criminal defence, civil litigation, debt recovery, corporate and commercial law, personal injury and motor claims, family law, property conveyancing, and employment/industrial matters.",
            },
          },
          {
            "@type": "Question",
            name: "Does the firm speak Chinese?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The firm offers services in English, Chinese (Mandarin) and Bahasa Malaysia, and regularly assists foreign clients.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
