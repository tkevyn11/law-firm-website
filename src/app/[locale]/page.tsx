import Image from "next/image";
import { existsSync } from "fs";
import path from "path";
import { Scale, Shield, MessageSquare, Globe2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroEntrance } from "@/components/motion/hero-entrance";
import { HeroImage } from "@/components/motion/hero-image";
import { Reveal } from "@/components/motion/reveal";
import { HoverLift } from "@/components/motion/hover-lift";
import { CountUp } from "@/components/motion/count-up";
import { firm, partners, practiceAreaIds, whatsappUrl } from "@/lib/firm";

const whyIcons = [Shield, MessageSquare, Scale, Globe2] as const;
const whyKeys = ["strategy", "communication", "results", "multilingual"] as const;
const homePractice = practiceAreaIds.slice(0, 6);
const testimonialKeys = ["t1", "t2", "t3"] as const;
const HOME_HERO = "/hero/home.png";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tp = await getTranslations("practice.areas");
  const wa = whatsappUrl(
    partners[0].whatsapp,
    "Hello, I would like to enquire about legal advice."
  );
  const hasHomeHero = existsSync(
    path.join(process.cwd(), "public", "hero", "home.png")
  );

  return (
    <>
      <section className="relative min-h-[70vh] overflow-hidden border-b border-navy/10 bg-navy text-ivory sm:min-h-[75vh]">
        {hasHomeHero ? (
          <HeroImage
            src={HOME_HERO}
            alt={t("heroAlt")}
            priority
            imageOpacity={1}
          />
        ) : null}
        {/* Left-weighted overlay — text sits in the image's dark copy space */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/55 to-navy/25"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-navy/30"
          aria-hidden
        />
        <div className="relative flex min-h-[70vh] items-center sm:min-h-[75vh]">
          <HeroEntrance
            eyebrow={t("heroEyebrow")}
            title={t("heroTitle")}
            subtitle={t("heroSubtitle")}
            nameZh={firm.nameZh}
            ctaEnquire={t("ctaEnquire")}
            ctaWhatsapp={t("ctaWhatsapp")}
            whatsappHref={wa}
          />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {t("introTitle")}
            </h2>
            <div className="gold-rule mt-4 max-w-xs" />
            <p className="mt-6 text-lg leading-relaxed text-navy/75">
              {t("introBody")}
            </p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                value: 1000,
                suffix: "+",
                label: t("stats.cases"),
              },
              {
                value: 20,
                suffix: "+",
                label: t("stats.years"),
              },
              {
                value: 3,
                suffix: "",
                label: t("stats.languages"),
              },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08}>
                <div className="rounded-lg border border-gold/30 bg-white p-5 text-center">
                  <p className="font-serif text-3xl font-semibold text-gold">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-navy/60">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.24}>
              <div className="rounded-lg border border-gold/30 bg-white p-5 text-center">
                <p className="font-serif text-3xl font-semibold text-gold">KL</p>
                <p className="mt-2 text-xs uppercase tracking-wide text-navy/60">
                  {t("stats.location")}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-white section-pad">
        <div className="container-narrow">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                {t("practiceTitle")}
              </h2>
              <p className="mt-3 text-navy/70">{t("practiceSubtitle")}</p>
              <div className="gold-diamond" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homePractice.map((id, i) => (
              <Reveal key={id} delay={i * 0.05}>
                <HoverLift>
                  <Card className="h-full border-l-4 border-l-gold cursor-pointer transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle>
                        <Link
                          href={`/practice-areas#${id}`}
                          className="hover:text-gold"
                        >
                          {tp(`${id}.title`)}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-navy/70">
                        {tp(`${id}.body`)}
                      </p>
                    </CardContent>
                  </Card>
                </HoverLift>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/practice-areas">{t("viewAllPractice")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold sm:text-4xl">
              {t("whyTitle")}
            </h2>
            <div className="gold-diamond" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyKeys.map((key, i) => {
              const Icon = whyIcons[i];
              return (
                <Reveal key={key} delay={i * 0.06}>
                  <div className="h-full rounded-lg border border-border bg-white p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-semibold text-navy">
                      {t(`why.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy/70">
                      {t(`why.${key}.body`)}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-white section-pad">
        <div className="container-narrow">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                {t("partnersTitle")}
              </h2>
              <p className="mt-3 text-navy/70">{t("partnersSubtitle")}</p>
              <div className="gold-diamond" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {partners.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <HoverLift>
                  <Card className="h-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-navy to-gold" />
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      {p.photo ? (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-gold/40">
                          <Image
                            src={p.photo}
                            alt={p.name}
                            fill
                            className="object-cover object-top"
                            sizes="80px"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-gold/40 bg-navy font-serif text-xl text-gold">
                          {p.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-2xl">
                          {locale === "zh" ? p.nameZh : p.name}
                        </CardTitle>
                        <p className="text-sm text-gold">
                          {locale === "zh" ? p.roleZh : p.role}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="font-serif text-3xl text-navy">
                        {p.highlight}
                      </p>
                      <p className="text-sm text-navy/60">{p.highlightLabel}</p>
                      <p className="mt-4 text-sm text-navy/70">
                        {p.languages.join(" · ")}
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="mt-6"
                        size="sm"
                      >
                        <Link href={`/team/${p.slug}`}>
                          {locale === "zh" ? "了解更多" : "Learn more"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </HoverLift>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold sm:text-4xl">
                {t("testimonialsTitle")}
              </h2>
              <p className="mt-3 text-navy/70">{t("testimonialsSubtitle")}</p>
              <div className="gold-diamond" />
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonialKeys.map((key, i) => (
              <Reveal key={key} delay={i * 0.08}>
                <HoverLift>
                  <blockquote className="flex h-full flex-col rounded-lg border border-border bg-white p-6">
                    <p className="flex-1 text-sm leading-relaxed text-navy/75">
                      “{t(`testimonials.${key}.quote`)}”
                    </p>
                    <footer className="mt-5 border-t border-navy/10 pt-4 text-xs font-medium uppercase tracking-wide text-gold">
                      {t(`testimonials.${key}.author`)}
                    </footer>
                  </blockquote>
                </HoverLift>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy text-center text-ivory navy-cta">
        <div className="container-narrow relative">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/75">{t("ctaBody")}</p>
            <Button asChild variant="gold" size="lg" className="mt-8">
              <Link href="/book-appointment">{t("ctaButton")}</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
