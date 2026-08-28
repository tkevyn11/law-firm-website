import { MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AppointmentForm } from "@/components/contact/appointment-form";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PageJsonLd } from "@/components/seo/json-ld";
import { partners, whatsappUrl } from "@/lib/firm";
import { routeSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "appointment" });
  return {
    title: t("seo.title"),
    description: t("seo.description"),
    ...routeSeo(locale, "/book-appointment"),
  };
}

export default async function BookAppointmentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appointment");
  const tn = await getTranslations("nav");

  return (
    <>
      <PageJsonLd
        locale={locale}
        path="/book-appointment"
        name={t("seo.title")}
        description={t("seo.description")}
        trail={[
          { name: tn("home"), path: "" },
          { name: tn("book"), path: "/book-appointment" },
        ]}
      />
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        imageSrc="/hero/appointment.jpg"
        imageAlt={t("heroAlt")}
      />

      <section className="section-pad">
        <div className="container-narrow grid gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <h2 className="font-serif text-2xl text-navy">{t("formTitle")}</h2>
            <div className="gold-rule mt-3 max-w-[8rem]" />
            <div className="relative mt-8">
              <AppointmentForm />
            </div>
            <p className="mt-6 text-xs text-navy/50">{t("disclaimer")}</p>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={0.1}>
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="font-serif text-xl text-navy">{t("altTitle")}</h2>
              <p className="mt-2 text-sm text-navy/70">{t("altBody")}</p>
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
                        `Hello ${p.name}, I would like to book an appointment.`
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
          </Reveal>
        </div>
      </section>
    </>
  );
}
