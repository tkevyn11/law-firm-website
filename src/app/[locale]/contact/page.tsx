import { MapPin, MessageCircle, Phone, Mail, Clock } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/page-hero";
import { firm, partners, whatsappUrl } from "@/lib/firm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: "/en/contact", zh: "/zh/contact" },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        imageSrc="/hero/contact.jpg"
        imageAlt={t("heroAlt")}
      />

      <section className="section-pad">
        <div className="container-narrow grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl text-navy">{t("formTitle")}</h2>
            <div className="gold-rule mt-3 max-w-[8rem]" />
            <div className="relative mt-8">
              <EnquiryForm />
            </div>
            <p className="mt-6 text-xs text-navy/50">{t("disclaimer")}</p>
          </div>

          <aside className="space-y-8 lg:col-span-2">
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="font-serif text-xl text-navy">{t("officeTitle")}</h2>
              <ul className="mt-4 space-y-4 text-sm text-navy/80">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    {firm.address.line1}
                    <br />
                    {firm.address.line2}
                    <br />
                    {firm.address.line3}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={`tel:${firm.phone.replace(/\s/g, "")}`}
                    className="cursor-pointer hover:text-gold"
                  >
                    {firm.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-gold" />
                  <a
                    href={`mailto:${firm.email}`}
                    className="cursor-pointer hover:text-gold"
                  >
                    {firm.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-4 w-4 shrink-0 text-gold" />
                  <span>{t("hours")}</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="font-serif text-xl text-navy">
                {t("whatsappTitle")}
              </h2>
              <div className="mt-4 space-y-3">
                {partners.map((p) => (
                  <Button
                    key={p.id}
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <a
                      href={whatsappUrl(
                        p.whatsapp,
                        `Hello ${p.name}, I would like to enquire about legal advice.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4 text-gold" />
                      {locale === "zh" ? p.nameZh : p.name}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-navy/10 bg-white section-pad !pt-12">
        <div className="container-narrow">
          <h2 className="mb-6 text-center font-serif text-2xl text-navy">
            {t("mapTitle")}
          </h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <iframe
              title="Publika Solaris Dutamas map"
              src="https://maps.google.com/maps?q=Publika%20Solaris%20Dutamas%20Mont%20Kiara&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="h-[360px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-center text-sm">
            <a
              href={firm.mapSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-gold hover:underline"
            >
              Open in Google Maps
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
