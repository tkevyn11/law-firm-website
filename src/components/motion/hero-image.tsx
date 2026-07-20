"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type HeroImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  /** Extra opacity on the image itself (0–1). Overlay is separate. */
  imageOpacity?: number;
  /** object-position / object-* utilities (e.g. mobile right-weighted crop) */
  objectClassName?: string;
};

export function HeroImage({
  src,
  alt,
  priority = false,
  className,
  imageOpacity = 1,
  objectClassName,
}: HeroImageProps) {
  const reduce = useReducedMotion();

  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      quality={92}
      sizes="100vw"
      className={cn("object-cover object-center", objectClassName)}
      style={{ opacity: imageOpacity }}
    />
  );

  if (reduce) {
    return (
      <div className={cn("absolute inset-0 overflow-hidden", className)}>
        {image}
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.03 }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        {image}
      </motion.div>
    </div>
  );
}
