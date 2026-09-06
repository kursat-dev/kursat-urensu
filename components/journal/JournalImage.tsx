import Image from "next/image";

import type { JournalImage as JournalImageData } from "@/lib/journal";

/**
 * A journal photo, in one of two modes.
 *
 * "card" — the home rail and the /journal grid. A fixed 4/5 frame with
 * object-fit: cover, so the grid stays on a tidy baseline. Cropping is fine
 * here: the card is a thumbnail and the full photo is one click away.
 *
 * "full" — the detail page. Every journal photo is portrait (0.45–0.75), so a
 * fixed landscape frame cut heads off. This mode sizes from the file's own
 * dimensions instead: nothing is cropped, `maxHeight` keeps tall portraits from
 * dominating a desktop screen, and `maxWidth: 100%` keeps them inside the
 * column on mobile. The width/height attributes still reserve the box, so
 * there is no layout shift.
 */
interface JournalImageProps {
  image: JournalImageData;
  variant?: "card" | "full";
  /** Frame ratio for the card variant only. */
  ratio?: string;
  /** Height cap for the full variant only. */
  maxHeight?: string;
  sizes: string;
  priority?: boolean;
}

export default function JournalImage({
  image,
  variant = "card",
  ratio = "4/5",
  maxHeight = "min(72vh, 640px)",
  sizes,
  priority = false,
}: JournalImageProps) {
  if (variant === "full") {
    // Cap the height by capping the width at (maxHeight x aspect ratio). Doing
    // it this way keeps the rendered size deterministic: `width/height: auto`
    // would instead follow whichever srcset variant the browser happened to
    // pick, and `max-height` alone would need object-fit to avoid distortion.
    const aspect = image.width / image.height;

    return (
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        className="grayscale"
        style={{
          width: "100%",
          height: "auto",
          maxWidth: `min(100%, calc(${maxHeight} * ${aspect.toFixed(4)}))`,
          background: "var(--color-surface)",
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: ratio,
        overflow: "hidden",
        background: "var(--color-surface)",
      }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="grayscale"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
