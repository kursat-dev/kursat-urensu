"use client";

import { useRef } from "react";

/**
 * Prev/next buttons for the home rail.
 *
 * The rail itself scrolls with native overflow + scroll-snap, so touch, trackpad
 * and keyboard already work with zero JavaScript. This adds pointer affordance
 * on desktop only; it is the sole client component in the Journal feature.
 */
export default function JournalRailNav({ targetId }: { targetId: string }) {
  const railRef = useRef<HTMLElement | null>(null);

  function scrollRail(direction: 1 | -1) {
    const rail = railRef.current ?? document.getElementById(targetId);
    railRef.current = rail;
    if (!rail) return;
    rail.scrollBy({ left: direction * Math.round(rail.clientWidth * 0.8), behavior: "smooth" });
  }

  const buttonStyle = { width: "36px", height: "36px", padding: "0" } as const;

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <button
        type="button"
        className="btn btn-secondary"
        style={buttonStyle}
        onClick={() => scrollRail(-1)}
        aria-label="Önceki Journal kartları"
      >
        ←
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        style={buttonStyle}
        onClick={() => scrollRail(1)}
        aria-label="Sonraki Journal kartları"
      >
        →
      </button>
    </div>
  );
}
