/**
 * Journal: an archive of real events, build moments and personal notes.
 *
 * Source of truth for the /journal index, the detail pages, the home rail, the
 * sitemap and the structured data.
 *
 * Ground rules for this file — every entry must stay verifiable:
 *  - Facts come from what is already published on this site (see /achievements)
 *    or from what Kürşat supplied directly. Nothing is inferred.
 *  - `date` is omitted where the real date is not known. It is better to show
 *    no date than a guessed one; the UI and JSON-LD both handle its absence.
 *  - `instagramUrl` is omitted until a real post URL exists. Never guess one.
 *  - `body` paragraphs marked TODO are placeholders for Kürşat's own words.
 */

export type JournalCategory = "Events" | "Building" | "Personal";

/** Order used by the category filter. Add new categories here. */
export const JOURNAL_CATEGORIES: readonly JournalCategory[] = ["Events", "Building", "Personal"];

export interface JournalImage {
  /** Path under /public. The file may not exist yet; the UI degrades safely. */
  src: string;
  /** Describes what is actually visible in the photo. No keyword stuffing. */
  alt: string;
  /** Optional short caption rendered under the image on the detail page. */
  caption?: string;
}

export interface JournalEntry {
  slug: string;
  title: string;
  /** One line, used on cards and as the meta description base. */
  excerpt: string;
  /** Longer summary for metadata; falls back to excerpt when absent. */
  description?: string;
  /**
   * ISO 8601. A bare year ("2025") is valid and is what we have for most
   * entries. Omitted entirely when the date is unknown.
   */
  date?: string;
  category: JournalCategory;
  featuredImage: JournalImage;
  /** Additional photos, shown as a gallery on the detail page. */
  images?: JournalImage[];
  /** Real Instagram post URL. Omitted until one is supplied. */
  instagramUrl?: string;
  /** Project names from lib/projects.ts that this entry relates to. */
  relatedProjects?: string[];
  /** Body paragraphs rendered on the detail page. */
  body: string[];
}

const DIR = "/journal";

export const JOURNAL_ENTRIES: readonly JournalEntry[] = [
  {
    slug: "maestrobot-2026",
    title: "Maestrobot 2026 Ankara",
    excerpt: "Lise ATSO Girişimcilik Yapay Zeka Uygulamaları Birinciliği. Sunulan proje: ZMeet.",
    date: "2026",
    category: "Events",
    relatedProjects: ["ZMeet"],
    featuredImage: {
      src: `${DIR}/maestrobot-2026/kursat-urensu-maestrobot-2026-ostim-teknik-universitesi.jpeg`,
      alt: "Maestrobot 2026 yarışmasında OSTİM Teknik Üniversitesi Ankara panosunun önünde masada çalışan üç yarışmacı",
    },
    images: [
      {
        src: `${DIR}/maestrobot-2026/kursat-urensu-maestrobot-2026-ekip.jpeg`,
        alt: "Maestrobot 2026 ekibi dört kişi olarak asansör aynasında",
      },
    ],
    instagramUrl: "https://www.instagram.com/p/Dc4QPlrCAcz/",
    body: [
      "Maestrobot tarafından düzenlenen yarışmada \u201cLise ATSO Girişimcilik Yapay Zeka " +
        "Uygulamaları Birinciliği\u201d aldık. Sunduğumuz proje ZMeet\u2019ti.",
      "Bu, ZMeet\u2019in B2C\u2019den B2B\u2019ye geçişinin ardından çıktığımız ilk gündü. " +
        "Yarışmaya yeni B2B pazarlama stratejimizle katıldık.",
      "Yarışma öncesinde, organizasyonu düzenleyen firmanın sisteminde bir güvenlik açığı fark " +
        "ettim. Açığı etik sınırlar içinde doğrulayıp şirket sahibine raporladım. Jüri sunumu " +
        "sırasında konuyu firmanın baş yazılımcısıyla da paylaştım ve gelecek yılki organizasyonun " +
        "sistemini geliştirmeye istekli olduğumu belirttim.",
    ],
  },
  {
    slug: "astro-hackathon",
    title: "Trabzon Astro TUA Hackathon",
    excerpt: "Katılımcı olarak kısıtlı sürede ekip halinde üretim.",
    // Kürşat'ın verdiği tarih; fotoğraftaki ekran görüntüsünde görünen
    // "29 Mar Paz 04:40" saat damgasıyla da örtüşüyor (29.03.2026 bir Pazar).
    date: "2026-03-29",
    category: "Events",
    featuredImage: {
      src: `${DIR}/astro-hackathon/kursat-urensu-astro-hackathon-yaka-karti.jpeg`,
      alt: "Astro Hackathon yarışmacı yaka kartı ve arkada kod yazılan dizüstü bilgisayar",
    },
    instagramUrl: "https://www.instagram.com/p/Dc4OdlmiKZp/",
    body: [
      "TUA ve ASTRO iş birliğiyle düzenlenen, iki gün süren bir hackathon.",
      "Ekibimle SpaceLink AI adlı projeyi geliştirdik: uzay sektöründeki şirketleri, ekipleri, " +
        "girişimleri ve yatırımcıları bir araya getiren, B2B odaklı bir web uygulaması.",
      "Şirketlerin uygun projeleri bulmasına, ekiplerin girişimleri için ekip arkadaşı bulmasına " +
        "ve yatırımcılarla eşleşmesine yardımcı oluyordu.",
    ],
  },
  {
    slug: "tedx-trabzon-university",
    title: "TEDx Trabzon Üniversitesi",
    excerpt: "Stand deneyimi: farklı bir izleyici kitlesiyle ürün konuşması.",
    date: "2025-12-05",
    category: "Events",
    relatedProjects: ["ZMeet", "DentalPrices"],
    featuredImage: {
      src: `${DIR}/tedx-trabzon/kursat-urensu-tedx-trabzon-zmeet-standi.jpeg`,
      alt: "Kürşat Ürensü, TEDx Trabzon Üniversitesi'nde ZMeet standının önünde belgeleri incelerken",
    },
    instagramUrl: "https://www.instagram.com/p/Dc4Mfs_oClR/",
    body: [
      "5 Aralık 2025\u2019te Trabzon Üniversitesi\u2019nde düzenlendi. ZMeet\u2019i tanıtmak ve " +
        "canlı demo göstermek için stand açtık; standın başında ben vardım.",
      "Konuşmacılardan Efe Çelebi standı ziyaret etti. Kendi şirketinde benzer bir ihtiyaç " +
        "olduğunu ve ZMeet\u2019in bu problemi çözebileceğini belirtti.",
      "Bu karşılaşma, ocak ayında süren görüşmelerin başlangıcı oldu. Görüşmelerin ve kısa bir " +
        "mülakatın ardından DentalPrices\u2019ta Jr. Developer olarak çalışmaya başladım; " +
        "ZMeet\u2019in DentalPrices sistemine entegrasyonunu geliştirme görevini üstlendim.",
    ],
  },
  {
    slug: "devfest-trabzon-2025",
    title: "GDG DevFest Trabzon 2025",
    excerpt: "ZMeet'i topluluk önünde ilk kez sundum. Stand deneyimi.",
    date: "2025",
    category: "Events",
    relatedProjects: ["ZMeet"],
    featuredImage: {
      src: `${DIR}/devfest-trabzon-2025/kursat-urensu-devfest-trabzon-2025-zmeet-standi.jpeg`,
      alt: "GDG DevFest Trabzon 2025'te ZMeet standının önünde ekip; arkada ZMeet afişi, masada ZMeet arayüzü açık ekran",
    },
    images: [
      {
        src: `${DIR}/devfest-trabzon-2025/kursat-urensu-devfest-trabzon-2025-android-maskot.jpeg`,
        alt: "GDG DevFest Trabzon 2025'te ZMeet standının önünde şişme Android maskot kostümü",
      },
      {
        src: `${DIR}/devfest-trabzon-2025/devfest-trabzon-2025-sponsor-yaka-karti.jpeg`,
        alt: "GDG DevFest Trabzon 2025 sponsor yaka kartı: Kürşat Ürensü, Bronze Sponsor — Özel RoboTekno Koleji, ZMeet",
      },
    ],
    body: [
      "ZMeet'i topluluk önünde ilk kez burada sundum. Stand deneyimi.",
      // TODO(kursat): etkinlik hakkında kendi notlarını ekle.
    ],
  },
  {
    slug: "devfest-istanbul-2025",
    title: "GDG DevFest İstanbul 2025",
    excerpt: "Davetli katılımcı. İstanbul teknoloji ekosisteminde network.",
    date: "2025",
    category: "Events",
    featuredImage: {
      src: `${DIR}/devfest-istanbul-2025/devfest-istanbul-2025-yaka-kartlari.jpeg`,
      alt: "GDG DevFest İstanbul 2025'e ait üç katılımcı yaka kartı; ortadaki Kürşat Ürensü adına",
    },
    body: [
      "Davetli katılımcı olarak katıldım. İstanbul teknoloji ekosisteminde network.",
      // TODO(kursat): etkinlik hakkında kendi notlarını ekle.
    ],
  },
  {
    slug: "personal-moments",
    title: "Personal Moments",
    excerpt: "Arşivden kısa kareler.",
    // TODO(kursat): tarih eklenecek.
    category: "Personal",
    featuredImage: {
      src: `${DIR}/personal/kursat-urensu-siyah-polo.jpeg`,
      alt: "Kürşat Ürensü'nün ayna karşısında siyah polo tişörtle çektiği fotoğraf",
    },
    images: [
      {
        src: `${DIR}/personal/kursat-urensu-siyah-tisort.jpeg`,
        alt: "Kürşat Ürensü'nün ayna karşısında siyah tişörtle çektiği fotoğraf",
      },
    ],
    body: [
      // TODO(kursat): bu bölüm için kendi kısa notunu ekle.
    ],
  },
];

export function getJournalEntry(slug: string): JournalEntry | undefined {
  return JOURNAL_ENTRIES.find((entry) => entry.slug === slug);
}

/** All images belonging to an entry, featured first. */
export function entryImages(entry: JournalEntry): JournalImage[] {
  return [entry.featuredImage, ...(entry.images ?? [])];
}

/** "2025" or "2025-04-12" -> a label the UI can print. Empty when unknown. */
export function formatJournalDate(date?: string): string {
  if (!date) return "";
  if (/^\d{4}$/.test(date)) return date;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? date
    : parsed.toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
}
