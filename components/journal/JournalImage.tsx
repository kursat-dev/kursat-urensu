import Image from "next/image";

import type { JournalImage as JournalImageData } from "@/lib/journal";

/**
 * A journal photo.
 *
 * `fill` inside an aspect-ratio box: the source photos have mixed native
 * ratios (3:4, 9:20, 1200x1600), so the frame fixes the ratio and the image
 * covers it. The box reserves the space before the image loads, so there is no
 * layout shift.
 *
 * Every file in lib/journal.ts must exist under /public — a missing one now
 * renders a broken image rather than a placeholder.
 */
interface JournalImageProps {
  image: JournalImageData;
  /** CSS aspect-ratio for the frame. Matches the design's 4/5 portrait default. */
  ratio?: string;
  sizes: string;
  priority?: boolean;
}

export default function JournalImage({
  image,
  ratio = "4/5",
  sizes,
  priority = false,
}: JournalImageProps) {
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
