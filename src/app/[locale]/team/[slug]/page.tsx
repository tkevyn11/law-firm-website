import Image from "next/image";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import {
  getTeamMember,
  team,
  telHref,
  whatsappUrl,
} from "@/lib/firm";

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return {};
  const t = await getTranslations({ locale, namespace: "team" });
  const name = locale === "zh" ? member.nameZh : member.name;
  return {
    title: name,
    description: t(`members.${member.slug}.focus`),
    alternates: {
      canonical: `/${locale}/team/${slug}`,
      languages: {
        en: `/en/team/${slug}`,
        zh: `/zh/team/${slug}`,
      },
    },
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const member = getTeamMember(slug);
  if (!member) notFound();

  const t = await getTranslations("team");
  const name = locale === "zh" ? member.nameZh : member.name;
  const role = locale === "zh" ? member.roleZh : member.role;

  return (
    <>
      <section className="border-b border-navy/10 bg-white section-pad !pb-12 !pt-16">
        <div className="container-narrow">
          <Link
            href="/team"
            className="cursor-pointer text-sm text-navy/60 hover:text-gold"
          >
            ← {t("backToTeam")}
          </Link>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-narrow">
          <Reveal>
            <article className="grid gap-10 rounded-lg border border-border bg-white p-6 md:grid-cols-[220px_1fr] md:p-10">
              <div className="flex flex-col items-center text-center">
                {member.photo ? (
                  <div className="relative h-44 w-44 overflow-hidden rounded-full border-2 border-gold/50 shadow-md">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top"
                      sizes="176px"
                    />
                  </div>
                ) : (
                  <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-gold/50 bg-navy font-serif text-4xl text-gold">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                )}
                <h1 className="mt-5 font-serif text-3xl text-navy">{name}</h1>
                <p className="mt-1 text-sm text-gold">{role}</p>
                {member.whatsapp ? (
                  <Button asChild variant="gold" size="sm" className="mt-5">
                    <a
                      href={whatsappUrl(
                        member.whatsapp,
                        `Hello ${member.name}, I would like to enquire about legal advice.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden />
                      WhatsApp
                    </a>
                  </Button>
                ) : null}
              </div>

              <div>
                <p className="leading-relaxed text-navy/80">
                  {t(`members.${member.slug}.bio`)}
                </p>
                <h2 className="mt-8 font-serif text-lg text-navy">
                  {t("credentials")}
                </h2>
                <p className="mt-2 text-sm text-navy/70">
                  {t(`members.${member.slug}.focus`)}
                </p>
                <h2 className="mt-4 font-serif text-lg text-navy">
                  {t("languages")}
                </h2>
                <p className="mt-2 text-sm text-navy/70">
                  {member.languages.join(" · ")}
                </p>
                <h2 className="mt-4 font-serif text-lg text-navy">
                  {t("contact")}
                </h2>
                <div className="mt-2 space-y-1 text-sm text-navy/70">
                  {member.phones.map((phone) => (
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
                      href={`mailto:${member.email}`}
                      className="cursor-pointer hover:text-gold"
                    >
                      {member.email}
                    </a>
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
