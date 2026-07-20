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
  { href: "/practice-areas", key: "practice" as const },
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
      <div className="container-narrow flex min-h-[6rem] items-center justify-between gap-3 px-4 py-2 sm:min-h-[7rem] sm:gap-4 sm:px-6 lg:min-h-[7.5rem] lg:px-8">
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
            className="h-20 w-auto max-w-[min(78vw,380px)] object-contain object-left sm:h-[5.75rem] sm:max-w-[460px] lg:h-[6.5rem] lg:max-w-[520px]"
            priority
            unoptimized
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex lg:gap-8" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="cursor-pointer text-sm font-medium text-navy/80 transition-colors duration-200 hover:text-gold"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button asChild variant="gold" size="sm">
            <a
              href={primaryWa}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              {t("whatsapp")}
            </a>
          </Button>
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href="/contact">{t("enquire")}</Link>
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

      <div
        className={cn(
          "border-t border-navy/10 bg-ivory lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="container-narrow flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
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
          <div className="mt-3 flex flex-wrap items-center gap-3 px-3">
            <LanguageSwitcher />
            <Button asChild variant="gold" size="sm">
              <a href={primaryWa} target="_blank" rel="noopener noreferrer">
                {t("whatsapp")}
              </a>
            </Button>
            <Button asChild size="sm">
              <Link href="/contact" onClick={() => setOpen(false)}>
                {t("enquire")}
              </Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
