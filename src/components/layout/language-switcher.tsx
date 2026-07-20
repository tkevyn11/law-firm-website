"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: "en" | "zh") {
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-navy/15 bg-white/80 p-0.5 text-xs font-medium",
        className
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={cn(
          "cursor-pointer rounded px-2.5 py-1.5 transition-colors duration-200",
          locale === "en"
            ? "bg-navy text-ivory"
            : "text-navy/70 hover:text-navy"
        )}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLocale("zh")}
        className={cn(
          "cursor-pointer rounded px-2.5 py-1.5 transition-colors duration-200",
          locale === "zh"
            ? "bg-navy text-ivory"
            : "text-navy/70 hover:text-navy"
        )}
        aria-pressed={locale === "zh"}
      >
        中文
      </button>
    </div>
  );
}
