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

      <section className="section-pad">
        <div className="container-narrow grid gap-6 md:grid-cols-2">
          {practiceAreaIds.map((id) => {
            const Icon = icons[id];
            return (
              <Card
                key={id}
                id={id}
                className="scroll-mt-28 border-l-4 border-l-gold"
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
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="container-narrow mt-14 text-center">
          <Button asChild variant="gold" size="lg">
            <Link href="/contact">{tn("enquire")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
