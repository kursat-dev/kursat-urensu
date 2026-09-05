import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import JournalImage from "@/components/journal/JournalImage";
import JournalJsonLd from "@/components/seo/JournalJsonLd";
import { JOURNAL_ENTRIES, formatJournalDate, getJournalEntry } from "@/lib/journal";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type Params = { slug: string };

/** Every entry is known at build time, so all detail pages prerender. */
export function generateStaticParams(): Params[] {
  return JOURNAL_ENTRIES.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntry(slug);
  if (!entry) return {};

  const meta = buildMetadata({
    title: entry.title,
    description: entry.description ?? entry.excerpt,
    path: `/journal/${entry.slug}`,
  });

  // Prefer the entry's own photo for social cards over the site-wide portrait.
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      images: [{ url: absoluteUrl(entry.featuredImage.src), alt: entry.featuredImage.alt }],
    },
    twitter: { ...meta.twitter, images: [absoluteUrl(entry.featuredImage.src)] },
  };
}

export default async function JournalEntryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);
  if (!entry) notFound();

  const date = formatJournalDate(entry.date);
  const gallery = entry.images ?? [];

  return (
    <>
      <JournalJsonLd entry={entry} />
      <article>
        <section>
          <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(40px,6vw,80px) clamp(20px,5vw,56px) clamp(28px,4vw,48px)" }}>
            <Link href="/journal" className="btn btn-ghost" style={{ padding: "0", marginBottom: "clamp(24px,3vw,40px)" }}>
              ← Journal
            </Link>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", margin: "0 0 14px" }}>
              <span style={{ fontSize: "12px", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-accent-700)" }}>
                {entry.category}
              </span>
              {date ? <span style={{ fontSize: "13px", color: "var(--color-neutral-700)" }}>{date}</span> : null}
            </div>
            <h1 style={{ fontSize: "clamp(30px,4.6vw,60px)", lineHeight: "1.05", letterSpacing: "-0.03em", margin: "0 0 16px", maxWidth: "22ch", textWrap: "balance" }}>
              {entry.title}
            </h1>
            <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.65", color: "var(--color-neutral-800)", maxWidth: "62ch", textWrap: "pretty" }}>
              {entry.excerpt}
            </p>
          </div>
        </section>

        <section>
          <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "0 clamp(20px,5vw,56px)" }}>
            <figure style={{ margin: "0" }}>
              <JournalImage
                image={entry.featuredImage}
                ratio="3/2"
                sizes="(max-width: 1240px) 92vw, 1128px"
                priority
              />
              <figcaption>{entry.featuredImage.alt}</figcaption>
            </figure>
          </div>
        </section>

        {entry.body.length > 0 ? (
          <section>
            <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(32px,4vw,56px) clamp(20px,5vw,56px) 0" }}>
              {entry.body.map((paragraph) => (
                <p key={paragraph} style={{ fontSize: "16px", lineHeight: "1.65", color: "var(--color-neutral-800)", margin: "0 0 18px", maxWidth: "62ch" }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {gallery.length > 0 ? (
          <section>
            <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(32px,4vw,56px) clamp(20px,5vw,56px) 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(16px,2vw,28px)" }}>
                {gallery.map((image) => (
                  <figure key={image.src} style={{ margin: "0" }}>
                    <JournalImage image={image} sizes="(max-width: 880px) 92vw, 45vw" />
                    <figcaption>{image.caption ?? image.alt}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section>
          <div style={{ maxWidth: "1240px", margin: "0 auto", padding: "clamp(32px,4vw,56px) clamp(20px,5vw,56px) clamp(56px,8vw,104px)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "clamp(12px,2vw,20px)" }}>
            {entry.instagramUrl ? (
              <a href={entry.instagramUrl} className="btn btn-secondary" rel="noopener noreferrer">
                Instagram&apos;da gör →
              </a>
            ) : null}
            {entry.relatedProjects?.length ? (
              <Link href="/projects" className="btn btn-ghost" style={{ padding: "0" }}>
                İlgili proje: {entry.relatedProjects.join(" · ")} →
              </Link>
            ) : null}
          </div>
        </section>
      </article>
    </>
  );
}
