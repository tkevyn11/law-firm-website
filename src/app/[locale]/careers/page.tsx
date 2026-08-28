import { Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { firm } from "@/lib/firm";
import { routeSeo } from "@/lib/seo";

const whyKeys = ["mentorship", "growth", "culture"] as const;
const roleKeys = ["associates", "pupils", "interns", "paralegals"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careers" });
  return {
    title: t("title"),
    description: t("subtitle"),
    ...routeSeo(locale, "/careers"),
  };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");

  return (
    <>
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        imageSrc="/hero/careers-hero.png"
        imageAlt={t("heroAlt")}
        layout="copySpaceLeft"
      />

      <section className="section-pad">
        <div className="container-narrow max-w-3xl">
          <Reveal>
            <h2 className="text-3xl font-semibold">{t("introTitle")}</h2>
            <div className="gold-rule mt-4 max-w-xs" />
            <p className="mt-6 text-lg leading-relaxed text-navy/75">
              {t("introBody")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-white section-pad">
        <div className="container-narrow">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold">
              {t("whyTitle")}
            </h2>
            <div className="gold-diamond" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {whyKeys.map((key, i) => (
              <Reveal key={key} delay={i * 0.08}>
                <Card className="h-full text-center">
                  <CardHeader>
                    <CardTitle>{t(`why.${key}.title`)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-navy/70">
                      {t(`why.${key}.body`)}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow">
          <Reveal>
            <h2 className="text-center text-3xl font-semibold">
              {t("rolesTitle")}
            </h2>
            <div className="gold-diamond" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {roleKeys.map((key, i) => (
              <Reveal key={key} delay={i * 0.06}>
                <article className="h-full rounded-lg border border-border bg-white p-6 border-l-4 border-l-gold">
                  <h3 className="font-serif text-xl text-navy">
                    {t(`roles.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy/70">
                    {t(`roles.${key}.body`)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-white section-pad">
        <div className="container-narrow max-w-3xl text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold">{t("remunerationTitle")}</h2>
            <div className="gold-diamond" />
            <p className="mt-4 leading-relaxed text-navy/75">
              {t("remunerationBody")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-navy text-center text-ivory navy-cta">
        <div className="container-narrow relative">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold text-white">
              {t("applyTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-ivory/75">
              {t("applyBody")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="gold" size="lg">
                <a href={`mailto:${firm.email}?subject=Career%20Application`}>
                  <Mail className="h-4 w-4" aria-hidden />
                  {t("applyEmail")}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-ivory/30 text-ivory hover:border-gold hover:text-gold"
              >
                <Link href="/book-appointment">{t("applyBook")}</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
