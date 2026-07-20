export const firm = {
  name: "TAN, KONG & ASSOCIATES",
  nameZh: "陈和江律师事务所",
  titles: "Peguambela & Peguamcara · Advocates & Solicitors",
  address: {
    line1: "C4-2-9, Block C4, Publika Solaris Dutamas",
    line2: "No. 1, Jalan Dutamas 1",
    line3: "Mont Kiara, 50480 Kuala Lumpur",
    country: "Malaysia",
  },
  email: "info@tankong.my", // placeholder until official email confirmed
  phone: "+6012-355 0556",
  hours: {
    weekdays: "Monday – Friday · 9:00 am – 6:00 pm",
    weekdaysZh: "星期一至星期五 · 上午 9:00 – 下午 6:00",
    weekend: "Saturday – Sunday · Closed (by appointment)",
    weekendZh: "星期六至星期日 · 休息（可预约）",
  },
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7!2d101.665!3d3.172!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc483f0b0b0b0b%3A0x0!2sPublika%20Solaris%20Dutamas!5e0!3m2!1sen!2smy!4v1700000000000!5m2!1sen!2smy",
  mapSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=Publika+Solaris+Dutamas+Mont+Kiara",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://tankong.my",
} as const;

export const partners = [
  {
    id: "kenny-tan",
    slug: "kenny-tan",
    name: "Kenny Tan",
    nameZh: "陈成意",
    role: "Partner · Criminal Defence",
    roleZh: "合伙人 · 刑事辩护",
    phones: ["+6012-355 0556"],
    whatsapp: "60123550556",
    email: "info@tcycolegal.com",
    languages: ["English", "Chinese", "Bahasa Malaysia"],
    highlight: "1000+",
    highlightLabel: "criminal cases defended",
    photo: "/partners/kenny-tan.jpg",
  },
  {
    id: "melvin-kong",
    slug: "melvin-kong",
    name: "Melvin Kong",
    nameZh: "江俊源",
    role: "Partner · Civil & Corporate",
    roleZh: "合伙人 · 民事与公司法",
    phones: ["+6012-666 3181", "+6011-1163 3181"],
    whatsapp: "60126663181",
    email: "jykongmelvin@gmail.com",
    languages: ["Bahasa Malaysia", "English", "Mandarin"],
    highlight: "10+",
    highlightLabel: "years of practice",
    photo: "",
  },
] as const;

/** Team listing / profile pages — partners only */
export const team = partners;

export type TeamMember = (typeof team)[number];

export const practiceAreaIds = [
  "criminal",
  "civil",
  "debt",
  "corporate",
  "personal-injury",
  "family",
  "property",
  "employment",
] as const;

export type PracticeAreaId = (typeof practiceAreaIds)[number];

export function getTeamMember(slug: string) {
  return team.find((m) => m.slug === slug);
}

export function whatsappUrl(number: string, message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}
