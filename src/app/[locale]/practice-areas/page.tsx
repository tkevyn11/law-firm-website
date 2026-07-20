import {
  Briefcase,
  Building2,
  FileWarning,
  Gavel,
  HeartHandshake,
  Home,
  Scale,
  Users,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { HoverLift } from "@/components/motion/hover-lift";
import { practiceAreaIds, type PracticeAreaId } from "@/lib/firm";

const icons: Record<PracticeAreaId, typeof Scale> = {
  criminal: Gavel,
  civil: Scale,
  debt: FileWarning,
  corporate: Building2,
  "personal-injury": HeartHandshake,
  family: Users,
  property: Home,
  employment: Briefcase,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "practice" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/practice-areas`,
      languages: {
        en: "/en/practice-areas",
        zh: "/zh/practice-areas",
      },
    },
  };
}

export default async function PracticeAreasPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("practice");
  const tn = await getTranslations("nav");

  return (
    <>
      <section className="border-b border-navy/10 bg-white section-pad !pb-12 !pt-16">
        <div className="container-narrow text-center">
          <h1 className="text-4xl font-semibold sm:text-5xl">{t("title")}</h1>
          <p className="mt-3 text-lg text-navy/70">{t("subtitle")}</p>
          <div className="gold-diamond" />
        </div>
      </section>

      <div className="sticky top-[5.5rem] z-30 border-b border-navy/10 bg-ivory/95 backdrop-blur-md sm:top-[6.25rem] lg:top-[9.5rem]">
        <div className="container-narrow overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <p className="sr-only">{t("jumpTo")}</p>
          <nav
            className="flex min-w-max gap-2"
            aria-label={t("jumpTo")}
          >
            {practiceAreaIds.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="cursor-pointer whitespace-nowrap rounded-md border border-navy/15 bg-white px-3 py-1.5 text-xs font-medium text-navy/80 transition-colors hover:border-gold hover:text-gold"
              >
                {t(`areas.${id}.title`)}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <section className="section-pad">
        <div className="container-narrow grid gap-6 md:grid-cols-2">
          {practiceAreaIds.map((id, i) => {
            const Icon = icons[id];
            const services = t.raw(`areas.${id}.services`) as string[];
            return (
              <Reveal key={id} delay={i * 0.05}>
                <HoverLift>
                  <Card
                    id={id}
                    className="h-full scroll-mt-36 border-l-4 border-l-gold sm:scroll-mt-40 lg:scroll-mt-52"
                  >
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <CardTitle className="pt-1.5">
                        {t(`areas.${id}.title`)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-navy/75">
                        {t(`areas.${id}.body`)}
                      </p>
                      {Array.isArray(services) && services.length > 0 && (
                        <ul className="mt-5 space-y-2 border-t border-navy/10 pt-5">
                          {services.map((service) => (
                            <li
                              key={service}
                              className="flex gap-2 text-sm text-navy/70"
                            >
                              <span
                                className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                                aria-hidden
                              />
                              {service}
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </HoverLift>
              </Reveal>
            );
          })}
        </div>

        <div className="container-narrow mt-14 text-center">
          <Button asChild variant="gold" size="lg">
            <Link href="/book-appointment">{tn("book")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
