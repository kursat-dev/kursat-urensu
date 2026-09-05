import JournalCard from "@/components/journal/JournalCard";
import JournalListJsonLd from "@/components/seo/JournalListJsonLd";
import { JOURNAL_CATEGORIES, JOURNAL_ENTRIES } from "@/lib/journal";
import { buildMetadata } from "@/lib/seo";

const description =
  "Kürşat Ürensü'nün etkinlik, ürün geliştirme ve kişisel anlarından oluşan arşivi: " +
  "Maestrobot, GDG DevFest, TEDx ve hackathon notları.";

export const metadata = buildMetadata({
  title: "Journal",
  description,
  path: "/journal",
});

/**
 * Only categories that actually have entries get a filter — a chip that always
 * returns nothing is worse than no chip. New categories appear here on their
 * own as soon as an entry uses one. Radio ids match the selectors in globals.css.
 */
const usedCategories = JOURNAL_CATEGORIES.filter((category) =>
  JOURNAL_ENTRIES.some((entry) => entry.category === category),
);

const FILTERS = [
  { id: "journal-filter-all", label: "Hepsi", defaultChecked: true },
  ...usedCategories.map((category) => ({
    id: `journal-filter-${category.toLowerCase()}`,
    label: category,
    defaultChecked: false,
  })),
];

export default function JournalPage() {
  return (
    <>
      <JournalListJsonLd description={description} />
      <section className="ku-journal">
        <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(56px,8vw,112px) clamp(20px,5vw,56px)" }}>
          <p style={{ fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-accent-700)", margin: "0 0 clamp(16px,2vw,24px)" }}>
            Journal
          </p>
          <h1 style={{ fontSize: "clamp(30px,4.6vw,60px)", letterSpacing: "-0.03em", margin: "0 0 16px" }}>
            Anlar, projeler ve saklamaya değer şeyler
          </h1>
          <p style={{ margin: "0 0 clamp(28px,4vw,44px)", fontSize: "16px", lineHeight: "1.6", color: "var(--color-neutral-800)", maxWidth: "58ch" }}>
            Etkinlikler, ürün geliştirirken yaşananlar ve kısa notlar.
          </p>

          {usedCategories.length > 1 ? (
          <fieldset style={{ border: "0", padding: "0", margin: "0 0 clamp(28px,4vw,44px)" }}>
            <legend className="sr-only-legend" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
              Kategoriye göre filtrele
            </legend>
            <div className="seg">
              {FILTERS.map((filter) => (
                <label key={filter.id} className="seg-opt">
                  <input
                    type="radio"
                    name="journal-category"
                    id={filter.id}
                    defaultChecked={filter.defaultChecked}
                  />
                  {filter.label}
                </label>
              ))}
            </div>
          </fieldset>
          ) : null}

          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: "clamp(24px,3vw,44px)", listStyle: "none", margin: "0", padding: "0" }}>
            {JOURNAL_ENTRIES.map((entry, index) => (
              <li key={entry.slug} data-journal-category={entry.category}>
                <JournalCard
                  entry={entry}
                  sizes="(max-width: 640px) 92vw, (max-width: 1240px) 45vw, 380px"
                  priority={index < 2}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
