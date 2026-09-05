import Link from "next/link";

import { JOURNAL_ENTRIES } from "@/lib/journal";

import JournalCard from "./JournalCard";
import JournalRailNav from "./JournalRailNav";

const RAIL_ID = "journal-rail";

/**
 * Home page Journal section: a horizontal rail.
 *
 * Scrolling is native overflow-x + scroll-snap, so it swipes on touch and
 * drags on trackpad without any JavaScript. Cards are sized in `vw` with a
 * `max-width`, which is what keeps the rail from ever widening the page —
 * the overflow is contained by the rail, never by <body>.
 *
 * Section chrome follows the design's existing pattern (1240px column, the
 * same clamped padding and heading scale as "Kod" and "Hedefleri").
 */
export default function JournalRail() {
  return (
    <section
      style={{ borderBottom: "2px solid var(--color-divider)" }}
      aria-labelledby="journal-heading"
    >
      <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(56px,8vw,104px) clamp(20px,5vw,56px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "16px", marginBottom: "clamp(24px,3vw,40px)" }}>
          <h2 id="journal-heading" style={{ fontSize: "clamp(30px,4vw,52px)", letterSpacing: "-0.03em", margin: "0" }}>
            Journal
          </h2>
          <p style={{ margin: "0", fontSize: "15px", color: "var(--color-neutral-800)", maxWidth: "46ch" }}>
            Etkinlikler, ürün geliştirirken yaşananlar ve saklamaya değer anlar.
          </p>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            <JournalRailNav targetId={RAIL_ID} />
          </div>
        </div>

        <ul
          id={RAIL_ID}
          className="ku-rail"
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(min(78vw,300px),1fr)",
            gap: "clamp(16px,2vw,28px)",
            listStyle: "none",
            margin: "0",
            padding: "0 0 6px",
            overflowX: "auto",
            overscrollBehaviorX: "contain",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "thin",
          }}
        >
          {JOURNAL_ENTRIES.map((entry, index) => (
            <li key={entry.slug} style={{ scrollSnapAlign: "start" }}>
              <JournalCard
                entry={entry}
                sizes="(max-width: 880px) 78vw, 300px"
                priority={index === 0}
              />
            </li>
          ))}
        </ul>

        <Link
          href="/journal"
          className="btn btn-ghost"
          style={{ padding: "0", marginTop: "clamp(20px,2.5vw,28px)" }}
        >
          Tüm Journal →
        </Link>
      </div>
    </section>
  );
}
