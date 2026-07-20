import { existsSync } from "fs";
import path from "path";
import { HeroImage } from "@/components/motion/hero-image";
import { PageHeroText } from "@/components/motion/page-hero-text";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  subtitle?: string;
  /** Public path e.g. /hero/about.jpg — falls back to navy gradient if missing */
  imageSrc?: string;
  imageAlt?: string;
  align?: "center" | "left";
  /** Use left dark copy-space (text left, lighter overlay on the right) */
  layout?: "centered" | "copySpaceLeft";
  priority?: boolean;
  className?: string;
};

function heroFileExists(publicPath: string) {
  const relative = publicPath.replace(/^\//, "");
  return existsSync(path.join(process.cwd(), "public", relative));
}

export function PageHero({
  title,
  subtitle,
  imageSrc,
  imageAlt = "",
  align = "center",
  layout = "centered",
  priority = true,
  className,
}: PageHeroProps) {
  const hasImage = Boolean(imageSrc && heroFileExists(imageSrc));
  const copyLeft = layout === "copySpaceLeft";
  const textAlign = copyLeft ? "left" : align;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-navy/10 bg-navy text-ivory",
        copyLeft && "min-h-[70vh] sm:min-h-[75vh]",
        className
      )}
    >
      {hasImage && imageSrc ? (
        <HeroImage src={imageSrc} alt={imageAlt} priority={priority} />
      ) : null}

      {/* Navy gradient overlay — keeps text legible */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          !hasImage && "bg-gradient-to-br from-navy via-navy to-navy-light",
          hasImage &&
            !copyLeft &&
            "bg-gradient-to-b from-navy/85 via-navy/70 to-navy/80",
          hasImage &&
            copyLeft &&
            "bg-gradient-to-r from-navy/88 via-navy/50 to-navy/20"
        )}
        aria-hidden
      />
      {hasImage && copyLeft ? (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-navy/25"
          aria-hidden
        />
      ) : null}

      {/* Soft gold atmosphere */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, #b8925a 0%, transparent 40%), radial-gradient(circle at 85% 70%, #c9a227 0%, transparent 35%)",
        }}
        aria-hidden
      />

      <PageHeroText
        title={title}
        subtitle={subtitle}
        align={textAlign}
        className={cn(copyLeft && "flex min-h-[70vh] flex-col justify-center sm:min-h-[75vh]")}
      />
    </section>
  );
}
