import Link from "next/link";

import { formatJournalDate, type JournalEntry } from "@/lib/journal";

import JournalImage from "./JournalImage";

/**
 * One journal entry as a card. Shared by the home rail and the /journal grid so
 * both stay identical; the design's own type scale and tokens are reused
 * throughout — no new visual language.
 */
export default function JournalCard({
  entry,
  sizes,
  priority = false,
}: {
  entry: JournalEntry;
  sizes: string;
  priority?: boolean;
}) {
  const date = formatJournalDate(entry.date);

  return (
    <article style={{ height: "100%" }}>
      <Link
        href={`/journal/${entry.slug}`}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          textDecoration: "none",
          color: "var(--color-text)",
        }}
      >
        <JournalImage image={entry.featuredImage} sizes={sizes} priority={priority} />
        <div style={{ display: "flex", alignItems: "baseline", gap: "10px", margin: "14px 0 8px" }}>
          <span style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-accent-700)" }}>
            {entry.category}
          </span>
          {date ? (
            <span style={{ fontSize: "12px", color: "var(--color-neutral-700)" }}>{date}</span>
          ) : null}
        </div>
        <h3 style={{ fontSize: "clamp(18px,1.7vw,21px)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          {entry.title}
        </h3>
        <p style={{ margin: "0", fontSize: "14px", lineHeight: "1.6", color: "var(--color-neutral-800)" }}>
          {entry.excerpt}
        </p>
      </Link>
    </article>
  );
}
