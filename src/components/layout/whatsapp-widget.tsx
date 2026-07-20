"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { partners, whatsappUrl } from "@/lib/firm";
import { cn } from "@/lib/utils";

export function WhatsappWidget() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("whatsappWidget");
  const locale = useLocale();
  const reduce = useReducedMotion();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="w-[min(92vw,320px)] overflow-hidden rounded-lg border border-navy/10 bg-white shadow-xl"
          >
            <div className="bg-navy px-4 py-3 text-ivory">
              <p className="font-serif text-lg text-white">{t("title")}</p>
              <p className="mt-1 text-xs text-ivory/70">{t("subtitle")}</p>
            </div>
            <ul className="divide-y divide-navy/10 p-2">
              {partners.map((p) => (
                <li key={p.id}>
                  <a
                    href={whatsappUrl(
                      p.whatsapp,
                      `Hello ${p.name}, I would like to enquire about legal advice.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-3 transition-colors hover:bg-gold/10"
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
                      <MessageCircle className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-navy">
                        {locale === "zh" ? p.nameZh : p.name}
                      </span>
                      <span className="block text-xs text-navy/55">
                        {locale === "zh" ? p.roleZh : p.role}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? t("close") : t("open")}
        className={cn(
          "inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full shadow-lg transition-colors",
          open
            ? "bg-navy text-ivory hover:bg-navy/90"
            : "bg-[#25D366] text-white hover:bg-[#1ebe57]"
        )}
      >
        {open ? (
          <X className="h-6 w-6" aria-hidden />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden />
        )}
      </button>
    </div>
  );
}
