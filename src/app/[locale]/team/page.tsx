import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { HoverLift } from "@/components/motion/hover-lift";
import { PageJsonLd } from "@/components/seo/json-ld";
import { team } from "@/lib/firm";
import { routeSeo } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  return {
    title: t("seo.title"),
    description: t("seo.description"),
    ...routeSeo(locale, "/team"),
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const tn = await getTranslations("nav");

  return (
    <>
      <PageJsonLd
        locale={locale}
        path="/team"
        name={t("seo.title")}
        description={t("seo.description")}
        trail={[
          { name: tn("home"), path: "" },
          { name: tn("team"), path: "/team" },
        ]}
      />
      <PageHero
        title={t("title")}
        subtitle={t("subtitle")}
        imageSrc="/hero/team.jpg"
        imageAlt={t("heroAlt")}
      />

      <section className="section-pad">
        <div className="container-narrow mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.06}>
              <HoverLift>
                <Card className="h-full overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-navy to-gold" />
                  <CardHeader className="flex flex-col items-center space-y-0 text-center">
                    {member.photo ? (
                      <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-gold/40">
                        <Image
                          src={member.photo}
                          alt={locale === "zh" ? member.nameZh : member.name}
                          fill
                          className="object-cover object-top"
                          sizes="112px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold/40 bg-navy font-serif text-2xl text-gold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                    )}
                    <CardTitle className="mt-4 text-xl">
                      {locale === "zh" ? member.nameZh : member.name}
                    </CardTitle>
                    <p className="mt-1 text-sm text-gold">
                      {locale === "zh" ? member.roleZh : member.role}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="line-clamp-3 text-sm text-navy/70">
                      {t(`members.${member.slug}.focus`)}
                    </p>
                    <Button asChild variant="outline" className="mt-6" size="sm">
                      <Link href={`/team/${member.slug}`}>
                        {t("viewProfile")}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </HoverLift>
            </Reveal>
          ))}
        </div>

        <div className="container-narrow mt-12 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/practice-areas">{t("explorePractice")}</Link>
          </Button>
          <Button asChild variant="gold">
            <Link href="/book-appointment">{tn("book")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
