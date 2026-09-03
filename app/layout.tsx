import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import SiteJsonLd from "@/components/seo/SiteJsonLd";
import { siteConfig } from "@/lib/site";

import "./globals.css";

/* Self-hosted so there is no render-blocking request to Google Fonts.
   latin-ext carries the Turkish glyphs (ş, ğ, ı, ç, ö, ü). */
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "800"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { email: false, address: false, telephone: false },
  // Google Search Console site ownership. Next.js renders this as
  // <meta name="google-site-verification" content="..." /> in <head>.
  // Public by design — it is not a secret and belongs in source.
  verification: { google: "eHZ0DJIVNgqzBAl4Y5i9Axi4pqdcMZigU1rG-vWJMZw" },
};

export const viewport: Viewport = {
  themeColor: "#f3f2f2",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={siteConfig.lang} className={archivo.variable}>
      <body>
        <SiteJsonLd />
        {/* accent-700 (not accent) gives 6.4:1 against the light text — AA at this
            size, where the design's accent would only reach 3.8:1.
            text-…! : the design system sets an unlayered `a { color }`, which
            outranks Tailwind's layered utilities without the important flag. */}
        <a
          href="#ku-main"
          className="absolute top-0 -left-[9999px] z-100 px-4 py-2.5 text-sm font-[800] font-[family-name:var(--font-heading)] bg-[var(--color-accent-700)] text-[var(--color-bg)]! no-underline focus-visible:left-0"
        >
          İçeriğe geç
        </a>
        <div style={{ minHeight: "100vh", background: "var(--color-bg)", color: "var(--color-text)", fontFamily: "var(--font-body)" }}>
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
