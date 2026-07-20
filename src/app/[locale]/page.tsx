import Image from "next/image";
import { Scale, Shield, MessageSquare, Globe2 } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { firm, partners, practiceAreaIds, whatsappUrl } from "@/lib/firm";

const whyIcons = [Shield, MessageSquare, Scale, Globe2] as const;
const whyKeys = ["strategy", "communication", "results", "multilingual"] as const;
const homePractice = practiceAreaIds.slice(0, 6);

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

  return (
    <>
      <section className="relative overflow-hidden border-b border-navy/10 bg-navy text-ivory">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #b8925a 0%, transparent 45%), radial-gradient(circle at 80% 60%, #c9a227 0%, transparent 40%)",
          }}
        />
        <div className="container-narrow relative section-pad">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">
            {t("heroEyebrow")}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
            {t("heroTitle")}
          </h1>
          <div className="gold-diamond" />
          <p className="mt-2 max-w-2xl text-lg text-ivory/80 sm:text-xl">
            {t("heroSubtitle")}
          </p>
          <p className="mt-4 font-serif text-gold-muted">{firm.nameZh}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href="/contact">{t("ctaEnquire")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-ivory/30 text-ivory hover:border-gold hover:text-gold"
            >
              <a href={wa} target="_blank" rel="noopener noreferrer">
                {t("ctaWhatsapp")}
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {t("introTitle")}
            </h2>
            <div className="gold-rule mt-4 max-w-xs" />
            <p className="mt-6 text-lg leading-relaxed text-navy/75">
              {t("introBody")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "1000+", label: t("stats.cases") },
              { value: "20+", label: t("stats.years") },
              { value: "3", label: t("stats.languages") },
              { value: "KL", label: t("stats.location") },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-gold/30 bg-white p-5 text-center"
              >
                <p className="font-serif text-3xl font-semibold text-gold">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-navy/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-white section-pad">
        <div className="container-narrow">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {t("practiceTitle")}
            </h2>
            <p className="mt-3 text-navy/70">{t("practiceSubtitle")}</p>
            <div className="gold-diamond" />
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {homePractice.map((id) => (
              <Card
                key={id}
                className="border-l-4 border-l-gold cursor-pointer"
              >
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
          <h2 className="text-center text-3xl font-semibold sm:text-4xl">
            {t("whyTitle")}
          </h2>
          <div className="gold-diamond" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyKeys.map((key, i) => {
              const Icon = whyIcons[i];
              return (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-white p-6 text-center"
                >
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
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-navy/10 bg-white section-pad">
        <div className="container-narrow">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl">
              {t("partnersTitle")}
            </h2>
            <p className="mt-3 text-navy/70">{t("partnersSubtitle")}</p>
            <div className="gold-diamond" />
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {partners.map((p) => (
              <Card key={p.id} className="overflow-hidden">
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
                  <p className="font-serif text-3xl text-navy">{p.highlight}</p>
                  <p className="text-sm text-navy/60">{p.highlightLabel}</p>
                  <p className="mt-4 text-sm text-navy/70">
                    {p.languages.join(" · ")}
                  </p>
                  <Button asChild variant="outline" className="mt-6" size="sm">
                    <Link href="/about">
                      {locale === "zh" ? "了解更多" : "Learn more"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy text-center text-ivory">
        <div className="container-narrow">
          <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ivory/75">{t("ctaBody")}</p>
          <Button asChild variant="gold" size="lg" className="mt-8">
            <Link href="/contact">{t("ctaButton")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
