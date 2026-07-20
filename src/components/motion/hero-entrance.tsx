"use client";

import { useReducedMotion, motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { firm } from "@/lib/firm";

type HeroEntranceProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  nameZh: string;
  ctaEnquire: string;
  ctaWhatsapp: string;
  whatsappHref: string;
};

export function HeroEntrance({
  eyebrow,
  title,
  subtitle,
  nameZh,
  ctaEnquire,
  ctaWhatsapp,
  whatsappHref,
}: HeroEntranceProps) {
  const reduce = useReducedMotion();
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12 },
    },
  };
  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      className="container-narrow relative section-pad"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.p
        variants={item}
        className="text-sm font-medium uppercase tracking-[0.2em] text-gold"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        variants={item}
        className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl"
      >
        {title}
      </motion.h1>
      <motion.div
        variants={item}
        className="my-4 h-3 w-3 rotate-45 border border-gold bg-gold/20"
        aria-hidden
      />
      <motion.p
        variants={item}
        className="mt-2 max-w-2xl text-lg text-ivory/80 sm:text-xl"
      >
        {subtitle}
      </motion.p>
      <motion.p variants={item} className="mt-4 font-serif text-gold-muted">
        {nameZh || firm.nameZh}
      </motion.p>
      <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
        <Button asChild variant="gold" size="lg">
          <Link href="/book-appointment">{ctaEnquire}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-ivory/30 text-ivory hover:border-gold hover:text-gold"
        >
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            {ctaWhatsapp}
          </a>
        </Button>
      </motion.div>
    </motion.div>
  );
}
