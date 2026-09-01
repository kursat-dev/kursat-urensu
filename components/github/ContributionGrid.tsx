import type { ContributionCell, ContributionLevel } from "@/lib/github";

/** Accent ramp for the five contribution buckets, as specified by the design. */
const LEVEL_BACKGROUNDS: Record<ContributionLevel, string> = {
  0: "transparent",
  1: "var(--color-accent-200)",
  2: "var(--color-accent-400)",
  3: "var(--color-accent-500)",
  4: "var(--color-accent-700)",
};

interface ContributionGridProps {
  cells: ContributionCell[];
}

/**
 * Rendered on the server: 182 static spans, zero client JavaScript.
 * The design generated these in the browser; the output is byte-identical.
 */
export default function ContributionGrid({ cells }: ContributionGridProps) {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(26,1fr)", gridAutoRows: "1fr", gap: "3px" }}
      role="img"
      aria-label="Son 6 ayın GitHub katkı grafiği"
    >
      {cells.map((cell) => (
        <span
          key={cell.index}
          style={{
            aspectRatio: "1",
            background: LEVEL_BACKGROUNDS[cell.level],
            border: cell.level === 0 ? "1px solid var(--color-neutral-300)" : "none",
            display: "block",
          }}
        />
      ))}
    </div>
  );
}
