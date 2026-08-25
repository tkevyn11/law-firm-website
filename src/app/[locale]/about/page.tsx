import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { partners, telHref, whatsappUrl } from "@/lib/firm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", zh: "/zh/about" },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const partnerCopy = [
    { partner: partners[0], bioKey: "kenny" as const },
    { partner: partners[1], bioKey: "melvin" as const },
  ];

  return (
    <>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        imageSrc="/hero/about-hero.png"
        imageAlt={t("heroAlt")}
        layout="copySpaceLeft"
      />

      <section className="section-pad">
        <div className="container-narrow grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="text-3xl font-semibold">{t("storyTitle")}</h2>
            <div className="gold-rule mt-4 max-w-xs" />
            <p className="mt-6 text-lg leading-relaxed text-navy/75">
              {t("story")}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-navy/5">
              <Image
                src="/about/lady-justice.jpg"
                alt={t("storyImageAlt")}
                fill
                className="object-cover object-right"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-white section-pad">
        <div className="container-narrow">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold">
              {t("valuesTitle")}
            </h2>
            <div className="gold-diamond" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(["integrity", "dedication", "excellence"] as const).map(
              (key, i) => (
                <Reveal key={key} delay={i * 0.08}>
                  <Card className="h-full text-center">
                    <CardHeader>
                      <CardTitle>{t(`values.${key}.title`)}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-navy/70">
                        {t(`values.${key}.body`)}
                      </p>
                    </CardContent>
                  </Card>
                </Reveal>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold">
              {t("partnersTitle")}
            </h2>
            <div className="gold-diamond" />
          </Reveal>
          <div className="mt-12 space-y-10">
            {partnerCopy.map(({ partner, bioKey }, i) => (
              <Reveal key={partner.id} delay={i * 0.08}>
                <article
                  id={partner.id}
                  className="grid gap-8 rounded-lg border border-border bg-white p-6 md:grid-cols-[200px_1fr] md:p-8"
                >
                  <div className="flex flex-col items-center text-center">
                    {partner.photo ? (
                      <div className="relative h-40 w-40 overflow-hidden rounded-full border-2 border-gold/50 shadow-md">
                        <Image
                          src={partner.photo}
                          alt={partner.name}
                          fill
                          className="object-cover object-top"
                          sizes="160px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-gold/50 bg-navy text-3xl font-serif text-gold">
                        {partner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                    <h3 className="mt-4 font-serif text-2xl text-navy">
                      {locale === "zh" ? partner.nameZh : partner.name}
                    </h3>
                    <p className="mt-1 text-sm text-gold">
                      {locale === "zh" ? partner.roleZh : partner.role}
                    </p>
                    <Button asChild variant="gold" size="sm" className="mt-4">
                      <a
                        href={whatsappUrl(
                          partner.whatsapp,
                          `Hello ${partner.name}, I would like to enquire about legal advice.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" aria-hidden />
                        WhatsApp
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href={`/team/${partner.slug}`}>
                        {t("viewProfile")}
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <p className="leading-relaxed text-navy/80">
                      {t(`${bioKey}.bio`)}
                    </p>
                    <h4 className="mt-6 font-serif text-lg text-navy">
                      {t("credentials")}
                    </h4>
                    <p className="mt-2 text-sm text-navy/70">
                      {t(`${bioKey}.focus`)}
                    </p>
                    <h4 className="mt-4 font-serif text-lg text-navy">
                      {t("languages")}
                    </h4>
                    <p className="mt-2 text-sm text-navy/70">
                      {(locale === "zh"
                        ? partner.languagesZh
                        : partner.languages
                      ).join(locale === "zh" ? "，" : " · ")}
                    </p>
                    <div className="mt-4 space-y-1 text-sm text-navy/60">
                      {partner.phones.map((phone) => (
                        <p key={phone}>
                          <a
                            href={telHref(phone)}
                            className="cursor-pointer hover:text-gold"
                          >
                            {phone}
                          </a>
                        </p>
                      ))}
                      <p>
                        <a
                          href={`mailto:${partner.email}`}
                          className="cursor-pointer hover:text-gold"
                        >
                          {partner.email}
                        </a>
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
