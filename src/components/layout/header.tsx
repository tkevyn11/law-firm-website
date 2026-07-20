"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { firm, partners, whatsappUrl } from "@/lib/firm";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/team", key: "team" as const },
  { href: "/practice-areas", key: "practice" as const },
  { href: "/careers", key: "careers" as const },
  { href: "/contact", key: "contact" as const },
];

export function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const primaryWa = whatsappUrl(
    partners[0].whatsapp,
    "Hello, I would like to enquire about legal advice."
  );

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-ivory/95 backdrop-blur-md">
      {/* Top row: logo + actions */}
      <div className="container-narrow flex min-h-[5.5rem] items-center justify-between gap-4 px-4 py-2 sm:min-h-[6.25rem] sm:px-6 lg:min-h-[6.75rem] lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink cursor-pointer items-center"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logo.png"
            alt={`${firm.name} logo`}
            width={926}
            height={314}
            className="h-[4.75rem] w-auto max-w-[min(70vw,340px)] object-contain object-left sm:h-[5.25rem] sm:max-w-[400px] lg:h-[5.75rem] lg:max-w-[440px]"
            priority
            unoptimized
          />
        </Link>

        <div className="hidden items-center gap-3 md:flex lg:gap-4">
          <LanguageSwitcher />
          <Button asChild variant="gold" size="sm">
            <a
              href={primaryWa}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t("whatsapp")}</span>
            </a>
          </Button>
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href="/book-appointment">{t("book")}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-navy/15 text-navy lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Desktop nav row — breathing room, not squeezed beside CTAs */}
      <nav
        className="hidden border-t border-navy/10 lg:block"
        aria-label="Main"
      >
        <div className="container-narrow flex items-center justify-center gap-8 px-4 py-3 sm:gap-10 sm:px-6 lg:px-8 xl:gap-12">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer text-[0.8125rem] font-medium tracking-wide text-navy/75 transition-colors duration-200 hover:text-gold xl:text-sm"
            >
              {t(link.key)}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile / tablet drawer */}
      <div
        className={cn(
          "border-t border-navy/10 bg-ivory lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav
          className="container-narrow flex flex-col gap-1 px-4 py-4"
          aria-label="Mobile"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-md px-3 py-3 text-sm font-medium text-navy hover:bg-navy/5"
            >
              {t(link.key)}
            </Link>
          ))}
          <div className="mt-3 flex flex-wrap items-center gap-3 px-3 md:hidden">
            <LanguageSwitcher />
            <Button asChild variant="gold" size="sm">
              <a href={primaryWa} target="_blank" rel="noopener noreferrer">
                {t("whatsapp")}
              </a>
            </Button>
            <Button asChild size="sm">
              <Link href="/book-appointment" onClick={() => setOpen(false)}>
                {t("book")}
              </Link>
            </Button>
          </div>
          <div className="mt-2 hidden px-3 md:block lg:hidden">
            <Button asChild size="sm">
              <Link href="/book-appointment" onClick={() => setOpen(false)}>
                {t("book")}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
