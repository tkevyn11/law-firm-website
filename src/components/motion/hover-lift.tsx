"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverLiftProps = {
  children: React.ReactNode;
  className?: string;
};

export function HoverLift({ children, className }: HoverLiftProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("h-full", className)}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
    >
      {children}
    </motion.div>
  );
}
