import { getTranslations } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/routing";
import { firm } from "@/lib/firm";

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const year = new Date().getFullYear();
  const isZh = locale === "zh";

  return (
    <footer className="border-t border-navy/10 bg-navy text-ivory">
      <div className="container-narrow section-pad !py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-serif text-xl tracking-wide text-white">
              {firm.name}
            </p>
            <p className="mt-1 text-sm text-gold-muted">{firm.nameZh}</p>
            <p className="mt-2 text-xs text-ivory/60">{firm.titles}</p>
            <div className="gold-rule mt-6 max-w-[12rem]" />
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">
              {t("quickLinks")}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-ivory/80">
              <li>
                <Link href="/" className="cursor-pointer hover:text-gold">
                  {nav("home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="cursor-pointer hover:text-gold">
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/practice-areas"
                  className="cursor-pointer hover:text-gold"
                >
                  {nav("practice")}
                </Link>
              </li>
              <li>
                <Link href="/team" className="cursor-pointer hover:text-gold">
                  {nav("team")}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="cursor-pointer hover:text-gold"
                >
                  {nav("careers")}
                </Link>
              </li>
              <li>
                <Link
                  href="/book-appointment"
                  className="cursor-pointer hover:text-gold"
                >
                  {nav("book")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="cursor-pointer hover:text-gold"
                >
                  {nav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">
              {t("hours")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-ivory/80">
              <li className="flex gap-2">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  aria-hidden
                />
                <span>
                  {isZh ? firm.hours.weekdaysZh : firm.hours.weekdays}
                  <br />
                  {isZh ? firm.hours.weekendZh : firm.hours.weekend}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold">
              {t("contact")}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-ivory/80">
              <li className="flex gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-gold"
                  aria-hidden
                />
                <span>
                  {firm.address.line1}
                  <br />
                  {firm.address.line2}
                  <br />
                  {firm.address.line3}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <a
                  href={`tel:${firm.phone.replace(/\s/g, "")}`}
                  className="cursor-pointer hover:text-gold"
                >
                  {firm.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <a
                  href={`mailto:${firm.email}`}
                  className="cursor-pointer hover:text-gold"
                >
                  {firm.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-ivory/50">
          <p>
            © {year} {firm.name}. {t("rights")}
          </p>
          <p className="mt-2 max-w-3xl">{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
