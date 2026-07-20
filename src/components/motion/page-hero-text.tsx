"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type PageHeroTextProps = {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
};

export function PageHeroText({
  title,
  subtitle,
  align = "center",
  className,
}: PageHeroTextProps) {
  const reduce = useReducedMotion();
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.1 },
    },
  };
  const item = {
    hidden: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      className={cn(
        "container-narrow relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24",
        align === "center" ? "text-center" : "text-left",
        className
      )}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h1
        variants={item}
        className="font-serif text-4xl font-semibold text-white sm:text-5xl"
      >
        {title}
      </motion.h1>
      {subtitle ? (
        <motion.p
          variants={item}
          className={cn(
            "mt-3 text-lg text-ivory/80",
            align === "center" && "mx-auto max-w-2xl"
          )}
        >
          {subtitle}
        </motion.p>
      ) : null}
      <motion.div
        variants={item}
        className={cn(
          "my-4 h-3 w-3 rotate-45 border border-gold bg-gold/20",
          align === "center" ? "mx-auto" : "mx-0"
        )}
        aria-hidden
      />
    </motion.div>
  );
}
